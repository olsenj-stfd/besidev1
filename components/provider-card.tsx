import { CheckCircle2, MapPin, Video } from "lucide-react";
import type { Provider, Condition } from "@/lib/types";
import { ConditionBadge } from "./condition-badge";

const MODALITY_LABEL: Record<string, string> = {
  individual: "1:1 therapy",
  family: "family therapy",
  couples: "couples therapy",
  group: "group",
  coaching: "coaching",
  intensive: "intensive",
};

export function ProviderCard({
  provider,
  conditions,
}: {
  provider: Provider;
  conditions: Condition[];
}) {
  const cMap = new Map(conditions.map((c) => [c.slug, c]));
  const provConditions = provider.conditionSlugs
    .map((s) => cMap.get(s))
    .filter(Boolean) as Condition[];

  return (
    <div className="rounded-2xl border border-sand bg-white/70 p-5 hover:bg-white transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center font-display text-ink shrink-0">
          {provider.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-display text-lg text-ink leading-tight">
              {provider.name}
            </h3>
            <span className="text-xs text-ink-muted">
              {provider.credentials}
            </span>
          </div>
          <p className="text-xs text-clay-deep mt-0.5">{provider.title}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        {provider.blurb}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {provConditions.map((c) => (
          <ConditionBadge key={c.slug} condition={c} size="sm" />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
        {provider.format !== "in_person" && (
          <span className="inline-flex items-center gap-1">
            <Video className="w-3 h-3" aria-hidden /> telehealth
          </span>
        )}
        {provider.city && provider.state && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" aria-hidden /> {provider.city}, {provider.state}
          </span>
        )}
        <span>·</span>
        <span>
          {provider.modalities
            .map((m) => MODALITY_LABEL[m] ?? m)
            .join(" · ")}
        </span>
      </div>

      {provider.secondPatientTrained && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage/15 border border-sage/30 px-2.5 py-1 text-[11px] text-sage-deep">
          <CheckCircle2 className="w-3 h-3" aria-hidden />
          second-patient trained{provider.vettedBy ? ` · vetted by ${provider.vettedBy}` : ""}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={
            provider.takingClients
              ? "text-xs text-sage-deep"
              : "text-xs text-ink-muted"
          }
        >
          {provider.takingClients ? "accepting new clients" : "waitlist only"}
        </span>
        <button
          type="button"
          className="rounded-full border border-sand bg-cream-deep text-ink-soft px-3 py-1 text-xs hover:border-clay/40 hover:text-clay-deep transition-colors"
        >
          request intro
        </button>
      </div>
    </div>
  );
}
