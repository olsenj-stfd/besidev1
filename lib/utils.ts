import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

const ADJ = [
  "Quiet", "Brave", "Steady", "Gentle", "Kind", "Patient",
  "Hopeful", "Tender", "Warm", "Calm", "Grounded", "Soft",
  "Open", "Still", "Earnest", "Honest", "Mended", "Rooted",
];

const NOUN = [
  "River", "Lantern", "Field", "Hearth", "Anchor", "Harbor",
  "Meadow", "Willow", "Compass", "Stone", "Beacon", "Shore",
  "Pine", "Cedar", "Cove", "Brook", "Dawn", "Tide",
];

export function suggestPseudonym(): string {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const n = NOUN[Math.floor(Math.random() * NOUN.length)];
  const num = Math.floor(Math.random() * 90 + 10);
  return `${a}${n}${num}`;
}

export function tintClasses(tint: "clay" | "sage" | "rose" | "amber" | "sand") {
  switch (tint) {
    case "clay":
      return { bg: "bg-clay/10", border: "border-clay/30", text: "text-clay-deep" };
    case "sage":
      return { bg: "bg-sage/10", border: "border-sage/30", text: "text-sage-deep" };
    case "rose":
      return { bg: "bg-rose/15", border: "border-rose/40", text: "text-clay-deep" };
    case "amber":
      return { bg: "bg-amber/15", border: "border-amber/40", text: "text-ink-soft" };
    case "sand":
    default:
      return { bg: "bg-sand", border: "border-sand", text: "text-ink-soft" };
  }
}
