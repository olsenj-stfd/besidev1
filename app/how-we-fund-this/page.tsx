import Link from "next/link";

export const metadata = { title: "How we fund this — Beside" };

export default function HowWeFundPage() {
  return (
    <div className="space-y-7 rise max-w-prose">
      <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">
        the money question, answered out loud
      </p>
      <h1 className="font-display text-3xl text-ink leading-tight">
        How we fund this — and what we won&rsquo;t do.
      </h1>
      <p className="text-ink-soft leading-relaxed">
        Beside has to make money. We&rsquo;d rather tell you exactly how than
        leave you to wonder. The platform stays free for the people who come
        here to read and share. The revenue comes from the other side of the
        problem — the providers, the centers, and the employers who already
        spend money on this.
      </p>

      <Section title="What we do">
        <Bullet>
          <strong className="text-ink">Verified-provider listings.</strong>{" "}
          Therapists and clinics pay a flat annual fee to be listed in{" "}
          <Link href="/find-help" className="text-clay-deep hover:underline">
            /find-help
          </Link>
          . The fee is the same whether they get one inquiry or one hundred.
        </Bullet>
        <Bullet>
          <strong className="text-ink">B2B SaaS for treatment centers and hospitals.</strong>{" "}
          Family programs are notoriously thin. We license the Beside
          community + curriculum infrastructure to centers who want to give
          their alumni families ongoing support after discharge.
        </Bullet>
        <Bullet>
          <strong className="text-ink">Employer & EAP wellness benefits.</strong>{" "}
          Companies cover their employees&rsquo; access to Beside as part of
          mental health and caregiving benefits — the same way EAPs already
          cover therapy.
        </Bullet>
        <Bullet>
          <strong className="text-ink">Foundation and research partnerships.</strong>{" "}
          Anonymized, opt-in patterns from the corpus are useful for clinical
          research and grant-funded work.
        </Bullet>
      </Section>

      <Section title="What we won&rsquo;t do">
        <Bullet>
          <strong className="text-ink">Per-referral payments.</strong> We
          don&rsquo;t take a cut from a treatment center for sending you their
          way. The federal{" "}
          <a
            href="https://www.congress.gov/bill/115th-congress/house-bill/6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clay-deep hover:underline"
          >
            Eliminating Kickbacks in Recovery Act
          </a>{" "}
          and the federal anti-kickback statute exist for good reason: paid
          patient-brokering is how vulnerable people get sent to the highest
          bidder, not the right fit. We are not that.
        </Bullet>
        <Bullet>
          <strong className="text-ink">Sell or trade the stories.</strong>{" "}
          Stories shared on Beside are never sold to advertisers, recovery
          centers, or research partners. Anonymized patterns may inform
          research, but only opt-in, and never the original text.
        </Bullet>
        <Bullet>
          <strong className="text-ink">Run targeted ads.</strong> Nothing on
          Beside is ad-supported. We don&rsquo;t track you across the web. We
          don&rsquo;t need your email.
        </Bullet>
        <Bullet>
          <strong className="text-ink">Use AI to talk back.</strong> AI
          quietly helps people find each other. It does not pretend to be a
          friend. See our{" "}
          <Link href="/about" className="text-clay-deep hover:underline">
            full philosophy
          </Link>
          .
        </Bullet>
      </Section>

      <Section title="Why we&rsquo;re telling you this">
        <p className="text-ink-soft leading-relaxed">
          Trust on a platform like this is everything. The people coming here
          are at one of the harder moments of their lives. Anything that gets
          recommended to them — a therapist, a center, a meeting — has to be
          recommended for the right reason. The economics need to make that
          obvious. So we&rsquo;re writing it down here.
        </p>
      </Section>

      <div className="pt-3">
        <Link
          href="/for-providers"
          className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          for providers & partners →
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-soft leading-relaxed pl-4 border-l-2 border-sand">
      {children}
    </p>
  );
}
