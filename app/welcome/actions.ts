"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { startSession } from "@/lib/session";

const schema = z.object({
  pseudonym: z
    .string()
    .min(3, "A few more characters.")
    .max(24, "Keep it under 24 characters.")
    .regex(/^[A-Za-z0-9_]+$/, "Letters, numbers, underscores only."),
  conditions: z.array(z.string()).min(1, "Pick at least one.").max(4),
  themes: z.array(z.string()).min(1, "Pick at least one.").max(4),
});

export async function beginSession(_prev: unknown, formData: FormData) {
  const conditions = formData.getAll("conditions").map(String);
  const themes = formData.getAll("themes").map(String);
  const parsed = schema.safeParse({
    pseudonym: String(formData.get("pseudonym") ?? ""),
    conditions,
    themes,
  });
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "Something needs another look.";
    return { error: first };
  }
  await startSession(parsed.data);
  redirect("/browse");
}
