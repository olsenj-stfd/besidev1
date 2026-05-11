"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { recordPulse } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

const score = z
  .union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")])
  .transform((v) => Number(v) as 0 | 1 | 2 | 3 | 4);

const schema = z.object({
  loneliness: score,
  blame: score,
  anxiety: score,
  positive_relations: score,
});

export async function submitPulse(_prev: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please begin first." };

  const parsed = schema.safeParse({
    loneliness: String(formData.get("loneliness") ?? ""),
    blame: String(formData.get("blame") ?? ""),
    anxiety: String(formData.get("anxiety") ?? ""),
    positive_relations: String(formData.get("positive_relations") ?? ""),
  });
  if (!parsed.success) {
    return { error: "Please answer each question." };
  }
  await recordPulse(user.id, parsed.data);
  redirect("/pulse?recorded=1");
}
