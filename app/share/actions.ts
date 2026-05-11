"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createStory,
  listThemes,
  listConditions,
  setStoryTriage,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { suggestTags, triageStory, type TagSuggestion } from "@/lib/ai";

const submitSchema = z.object({
  title: z.string().min(4, "A few more words.").max(120, "Keep it short."),
  body: z
    .string()
    .min(20, "Just a little more — a paragraph if you can.")
    .max(4000, "Long. Trim it a little if you can."),
  conditions: z.array(z.string()).min(1, "Pick at least one.").max(3),
  themes: z.array(z.string()).min(1, "Pick at least one.").max(4),
});

export async function submitStory(_prev: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please begin first." };

  const conditions = formData.getAll("conditions").map(String);
  const themes = formData.getAll("themes").map(String);
  const parsed = submitSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    conditions,
    themes,
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Something needs another look.",
    };
  }

  const story = await createStory({
    pseudonym: user.pseudonym,
    conditionSlugs: parsed.data.conditions,
    themeSlugs: parsed.data.themes,
    title: parsed.data.title,
    body: parsed.data.body,
  });

  try {
    const triage = await triageStory({ title: story.title, body: story.body });
    if (triage) await setStoryTriage(story.id, triage);
  } catch {
    // moderator will read manually if AI is unavailable
  }

  redirect("/share/thanks");
}

const suggestSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(20),
});

export async function suggestTagsAction(input: {
  title: string;
  body: string;
}): Promise<
  | { ok: true; suggestion: TagSuggestion }
  | { ok: false; error: string }
> {
  const parsed = suggestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Write a bit more first." };

  const [themes, conditions] = await Promise.all([
    listThemes(),
    listConditions(),
  ]);
  const suggestion = await suggestTags({
    title: parsed.data.title,
    body: parsed.data.body,
    themes,
    conditions,
  });
  if (!suggestion) {
    return { ok: false, error: "Suggestions aren't available right now." };
  }
  return { ok: true, suggestion };
}
