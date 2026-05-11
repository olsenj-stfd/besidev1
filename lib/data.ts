import { promises as fs } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type {
  Store,
  Story,
  Theme,
  Condition,
  Provider,
  User,
  ReactionKind,
  StoryStatus,
  StoryTriage,
  ResonantStory,
  PulseEntry,
  PulseScore,
  PulseDimension,
} from "./types";
import {
  freshStore,
  SEED_CONDITIONS,
  SEED_THEMES,
  SEED_PROVIDERS,
} from "./seed";
import {
  supabaseEnabled,
  getSupabase,
  rowToStory,
  rowToUser,
  storyToRow,
  ensureStoriesSeeded,
} from "./supabase";

// ─────────────────────────────────────────────────────────────────────
// Static lookups — conditions, themes, providers are configuration,
// not state. They live in seed.ts and never hit the database.
// ─────────────────────────────────────────────────────────────────────

export async function listConditions(): Promise<Condition[]> {
  return SEED_CONDITIONS;
}

export async function getCondition(slug: string): Promise<Condition | null> {
  return SEED_CONDITIONS.find((c) => c.slug === slug) ?? null;
}

export async function listThemes(): Promise<Theme[]> {
  return SEED_THEMES;
}

export async function getTheme(slug: string): Promise<Theme | null> {
  return SEED_THEMES.find((t) => t.slug === slug) ?? null;
}

export async function listProviders(): Promise<Provider[]> {
  return SEED_PROVIDERS;
}

export async function listProvidersByCondition(
  slug: string
): Promise<Provider[]> {
  return SEED_PROVIDERS.filter((p) => p.conditionSlugs.includes(slug));
}

export async function getProvider(id: string): Promise<Provider | null> {
  return SEED_PROVIDERS.find((p) => p.id === id) ?? null;
}

// ─────────────────────────────────────────────────────────────────────
// JSON-file backend (local dev fallback when Supabase env vars absent)
// ─────────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

let writeChain: Promise<void> = Promise.resolve();

async function ensureJsonStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Store;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seeded = freshStore();
    await fs.writeFile(STORE_PATH, JSON.stringify(seeded, null, 2), "utf-8");
    return seeded;
  }
}

async function readJsonStore(): Promise<Store> {
  return ensureJsonStore();
}

async function writeJsonStore(store: Store): Promise<void> {
  const next = writeChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  });
  writeChain = next.catch(() => {});
  return next;
}

// ─────────────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────────────

export async function listApprovedStories(): Promise<Story[]> {
  if (supabaseEnabled()) {
    await ensureStoriesSeeded();
    const { data, error } = await getSupabase()
      .from("stories")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToStory);
  }
  const s = await readJsonStore();
  return s.stories
    .filter((st) => st.status === "approved")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listStoriesByTheme(slug: string): Promise<Story[]> {
  const stories = await listApprovedStories();
  return stories.filter((st) => st.themeSlugs.includes(slug));
}

export async function listStoriesByCondition(slug: string): Promise<Story[]> {
  const stories = await listApprovedStories();
  return stories.filter((st) => st.conditionSlugs.includes(slug));
}

