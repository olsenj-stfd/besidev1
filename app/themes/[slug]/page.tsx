import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTheme,
  listStoriesByTheme,
  listThemes,
  listConditions,
} from "@/lib/data";
import { StoryCard } from "@/components/story-card";
import { tintClasses, cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const theme = await getTheme(slug);
  return { title: theme ? `${theme.label} — Beside` : "Theme — Beside" };
}

export default async function ThemePage({ params }: { params: Params }) {
  const { slug } = await params;
  const [theme, stories, themes, conditions] = await Promise.all([
    getTheme(slug),
    listStoriesByTheme(slug),
    listThemes(),
    listConditions(),
  ]);
  if (!theme) notFound();

  const t = tintClasses(theme.tint);

  return (
    <div className="space-y-8">
      <section className={cn("rise rounded-3xl border p-6", t.bg, t.border)}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl" aria-hidden>
            {theme.emoji}
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            theme
          </p>
        </div>
        <h1 className={cn("font-display text-3xl leading-tight", t.text)}>
          {theme.label}
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          {theme.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/share"
            className="inline-flex items-center rounded-full bg-clay text-cream px-4 py-2 text-sm font-medium hover:bg-clay-deep transition-colors"
          >
            Share something here
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center rounded-full border border-sand bg-white/70 text-ink-soft px-4 py-2 text-sm font-medium hover:border-clay/40 hover:text-ink transition-colors"
          >
            Other themes
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-ink mb-4">Stories</h2>
        <div className="space-y-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              themes={themes}
              conditions={conditions}
            />
          ))}
          {stories.length === 0 && (
            <p className="text-ink-muted text-sm">
              No stories here yet. Yours could be the first.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
