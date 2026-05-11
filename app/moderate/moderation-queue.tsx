"use client";

import { useState, useTransition } from "react";
import { Check, X, Eye, Sparkles, AlertTriangle } from "lucide-react";
import type { Story, Theme, StoryTriage } from "@/lib/types";
import { timeAgo, cn, tintClasses } from "@/lib/utils";
import { approveStory, rejectStory } from "./actions";

const RISK_STYLE: Record<StoryTriage["risk"], string> = {
  none: "bg-sage/15 text-sage-deep border-sage/30",
  low: "bg-sand text-ink-soft border-sand",
  medium: "bg-amber/25 text-ink border-amber/40",
  high: "bg-danger/15 text-danger border-danger/40",
};

const SUGGESTION_STYLE: Record<StoryTriage["suggestion"], string> = {
  approve: "text-sage-deep",
  review: "text-ink-soft",
  hold: "text-danger",
};

const STATUS_LABEL: Record<Story["status"], string> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
};

export function ModerationQueue({
  stories,
  themes,
}: {
  stories: Story[];
  themes: Theme[];
}) {
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [pendingId, startTransition] = useTransition();
  const [acting, setActing] = useState<string | null>(null);

  const themeMap = new Map(themes.map((t) => [t.slug, t]));
  const filtered =
    filter === "pending" ? stories.filter((s) => s.status === "pending") : stories;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setFilter("pending")}
          className={cn(
            "rounded-full px-3 py-1 border",
            filter === "pending"
              ? "bg-clay/15 border-clay/40 text-clay-deep"
              : "bg-white border-sand text-ink-soft hover:border-clay/30"
          )}
        >
          pending ({stories.filter((s) => s.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-3 py-1 border",
            filter === "all"
              ? "bg-clay/15 border-clay/40 text-clay-deep"
              : "bg-white border-sand text-ink-soft hover:border-clay/30"
          )}
        >
          all ({stories.length})
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-ink-muted text-sm">Nothing here. Take a breath.</p>
        )}
        {filtered.map((story) => {
          const storyThemes = story.themeSlugs
            .map((s) => themeMap.get(s))
            .filter(Boolean) as Theme[];
          return (
            <article
              key={story.id}
              className="rounded-2xl border border-sand bg-white/70 p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="text-ink-soft">{story.pseudonym}</span>
                  <span aria-hidden>·</span>
                  <span>{timeAgo(story.createdAt)}</span>
                  <span aria-hidden>·</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider",
                      story.status === "pending" && "bg-amber/30 text-ink",
                      story.status === "approved" && "bg-sage/20 text-sage-deep",
                      story.status === "rejected" && "bg-danger/15 text-danger"
                    )}
                  >
                    {STATUS_LABEL[story.status]}
                  </span>
                </div>
              </div>
              <h3 className="font-display text-lg text-ink leading-snug">
                {story.title}
              </h3>
              {story.triage && (
                <div className="mt-3 rounded-xl border border-sand bg-cream-deep/60 p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3 h-3 text-clay-deep" aria-hidden />
                    <span className="text-ink-muted uppercase tracking-wider text-[10px]">
                      AI triage — moderator only
                    </span>
                  </div>
                  <p className="text-ink-soft leading-relaxed mb-2">
                    {story.triage.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
                        RISK_STYLE[story.triage.risk]
                      )}
                    >
                      {story.triage.risk !== "none" && (
                        <AlertTriangle className="w-2.5 h-2.5" aria-hidden />
                      )}
                      risk: {story.triage.risk}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider",
                        SUGGESTION_STYLE[story.triage.suggestion]
                      )}
                    >
                      suggests: {story.triage.suggestion}
                    </span>
                    {story.triage.flags.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-white border border-sand px-2 py-0.5 text-[10px] text-ink-soft"
                      >
                        {f.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-3 text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
                {story.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {storyThemes.map((t) => {
                  const tc = tintClasses(t.tint);
                  return (
                    <span
                      key={t.slug}
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
                        tc.bg,
                        tc.border,
                        tc.text
                      )}
                    >
                      {t.short}
                    </span>
                  );
                })}
              </div>
              {story.status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActing(story.id);
                      startTransition(async () => {
                        await approveStory(story.id);
                        setActing(null);
                      });
                    }}
                    disabled={pendingId && acting === story.id ? true : false}
                    className="inline-flex items-center gap-1 rounded-full bg-sage text-cream px-3 py-1.5 text-sm hover:bg-sage-deep transition-colors disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" /> approve
                  </button>
                  <button
                    onClick={() => {
                      setActing(story.id);
                      startTransition(async () => {
                        await rejectStory(story.id);
                        setActing(null);
                      });
                    }}
                    disabled={pendingId && acting === story.id ? true : false}
                    className="inline-flex items-center gap-1 rounded-full border border-sand bg-white text-ink-soft px-3 py-1.5 text-sm hover:border-danger/40 hover:text-danger transition-colors disabled:opacity-60"
                  >
                    <X className="w-3.5 h-3.5" /> hold
                  </button>
                  {story.status === "pending" && (
                    <a
                      href={`/stories/${story.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-sand bg-white text-ink-soft px-3 py-1.5 text-sm hover:border-clay/30 hover:text-ink transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> preview
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
