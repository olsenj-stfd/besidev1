"use client";

import { useTransition, useOptimistic } from "react";
import { Heart, Hand, Sparkles } from "lucide-react";
import { REACTION_LABELS, type ReactionKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<ReactionKind, React.ComponentType<{ className?: string }>> = {
  me_too: Hand,
  thinking_of_you: Heart,
  thank_you: Sparkles,
};

type Props = {
  storyId: string;
  counts: Record<ReactionKind, number>;
  reacted: Record<ReactionKind, boolean>;
  signedIn: boolean;
  reactAction: (
    storyId: string,
    kind: ReactionKind
  ) => Promise<{ ok: boolean; error?: string }>;
};

type OptimisticState = {
  counts: Record<ReactionKind, number>;
  reacted: Record<ReactionKind, boolean>;
};

export function ReactionBar({
  storyId,
  counts,
  reacted,
  signedIn,
  reactAction,
}: Props) {
  const [, startTransition] = useTransition();
  const [state, applyOptimistic] = useOptimistic<OptimisticState, ReactionKind>(
    { counts, reacted },
    (s, kind) => {
      if (s.reacted[kind]) return s;
      return {
        counts: { ...s.counts, [kind]: (s.counts[kind] ?? 0) + 1 },
        reacted: { ...s.reacted, [kind]: true },
      };
    }
  );

  const ORDER: ReactionKind[] = ["me_too", "thinking_of_you", "thank_you"];

  return (
    <div className="rounded-2xl border border-sand bg-white/60 p-4">
      {!signedIn && (
        <p className="text-xs text-ink-muted mb-3">
          <a href="/welcome" className="text-clay-deep hover:underline">
            begin
          </a>{" "}
          to hold this story.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {ORDER.map((kind) => {
          const Icon = ICONS[kind];
          const has = state.reacted[kind];
          return (
            <button
              key={kind}
              type="button"
              disabled={!signedIn || has}
              onClick={() => {
                if (!signedIn || has) return;
                startTransition(async () => {
                  applyOptimistic(kind);
                  await reactAction(storyId, kind);
                });
              }}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                has
                  ? "bg-clay/15 border-clay/40 text-clay-deep cursor-default"
                  : signedIn
                    ? "bg-white border-sand text-ink-soft hover:border-clay/40 hover:text-clay-deep hover:bg-cream"
                    : "bg-white border-sand/60 text-ink-muted cursor-not-allowed"
              )}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden />
              <span>{REACTION_LABELS[kind]}</span>
              {state.counts[kind] > 0 && (
                <span className="text-xs text-ink-muted">
                  {state.counts[kind]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