export async function getStory(id: string): Promise<Story | null> {
  if (supabaseEnabled()) {
    const { data, error } = await getSupabase()
      .from("stories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToStory(data) : null;
  }
  const s = await readJsonStore();
  return s.stories.find((st) => st.id === id) ?? null;
}

export async function listPendingStories(): Promise<Story[]> {
  if (supabaseEnabled()) {
    const { data, error } = await getSupabase()
      .from("stories")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToStory);
  }
  const s = await readJsonStore();
  return s.stories
    .filter((st) => st.status === "pending")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listAllStoriesForModeration(): Promise<Story[]> {
  if (supabaseEnabled()) {
    await ensureStoriesSeeded();
    const { data, error } = await getSupabase()
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToStory);
  }
  const s = await readJsonStore();
  return [...s.stories].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createStory(input: {
  pseudonym: string;
  conditionSlugs: string[];
  themeSlugs: string[];
  title: string;
  body: string;
}): Promise<Story> {
  const story: Story = {
    id: `story_${nanoid(10)}`,
    pseudonym: input.pseudonym,
    conditionSlugs: input.conditionSlugs,
    themeSlugs: input.themeSlugs,
    title: input.title.trim(),
    body: input.body.trim(),
    reactions: { me_too: 0, thinking_of_you: 0, thank_you: 0 },
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("stories")
      .insert(storyToRow(story));
    if (error) throw error;
    return story;
  }
  const store = await readJsonStore();
  store.stories.push(story);
  await writeJsonStore(store);
  return story;
}

export async function setStoryStatus(
  id: string,
  status: StoryStatus,
  note?: string
): Promise<Story | null> {
  if (supabaseEnabled()) {
    const patch: Record<string, unknown> = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (note !== undefined) patch.moderation_note = note;
    const { data, error } = await getSupabase()
      .from("stories")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToStory(data) : null;
  }
  const store = await readJsonStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return null;
  story.status = status;
  if (status === "approved" && !story.approvedAt) {
    story.approvedAt = new Date().toISOString();
  }
  if (note !== undefined) story.moderationNote = note;
  await writeJsonStore(store);
  return story;
}

export async function setStoryTriage(
  id: string,
  triage: StoryTriage
): Promise<void> {
  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("stories")
      .update({ triage })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const store = await readJsonStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return;
  story.triage = triage;
  await writeJsonStore(store);
}

export async function setStoryResonant(
  id: string,
  resonant: ResonantStory[]
): Promise<void> {
  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("stories")
      .update({ resonant })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const store = await readJsonStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return;
  story.resonant = resonant;
  await writeJsonStore(store);
}

// ─────────────────────────────────────────────────────────────────────
// Reactions (cross-table: user + story)
// ─────────────────────────────────────────────────────────────────────

export async function addReaction(
  storyId: string,
  kind: ReactionKind,
  userId: string
): Promise<Story | null> {
  if (supabaseEnabled()) {
    const supa = getSupabase();
    const { data: userRow, error: uErr } = await supa
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (uErr) throw uErr;
    if (!userRow) return null;
    const user = rowToUser(userRow);

    const tag = `${storyId}:${kind}`;
    const { data: storyRow, error: sErr } = await supa
      .from("stories")
      .select("*")
      .eq("id", storyId)
      .maybeSingle();
    if (sErr) throw sErr;
    if (!storyRow) return null;
    const story = rowToStory(storyRow);

    if (user.reactedStoryIds.includes(tag)) return story;
    user.reactedStoryIds.push(tag);
    story.reactions[kind] = (story.reactions[kind] ?? 0) + 1;

    const { error: u2 } = await supa
      .from("users")
      .update({ reacted_story_ids: user.reactedStoryIds })
      .eq("id", userId);
    if (u2) throw u2;
    const { error: s2 } = await supa
      .from("stories")
      .update({ reactions: story.reactions })
      .eq("id", storyId);
    if (s2) throw s2;
    return story;
  }
  const store = await readJsonStore();
  const story = store.stories.find((s) => s.id === storyId);
  if (!story) return null;
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;

  const tag = `${storyId}:${kind}`;
  if (user.reactedStoryIds.includes(tag)) return story;
  user.reactedStoryIds.push(tag);
  story.reactions[kind] = (story.reactions[kind] ?? 0) + 1;
  await writeJsonStore(store);
  return story;
}

export async function getUserReactions(
  userId: string
): Promise<Set<string>> {
  const user = await getUser(userId);
  if (!user) return new Set();
  return new Set(user.reactedStoryIds);
}

export async function getEngagementCount(userId: string): Promise<{
  reactionCount: number;
  shareCount: number;
}> {
  if (supabaseEnabled()) {
    const user = await getUser(userId);
    if (!user) return { reactionCount: 0, shareCount: 0 };
    const uniqueReactedStories = new Set(
      user.reactedStoryIds.map((tag) => tag.split(":")[0])
    );
    const { count, error } = await getSupabase()
      .from("stories")
      .select("*", { count: "exact", head: true })
      .eq("pseudonym", user.pseudonym);
    if (error) throw error;
    return {
      reactionCount: uniqueReactedStories.size,
      shareCount: count ?? 0,
    };
  }
  const store = await readJsonStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return { reactionCount: 0, shareCount: 0 };
  const uniqueReactedStories = new Set(
    user.reactedStoryIds.map((tag) => tag.split(":")[0])
  );
  const shareCount = store.stories.filter(
    (s) => s.pseudonym === user.pseudonym
  ).length;
  return { reactionCount: uniqueReactedStories.size, shareCount };
}

// ─────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────

export async function createUser(input: {
  pseudonym: string;
  themes: string[];
  conditions: string[];
}): Promise<User> {
  const user: User = {
    id: `user_${nanoid(10)}`,
    pseudonym: input.pseudonym,
    themes: input.themes,
    conditions: input.conditions,
    reactedStoryIds: [],
    createdAt: new Date().toISOString(),
  };
  if (supabaseEnabled()) {
    const { error } = await getSupabase().from("users").insert({
      id: user.id,
      pseudonym: user.pseudonym,
      themes: user.themes,
      conditions: user.conditions,
      reacted_story_ids: user.reactedStoryIds,
      created_at: user.createdAt,
    });
    if (error) throw error;
    return user;
  }
  const store = await readJsonStore();
  store.users.push(user);
  await writeJsonStore(store);
  return user;
}

export async function getUser(id: string): Promise<User | null> {
  if (supabaseEnabled()) {
    const { data, error } = await getSupabase()
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToUser(data) : null;
  }
  const s = await readJsonStore();
  return s.users.find((u) => u.id === id) ?? null;
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "pseudonym" | "themes" | "conditions">>
): Promise<User | null> {
  if (supabaseEnabled()) {
    const dbPatch: Record<string, unknown> = {};
    if (patch.pseudonym) dbPatch.pseudonym = patch.pseudonym;
    if (patch.themes) dbPatch.themes = patch.themes;
    if (patch.conditions) dbPatch.conditions = patch.conditions;
    const { data, error } = await getSupabase()
      .from("users")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToUser(data) : null;
  }
  const store = await readJsonStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return null;
  if (patch.pseudonym) user.pseudonym = patch.pseudonym;
  if (patch.themes) user.themes = patch.themes;
  if (patch.conditions) user.conditions = patch.conditions;
  await writeJsonStore(store);
  return user;
}

// ─────────────────────────────────────────────────────────────────────
// Pulses (stored as jsonb on the user row in Supabase)
// ─────────────────────────────────────────────────────────────────────

function startOfWeek(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export async function recordPulse(
  userId: string,
  scores: Record<PulseDimension, PulseScore>
): Promise<PulseEntry | null> {
  const user = await getUser(userId);
  if (!user) return null;
  const weekStart = startOfWeek();
  const pulses = user.pulses ?? [];
  const existingIdx = pulses.findIndex((p) => p.weekStart === weekStart);
  const entry: PulseEntry = {
    id: `pulse_${nanoid(8)}`,
    weekStart,
    scores,
    createdAt: new Date().toISOString(),
  };
  if (existingIdx >= 0) pulses[existingIdx] = entry;
  else pulses.push(entry);

  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("users")
      .update({ pulses })
      .eq("id", userId);
    if (error) throw error;
    return entry;
  }
  const store = await readJsonStore();
  const u = store.users.find((x) => x.id === userId);
  if (!u) return null;
  u.pulses = pulses;
  await writeJsonStore(store);
  return entry;
}

export async function listPulses(userId: string): Promise<PulseEntry[]> {
  const user = await getUser(userId);
  if (!user || !user.pulses) return [];
  return [...user.pulses].sort((a, b) =>
    a.weekStart < b.weekStart ? -1 : 1
  );
}

export async function getCurrentWeekPulse(
  userId: string
): Promise<PulseEntry | null> {
  const pulses = await listPulses(userId);
  const week = startOfWeek();
  return pulses.find((p) => p.weekStart === week) ?? null;
}

export async function clearPulses(userId: string): Promise<void> {
  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("users")
      .update({ pulses: [] })
      .eq("id", userId);
    if (error) throw error;
    return;
  }
  const store = await readJsonStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return;
  user.pulses = [];
  await writeJsonStore(store);
}

