"use client";

import { useState } from "react";
import type { Theme } from "@/lib/types";
import { tintClasses, cn } from "@/lib/utils";

type Props = {
  themes: Theme[];
  initial?: string[];
  name: string;
  min?: number;
  max?: number;
  helperText?: string;
};

export function ThemePicker({
  themes,
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
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        if (next.size >= max) return prev;
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <div>
      {helperText && (
        <p className="text-sm text-ink-soft mb-3">{helperText}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => {
          const t = tintClasses(theme.tint);
          const on = selected.has(theme.slug);
          return (
            <button
              key={theme.slug}
              type="button"
              onClick={() => toggle(theme.slug)}
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
                  {theme.emoji}
                </span>
                <span className="font-medium text-sm">{theme.short}</span>
              </div>
              <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                {theme.label}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        {selected.size === 0 && `Pick at least ${min}.`}
        {selected.size > 0 &&
          `${selected.size} selected · pick up to ${max}.`}
      </p>
      {Array.from(selected).map((slug) => (
        <input key={slug} type="hidden" name={name} value={slug} />
      ))}
    </div>
  );
}
