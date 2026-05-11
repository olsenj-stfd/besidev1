import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-5 rise pt-10">
      <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">
        not found
      </p>
      <h1 className="font-display text-3xl text-ink leading-tight">
        That page slipped away.
      </h1>
      <p className="text-ink-soft leading-relaxed max-w-prose">
        Probably nothing. Probably a moved link. Either way, here&rsquo;s the
        way back.
      </p>
      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors"
        >
          Home
        </Link>
        <Link
          href="/browse"
          className="inline-flex items-center rounded-full border border-sand bg-white/60 text-ink-soft px-5 py-2.5 font-medium hover:border-clay/40 hover:text-ink transition-colors"
        >
          Browse
        </Link>
      </div>
    </div>
  );
}
