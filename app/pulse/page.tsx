import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Activity, Beaker } from "lucide-react";
import {
  listPulses,
  getCurrentWeekPulse,
  listApprovedStories,
  listConditions,
  listThemes,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { PulseChart } from "@/components/pulse-chart";
import { StoryCard } from "@/components/story-card";
import { loadDemoData, clearMyPulses } from "./demo-actions";
import type { PulseEntry } from "@/lib/types";

export const metadata = { title: "Your Pulse — Beside" };

type SearchParams = Promise<{
  recorded?: string;
  demo?: string;
  cleared?: string;
}>;

export default async function PulsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/welcome");
  const sp = await searchParams;

  const [pulses, thisWeek, allStories, conditions, themes] = await Promise.all([
    listPulses(user.id),
    getCurrentWeekPulse(user.id),
    listApprovedStories(),
    listConditions(),
    listThemes(),
  ]);

  const insight = pulses.length > 0 ? buildInsight(pulses) : null;

  // Soft-routing pool: stories tagged with the user's themes/conditions,
  // not yet reacted to, sorted by total reactions (proxy for resonance).
  const userThemes = new Set(user.themes);
  const userConds = new Set(user.conditions ?? []);
  const reacted = new Set(
    user.reactedStoryIds.map((tag) => tag.split(":")[0])
  );
  const candidates = allStories
    .filter((s) => !reacted.has(s.id))
    .filter(
      (s) =>
        s.themeSlugs.some((t) => userThemes.has(t)) ||
        s.conditionSlugs.some((c) => userConds.has(c))
    )
    .sort((a, b) => {
      const sumA =
        a.reactions.me_too +
        a.reactions.thinking_of_you +
        a.reactions.thank_you;
      const sumB =
        b.reactions.me_too +
        b.reactions.thinking_of_you +
        b.reactions.thank_you;
      return sumB - sumA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-10 rise">
      <section>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          your pulse
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          A quiet check on how you&rsquo;re carrying it.
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Once a week, four short questions. We use the four
          highest&ndash;effect dimensions from{" "}
          <Link href="/evidence" className="text-clay-deep hover:underline">
            the 2012 study Beside is built on
          </Link>{" "}
          &mdash; loneliness, self-blame, anxiety, and connection. Your
          answers stay private to you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {thisWeek ? (
            <Link
              href="/pulse/take"
              className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
            >
              Update this week
            </Link>
          ) : (
            <Link
              href="/pulse/take"
              className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" aria-hidden />
              Take this week&rsquo;s pulse
            </Link>
          )}
        </div>
      </section>

      {sp.recorded === "1" && (
        <section className="rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-sage-deep">
          Saved. Thank you for checking in. We&rsquo;ll ask again next week.
        </section>
      )}
      {sp.demo === "1" && (
        <section className="rounded-2xl border border-amber/40 bg-amber/15 p-4 text-sm text-ink-soft">
          Loaded an 8-week demo trajectory. This is synthetic data for
          showing how Pulse looks once it has history. The newest week is
          intentionally a hard one so you can see the concern flow.
        </section>
      )}
      {sp.cleared === "1" && (
        <section className="rounded-2xl border border-sand bg-cream-deep p-4 text-sm text-ink-soft">
          Cleared. Take a fresh pulse anytime.
        </section>
      )}

      {pulses.length > 0 ? (
        <>
          <section>
            <h2 className="font-display text-xl text-ink mb-3">
              Your trajectory
            </h2>
            <PulseChart pulses={pulses} />
            <p className="mt-3 text-xs text-ink-muted leading-relaxed">
              Each chart shows the past {Math.min(pulses.length, 12)}{" "}
              {pulses.length === 1 ? "week" : "weeks"}. The dashed line is
              the midpoint. The arrow shows the change from your previous
              week.
            </p>
          </section>

          {insight && (
            <section
              className={`rounded-2xl border p-5 ${
                insight.tone === "concern"
                  ? "border-clay/30 bg-clay/5"
                  : "border-sage/30 bg-sage/5"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-ink-muted mb-2">
                this week
              </p>
              <p className="font-display text-lg text-ink leading-snug">
                {insight.headline}
              </p>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                {insight.body}
              </p>
            </section>
          )}

          {insight?.tone === "concern" && candidates.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sage-deep" aria-hidden />
                <h2 className="font-display text-xl text-ink">
                  Stories that might land
                </h2>
              </div>
              <p className="text-xs text-ink-muted mb-4">
                Pulled from members in your themes you haven&rsquo;t held
                yet. No AI reading your scores &mdash; just the people
                quietly carrying close to what you&rsquo;re carrying.
              </p>
              <div className="space-y-3">
                {candidates.map((s) => (
                  <StoryCard
                    key={s.id}
                    story={s}
                    themes={themes}
                    conditions={conditions}
                  />
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href={
                    user.conditions && user.conditions[0]
                      ? `/find-help?condition=${user.conditions[0]}`
                      : "/find-help"
                  }
                  className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-4 py-2 text-sm hover:border-clay/40 hover:text-ink transition-colors"
                >
                  Or, see clinicians who specialize in this →
                </Link>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="rounded-2xl border border-sand bg-cream-deep p-6">
          <h2 className="font-display text-xl text-ink leading-snug">
            No pulses yet.
          </h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            The first one takes about 90 seconds. After that, you&rsquo;ll
            have a small chart of your own that nobody else sees, and
            we&rsquo;ll know when to gently surface stories that might land.
          </p>
          <div className="mt-4">
            <form action={loadDemoData}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 text-ink-soft px-3 py-1.5 text-xs hover:bg-amber/25 transition-colors"
              >
                <Beaker className="w-3 h-3" aria-hidden />
                Load 8-week demo trajectory
              </button>
            </form>
            <p className="mt-2 text-[11px] text-ink-muted">
              For the prototype: backfills synthetic data so the chart, the
              insight card, and the soft-routing flow all populate.
            </p>
          </div>
        </section>
      )}

      <section className="border-t border-sand pt-5 mt-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-2">
          demo controls (prototype only)
        </p>
        <div className="flex flex-wrap gap-2">
          <form action={loadDemoData}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white text-ink-soft px-3 py-1.5 text-xs hover:border-amber/40 transition-colors"
            >
              <Beaker className="w-3 h-3" aria-hidden />
              Backfill 8-week trajectory
            </button>
          </form>
          {pulses.length > 0 && (
            <form action={clearMyPulses}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white text-ink-muted px-3 py-1.5 text-xs hover:border-clay/40 hover:text-clay-deep transition-colors"
              >
                Clear my pulses
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white/60 p-5 text-xs text-ink-muted leading-relaxed">
        <p className="text-ink-soft mb-1">
          <strong>What this is built on.</strong>
        </p>
        <p>
          The four dimensions are drawn from the seven psychological-health
          measures used in Gustafson et al. (2012), which found{" "}
          <em>large</em> effect sizes for an early version of this kind of
          intervention with adult children of alcoholics. Read more on{" "}
          <Link href="/evidence" className="text-clay-deep hover:underline">
            /evidence
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function buildInsight(pulses: PulseEntry[]): {
  headline: string;
  body: string;
  tone: "concern" | "steady";
} {
  const last = pulses[pulses.length - 1];
  const prev = pulses.length > 1 ? pulses[pulses.length - 2] : null;
  const distress =
    (last.scores.loneliness + last.scores.blame + last.scores.anxiety) / 3;
  const connection = last.scores.positive_relations;

  if (distress >= 3 || connection <= 1) {
    const dirs: string[] = [];
    if (last.scores.loneliness >= 3) dirs.push("loneliness");
    if (last.scores.blame >= 3) dirs.push("self-blame");
    if (last.scores.anxiety >= 3) dirs.push("anxiety");
    if (connection <= 1) dirs.push("low connection");
    const list = dirs.length === 0 ? "this stretch" : dirs.join(", ");
    return {
      tone: "concern",
      headline: "This was a hard week to carry.",
      body: `Your ${list} read high. That doesn’t need fixing — it needs witnessing. Below are a few stories from people in your themes that might land for you today, and a path to clinicians who specialize in this.`,
    };
  }

  if (prev) {
    const prevDistress =
      (prev.scores.loneliness + prev.scores.blame + prev.scores.anxiety) / 3;
    if (distress < prevDistress - 0.5) {
      return {
        tone: "steady",
        headline: "A little softer than last week.",
        body:
          "Distress dimensions ticked down. We’ll be here next week — same four questions.",
      };
    }
    if (connection > prev.scores.positive_relations) {
      return {
        tone: "steady",
        headline: "Connection up.",
        body:
          "You felt closer to the people you love this week than last. Hold onto that.",
      };
    }
  }

  return {
    tone: "steady",
    headline: "Steady-ish.",
    body: "Nothing flagged this week. We’ll be here when you check in next.",
  };
}
