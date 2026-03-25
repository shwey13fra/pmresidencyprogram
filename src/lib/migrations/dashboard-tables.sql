-- ============================================================
-- Micro PM Residency — Dashboard Tables Migration
-- Run in Supabase SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. Add dashboard_token to applicants
-- ------------------------------------------------------------

ALTER TABLE applicants
  ADD COLUMN IF NOT EXISTS dashboard_token TEXT UNIQUE;


-- ------------------------------------------------------------
-- 2. tasks table
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id       UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL DEFAULT 'collaborative'
                  CHECK (type IN ('individual', 'collaborative')),
  status        TEXT NOT NULL DEFAULT 'todo'
                  CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority      TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('high', 'medium', 'low')),
  assignee_id   UUID REFERENCES applicants(id) ON DELETE SET NULL,
  due_label     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 3. notes table
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  tag         TEXT CHECK (tag IN ('insight', 'decision', 'risk')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 4. checklist_items table
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS checklist_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id  UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  is_done       BOOLEAN NOT NULL DEFAULT false,
  sort_order    INT NOT NULL DEFAULT 0
);


-- ------------------------------------------------------------
-- 5. cohort_config table
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cohort_config (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_date               DATE NOT NULL,
  startup_name              TEXT,
  startup_problem           TEXT,
  startup_pm_name           TEXT,
  startup_data_description  TEXT,
  zoom_link                 TEXT,
  miro_link                 TEXT,
  slack_link                TEXT,
  deck_template_link        TEXT,
  problem_brief_link        TEXT,
  interview_guide_link      TEXT,
  pm_feedback               TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 6. updated_at trigger for tasks
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_set_updated_at ON tasks;

CREATE TRIGGER tasks_set_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------
-- 7. Row-Level Security
-- ------------------------------------------------------------

-- tasks --
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_authenticated"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "tasks_insert_service_role"
  ON tasks FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "tasks_update_service_role"
  ON tasks FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- notes --
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_authenticated"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "notes_insert_authenticated"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- checklist_items --
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checklist_select_authenticated"
  ON checklist_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "checklist_update_authenticated"
  ON checklist_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- cohort_config --
ALTER TABLE cohort_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cohort_config_select_authenticated"
  ON cohort_config FOR SELECT
  TO authenticated
  USING (true);
