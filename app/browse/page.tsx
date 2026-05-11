import Link from "next/link";
import { listThemes, listApprovedStories, listConditions } from "@/lib/data";
import { ThemeCard } from "@/components/theme-card";
import { StoryCard } from "@/components/story-card";
import { PulseNudge } from "@/components/pulse-nudge";

export const metadata = { title: "Browse — Beside" };

type SearchParams = Promise<{ condition?: string }>;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const [themes, conditions, allStories] = await Promise.all([
    listThemes(),
    listConditions(),
    listApprovedStories(),
  ]);

  const filter = sp.condition;
  const stories = filter
    ? allStories.filter((s) => s.conditionSlugs.includes(filter))
    : allStories;

  const counts = new Map<string, number>();
  for (const s of stories) {
    for (const slug of s.themeSlugs) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rise">
        <h1 className="font-display text-3xl text-ink leading-tight">
          Find your people
        </h1>
        <p className="mt-2 text-ink-soft leading-relaxed">
          Stories from the family side of addiction, mental illness, eating
          disorders, and grief. Filter by what you&rsquo;re here about.
        </p>
      </section>

      <section>
        <p className="text-xs text-ink-muted mb-2">filter by condition</p>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/browse"
            className={`rounded-full border px-3 py-1 text-xs ${
              !filter
                ? "bg-clay text-cream border-clay"
                : "bg-white border-sand text-ink-soft hover:border-clay/30"
            }`}
          >
            all
          </Link>
          {conditions.map((c) => {
            const active = filter === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/browse?condition=${c.slug}`}
                className={`rounded-full border px-3 py-1 text-xs inline-flex items-center ${
                  active
                    ? "bg-clay text-cream border-clay"
                    : "bg-white border-sand text-ink-soft hover:border-clay/30"
                }`}
              >
                {c.short}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-ink mb-3">By theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((t) => (
            <ThemeCard key={t.slug} theme={t} count={counts.get(t.slug) ?? 0} />
          ))}
        </div>
      </section>

      <PulseNudge />

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-ink">Recent stories</h2>
          <Link href="/share" className="text-sm text-clay-deep hover:text-clay">
            share yours →
          </Link>
        </div>
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
              No stories under this filter yet. Try another, or{" "}
              <Link href="/share" className="text-clay-deep underline">
                share
              </Link>{" "}
              the first one.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
