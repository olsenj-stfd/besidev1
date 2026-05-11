"use server";

import { cookies } from "next/headers";
import {
  CHECKIN_COOKIE,
  CHECKIN_TTL_SECONDS,
  type CheckinState,
  type Mood,
  type Checkin,
} from "./checkin-types";

export async function recordCheckin(input: {
  state: CheckinState;
  mood?: Mood;
}): Promise<void> {
  const jar = await cookies();
  const value: Checkin = {
    state: input.state,
    mood: input.mood,
    at: Date.now(),
  };
  jar.set(CHECKIN_COOKIE, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CHECKIN_TTL_SECONDS,
  });
}
