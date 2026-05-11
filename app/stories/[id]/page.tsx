import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  getStory,
  listThemes,
  listConditions,
  getUserReactions,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { ReactionBar } from "@/components/reaction-bar";
import { ConditionBadge } from "@/components/condition-badge";
import { reactToStory } from "./actions";
import { timeAgo, tintClasses, cn } from "@/lib/utils";
import type { ReactionKind } from "@/lib/types";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const story = await getStory(id);
  return { title: story ? `${story.title} — Beside` : "Story — Beside" };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const [story, themes, conditions, user] = await Promise.all([
    getStory(id),
    listThemes(),
    listConditions(),
    getCurrentUser(),
  ]);
  if (!story || story.status !== "approved") notFound();

  const themeMap = new Map(themes.map((t) => [t.slug, t]));
  const storyThemes = story.themeSlugs
    .map((s) => themeMap.get(s))
    .filter(Boolean) as typeof themes;
  const conditionMap = new Map(conditions.map((c) => [c.slug, c]));
  const storyConditions = (story.conditionSlugs ?? [])
    .map((s) => conditionMap.get(s))
    .filter(Boolean) as typeof conditions;

  const reactedSet = user ? await getUserReactions(user.id) : new Set<string>();
  const reacted: Record<ReactionKind, boolean> = {
    me_too: reactedSet.has(`${story.id}:me_too`),
    thinking_of_you: reactedSet.has(`${story.id}:thinking_of_you`),
    thank_you: reactedSet.has(`${story.id}:thank_you`),
  };

  return (
    <article className="space-y-7 rise">
      <Link
        href="/browse"
        className="text-sm text-ink-muted hover:text-ink-soft inline-flex items-center gap-1"
      >
        ← back
      </Link>

      <header>
        {storyConditions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {storyConditions.map((c) => (
              <ConditionBadge key={c.slug} condition={c} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {storyThemes.map((t) => {
            const tc = tintClasses(t.tint);
            return (
              <Link
                key={t.slug}
                href={`/themes/${t.slug}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs",
                  tc.bg,
                  tc.border,
                  tc.text
                )}
              >
                <span aria-hidden>{t.emoji}</span>
                <span>{t.short}</span>
              </Link>
            );
          })}
        </div>
        <h1 className="font-display text-3xl sm:text-[2rem] text-ink leading-tight tracking-tight">
          {story.title}
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          <span className="text-ink-soft">{story.pseudonym}</span>
          <span className="mx-2" aria-hidden>·</span>
          <span>{timeAgo(story.createdAt)}</span>
        </p>
      </header>

      <div className="prose-like text-ink leading-[1.75] text-[1.05rem] whitespace-pre-wrap">
        {story.body}
      </div>

      <ReactionBar
        storyId={story.id}
        counts={story.reactions}
        reacted={reacted}
        signedIn={!!user}
        reactAction={reactToStory}
      />

      {story.resonant && story.resonant.length > 0 && (
        <ResonantStoriesSection
          resonant={story.resonant}
        />
      )}

      <div className="rounded-2xl border border-sand bg-cream-deep p-5 text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">A note from beside</p>
        <p className="leading-relaxed">
          We don&rsquo;t allow comments here. We do allow holding. Reactions are
          how we say &ldquo;I see you&rdquo; without crowding what someone just
          shared. If something here resonates,{" "}
          <Link href="/share" className="text-clay-deep hover:underline">
            you can write your own
          </Link>
          .
        </p>
      </div>
    </article>
  );
}

async function ResonantStoriesSection({
  resonant,
}: {
  resonant: { id: string; reason: string }[];
}) {
  const items = await Promise.all(
    resonant.map(async (r) => {
      const s = await getStory(r.id);
      return s && s.status === "approved"
        ? { story: s, reason: r.reason }
        : null;
    })
  );
  const visible = items.filter(Boolean) as {
    story: NonNullable<Awaited<ReturnType<typeof getStory>>>;
    reason: string;
  }[];
  if (visible.length === 0) return null;

  return (
    <section className="rounded-2xl border border-sage/30 bg-sage/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-sage-deep" aria-hidden />
        <h2 className="font-display text-lg text-ink">Stories that rhyme</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">
        Other people writing about something close to this. Picked by emotional
        shape, not by keyword.
      </p>
      <ul className="space-y-3">
        {visible.map(({ story, reason }) => (
          <li key={story.id}>
            <Link
              href={`/stories/${story.id}`}
              className="block rounded-xl border border-sand bg-white/70 p-3 hover:border-sage/40 hover:bg-white transition-colors"
            >
              <p className="font-display text-base text-ink leading-snug">
                {story.title}
              </p>
              <p className="text-xs text-ink-muted mt-0.5">{story.pseudonym}</p>
              <p className="text-xs text-sage-deep mt-2 italic leading-relaxed">
                {reason}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
