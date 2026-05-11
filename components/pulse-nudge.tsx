import Link from "next/link";
import { cookies } from "next/headers";
import { Activity } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getEngagementCount } from "@/lib/data";
import { dismissPulseNudge } from "@/lib/pulse-nudge-action";

const DISMISS_COOKIE = "beside_pulse_nudge_dismissed";
const REACTION_THRESHOLD = 3;

export async function PulseNudge() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.pulses && user.pulses.length > 0) return null;

  const jar = await cookies();
  if (jar.has(DISMISS_COOKIE)) return null;

  const { reactionCount, shareCount } = await getEngagementCount(user.id);
  if (reactionCount < REACTION_THRESHOLD && shareCount < 1) return null;

  return (
    <section className="rounded-2xl border border-clay/30 bg-clay/5 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-3.5 h-3.5 text-clay-deep" aria-hidden />
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">
          a quiet invitation
        </p>
      </div>
      <h3 className="font-display text-xl text-ink leading-snug">
        Want to know how you&rsquo;re carrying it?
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">
        You&rsquo;ve been holding stories with us. If you want, you can also
        keep a small private chart of how you&rsquo;re doing &mdash; four
        short questions, once a week. Nobody else sees it.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/pulse/take"
          className="inline-flex items-center rounded-full bg-clay text-cream px-4 py-2 text-sm font-medium hover:bg-clay-deep transition-colors"
        >
          Try Pulse →
        </Link>
        <form action={dismissPulseNudge}>
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-sand bg-white text-ink-soft px-4 py-2 text-sm hover:border-clay/40 hover:text-ink transition-colors"
          >
            Not now
          </button>
        </form>
      </div>
    </section>
  );
}
