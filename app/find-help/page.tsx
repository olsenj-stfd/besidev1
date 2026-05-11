import Link from "next/link";
import { listProviders, listConditions } from "@/lib/data";
import { ProviderCard } from "@/components/provider-card";
import { ConditionBadge } from "@/components/condition-badge";

export const metadata = { title: "Find help — Beside" };

type SearchParams = Promise<{ condition?: string }>;

export default async function FindHelpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const [providers, conditions] = await Promise.all([
    listProviders(),
    listConditions(),
  ]);

  const filter = sp.condition;
  const visible = filter
    ? providers.filter((p) => p.conditionSlugs.includes(filter))
    : providers;

  return (
    <div className="space-y-8">
      <section className="rise">
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          for the second patient
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Find someone who gets it
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed max-w-prose">
          Therapists, counselors, and coaches who specialize in supporting the
          family side of these conditions — not just the person diagnosed. Each
          one is vetted by a clinical partner. Beside is paid a flat listing
          fee, never per referral, so the recommendation here is the same one
          we&rsquo;d give a friend.
        </p>
      </section>

      <section>
        <p className="text-xs text-ink-muted mb-2">filter by what you carry</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/find-help"
            className={`rounded-full border px-3 py-1 text-xs ${
              !filter
                ? "bg-clay text-cream border-clay"
                : "bg-white border-sand text-ink-soft hover:border-clay/30"
            }`}
          >
            all
          </Link>
          {conditions.map((c) => {
            const active = filter === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/find-help?condition=${c.slug}`}
                className={`rounded-full border px-3 py-1 text-xs inline-flex items-center ${
                  active
                    ? "bg-clay text-cream border-clay"
                    : "bg-white border-sand text-ink-soft hover:border-clay/30"
                }`}
              >
                {c.short}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="space-y-3">
          {visible.map((p) => (
            <ProviderCard key={p.id} provider={p} conditions={conditions} />
          ))}
          {visible.length === 0 && (
            <p className="text-ink-muted text-sm">
              No providers under this filter yet. Check back — we&rsquo;re
              adding partners every week.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-cream-deep p-5 text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">
          Are you a clinician or treatment center?
        </p>
        <p className="leading-relaxed">
          We partner with hospitals, treatment centers, and family-trained
          clinicians who want their work to reach the people quietly carrying
          someone else&rsquo;s diagnosis.{" "}
          <Link
            href="/for-providers"
            className="text-clay-deep hover:underline"
          >
            Learn about partnership
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
