"use client";

import { useActionState, useState } from "react";
import { Shuffle } from "lucide-react";
import { ThemePicker } from "@/components/theme-picker";
import { ConditionPicker } from "@/components/condition-picker";
import type { Theme, Condition } from "@/lib/types";
import { suggestPseudonym } from "@/lib/utils";
import { beginSession } from "./actions";

export function WelcomeForm({
  themes,
  conditions,
  suggestion,
}: {
  themes: Theme[];
  conditions: Condition[];
  suggestion: string;
}) {
  const [state, formAction, pending] = useActionState(beginSession, null);
  const [pseudonym, setPseudonym] = useState(suggestion);

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label
          htmlFor="pseudonym"
          className="block text-sm font-medium text-ink mb-2"
        >
          Your pseudonym
        </label>
        <div className="flex gap-2">
          <input
            id="pseudonym"
            name="pseudonym"
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            maxLength={24}
            className="flex-1 rounded-xl border border-sand bg-white px-4 py-2.5 text-ink placeholder:text-ink-muted focus:border-clay/50 focus:outline-none"
            placeholder="QuietRiver42"
          />
          <button
            type="button"
            onClick={() => setPseudonym(suggestPseudonym())}
            className="rounded-xl border border-sand bg-white/60 px-3 text-ink-soft hover:border-clay/40 hover:text-ink transition-colors"
            aria-label="Suggest another name"
          >
            <Shuffle className="w-4 h-4" aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          Letters, numbers, underscores. No real names, please.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          What are you here about?
        </label>
        <ConditionPicker
          conditions={conditions}
          name="conditions"
          helperText="Pick the condition(s) someone you love is dealing with — or that you&rsquo;re carrying yourself."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          And what are you carrying?
        </label>
        <ThemePicker
          themes={themes}
          name="themes"
          helperText="The relationship and the stretch you&rsquo;re in. Pick one or a few."
        />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors disabled:opacity-60"
        >
          {pending ? "settling in…" : "Step in"}
        </button>
        <p className="mt-3 text-xs text-ink-muted">
          We don&rsquo;t track you across the web. We don&rsquo;t sell anything.
          We don&rsquo;t need your email.
        </p>
      </div>
    </form>
  );
}
