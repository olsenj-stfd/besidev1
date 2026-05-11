import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export async function Nav() {
  const user = await getCurrentUser();
  return (
    <header className="border-b border-sand/70 bg-cream/85 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-[680px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-ink hover:text-clay-deep transition-colors leading-none"
          aria-label="Beside, home"
        >
          be<span className="italic">side</span>
          <span className="text-clay">.</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5 text-sm">
          <Link
            href="/browse"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            browse
          </Link>
          <Link
            href="/find-help"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            find help
          </Link>
          <Link
            href="/share"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            share
          </Link>
          {user && (
            <Link
              href="/pulse"
              className="text-ink-soft hover:text-ink transition-colors"
            >
              pulse
            </Link>
          )}
          {user ? (
            <span className="text-ink-muted hidden sm:inline">
              {user.pseudonym}
            </span>
          ) : (
            <Link
              href="/welcome"
              className="text-clay-deep font-medium hover:text-clay transition-colors"
            >
              begin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