const DEMO_TRAJECTORY: Record<PulseDimension, PulseScore>[] = [
  { loneliness: 2, blame: 2, anxiety: 3, positive_relations: 3 },
  { loneliness: 3, blame: 3, anxiety: 3, positive_relations: 2 },
  { loneliness: 4, blame: 3, anxiety: 4, positive_relations: 1 },
  { loneliness: 4, blame: 4, anxiety: 4, positive_relations: 1 },
  { loneliness: 4, blame: 3, anxiety: 3, positive_relations: 2 },
  { loneliness: 3, blame: 2, anxiety: 3, positive_relations: 2 },
  { loneliness: 2, blame: 2, anxiety: 2, positive_relations: 3 },
  { loneliness: 3, blame: 3, anxiety: 3, positive_relations: 1 },
];

export async function recordDemoPulses(userId: string): Promise<void> {
  const today = new Date();
  const day = today.getDay();
  const diff = (day + 6) % 7;
  const pulses: PulseEntry[] = DEMO_TRAJECTORY.map((scores, i) => {
    const weekDate = new Date(today);
    weekDate.setDate(
      today.getDate() - diff - (DEMO_TRAJECTORY.length - 1 - i) * 7
    );
    weekDate.setHours(0, 0, 0, 0);
    return {
      id: `pulse_demo_${i}`,
      weekStart: weekDate.toISOString().slice(0, 10),
      scores,
      createdAt: weekDate.toISOString(),
    };
  });

  if (supabaseEnabled()) {
    const { error } = await getSupabase()
      .from("users")
      .update({ pulses })
      .eq("id", userId);
    if (error) throw error;
    return;
  }
  const store = await readJsonStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return;
  user.pulses = pulses;
  await writeJsonStore(store);
}

export async function resetStore(): Promise<void> {
  if (supabaseEnabled()) {
    // No-op in Supabase mode — we don't auto-reset cloud data.
    return;
  }
  await writeJsonStore(freshStore());
}
