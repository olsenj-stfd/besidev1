"use server";

import { revalidatePath } from "next/cache";
import { addReaction } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import type { ReactionKind } from "@/lib/types";

export async function reactToStory(
  storyId: string,
  kind: ReactionKind
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "not signed in" };
  }
  const result = await addReaction(storyId, kind, user.id);
  if (!result) return { ok: false, error: "story not found" };
  revalidatePath(`/stories/${storyId}`);
  return { ok: true };
}
