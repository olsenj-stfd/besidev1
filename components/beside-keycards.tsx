import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { User } from "@/lib/types";

export function BesideKeycards({ user }: { user: User | null }) {
  return (
    <section className="relative my-6 sm:my-10 lg:h-[440px] flex flex-col items-center lg:items-start gap-6 lg:gap-0">
      {/* ─────────────── BACK CARD — Gustafson testimonial ─────────────── */}
      <article
        className="paper-texture relative w-full max-w-[360px] lg:absolute lg:top-0 lg:right-0 lg:w-[360px] h-[380px] bg-sand rounded-2xl shadow-lg lg:rotate-3 hover:lg:rotate-2 transition-transform duration-500 border border-black/5 z-10"
      >
        {/* Vertical typewriter side rail */}
        <div className="absolute left-3 top-0 bottom-0 h-full hidden sm:flex items-center pr-2 border-r border-black/10">
          <span
            className="font-mono text-[9px] tracking-widest uppercase opacity-60"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            beside.com · s. 2012
          </span>
        </div>

        <div className="pl-10 sm:pl-12 pt-10 pr-6 pb-10 h-full flex flex-col relative">
          {/* Round corner stamp */}
          <div className="absolute top-5 right-5 w-20 h-20 border border-black/20 rounded-full flex items-center justify-center -rotate-12">
            <div className="w-16 h-16 border border-dashed border-black/30 rounded-full flex items-center justify-center">
              <span className="font-mono text-[9px] text-center leading-tight opacity-70">
                EVIDENCE
                <br />
                ANCHOR
                <br />
                NO. 2012
              </span>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-3">
            quote from the source
          </p>

          <div className="mt-auto">
            <p className="font-display italic text-xl sm:text-2xl leading-[1.15] text-ink">
              &ldquo;With group therapy alone there would be 6 days, 22.5
              hours each week that I&rsquo;d feel more or less alone.&rdquo;
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest opacity-60">
              — adult child of an alcoholic, gustafson 2012
            </p>
          </div>

          {/* Tear-here */}
          <div className="absolute bottom-0 left-0 right-0 h-6 border-t-2 border-dashed border-black/15 flex items-center justify-between px-6">
            <span className="font-mono text-[8px] uppercase tracking-widest opacity-70">
              tear here for evidence
            </span>
            <Link
              href="/evidence"
              className="font-mono text-[8px] uppercase tracking-widest opacity-70 hover:opacity-100 inline-flex items-center gap-1"
            >
              <BookOpen className="w-2.5 h-2.5" aria-hidden />
              see /evidence
            </Link>
          </div>
        </div>
      </article>

      {/* ─────────────── FRONT CARD — Beside membership ─────────────── */}
      <article
        className="paper-texture relative w-full max-w-[340px] lg:absolute lg:top-12 lg:left-0 lg:w-[340px] h-[340px] bg-blush rounded-2xl shadow-xl lg:-rotate-2 hover:lg:-rotate-1 transition-transform duration-500 z-20"
      >
        {/* Domed cut-out at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-cream rounded-b-full shadow-inner border-t-0" />

        <div className="p-7 sm:p-8 h-full flex flex-col relative">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-2 mt-6">
            membership card
          </p>
          <h3 className="font-display text-5xl sm:text-6xl font-light leading-none text-ink">
            be<span className="italic">side</span>
            <span className="text-clay">.</span>
          </h3>
          <p className="font-display italic text-lg mt-2 leading-snug text-ink-soft">
            for the second patient
          </p>

          <dl className="mt-auto pt-6 space-y-3">
            <div className="border-b border-black/10 pb-2">
              <dt className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-0.5">
                Est.
              </dt>
              <dd className="font-display text-base">
                2026 · Stanford GSB MSx
              </dd>
            </div>
            <div className="border-b border-black/10 pb-2">
              <dt className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-0.5">
                Member
              </dt>
              <dd className="font-display text-base">
                {user ? user.pseudonym : "Pseudonymous, always"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-0.5">
                Status
              </dt>
              <dd className="font-display text-base italic">
                {user ? "you are beside others" : "begin a pseudonym to enter"}
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </section>
  );
}
