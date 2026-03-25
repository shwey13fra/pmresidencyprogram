-- ── Feature 1: User Interview Tracker ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id          uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id        uuid NOT NULL REFERENCES applicants(id),
  interviewee_name text NOT NULL,
  interviewee_role text,
  key_insight      text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Feature 2: Deck Submission ───────────────────────────────────────────────
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deck_url          text;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deck_submitted_at timestamptz;

-- ── Feature 3: Resource Library ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid REFERENCES teams(id) ON DELETE CASCADE,   -- NULL = global (all teams)
  title       text NOT NULL,
  url         text NOT NULL,
  description text,
  type        text NOT NULL DEFAULT 'link',                  -- link | doc | video | template
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Feature 4: Private Notes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS private_notes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  content      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Permissions ──────────────────────────────────────────────────────────────
GRANT ALL ON interviews    TO service_role;
GRANT ALL ON resources     TO service_role;
GRANT ALL ON private_notes TO service_role;
