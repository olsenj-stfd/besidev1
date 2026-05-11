"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { unlockModerator } from "./actions";

export function ModeratorGate() {
  const [state, formAction, pending] = useActionState(unlockModerator, null);
  const router = useRouter();

  useEffect(() => {
    if (state && "ok" in state && state.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3">
      <input
        type="password"
        name="password"
        placeholder="moderator key"
        className="w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-ink focus:border-clay/50 focus:outline-none"
        autoComplete="off"
      />
      {state && "error" in state && state.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-full bg-clay text-cream px-5 py-2.5 font-medium hover:bg-clay-deep transition-colors disabled:opacity-60"
      >
        {pending ? "checking…" : "Unlock"}
      </button>
      <p className="text-xs text-ink-muted">
        Demo key: <code className="text-ink-soft">beside-mod</code>
      </p>
    </form>
  );
}
