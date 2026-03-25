-- ============================================================
-- Micro PM Residency — Startup Problems Migration
-- Run in Supabase SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. startup_problems table
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS startup_problems (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name              TEXT NOT NULL,
  startup_problem           TEXT,
  startup_pm_name           TEXT,
  startup_data_description  TEXT,
  zoom_link                 TEXT,
  miro_link                 TEXT,
  slack_link                TEXT,
  deck_template_link        TEXT,
  problem_brief_link        TEXT,
  interview_guide_link      TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. Add problem_id + pm_feedback to teams
-- ------------------------------------------------------------

ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS problem_id UUID REFERENCES startup_problems(id) ON DELETE SET NULL;

ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS pm_feedback TEXT;

-- ------------------------------------------------------------
-- 3. Slim down cohort_config — drop per-problem columns
--    (only if they exist, safe to run multiple times)
-- ------------------------------------------------------------

ALTER TABLE cohort_config
  DROP COLUMN IF EXISTS startup_name,
  DROP COLUMN IF EXISTS startup_problem,
  DROP COLUMN IF EXISTS startup_pm_name,
  DROP COLUMN IF EXISTS startup_data_description,
  DROP COLUMN IF EXISTS zoom_link,
  DROP COLUMN IF EXISTS miro_link,
  DROP COLUMN IF EXISTS slack_link,
  DROP COLUMN IF EXISTS deck_template_link,
  DROP COLUMN IF EXISTS problem_brief_link,
  DROP COLUMN IF EXISTS interview_guide_link,
  DROP COLUMN IF EXISTS pm_feedback;

-- ------------------------------------------------------------
-- 4. RLS for startup_problems
-- ------------------------------------------------------------

ALTER TABLE startup_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "problems_select_authenticated"
  ON startup_problems FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "problems_all_service_role"
  ON startup_problems FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 5. Grants
-- ------------------------------------------------------------

GRANT ALL ON startup_problems TO service_role;
GRANT SELECT ON startup_problems TO authenticated;
