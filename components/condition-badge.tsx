import type { Condition } from "@/lib/types";
import { tintClasses, cn } from "@/lib/utils";

export function ConditionBadge({
  condition,
  size = "md",
}: {
  condition: Condition;
  size?: "sm" | "md";
}) {
  const t = tintClasses(condition.tint);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        t.bg,
        t.border,
        t.text
      )}
    >
      <span aria-hidden>{condition.emoji}</span>
      <span>{condition.short}</span>
    </span>
  );
}
