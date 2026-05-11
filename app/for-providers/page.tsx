import Link from "next/link";

export const metadata = { title: "For providers & partners — Beside" };

export default function ForProvidersPage() {
  return (
    <div className="space-y-8 rise">
      <section>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          for clinicians, hospitals, and treatment centers
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          The family side is the side you can&rsquo;t reach.
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Most clinical infrastructure is built for the diagnosed patient.
          Their families — second patients — quietly carry the same condition
          without the same resources. They are the next ten years of growth in
          our field. They are also the people most likely to show up at your
          door if their loved one slips. We want them to find you sooner.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card
          title="Vetted listing in our directory"
          body="Your practice or program shown to second patients searching by what they're carrying — partner of, child of, parent of, sibling. Each listing is reviewed by our clinical board before it goes live."
        />
        <Card
          title="Flat partnership fee"
          body="Annual subscription, never per referral. We will not pay you, and you will not pay us, on a per-client basis. We think this matters for the people on the other side of the recommendation."
        />
        <Card
          title="Family programs that reach further"
          body="If you run a family program inside a treatment center or hospital, we offer a B2B SaaS layer that gives your alumni families ongoing community after discharge."
        />
        <Card
          title="Co-branded research"
          body="We share — anonymized, opt-in — what families are writing about. The patterns inside the corpus are useful for clinical training, program design, and grant work."
        />
      </section>

      <section className="rounded-2xl border border-sand bg-cream-deep p-5">
        <h2 className="font-display text-xl text-ink mb-2">Who we&rsquo;re building with</h2>
        <p className="text-sm text-ink-soft leading-relaxed">
          We&rsquo;re in conversation with clinical leads at academic medical
          centers, established treatment centers, and specialty hospitals
          across addiction, mental health, eating disorders, and dementia
          care. Every listed provider is vetted by one of these partners.
        </p>
      </section>

      <section className="rounded-2xl border border-sage/30 bg-sage/5 p-5">
        <h2 className="font-display text-xl text-ink mb-2">
          Built on evidence
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed">
          Beside is the consumer-scale realization of an RCT-validated
          digital therapeutic for second patients (Gustafson et al., 2012;
          University of Wisconsin&ndash;Madison Center for Health Enhancement
          Systems Studies). We use the seven outcome measures from that trial
          as our effectiveness framework.{" "}
          <Link href="/evidence" className="text-clay-deep hover:underline">
            See the evidence base
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-ink mb-3">
          Tell us about your practice
        </h2>
        <p className="text-sm text-ink-soft mb-4 leading-relaxed">
          We&rsquo;re onboarding new providers in cohorts. If you&rsquo;d like
          to be part of the next one, drop us a note.
        </p>
        <a
          href="mailto:partners@beside.example"
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
        >
          Get in touch
        </a>
        <Link
          href="/how-we-fund-this"
          className="ml-3 inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          How we fund this
        </Link>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-sand bg-white/70 p-5">
      <h3 className="font-display text-lg text-ink leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
