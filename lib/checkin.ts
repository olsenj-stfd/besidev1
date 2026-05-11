import { cookies } from "next/headers";
import {
  CHECKIN_COOKIE,
  type Checkin,
} from "./checkin-types";

export async function getCheckin(): Promise<Checkin | null> {
  const jar = await cookies();
  const raw = jar.get(CHECKIN_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Checkin;
    if (parsed.state !== "safe" && parsed.state !== "unsafe") return null;
    return parsed;
  } catch {
    return null;
  }
}
