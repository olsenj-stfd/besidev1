import { redirect } from "next/navigation";
import { listThemes, listConditions } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { suggestPseudonym } from "@/lib/utils";
import { WelcomeForm } from "./welcome-form";

export const metadata = { title: "Begin — Beside" };

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/browse");

  const [themes, conditions] = await Promise.all([
    listThemes(),
    listConditions(),
  ]);
  const suggestion = suggestPseudonym();

  return (
    <div className="space-y-7 rise">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep mb-3">
          step in slowly
        </p>
        <h1 className="font-display text-3xl text-ink leading-tight">
          Welcome. Pick a name nobody knows.
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          You don&rsquo;t need an email. You don&rsquo;t need to be ready. You
          just need a name to be known by here, and a sense of what
          you&rsquo;re carrying.
        </p>
      </header>
      <WelcomeForm
        themes={themes}
        conditions={conditions}
        suggestion={suggestion}
      />
    </div>
  );
}
