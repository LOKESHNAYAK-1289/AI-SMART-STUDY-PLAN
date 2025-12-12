/*
  # Create gaps table

  1. New Tables
    - `gaps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `topic` (text, not null)
      - `description` (text, not null)
      - `priority` (priority_level enum, default medium)
      - `gap_type` (gap_type enum, default conceptual)
      - `prerequisite` (text, nullable)
      - `resolved` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `gaps` table
    - Add policies for users to manage their own gaps
*/

-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gap_type AS ENUM ('prerequisite', 'conceptual', 'practice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create gaps table
CREATE TABLE IF NOT EXISTS gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic text NOT NULL,
  description text NOT NULL,
  priority priority_level DEFAULT 'medium',
  gap_type gap_type DEFAULT 'conceptual',
  prerequisite text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gaps_user_id ON gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_gaps_priority ON gaps(priority);
CREATE INDEX IF NOT EXISTS idx_gaps_resolved ON gaps(resolved);

-- Enable Row Level Security
ALTER TABLE gaps ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    CREATE POLICY "Users can view own gaps"
      ON gaps
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own gaps"
      ON gaps
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own gaps"
      ON gaps
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own gaps"
      ON gaps
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;