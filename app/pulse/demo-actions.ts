"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { recordDemoPulses, clearPulses } from "@/lib/data";

export async function loadDemoData(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await recordDemoPulses(user.id);
  redirect("/pulse?demo=1");
}

export async function clearMyPulses(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await clearPulses(user.id);
  redirect("/pulse?cleared=1");
}
