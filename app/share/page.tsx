import Link from "next/link";
import { listThemes, listConditions } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { ShareForm } from "./share-form";

export const metadata = { title: "Share — Beside" };

export default async function SharePage() {
  const [themes, conditions, user] = await Promise.all([
    listThemes(),
    listConditions(),
    getCurrentUser(),
  ]);

  if (!user) {
    return (
      <div className="space-y-5 rise">
        <h1 className="font-display text-3xl text-ink">Share something</h1>
        <p className="text-ink-soft leading-relaxed">
          You&rsquo;ll need a pseudonym before you write here. It takes a
          minute, no email needed.
        </p>
        <Link
          href="/welcome"
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
        >
          Begin quietly
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 rise">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          your turn — {user.pseudonym}
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Share something. We&rsquo;ll read it before it&rsquo;s posted.
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          A real human moderator looks at every story. This isn&rsquo;t about
          gatekeeping &mdash; it&rsquo;s about keeping this place soft for
          everyone in it.
        </p>
      </header>
      <ShareForm
        themes={themes}
        conditions={conditions}
        initialThemes={user.themes}
        initialConditions={user.conditions ?? []}
      />
      <aside className="rounded-2xl border border-sand bg-cream-deep p-5 text-sm text-ink-soft leading-relaxed">
        <p className="font-medium text-ink mb-2">A few gentle asks</p>
        <ul className="space-y-1 list-disc pl-5">
          <li>Use first names only, or change them.</li>
          <li>No locations, employers, schools, or treatment-center names.</li>
          <li>Write to be read, not to be replied to.</li>
          <li>
            If you&rsquo;re in crisis right now, please call or text{" "}
            <a href="tel:988" className="text-clay-deep underline">
              988
            </a>{" "}
            instead of writing here. We will still be here later.
          </li>
        </ul>
      </aside>
    </div>
  );
}
