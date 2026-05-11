"use client";

import { useActionState, useState } from "react";
import type { PulseDimension } from "@/lib/types";
import { cn } from "@/lib/utils";
import { submitPulse } from "./actions";

type Question = {
  field: PulseDimension;
  prompt: string;
  scale: [string, string]; // 0-end, 4-end labels
};

const QUESTIONS: Question[] = [
  {
    field: "loneliness",
    prompt: "Even around people, how alone did this week feel?",
    scale: ["not really", "almost always"],
  },
  {
    field: "blame",
    prompt:
      "How much did you carry the feeling that this is somehow your fault?",
    scale: ["not at all", "constantly"],
  },
  {
    field: "anxiety",
    prompt: "How braced for the next thing did your body feel?",
    scale: ["calm", "very braced"],
  },
  {
    field: "positive_relations",
    prompt: "How connected did you feel to the people you love?",
    scale: ["distant", "deeply connected"],
  },
];

export function PulseForm() {
  const [state, formAction, pending] = useActionState(submitPulse, null);
  const [answers, setAnswers] = useState<Partial<Record<PulseDimension, number>>>(
    {}
  );

  const allAnswered = QUESTIONS.every((q) => typeof answers[q.field] === "number");

  return (
    <form action={formAction} className="space-y-6">
      {QUESTIONS.map((q) => (
        <fieldset key={q.field} className="rounded-2xl border border-sand bg-white/70 p-5">
          <legend className="font-display text-base text-ink leading-snug px-1">
            {q.prompt}
          </legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((v) => {
              const selected = answers[q.field] === v;
              return (
                <label
                  key={v}
                  className={cn(
                    "flex items-center justify-center rounded-xl border py-3 cursor-pointer text-sm font-medium transition-colors",
                    selected
                      ? "bg-clay/15 border-clay text-clay-deep"
                      : "bg-white border-sand text-ink-soft hover:border-clay/40"
                  )}
                >
                  <input
                    type="radio"
                    name={q.field}
                    value={String(v)}
                    className="sr-only"
                    checked={selected}
                    onChange={() =>
                      setAnswers((a) => ({ ...a, [q.field]: v }))
                    }
                  />
                  {v}
                </label>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted px-1">
            <span>{q.scale[0]}</span>
            <span>{q.scale[1]}</span>
          </div>
        </fieldset>
      ))}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={!allAnswered || pending}
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors disabled:opacity-50"
        >
          {pending ? "saving…" : "Save this week"}
        </button>
        <p className="mt-3 text-xs text-ink-muted">
          Your answers stay private to you. They never appear in stories or
          on other people&rsquo;s screens.
        </p>
      </div>
    </form>
  );
}
