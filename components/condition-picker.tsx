"use client";

import { useState } from "react";
import type { Condition } from "@/lib/types";
import { tintClasses, cn } from "@/lib/utils";

type Props = {
  conditions: Condition[];
  initial?: string[];
  name: string;
  min?: number;
  max?: number;
  helperText?: string;
};

export function ConditionPicker({
  conditions,
  initial = [],
  name,
  min = 1,
  max = 4,
  helperText,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else if (next.size < max) next.add(slug);
      return next;
    });
  };

  return (
    <div>
      {helperText && (
        <p className="text-sm text-ink-soft mb-3">{helperText}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {conditions.map((c) => {
          const t = tintClasses(c.tint);
          const on = selected.has(c.slug);
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => toggle(c.slug)}
              className={cn(
                "text-left rounded-xl border p-3 transition-all",
                on
                  ? cn(t.bg, "border-clay text-ink shadow-sm")
                  : "bg-white/60 border-sand hover:border-clay/40 text-ink-soft"
              )}
              aria-pressed={on}
            >
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  {c.emoji}
                </span>
                <span className="font-medium text-sm">{c.short}</span>
              </div>
              <p className="text-xs text-ink-muted mt-1 leading-snug">
                {c.description.replace(/&rsquo;/g, "’")}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        {selected.size === 0 && `Pick at least ${min}.`}
        {selected.size > 0 && `${selected.size} selected · pick up to ${max}.`}
      </p>
      {Array.from(selected).map((slug) => (
        <input key={slug} type="hidden" name={name} value={slug} />
      ))}
    </div>
  );
}
