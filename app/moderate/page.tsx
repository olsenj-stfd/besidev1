import { listAllStoriesForModeration, listThemes } from "@/lib/data";
import { isModerator } from "./actions";
import { ModeratorGate } from "./moderator-gate";
import { ModerationQueue } from "./moderation-queue";

export const metadata = { title: "Moderate — Beside" };

export default async function ModeratePage() {
  const unlocked = await isModerator();
  if (!unlocked) {
    return (
      <div className="space-y-5 rise pt-6 max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">
          moderator
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Quiet room
        </h1>
        <p className="text-ink-soft leading-relaxed">
          This is where the human-in-the-loop reads new stories before they go
          out.
        </p>
        <ModeratorGate />
      </div>
    );
  }

  const [stories, themes] = await Promise.all([
    listAllStoriesForModeration(),
    listThemes(),
  ]);

  return (
    <div className="space-y-7 rise">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          moderator
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          The queue
        </h1>
        <p className="mt-2 text-ink-soft">
          Read with care. The point is not to filter — it&rsquo;s to keep this
          place safe for the next person.
        </p>
      </header>
      <ModerationQueue stories={stories} themes={themes} />
    </div>
  );
}
