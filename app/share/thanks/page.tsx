import Link from "next/link";

export const metadata = { title: "Thank you — Beside" };

export default function ThanksPage() {
  return (
    <div className="space-y-6 rise pt-6">
      <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">
        received
      </p>
      <h1 className="font-display text-3xl text-ink leading-tight">
        Thank you. We&rsquo;ll read it carefully.
      </h1>
      <p className="text-ink-soft leading-relaxed max-w-prose">
        Your story is in the queue. A real human moderator usually looks at
        new stories within a day. Once it&rsquo;s posted, it will appear under
        the themes you chose.
      </p>
      <p className="text-ink-soft leading-relaxed max-w-prose">
        While you wait — there&rsquo;s probably someone else here who needs
        to read what you just wrote. There&rsquo;s also probably someone
        else here you need to read.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/browse"
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
        >
          Read someone
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
