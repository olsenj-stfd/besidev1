export type ReactionKind = "me_too" | "thinking_of_you" | "thank_you";

export const REACTION_LABELS: Record<ReactionKind, string> = {
  me_too: "me too",
  thinking_of_you: "thinking of you",
  thank_you: "thank you for sharing",
};

export const REACTION_ORDER: ReactionKind[] = [
  "me_too",
  "thinking_of_you",
  "thank_you",
];

export type StoryStatus = "approved" | "pending" | "rejected";

export type Tint = "clay" | "sage" | "rose" | "amber" | "sand";

export type Condition = {
  slug: string;
  label: string;
  short: string;
  description: string;
  tint: Tint;
};

export type Theme = {
  slug: string;
  label: string;
  short: string;
  description: string;
  tint: Tint;
};

export type StoryTriage = {
  risk: "none" | "low" | "medium" | "high";
  flags: string[];
  summary: string;
  suggestion: "approve" | "review" | "hold";
};

export type ResonantStory = {
  id: string;
  reason: string;
};

export type Story = {
  id: string;
  pseudonym: string;
  conditionSlugs: string[];
  themeSlugs: string[];
  title: string;
  body: string;
  reactions: Record<ReactionKind, number>;
  status: StoryStatus;
  createdAt: string;
  approvedAt?: string;
  moderationNote?: string;
  triage?: StoryTriage;
  resonant?: ResonantStory[];
};

export type PulseScore = 0 | 1 | 2 | 3 | 4;

export type PulseDimension =
  | "loneliness"
  | "blame"
  | "anxiety"
  | "positive_relations";

export type PulseEntry = {
  id: string;
  weekStart: string;
  scores: Record<PulseDimension, PulseScore>;
  createdAt: string;
};

export type User = {
  id: string;
  pseudonym: string;
  themes: string[];
  conditions: string[];
  reactedStoryIds: string[];
  pulses?: PulseEntry[];
  createdAt: string;
};

export type ProviderModality =
  | "individual"
  | "family"
  | "couples"
  | "group"
  | "coaching"
  | "intensive";

export type Provider = {
  id: string;
  name: string;
  credentials: string;
  title: string;
  blurb: string;
  conditionSlugs: string[];
  modalities: ProviderModality[];
  format: "in_person" | "telehealth" | "both";
  city?: string;
  state?: string;
  secondPatientTrained: boolean;
  vettedBy?: string;
  takingClients: boolean;
};

export type Store = {
  conditions: Condition[];
  themes: Theme[];
  stories: Story[];
  users: User[];
  providers: Provider[];
};
