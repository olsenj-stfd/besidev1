import Link from "next/link";
import { ArrowDownRight, BookOpen, FileText } from "lucide-react";

export const metadata = { title: "Evidence — Beside" };

export default function EvidencePage() {
  return (
    <div className="space-y-10 rise max-w-prose">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          the research behind beside
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Beside is the consumer-scale realization of an RCT-validated digital
          therapeutic for second patients.
        </h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          The thesis &mdash; that a private, anonymous, asynchronous, peer-driven
          intervention can meaningfully improve the psychological health of
          family members of someone with a substance-use disorder &mdash; was
          tested in a randomized controlled pilot in 2012. The effects were
          large. The intervention was never commercialized. Beside picks up
          where that work left off, and extends it to mental illness, eating
          disorders, and grief.
        </p>
      </header>

      <section className="rounded-2xl border border-sand bg-white/70 p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-clay-deep" aria-hidden />
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            foundational study
          </p>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed">
          Gustafson DH, McTavish FM, Schubert CJ, Johnson RA. (2012).{" "}
          <strong className="text-ink">
            The Effect of a Computer-based Intervention on Adult Children of
            Alcoholics
          </strong>
          . <em>Journal of Addiction Medicine, 6(1), 24&ndash;28.</em>
        </p>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
          Pilot RCT (n=23) of <strong className="text-ink">CHESS</strong>{" "}
          (Comprehensive Health Enhancement Support System), an
          NIH&ndash;funded digital therapeutic developed at the University of
          Wisconsin&ndash;Madison Center for Health Enhancement Systems
          Studies. Three arms: therapy only, CHESS only, CHESS + therapy.
        </p>
        <a
          href="https://journals.lww.com/journaladdictionmedicine/fulltext/2012/03000/the_effect_of_a_computer_based_intervention_on.4.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-clay-deep hover:text-clay underline-offset-2 hover:underline"
        >
          <FileText className="w-3.5 h-3.5" aria-hidden /> Read the paper
        </a>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-3">
          What the study found
        </h2>
        <div className="space-y-3">
          <Finding
            stat="81.5% vs 42.8%"
            text="Group-therapy attendance was nearly twice as high when participants also had access to CHESS, compared to therapy alone."
          />
          <Finding
            stat="5 of 7 outcomes"
            text="The CHESS-only arm produced the largest effect size on five of the seven psychological-health measures &mdash; outperforming both therapy alone and CHESS combined with therapy."
          />
          <Finding
            stat="Cohen's d ≥ 0.8 on 4 of 5"
            text="Four of those five effect sizes were &ldquo;large&rdquo; by Cohen&rsquo;s convention. The fifth was moderate."
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-2">
          Beside&rsquo;s effectiveness framework
        </h2>
        <p className="text-ink-soft leading-relaxed mb-5">
          We&rsquo;ve adopted the seven outcome measures from Gustafson et al.
          (2012) as the framework for measuring whether Beside is doing what
          it claims to do. Distress measures should fall over time;
          health&ndash;and&ndash;growth measures should rise.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <MeasureCard
            tone="distress"
            title="Distress (target: ↓)"
            items={["Blame", "Depression", "Anxiety", "Loneliness"]}
          />
          <MeasureCard
            tone="health"
            title="Health & growth (target: ↑)"
            items={[
              "Personal growth",
              "Positive relations with others",
              "Self-acceptance",
            ]}
          />
        </div>
        <p className="mt-4 text-xs text-ink-muted leading-relaxed">
          As Beside scales, opt-in pre/post measures using these scales become
          part of the platform &mdash; both as an internal effectiveness
          check, and as the basis for future replication studies with
          academic partners.
        </p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          The four highest-effect dimensions from the 2012 trial &mdash;
          loneliness, self-blame, anxiety, and positive relations &mdash;
          are now live in the prototype as{" "}
          <Link href="/pulse" className="text-clay-deep hover:underline">
            Pulse
          </Link>
          : a private weekly self-check that gives each member their own
          longitudinal view, and (with explicit opt-in) becomes the data
          corpus for future replication work.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-3">
          What participants said
        </h2>
        <p className="text-sm text-ink-soft mb-4">
          Verbatim quotes from the 2012 trial, written by adult children of
          alcoholics about their experience using the CHESS intervention.
        </p>
        <div className="space-y-4">
          <Quote
            text="With group therapy alone there would be 6 days, 22.5 hours each week that I'd feel more or less alone."
          />
          <Quote
            text="I can say on the computer what can be too difficult in person."
          />
          <Quote
            text="With group therapy alone, shy people like me almost never have the courage to reveal much to the group, and with the computer alone the person doesn't grasp the sincerity behind the supportive messages."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-amber/40 bg-amber/15 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2">
          honest sizing
        </p>
        <p className="text-sm text-ink-soft leading-relaxed">
          The 2012 study is a <strong className="text-ink">pilot</strong>:
          n=23, all white participants, predominantly women, one therapist.
          The right framing is <em>RCT-grade pilot evidence with large
          effect sizes; replication at scale is needed</em>. We don&rsquo;t
          claim more than that, and we&rsquo;re actively pursuing the
          academic partnerships needed to replicate.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-3">
          Where this is going
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-ink-soft leading-relaxed">
          <li>
            Adopt the seven measures as Beside&rsquo;s opt-in outcome
            instrument.
          </li>
          <li>
            Collaborate with the UW&ndash;Madison Center for Health Enhancement
            Systems Studies (where CHESS was developed) on a modern
            replication study at scale, across the four conditions Beside
            covers.
          </li>
          <li>
            Publish the corpus-level patterns &mdash; anonymized, opt-in
            &mdash; so researchers and clinicians can use what we learn.
          </li>
        </ol>
      </section>

      <section className="text-sm text-ink-soft leading-relaxed">
        <h2 className="font-display text-xl text-ink mb-2">
          On the CHESS lineage
        </h2>
        <p>
          CHESS is a 30-year body of research from the University of
          Wisconsin&ndash;Madison Center for Health Enhancement Systems
          Studies, originally for cancer patients and later for substance use,
          HIV, and other chronic conditions. The addiction module
          (A&ndash;CHESS) was studied in a separate{" "}
          <a
            href="https://jamanetwork.com/journals/jamapsychiatry/fullarticle/1828837"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clay-deep hover:underline"
          >
            JAMA Psychiatry RCT (Gustafson et al., 2014)
          </a>{" "}
          for the diagnosed patient. Beside is designed in that tradition
          &mdash; private, asynchronous, peer-supported, evidence-based
          &mdash; and applied to the population the 2012 paper studied: the
          family side.
        </p>
      </section>

      <div className="pt-3 flex flex-wrap gap-3">
        <Link
          href="/for-providers"
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
        >
          For providers & partners
        </Link>
        <Link
          href="/how-we-fund-this"
          className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          How we fund this
        </Link>
      </div>
    </div>
  );
}

