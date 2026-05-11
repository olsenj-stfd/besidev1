-- Beside — Supabase schema
-- Run this once in your Supabase project's SQL editor.
-- (Supabase dashboard → SQL Editor → New query → paste → Run)
--
-- Conditions, themes, and providers are static configuration that lives
-- in lib/seed.ts and never hit the database. Only stories and users are
-- persisted here. Seed stories are inserted automatically on first read
-- by the app (lib/supabase.ts → ensureStoriesSeeded), so no INSERTs here.

-- ─── stories ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stories (
  id              TEXT PRIMARY KEY,
  pseudonym       TEXT NOT NULL,
  condition_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_slugs     JSONB NOT NULL DEFAULT '[]'::jsonb,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  reactions       JSONB NOT NULL DEFAULT '{"me_too":0,"thinking_of_you":0,"thank_you":0}'::jsonb,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('approved','pending','rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at     TIMESTAMPTZ,
  moderation_note TEXT,
  triage          JSONB,
  resonant        JSONB
);

CREATE INDEX IF NOT EXISTS stories_status_idx ON public.stories (status);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON public.stories (created_at DESC);
CREATE INDEX IF NOT EXISTS stories_pseudonym_idx ON public.stories (pseudonym);

-- ─── users ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                  TEXT PRIMARY KEY,
  pseudonym           TEXT NOT NULL,
  themes              JSONB NOT NULL DEFAULT '[]'::jsonb,
  conditions          JSONB NOT NULL DEFAULT '[]'::jsonb,
  reacted_story_ids   JSONB NOT NULL DEFAULT '[]'::jsonb,
  pulses              JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RLS notes ───────────────────────────────────────────────────────
-- This prototype uses the service_role key for all server-side access
-- (Next.js server components + server actions). RLS is therefore
-- bypassed and not required. If you later expose any read paths to the
-- anon key, turn RLS on per-table and add appropriate policies.
--
-- ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users   ENABLE ROW LEVEL SECURITY;
