"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, AlertCircle } from "lucide-react";
import { recordCheckin } from "@/lib/checkin-action";
import type { Mood } from "@/lib/checkin-types";

const MOODS: { value: Mood; label: string; sub?: string }[] = [
  { value: "steady", label: "Steady" },
  { value: "tired_ok", label: "Tired, but okay" },
  { value: "heavy_day", label: "Heavy day" },
  { value: "hard_week", label: "Hard week" },
  {
    value: "want_to_talk",
    label: "I want to talk to someone soon",
    sub: "we&rsquo;ll bring you to people who can help",
  },
];

type Step = "start" | "unsafe" | "mood";

export function SafetyCheckin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("start");
  const [pending, startTransition] = useTransition();

  const finishSafe = (mood: Mood) => {
    startTransition(async () => {
      await recordCheckin({ state: "safe", mood });
      if (mood === "want_to_talk") {
        router.push("/find-help");
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  const finishUnsafe = () => {
    startTransition(async () => {
      await recordCheckin({ state: "unsafe" });
      router.refresh();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-cream border border-sand shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {step === "start" && (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
              a check-in
            </p>
            <h2
              id="checkin-title"
              className="font-display text-2xl text-ink leading-tight mb-2"
            >
              Before you read or share, can we check in?
            </h2>
            <p className="text-ink-soft leading-relaxed mb-5">
              Are you safe right now?
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setStep("mood")}
                className="rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
              >
                I&rsquo;m safe
              </button>
              <button
                type="button"
                onClick={() => setStep("unsafe")}
                className="rounded-full border border-sand bg-white text-ink-soft px-5 py-2.5 font-medium hover:border-danger/40 hover:text-danger transition-colors"
              >
                Not really
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-muted leading-relaxed">
              We ask once when you arrive, and again every few hours. Whatever
              you choose stays between you and us.
            </p>
          </>
        )}

        {step === "unsafe" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-danger" aria-hidden />
              <p className="text-xs uppercase tracking-[0.18em] text-danger">
                stay here a moment
              </p>
            </div>
            <h2
              id="checkin-title"
              className="font-display text-2xl text-ink leading-tight mb-2"
            >
              Please reach a real person right now.
            </h2>
            <p className="text-ink-soft leading-relaxed mb-4">
              These are humans on the other end, available around the clock.
              You don&rsquo;t need a script. We will still be here when
              you&rsquo;re ready.
            </p>
            <ul className="space-y-2 mb-5">
              <li>
                <a
                  href="tel:988"
                  className="flex items-start gap-3 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 hover:bg-clay/20 transition-colors"
                >
                  <Phone className="w-4 h-4 text-clay-deep mt-0.5 shrink-0" aria-hidden />
                  <span className="leading-snug">
                    <strong className="text-ink">988</strong>{" "}
                    <span className="text-ink-soft">— Suicide & Crisis Lifeline (call or text, 24/7)</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:911"
                  className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 hover:bg-danger/20 transition-colors"
                >
                  <Phone className="w-4 h-4 text-danger mt-0.5 shrink-0" aria-hidden />
                  <span className="leading-snug">
                    <strong className="text-ink">911</strong>{" "}
                    <span className="text-ink-soft">— if you or someone with you is in immediate danger</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:18006624357"
                  className="flex items-start gap-3 rounded-xl border border-sand bg-white px-4 py-3 hover:border-clay/40 transition-colors"
                >
                  <Phone className="w-4 h-4 text-clay-deep mt-0.5 shrink-0" aria-hidden />
                  <span className="leading-snug">
                    <strong className="text-ink">1-800-662-4357</strong>{" "}
                    <span className="text-ink-soft">— SAMHSA, free & confidential</span>
                  </span>
                </a>
              </li>
            </ul>
            <button
              type="button"
              onClick={finishUnsafe}
              disabled={pending}
              className="w-full rounded-full border border-sand bg-white text-ink-soft px-5 py-2.5 text-sm font-medium hover:border-clay/40 hover:text-ink transition-colors disabled:opacity-60"
            >
              {pending ? "…" : "I&rsquo;ve called or messaged someone"}
            </button>
            <button
              type="button"
              onClick={() => setStep("start")}
              className="w-full mt-2 text-xs text-ink-muted hover:text-ink-soft transition-colors"
            >
              ← back
            </button>
          </>
        )}

        {step === "mood" && (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
              one more
            </p>
            <h2
              id="checkin-title"
              className="font-display text-2xl text-ink leading-tight mb-2"
            >
              How are you carrying it today?
            </h2>
            <p className="text-ink-soft leading-relaxed mb-4 text-sm">
              No wrong answer. We use it to know who&rsquo;s in the room with
              us.
            </p>
            <div className="flex flex-col gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => finishSafe(m.value)}
                  disabled={pending}
                  className="text-left rounded-xl border border-sand bg-white/70 px-4 py-3 text-ink hover:border-clay/40 hover:bg-white transition-colors disabled:opacity-60"
                >
                  <div className="font-medium">{m.label}</div>
                  {m.sub && (
                    <div
                      className="text-xs text-ink-muted mt-0.5"
                      dangerouslySetInnerHTML={{ __html: m.sub }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("start")}
              className="w-full mt-3 text-xs text-ink-muted hover:text-ink-soft transition-colors"
            >
              ← back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
