import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Theme, Condition } from "./types";

const MODEL = "claude-opus-4-7";

let _client: Anthropic | null | undefined;
function getClient(): Anthropic | null {
  if (_client !== undefined) return _client;
  if (!process.env.ANTHROPIC_API_KEY) {
    _client = null;
    return null;
  }
  _client = new Anthropic();
  return _client;
}

export const aiEnabled = (): boolean => getClient() !== null;

const TagSuggestionSchema = z.object({
  conditions: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "Condition slugs the story is about, ordered by primary first."
    ),
  themes: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe(
      "Theme slugs (relationship + stage) ordered by best fit. Must be from the provided list."
    ),
  rationale: z
    .string()
    .max(200)
    .describe("One short sentence explaining the choice, written warmly."),
});
export type TagSuggestion = z.infer<typeof TagSuggestionSchema>;

export async function suggestTags(input: {
  title: string;
  body: string;
  themes: Theme[];
  conditions: Condition[];
}): Promise<TagSuggestion | null> {
  const client = getClient();
  if (!client) return null;

  const conditionList = input.conditions
    .map((c) => `- ${c.slug}: ${c.label} — ${c.description}`)
    .join("\n");
  const themeList = input.themes
    .map((t) => `- ${t.slug}: ${t.label} — ${t.description}`)
    .join("\n");

  const system = `You help match anonymous stories from "second patients" — the family members and partners of people affected by addiction, mental illness, eating disorders, or chronic illness/loss — to the conditions and themes that best describe the writer's experience.

You return TWO things:
1. CONDITIONS — what the writer's loved one (or the writer themselves) is dealing with. From the list below.
2. THEMES — the relationship and life-stage shape of what the writer is carrying. From the list below.

Available conditions:
${conditionList}

Available themes:
${themeList}

Rules:
- Only return slugs that appear in the lists above.
- A story can belong to multiple conditions if both apply (e.g. someone who lost a sibling to addiction is both "addiction" and "grief-loss").
- Match themes on emotional shape, not literal mentions.
- The rationale is one short, warm sentence — it will be shown to the writer.`;

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system,
      messages: [
        {
          role: "user",
          content: `Title: ${input.title}\n\nStory:\n${input.body}`,
        },
      ],
      output_config: { format: zodOutputFormat(TagSuggestionSchema) },
    });
    const parsed = response.parsed_output;
    if (!parsed) return null;
    const validConds = new Set(input.conditions.map((c) => c.slug));
    const validThemes = new Set(input.themes.map((t) => t.slug));
    const conditions = parsed.conditions.filter((s) => validConds.has(s));
    const themes = parsed.themes.filter((s) => validThemes.has(s));
    if (conditions.length === 0 || themes.length === 0) return null;
    return { conditions, themes, rationale: parsed.rationale };
  } catch (err) {
    console.error("[ai.suggestTags]", err);
    return null;
  }
}

const TriageSchema = z.object({
  risk: z
    .enum(["none", "low", "medium", "high"])
    .describe("Crisis or safety risk level."),
  flags: z
    .array(
      z.enum([
        "self_harm",
        "active_crisis",
        "identifying_info",
        "names_individuals",
        "advice_seeking",
        "treatment_pitch",
        "off_topic",
      ])
    )
    .describe("Specific concerns. Empty array if none."),
  summary: z
    .string()
    .max(160)
    .describe("One-line summary for the moderator."),
  suggestion: z
    .enum(["approve", "review", "hold"])
    .describe("Recommended action — the human moderator decides."),
});
export type StoryTriage = z.infer<typeof TriageSchema>;

export async function triageStory(input: {
  title: string;
  body: string;
}): Promise<StoryTriage | null> {
  const client = getClient();
  if (!client) return null;

  const system = `You are a moderator's assistant for a peer-support platform for families affected by addiction. You read submitted stories and produce a triage note for the human moderator. You do NOT make moderation decisions — you flag concerns and propose an action; the human decides.

Flags:
- self_harm: language suggesting the writer may be considering self-harm or suicide
- active_crisis: appears to be in immediate crisis (overdose, in danger now)
- identifying_info: real names, employers, locations, treatment-center names
- names_individuals: names other people in a way that could identify them
- advice_seeking: primarily asking for advice/help (not the format of this platform)
- treatment_pitch: appears to be promoting a treatment center, product, or service
- off_topic: not actually about being affected by addiction

Risk levels:
- none: nothing concerning
- low: minor issues (e.g. one first name to redact)
- medium: emotionally heavy; reviewer should read carefully
- high: crisis or self-harm signals — surface immediately

Suggestions:
- approve: clean to publish as-is
- review: needs the human's eyes (most stories will land here)
- hold: should not be published without significant edits or follow-up

Be conservative. The bar for "approve" is high; the bar for "hold" is also high. Most stories should be "review".`;

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system,
      messages: [
        {
          role: "user",
          content: `Title: ${input.title}\n\nStory:\n${input.body}`,
        },
      ],
      output_config: { format: zodOutputFormat(TriageSchema) },
    });
    return response.parsed_output ?? null;
  } catch (err) {
    console.error("[ai.triageStory]", err);
    return null;
  }
}

const ResonanceSchema = z.object({
  matches: z
    .array(
      z.object({
        id: z.string().describe("Candidate story id, exactly as provided."),
        reason: z
          .string()
          .max(140)
          .describe("One short sentence naming the specific resonance."),
      })
    )
    .max(3),
});
export type ResonanceMatch = z.infer<typeof ResonanceSchema>["matches"][number];

export async function findResonantStories(input: {
  anchor: { id: string; title: string; body: string };
  candidates: { id: string; title: string; body: string }[];
}): Promise<ResonanceMatch[] | null> {
  const client = getClient();
  if (!client) return null;
  if (input.candidates.length === 0) return [];

  const system = `You help connect people who carry similar things. Given an anchor story and a list of candidates, identify up to 3 candidates whose emotional shape rhymes most closely with the anchor — same kind of carrying, same kind of moment, same kind of unresolved feeling.

Rules:
- Don't match on surface keywords. Match on the emotional truth underneath.
- Return at most 3 ids, ordered by strongest resonance first.
- The id MUST be exactly one of the ids provided in CANDIDATES.
- Each reason is one short sentence naming the specific resonance — what the two writers share. Write it warmly, in plain language.
- If no candidates resonate strongly, return fewer than 3 (or none).`;

  const candidatesText = input.candidates
    .map((c) => `[${c.id}]\nTitle: ${c.title}\n${c.body}`)
    .join("\n\n---\n\n");

  const userText = `ANCHOR STORY:\nTitle: ${input.anchor.title}\n${input.anchor.body}\n\n=========\n\nCANDIDATES:\n\n${candidatesText}`;

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system,
      messages: [{ role: "user", content: userText }],
      output_config: { format: zodOutputFormat(ResonanceSchema) },
    });
    if (!response.parsed_output) return null;
    const validIds = new Set(input.candidates.map((c) => c.id));
    return response.parsed_output.matches.filter((m) => validIds.has(m.id));
  } catch (err) {
    console.error("[ai.findResonantStories]", err);
    return null;
  }
}
