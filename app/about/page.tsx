import Link from "next/link";

export const metadata = { title: "About — Beside" };

export default function AboutPage() {
  return (
    <div className="space-y-6 rise pt-4 max-w-prose">
      <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">about</p>
      <h1 className="font-display text-3xl text-ink leading-tight">
        Built for the second patient.
      </h1>
      <div className="space-y-4 text-ink-soft leading-relaxed">
        <p>
          The healthcare system is built around the diagnosed patient. Beside
          is for the other person — the partner, parent, child, sibling, or
          friend quietly carrying the same condition without the same
          resources.
        </p>
        <p>
          We start with addiction, mental illness, eating disorders, and grief
          / chronic illness. The conditions are different. The carrying
          rhymes.
        </p>
        <h2 className="font-display text-xl text-ink pt-2">What you&rsquo;ll find</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Anonymous stories, grouped by what people are carrying.</li>
          <li>A way to share your own story when you&rsquo;re ready.</li>
          <li>Reactions, no comments. Holding, not crowding.</li>
          <li>A real human moderator reads every story before it goes live.</li>
          <li>
            A vetted directory of clinicians who specialize in the family side
            of these conditions — see{" "}
            <Link href="/find-help" className="text-clay-deep underline">
              /find-help
            </Link>
            .
          </li>
        </ul>
        <h2 className="font-display text-xl text-ink pt-2">What you won&rsquo;t find</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>An AI that talks to you like it&rsquo;s your friend.</li>
          <li>Treatment, advice, or diagnosis.</li>
          <li>Per-referral kickbacks from treatment centers.</li>
          <li>Ads, tracking, or a feed designed to keep you scrolling.</li>
        </ul>
        <h2 className="font-display text-xl text-ink pt-2">If you&rsquo;re in crisis</h2>
        <p>
          Please call or text{" "}
          <a href="tel:988" className="text-clay-deep underline">
            988
          </a>{" "}
          (Suicide & Crisis Lifeline),{" "}
          <a href="tel:18006624357" className="text-clay-deep underline">
            1-800-662-4357
          </a>{" "}
          (SAMHSA), or{" "}
          <a href="tel:18009312237" className="text-clay-deep underline">
            1-800-931-2237
          </a>{" "}
          (NEDA). We will still be here later.
        </p>
        <h2 className="font-display text-xl text-ink pt-2">Built on evidence</h2>
        <p>
          Beside is the consumer-scale realization of a digital therapeutic
          for second patients first studied in a 2012 RCT at the University
          of Wisconsin&ndash;Madison Center for Health Enhancement Systems
          Studies (Gustafson et al.). The intervention produced large effect
          sizes on blame, anxiety, loneliness, personal growth, and positive
          relations with others &mdash; in adult children of alcoholics. We
          extend that thesis to mental illness, eating disorders, and grief.{" "}
          <Link href="/evidence" className="text-clay-deep underline">
            See the full evidence base
          </Link>
          .
        </p>

        <h2 className="font-display text-xl text-ink pt-2">How we fund it</h2>
        <p>
          Honestly and on-the-record.{" "}
          <Link href="/how-we-fund-this" className="text-clay-deep underline">
            See the full breakdown
          </Link>{" "}
          — short version: flat-fee provider listings, B2B SaaS to treatment
          centers&rsquo; family programs, and employer wellness benefits.
          Never per-referral.
        </p>
      </div>
      <div className="pt-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          ← back home
        </Link>
      </div>
    </div>
  );
}
