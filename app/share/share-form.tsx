"use client";

import { useActionState, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { ThemePicker } from "@/components/theme-picker";
import { ConditionPicker } from "@/components/condition-picker";
import type { Theme, Condition } from "@/lib/types";
import { submitStory, suggestTagsAction } from "./actions";

export function ShareForm({
  themes,
  conditions,
  initialThemes,
  initialConditions,
}: {
  themes: Theme[];
  conditions: Condition[];
  initialThemes: string[];
  initialConditions: string[];
}) {
  const [state, formAction, pending] = useActionState(submitStory, null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [suggestPending, startSuggest] = useTransition();
  const [suggestion, setSuggestion] = useState<{
    conditions: string[];
    themes: string[];
    rationale: string;
  } | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [appliedThemes, setAppliedThemes] = useState<string[]>(initialThemes);
  const [appliedConditions, setAppliedConditions] =
    useState<string[]>(initialConditions);

  const canSuggest = title.trim().length >= 4 && body.trim().length >= 20;

  const onSuggest = () => {
    setSuggestError(null);
    startSuggest(async () => {
      const result = await suggestTagsAction({
        title: title.trim(),
        body: body.trim(),
      });
      if (!result.ok) {
        setSuggestError(result.error);
        return;
      }
      setSuggestion(result.suggestion);
      setAppliedThemes(result.suggestion.themes);
      setAppliedConditions(result.suggestion.conditions);
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-ink mb-2"
        >
          A line that might be the title
        </label>
        <input
          id="title"
          name="title"
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-clay/50 focus:outline-none"
          placeholder="The first time I went to Al-Anon"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-ink mb-2"
        >
          Your story
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          maxLength={4000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-ink placeholder:text-ink-muted focus:border-clay/50 focus:outline-none leading-relaxed resize-none"
          placeholder="Take your time. There's no perfect way to say it."
        />
        <p className="mt-2 text-xs text-ink-muted">
          {body.length} / 4000 · Your draft stays as long as this tab is open.
        </p>
      </div>

      <div className="flex items-center justify-end -mb-2">
        <button
          type="button"
          disabled={!canSuggest || suggestPending}
          onClick={onSuggest}
          className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white/80 px-3 py-1 text-xs text-ink-soft hover:border-clay/40 hover:text-clay-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            !canSuggest
              ? "Write a bit more first"
              : "Have AI read your draft and suggest tags"
          }
        >
          <Sparkles className="w-3 h-3" aria-hidden />
          {suggestPending ? "reading…" : "suggest tags"}
        </button>
      </div>

      {suggestion && (
        <p className="text-xs text-ink-soft bg-sage/10 border border-sage/20 rounded-lg px-3 py-2 -mt-3">
          <span className="text-sage-deep font-medium">a thought:</span>{" "}
          {suggestion.rationale}
        </p>
      )}
      {suggestError && (
        <p className="text-xs text-danger -mt-3">{suggestError}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          What is this about?
        </label>
        <ConditionPicker
          key={appliedConditions.join(",")}
          conditions={conditions}
          initial={appliedConditions}
          name="conditions"
          max={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Themes
        </label>
        <ThemePicker
          key={appliedThemes.join(",")}
          themes={themes}
          initial={appliedThemes}
          name="themes"
        />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors disabled:opacity-60"
        >
          {pending ? "sending…" : "Send for review"}
        </button>
      </div>
    </form>
  );
}
