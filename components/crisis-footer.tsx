import Link from "next/link";
import { Phone } from "lucide-react";

export function CrisisFooter() {
  return (
    <footer className="border-t border-sand/70 bg-cream-deep mt-auto">
      <div className="max-w-[680px] mx-auto px-5 py-6 text-sm text-ink-soft">
        <div className="flex items-start gap-3 mb-4">
          <Phone className="w-4 h-4 mt-0.5 text-clay-deep shrink-0" aria-hidden />
          <div>
            <p className="font-medium text-ink">If you or someone you love is in crisis</p>
            <p className="text-ink-soft mt-1">
              Beside is for connection, not crisis care. Please reach a person who can help right now.
            </p>
          </div>
        </div>
        <ul className="space-y-1.5 pl-7">
          <li>
            <a
              href="tel:988"
              className="text-clay-deep hover:text-clay underline-offset-2 hover:underline"
            >
              988
            </a>
            <span className="text-ink-muted"> — Suicide & Crisis Lifeline (call or text, 24/7)</span>
          </li>
          <li>
            <a
              href="tel:18006624357"
              className="text-clay-deep hover:text-clay underline-offset-2 hover:underline"
            >
              1-800-662-4357
            </a>
            <span className="text-ink-muted"> — SAMHSA: substance use & mental health (24/7, free)</span>
          </li>
          <li>
            <a
              href="tel:18009312237"
              className="text-clay-deep hover:text-clay underline-offset-2 hover:underline"
            >
              1-800-931-2237
            </a>
            <span className="text-ink-muted"> — NEDA: eating disorders helpline</span>
          </li>
          <li>
            <a
              href="tel:18002723900"
              className="text-clay-deep hover:text-clay underline-offset-2 hover:underline"
            >
              1-800-272-3900
            </a>
            <span className="text-ink-muted"> — Alzheimer&rsquo;s Association (24/7, caregiver support)</span>
          </li>
        </ul>
        <div className="mt-5 pt-4 border-t border-sand/70 flex items-center justify-between text-xs text-ink-muted flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/about" className="hover:text-ink-soft">
              about
            </Link>
            <Link href="/evidence" className="hover:text-ink-soft">
              evidence
            </Link>
            <Link href="/how-we-fund-this" className="hover:text-ink-soft">
              how we fund this
            </Link>
            <Link href="/for-providers" className="hover:text-ink-soft">
              for providers
            </Link>
          </div>
          <span>a quiet place · prototype</span>
        </div>
      </div>
    </footer>
  );
}
