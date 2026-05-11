import type { PulseEntry, PulseDimension } from "@/lib/types";

const DIM_META: Record<
  PulseDimension,
  { label: string; direction: "down" | "up"; color: string; label_low: string; label_high: string }
> = {
  loneliness: {
    label: "Loneliness",
    direction: "down",
    color: "#c49595",
    label_low: "rarely alone",
    label_high: "always alone",
  },
  blame: {
    label: "Self-blame",
    direction: "down",
    color: "#c97b5c",
    label_low: "no blame",
    label_high: "constant blame",
  },
  anxiety: {
    label: "Anxiety",
    direction: "down",
    color: "#d9a45e",
    label_low: "calm",
    label_high: "braced",
  },
  positive_relations: {
    label: "Connection",
    direction: "up",
    color: "#6b8e7f",
    label_low: "disconnected",
    label_high: "connected",
  },
};

const DIMS: PulseDimension[] = [
  "loneliness",
  "blame",
  "anxiety",
  "positive_relations",
];

export function PulseChart({ pulses }: { pulses: PulseEntry[] }) {
  if (pulses.length === 0) return null;
  const recent = pulses.slice(-12);

  return (
    <div className="grid grid-cols-2 gap-3">
      {DIMS.map((dim) => (
        <Sparkline key={dim} dim={dim} pulses={recent} />
      ))}
    </div>
  );
}

function Sparkline({
  dim,
  pulses,
}: {
  dim: PulseDimension;
  pulses: PulseEntry[];
}) {
  const meta = DIM_META[dim];
  const W = 240;
  const H = 80;
  const PAD_X = 8;
  const PAD_Y = 12;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const n = pulses.length;
  const xs = pulses.map((_, i) =>
    n === 1 ? PAD_X + innerW / 2 : PAD_X + (i / (n - 1)) * innerW
  );
  const ys = pulses.map((p) => {
    const v = p.scores[dim];
    return PAD_Y + ((4 - v) / 4) * innerH;
  });
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const last = pulses[pulses.length - 1].scores[dim];
  const prev = pulses.length > 1 ? pulses[pulses.length - 2].scores[dim] : null;
  const delta = prev === null ? null : last - prev;
  const arrow =
    delta === null
      ? null
      : delta === 0
        ? "·"
        : meta.direction === "down"
          ? delta < 0
            ? "↓"
            : "↑"
          : delta > 0
            ? "↑"
            : "↓";
  const goodMove =
    delta === null
      ? null
      : meta.direction === "down"
        ? delta < 0
        : delta > 0;

  return (
    <div className="rounded-2xl border border-sand bg-white/70 p-3">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-xs font-medium text-ink">{meta.label}</p>
        {arrow && (
          <span
            className={`text-xs ${
              goodMove === null
                ? "text-ink-muted"
                : goodMove
                  ? "text-sage-deep"
                  : "text-clay-deep"
            }`}
          >
            {arrow} {Math.abs(delta!)}
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-16"
        preserveAspectRatio="none"
      >
        <line
          x1={PAD_X}
          y1={H - PAD_Y}
          x2={W - PAD_X}
          y2={H - PAD_Y}
          stroke="#e8ddc9"
          strokeWidth="1"
        />
        <line
          x1={PAD_X}
          y1={PAD_Y + innerH / 2}
          x2={W - PAD_X}
          y2={PAD_Y + innerH / 2}
          stroke="#e8ddc9"
          strokeDasharray="2 3"
          strokeWidth="1"
        />
        <polyline
          points={points}
          fill="none"
          stroke={meta.color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {xs.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={ys[i]}
            r={i === xs.length - 1 ? 3 : 2}
            fill={meta.color}
          />
        ))}
      </svg>
      <div className="flex items-center justify-between text-[10px] text-ink-muted mt-1">
        <span>{meta.label_low}</span>
        <span className="text-ink-soft">{n} {n === 1 ? "week" : "weeks"}</span>
        <span>{meta.label_high}</span>
      </div>
    </div>
  );
}
