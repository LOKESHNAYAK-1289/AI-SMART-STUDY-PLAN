/*
  # Create topics table

  1. New Tables
    - `topics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `subject_id` (uuid, foreign key to subjects, nullable)
      - `name` (text, not null)
      - `difficulty` (difficulty_level enum, default medium)
      - `completed` (boolean, default false)
      - `date_completed` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `topics` table
    - Add policies for users to manage their own topics
*/

-- Create difficulty level enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  name text NOT NULL,
  difficulty difficulty_level DEFAULT 'medium',
  completed boolean DEFAULT false,
  date_completed timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_completed ON topics(completed);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    CREATE POLICY "Users can view own topics"
      ON topics
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own topics"
      ON topics
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own topics"
      ON topics
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own topics"
      ON topics
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;