function Finding({ stat, text }: { stat: string; text: string }) {
  return (
    <div className="rounded-xl border border-sand bg-white/70 p-4 flex gap-4 items-start">
      <ArrowDownRight
        className="w-4 h-4 text-clay-deep mt-1 shrink-0"
        aria-hidden
      />
      <div>
        <p className="font-display text-lg text-ink leading-tight">{stat}</p>
        <p
          className="text-sm text-ink-soft mt-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  );
}

function MeasureCard({
  tone,
  title,
  items,
}: {
  tone: "distress" | "health";
  title: string;
  items: string[];
}) {
  const cls =
    tone === "distress"
      ? "bg-rose/10 border-rose/30 text-clay-deep"
      : "bg-sage/10 border-sage/30 text-sage-deep";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="font-medium text-sm mb-2">{title}</p>
      <ul className="text-sm text-ink-soft space-y-1">
        {items.map((i) => (
          <li key={i}>· {i}</li>
        ))}
      </ul>
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="rounded-2xl border-l-4 border-clay bg-cream-deep px-5 py-4">
      <p className="font-display text-lg text-ink leading-snug italic">
        &ldquo;{text}&rdquo;
      </p>
      <footer className="mt-2 text-xs text-ink-muted">
        Adult child of an alcoholic, Gustafson et al. 2012 trial
      </footer>
    </blockquote>
  );
}
