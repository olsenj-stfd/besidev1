import Link from "next/link";
import type { Theme } from "@/lib/types";
import { tintClasses, cn } from "@/lib/utils";

export function ThemeCard({ theme, count }: { theme: Theme; count?: number }) {
  const t = tintClasses(theme.tint);
  return (
    <Link
      href={`/themes/${theme.slug}`}
      className={cn(
        "group block rounded-2xl border p-5 transition-all hover:shadow-sm hover:-translate-y-0.5",
        t.bg,
        t.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3
            className={cn("font-display text-lg leading-tight mb-2", t.text)}
          >
            {theme.label}
          </h3>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            {theme.description}
          </p>
        </div>
      </div>
      {typeof count === "number" && (
        <div className="mt-4 text-xs text-ink-muted">
          {count} {count === 1 ? "story" : "stories"}
        </div>
      )}
    </Link>
  );
}
