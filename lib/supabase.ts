import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Story, User } from "./types";

let _client: SupabaseClient | null = null;

export function supabaseEnabled(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
        "See README for Vercel + Supabase setup."
    );
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Row → domain mappers. Postgres uses snake_case; the app uses camelCase.

type StoryRow = {
  id: string;
  pseudonym: string;
  condition_slugs: string[] | null;
  theme_slugs: string[] | null;
  title: string;
  body: string;
  reactions: { me_too: number; thinking_of_you: number; thank_you: number } | null;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  approved_at: string | null;
  moderation_note: string | null;
  triage: Story["triage"] | null;
  resonant: Story["resonant"] | null;
};

export function rowToStory(r: StoryRow): Story {
  return {
    id: r.id,
    pseudonym: r.pseudonym,
    conditionSlugs: r.condition_slugs ?? [],
    themeSlugs: r.theme_slugs ?? [],
    title: r.title,
    body: r.body,
    reactions: r.reactions ?? { me_too: 0, thinking_of_you: 0, thank_you: 0 },
    status: r.status,
    createdAt: r.created_at,
    approvedAt: r.approved_at ?? undefined,
    moderationNote: r.moderation_note ?? undefined,
    triage: r.triage ?? undefined,
    resonant: r.resonant ?? undefined,
  };
}

export function storyToRow(s: Story): StoryRow {
  return {
    id: s.id,
    pseudonym: s.pseudonym,
    condition_slugs: s.conditionSlugs,
    theme_slugs: s.themeSlugs,
    title: s.title,
    body: s.body,
    reactions: s.reactions,
    status: s.status,
    created_at: s.createdAt,
    approved_at: s.approvedAt ?? null,
    moderation_note: s.moderationNote ?? null,
    triage: s.triage ?? null,
    resonant: s.resonant ?? null,
  };
}

type UserRow = {
  id: string;
  pseudonym: string;
  themes: string[] | null;
  conditions: string[] | null;
  reacted_story_ids: string[] | null;
  pulses: User["pulses"] | null;
  created_at: string;
};

export function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    pseudonym: r.pseudonym,
    themes: r.themes ?? [],
    conditions: r.conditions ?? [],
    reactedStoryIds: r.reacted_story_ids ?? [],
    pulses: r.pulses ?? undefined,
    createdAt: r.created_at,
  };
}

// Seed-on-first-read. Idempotent because we upsert by stable seed ID.
let _seedAttempted = false;
export async function ensureStoriesSeeded(): Promise<void> {
  if (_seedAttempted) return;
  _seedAttempted = true;
  const supa = getSupabase();
  const { count, error } = await supa
    .from("stories")
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error("[supabase.ensureStoriesSeeded] count failed:", error);
    return;
  }
  if ((count ?? 0) > 0) return;
  const { SEED_STORIES } = await import("./seed");
  const rows = SEED_STORIES.map(storyToRow);
  const { error: insertError } = await supa
    .from("stories")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (insertError) {
    console.error("[supabase.ensureStoriesSeeded] insert failed:", insertError);
  }
}
