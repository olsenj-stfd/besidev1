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
import { freshStore } from "./seed";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

let writeChain: Promise<void> = Promise.resolve();

async function ensureStore(): Promise<Store> {
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

async function readStore(): Promise<Store> {
  return ensureStore();
}

async function writeStore(store: Store): Promise<void> {
  const next = writeChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  });
  writeChain = next.catch(() => {});
  return next;
}

export async function listConditions(): Promise<Condition[]> {
  const s = await readStore();
  return s.conditions;
}

export async function getCondition(slug: string): Promise<Condition | null> {
  const s = await readStore();
  return s.conditions.find((c) => c.slug === slug) ?? null;
}

export async function listThemes(): Promise<Theme[]> {
  const s = await readStore();
  return s.themes;
}

export async function getTheme(slug: string): Promise<Theme | null> {
  const s = await readStore();
  return s.themes.find((t) => t.slug === slug) ?? null;
}

export async function listApprovedStories(): Promise<Story[]> {
  const s = await readStore();
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
  const s = await readStore();
  return s.stories.find((st) => st.id === id) ?? null;
}

export async function listPendingStories(): Promise<Story[]> {
  const s = await readStore();
  return s.stories
    .filter((st) => st.status === "pending")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listAllStoriesForModeration(): Promise<Story[]> {
  const s = await readStore();
  return [...s.stories].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createStory(input: {
  pseudonym: string;
  conditionSlugs: string[];
  themeSlugs: string[];
  title: string;
  body: string;
}): Promise<Story> {
  const store = await readStore();
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
  store.stories.push(story);
  await writeStore(store);
  return story;
}

export async function setStoryStatus(
  id: string,
  status: StoryStatus,
  note?: string
): Promise<Story | null> {
  const store = await readStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return null;
  story.status = status;
  if (status === "approved" && !story.approvedAt) {
    story.approvedAt = new Date().toISOString();
  }
  if (note !== undefined) story.moderationNote = note;
  await writeStore(store);
  return story;
}

export async function setStoryTriage(
  id: string,
  triage: StoryTriage
): Promise<void> {
  const store = await readStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return;
  story.triage = triage;
  await writeStore(store);
}

export async function setStoryResonant(
  id: string,
  resonant: ResonantStory[]
): Promise<void> {
  const store = await readStore();
  const story = store.stories.find((s) => s.id === id);
  if (!story) return;
  story.resonant = resonant;
  await writeStore(store);
}

export async function addReaction(
  storyId: string,
  kind: ReactionKind,
  userId: string
): Promise<Story | null> {
  const store = await readStore();
  const story = store.stories.find((s) => s.id === storyId);
  if (!story) return null;
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;

  const tag = `${storyId}:${kind}`;
  if (user.reactedStoryIds.includes(tag)) return story;
  user.reactedStoryIds.push(tag);
  story.reactions[kind] = (story.reactions[kind] ?? 0) + 1;
  await writeStore(store);
  return story;
}

export async function getUserReactions(
  userId: string
): Promise<Set<string>> {
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return new Set();
  return new Set(user.reactedStoryIds);
}

export async function getEngagementCount(userId: string): Promise<{
  reactionCount: number;
  shareCount: number;
}> {
  const store = await readStore();
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

export async function createUser(input: {
  pseudonym: string;
  themes: string[];
  conditions: string[];
}): Promise<User> {
  const store = await readStore();
  const user: User = {
    id: `user_${nanoid(10)}`,
    pseudonym: input.pseudonym,
    themes: input.themes,
    conditions: input.conditions,
    reactedStoryIds: [],
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await writeStore(store);
  return user;
}

export async function getUser(id: string): Promise<User | null> {
  const s = await readStore();
  return s.users.find((u) => u.id === id) ?? null;
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "pseudonym" | "themes" | "conditions">>
): Promise<User | null> {
  const store = await readStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return null;
  if (patch.pseudonym) user.pseudonym = patch.pseudonym;
  if (patch.themes) user.themes = patch.themes;
  if (patch.conditions) user.conditions = patch.conditions;
  await writeStore(store);
  return user;
}

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
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;
  const weekStart = startOfWeek();
  const existingIdx = (user.pulses ?? []).findIndex(
    (p) => p.weekStart === weekStart
  );
  const entry: PulseEntry = {
    id: `pulse_${nanoid(8)}`,
    weekStart,
    scores,
    createdAt: new Date().toISOString(),
  };
  if (!user.pulses) user.pulses = [];
  if (existingIdx >= 0) {
    user.pulses[existingIdx] = entry;
  } else {
    user.pulses.push(entry);
  }
  await writeStore(store);
  return entry;
}

export async function listPulses(userId: string): Promise<PulseEntry[]> {
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
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
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return;
  user.pulses = [];
  await writeStore(store);
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
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return;

  const today = new Date();
  const day = today.getDay();
  const diff = (day + 6) % 7;

  user.pulses = DEMO_TRAJECTORY.map((scores, i) => {
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
  await writeStore(store);
}

export async function listProviders(): Promise<Provider[]> {
  const s = await readStore();
  return s.providers;
}

export async function listProvidersByCondition(
  slug: string
): Promise<Provider[]> {
  const all = await listProviders();
  return all.filter((p) => p.conditionSlugs.includes(slug));
}

export async function getProvider(id: string): Promise<Provider | null> {
  const s = await readStore();
  return s.providers.find((p) => p.id === id) ?? null;
}

export async function resetStore(): Promise<void> {
  await writeStore(freshStore());
}
