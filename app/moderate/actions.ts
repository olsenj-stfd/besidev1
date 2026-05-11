"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  setStoryStatus,
  setStoryResonant,
  getStory,
  listApprovedStories,
} from "@/lib/data";
import { findResonantStories } from "@/lib/ai";

const MOD_COOKIE = "beside_mod";
const MOD_PASSWORD = process.env.MOD_PASSWORD ?? "beside-mod";

export async function unlockModerator(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== MOD_PASSWORD) {
    return { error: "Not the right key." };
  }
  const jar = await cookies();
  jar.set(MOD_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return { ok: true };
}

export async function lockModerator() {
  const jar = await cookies();
  jar.delete(MOD_COOKIE);
}

export async function isModerator(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(MOD_COOKIE)?.value === "1";
}

export async function approveStory(id: string) {
  if (!(await isModerator())) return;
  await setStoryStatus(id, "approved");

  // Compute resonance once at approval time so story pages stay cheap.
  try {
    const story = await getStory(id);
    if (story) {
      const all = await listApprovedStories();
      const candidates = all
        .filter((s) => s.id !== id)
        .slice(0, 24)
        .map((s) => ({ id: s.id, title: s.title, body: s.body }));
      const matches = await findResonantStories({
        anchor: { id: story.id, title: story.title, body: story.body },
        candidates,
      });
      if (matches) await setStoryResonant(story.id, matches);
    }
  } catch {
    // resonance is a nice-to-have; don't block approval on it
  }

  revalidatePath("/moderate");
  revalidatePath("/browse");
}

export async function rejectStory(id: string, note?: string) {
  if (!(await isModerator())) return;
  await setStoryStatus(id, "rejected", note);
  revalidatePath("/moderate");
}
