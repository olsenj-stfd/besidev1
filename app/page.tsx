import Link from "next/link";
import {
  listThemes,
  listApprovedStories,
  listConditions,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { ConditionBadge } from "@/components/condition-badge";
import { StoryCard } from "@/components/story-card";
import { PulseNudge } from "@/components/pulse-nudge";
import { BesideKeycards } from "@/components/beside-keycards";

export default async function HomePage() {
  const [themes, conditions, stories, user] = await Promise.all([
    listThemes(),
    listConditions(),
    listApprovedStories(),
    getCurrentUser(),
  ]);

  const recent = stories.slice(0, 4);

  return (
    <div className="space-y-12">
      <section className="pt-6 pb-2 rise">
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-4">
          beside · est. for the people loving someone through it
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light text-ink leading-[0.92] tracking-tight">
          For the people
          <br />
          <span className="italic ml-6 sm:ml-10">loving someone</span>
          <br />
          through it<span className="text-clay">.</span>
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-prose">
          Beside is a quiet place for the family side of addiction, mental
          illness, eating disorders, and grief. Read stories grouped by what
          you&rsquo;re carrying. Share when you&rsquo;re ready. Find
          professionals who specialize in supporting <em>you</em>, not the
          person diagnosed.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {user ? (
            <Link
              href="/browse"
              className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
            >
              Read stories
            </Link>
          ) : (
            <Link
              href="/welcome"
              className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
            >
              Begin quietly
            </Link>
          )}
          <Link
            href="/find-help"
            className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
          >
            Find help
          </Link>
        </div>
        <p className="mt-5 text-xs text-ink-muted max-w-prose leading-relaxed">
          Beside is for connection, not treatment. We don&rsquo;t use AI to
          talk back. We use it to help you find people who get it.
        </p>
      </section>

      <BesideKeycards user={user} />

      <section>
        <h2 className="font-display text-2xl text-ink mb-2">
          Built for the second patient.
        </h2>
        <p className="text-sm text-ink-soft mb-4 max-w-prose">
          Wife of an alcoholic. Parent of a child in eating-disorder recovery.
          Daughter of a mom with dementia. Brother of someone with bipolar.
          The conditions are different. The carrying is the same.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map((c) => (
            <Link
              key={c.slug}
              href={`/browse?condition=${c.slug}`}
              className="rounded-xl border border-sand bg-white/60 px-3 py-2.5 hover:border-clay/30 hover:bg-white transition-colors"
            >
              <ConditionBadge condition={c} />
              <p className="mt-1 text-xs text-ink-muted leading-snug">
                {c.description.replace(/&rsquo;/g, "’")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <PulseNudge />

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl text-ink">Read someone</h2>
          <Link
            href="/browse"
            className="text-sm text-clay-deep hover:text-clay"
          >
            more →
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              themes={themes}
              conditions={conditions}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
