"use server";

import { cookies } from "next/headers";

const COOKIE = "beside_pulse_nudge_dismissed";
const TTL_SECONDS = 60 * 60 * 24 * 7;

export async function dismissPulseNudge(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}
