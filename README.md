# Beside

A quiet place for the people who love someone touched by addiction.

Anonymous stories, grouped by theme. No comments — only reactions ("me too", "thinking of you", "thank you for sharing"). Every submission is reviewed by a human before going live. No AI talks back. The eventual matching layer (v2) only ever introduces you to another person.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind v4
- **Supabase Postgres** (production) with a local JSON store fallback for dev
- Cookie-based pseudonymous sessions
- PWA-ready (manifest + theme color)

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Without any env vars, the app writes to a local JSON store at `./.data/store.json` (auto-seeded on first request). To reset, delete that file and refresh.

## Deploy to Vercel

The local JSON store doesn't work on Vercel — serverless functions have a read-only filesystem. For production, point Beside at a Supabase Postgres database.

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine).
2. **Run the schema** in Supabase dashboard → SQL Editor → New query → paste [`supabase-schema.sql`](supabase-schema.sql) → Run. Creates `stories` and `users` tables. Conditions/themes/providers stay static in code.
3. **Grab two values** from Supabase dashboard → Project Settings → API:
   - `Project URL` → use as `SUPABASE_URL`
   - `service_role` secret key (NOT the anon key) → use as `SUPABASE_SERVICE_ROLE_KEY`
4. **In Vercel** → Project Settings → Environment Variables, add both. Optionally add `ANTHROPIC_API_KEY` (for AI features) and `MOD_PASSWORD` (defaults to `beside-mod`).
5. **Redeploy.** On first request, the app auto-seeds the `stories` table with the 19 seed stories (idempotent — re-runs are safe).

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are both set, the app uses Supabase. When either is missing, it falls back to the local JSON store. This means the same codebase runs locally with zero config *and* on Vercel with the two env vars set.

## Demo flow

1. `/` — Landing.
2. `/welcome` — Pick a pseudonym, pick the themes you identify with.
3. `/browse` — Theme grid + recent stories.
4. `/themes/[slug]` — All approved stories under a theme.
5. `/stories/[id]` — A single story with reactions.
6. `/share` — Submit a story (goes to moderation queue).
7. `/moderate` — Password-gated moderator view (default key: `beside-mod`).

To override the moderator password, set `MOD_PASSWORD=...` in a `.env.local`.

## AI features (optional)

Three AI features are wired in via the Anthropic SDK ([`lib/ai.ts`](lib/ai.ts)) using `claude-opus-4-7` with adaptive thinking and structured outputs. **All three no-op gracefully if `ANTHROPIC_API_KEY` is not set** — the app still runs fully offline for the demo.

1. **Theme binning** — In the share form, "suggest themes" reads the draft and proposes 1–4 themes with a one-line rationale. Author confirms.
2. **Moderator triage** — Every submission gets an AI triage note (risk level, flags, summary, suggested action) shown only inside `/moderate`. The human always decides.
3. **Resonance matching** — When a story is approved, Claude picks up to 3 already-published stories whose emotional shape rhymes most closely with it. Stored on the story record so reads stay cheap.

What AI explicitly does NOT do here, by design:
- Talk back to authors as a chatbot
- Reply to stories
- Make moderation decisions

Copy `.env.local.example` to `.env.local` and add your `ANTHROPIC_API_KEY` to enable.

## What's not in this prototype

- Real auth or accounts — pseudonyms live in a session cookie only.
- AI companion (and we don't intend to build one).
- Meeting-finder (Al-Anon / Nar-Anon / AA).
- Push notifications.
- A real database (the JSON store is intentionally swappable — see [`lib/data.ts`](lib/data.ts)).

## Why these choices

**Reactions, not comments.** Comments invite advice, debate, and re-traumatization. Reactions invite holding.

**Pseudonyms, not accounts.** Email addresses turn a hard story into a long-term liability. A cookie-bound pseudonym is enough to maintain identity inside the app while leaving no real-world trail.

**Human-in-the-loop moderation.** Every story is read before it's posted. Not to gatekeep — to keep the place soft for the next person.

**Crisis resources are persistent, not buried.** A footer with 988 and SAMHSA is on every page.
