import Link from "next/link";
import type { Story, Theme, Condition } from "@/lib/types";
import { ConditionBadge } from "./condition-badge";
import { timeAgo, cn } from "@/lib/utils";

export function StoryCard({
  story,
  themes,
  conditions,
}: {
  story: Story;
  themes: Theme[];
  conditions: Condition[];
}) {
  const themeMap = new Map(themes.map((t) => [t.slug, t]));
  const conditionMap = new Map(conditions.map((c) => [c.slug, c]));
  const storyThemes = story.themeSlugs
    .map((s) => themeMap.get(s))
    .filter(Boolean) as Theme[];
  const storyConditions = (story.conditionSlugs ?? [])
    .map((s) => conditionMap.get(s))
    .filter(Boolean) as Condition[];

  const totalReactions =
    story.reactions.me_too +
    story.reactions.thinking_of_you +
    story.reactions.thank_you;

  return (
    <Link
      href={`/stories/${story.id}`}
      className={cn(
        "group block rounded-2xl border border-sand bg-white/60 p-5",
        "transition-all hover:shadow-sm hover:border-clay/30 hover:bg-white"
      )}
    >
      {storyConditions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {storyConditions.map((c) => (
            <ConditionBadge key={c.slug} condition={c} size="sm" />
          ))}
        </div>
      )}
      <h3 className="font-display text-lg text-ink leading-snug group-hover:text-clay-deep transition-colors">
        {story.title}
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">
        {story.body}
      </p>
      <div className="mt-4 flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink-muted">
        <span className="text-ink-soft">{story.pseudonym}</span>
        <span aria-hidden>·</span>
        <span>{timeAgo(story.createdAt)}</span>
        {storyThemes.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5 flex-wrap">
              {storyThemes.slice(0, 2).map((t) => (
                <span key={t.slug}>{t.short}</span>
              ))}
            </span>
          </>
        )}
        {totalReactions > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>{totalReactions} held</span>
          </>
        )}
      </div>
    </Link>
  );
}
