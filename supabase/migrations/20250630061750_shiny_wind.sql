/*
  # Create study plans and tasks tables

  1. New Tables
    - `study_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `date` (date, not null)
      - `completed` (boolean, default false)
      - `total_estimated_time` (integer, default 0)
      - `actual_time_spent` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `study_tasks`
      - `id` (uuid, primary key)
      - `study_plan_id` (uuid, foreign key to study_plans)
      - `topic` (text, not null)
      - `description` (text, not null)
      - `estimated_time` (integer, default 60)
      - `task_type` (task_type enum, default new)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own study plans and tasks
*/

-- Create task type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE task_type AS ENUM ('review', 'practice', 'new');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create study_plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  completed boolean DEFAULT false,
  total_estimated_time integer DEFAULT 0,
  actual_time_spent integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create study_tasks table
CREATE TABLE IF NOT EXISTS study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_plan_id uuid NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  topic text NOT NULL,
  description text NOT NULL,
  estimated_time integer DEFAULT 60,
  task_type task_type DEFAULT 'new',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON study_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_plan_id ON study_tasks(study_plan_id);

-- Enable Row Level Security
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for study_plans
DO $$ BEGIN
    CREATE POLICY "Users can view own study plans"
      ON study_plans
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own study plans"
      ON study_plans
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own study plans"
      ON study_plans
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own study plans"
      ON study_plans
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create policies for study_tasks
DO $$ BEGIN
    CREATE POLICY "Users can view own study tasks"
      ON study_tasks
      FOR SELECT
      TO authenticated
      USING (auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own study tasks"
      ON study_tasks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own study tasks"
      ON study_tasks
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own study tasks"
      ON study_tasks
      FOR DELETE
      TO authenticated
      USING (auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;