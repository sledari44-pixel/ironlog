-- IronLog Database Schema
-- Run this in: supabase.com → your project → SQL Editor → New query

-- Main sets table
CREATE TABLE IF NOT EXISTS sets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  workout_type TEXT NOT NULL CHECK (workout_type IN ('Push','Pull','Legs','Core','Cardio','Mobility')),
  lift         TEXT NOT NULL,
  weight_lbs   NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps         INTEGER NOT NULL DEFAULT 0
);

-- Index for fast date-range queries (today's sets, history)
CREATE INDEX IF NOT EXISTS sets_logged_at_idx ON sets (logged_at DESC);

-- Enable Row Level Security (good practice even without auth)
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (no auth mode)
-- If you add auth later, replace this with per-user policies
CREATE POLICY "Allow all" ON sets FOR ALL USING (true) WITH CHECK (true);

-- Handy views for reporting in Supabase dashboard

-- Daily volume summary
CREATE OR REPLACE VIEW daily_volume AS
SELECT
  logged_at::date AS date,
  workout_type,
  COUNT(*) AS total_sets,
  SUM(reps) AS total_reps,
  SUM(weight_lbs * reps) AS total_volume_lbs
FROM sets
GROUP BY logged_at::date, workout_type
ORDER BY date DESC;

-- Personal records per lift
CREATE OR REPLACE VIEW personal_records AS
SELECT
  lift,
  workout_type,
  MAX(weight_lbs) AS max_weight_lbs,
  MAX(reps) AS max_reps,
  COUNT(*) AS total_sets_logged
FROM sets
GROUP BY lift, workout_type
ORDER BY max_weight_lbs DESC;

-- Weekly summary
CREATE OR REPLACE VIEW weekly_summary AS
SELECT
  date_trunc('week', logged_at)::date AS week_start,
  COUNT(*) AS total_sets,
  COUNT(DISTINCT logged_at::date) AS workout_days,
  SUM(weight_lbs * reps) AS total_volume_lbs
FROM sets
GROUP BY week_start
ORDER BY week_start DESC;
