import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCurrentWeekPulse } from "@/lib/data";
import { PulseForm } from "./pulse-form";

export const metadata = { title: "Take this week's pulse — Beside" };

export default async function TakePulsePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/welcome");

  const existing = await getCurrentWeekPulse(user.id);

  return (
    <div className="space-y-7 rise">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          this week&rsquo;s pulse
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Four short questions. About you, not them.
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          The four dimensions are the ones with the largest evidence base in
          the population Beside is built for &mdash; pulled from{" "}
          <Link href="/evidence" className="text-clay-deep hover:underline">
            Gustafson&rsquo;s 2012 RCT
          </Link>
          . There are no wrong answers. Use the 0&ndash;4 scale below each
          question.
        </p>
        {existing && (
          <p className="mt-4 text-xs text-ink-muted bg-cream-deep border border-sand rounded-lg px-3 py-2">
            You already checked in this week. Submitting again will replace
            this week&rsquo;s entry.
          </p>
        )}
      </header>

      <PulseForm />
    </div>
  );
}
