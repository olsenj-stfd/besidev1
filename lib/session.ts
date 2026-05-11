import { cookies } from "next/headers";
import { getUser, createUser } from "./data";
import type { User } from "./types";

const COOKIE_NAME = "beside_uid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (!id) return null;
  return getUser(id);
}

export async function startSession(input: {
  pseudonym: string;
  themes: string[];
  conditions: string[];
}): Promise<User> {
  const user = await createUser(input);
  const jar = await cookies();
  jar.set(COOKIE_NAME, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return user;
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
