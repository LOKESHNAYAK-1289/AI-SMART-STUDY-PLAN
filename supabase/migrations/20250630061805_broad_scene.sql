/*
  # Create mood entries table

  1. New Tables
    - `mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `date` (date, not null)
      - `mood` (mood_type enum, not null)
      - `study_hours` (numeric, default 0)
      - `notes` (text, nullable)
      - `energy_level` (integer, default 5, check 1-10)
      - `motivation_level` (integer, default 5, check 1-10)
      - `stress_factors` (text array, default empty)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `mood_entries` table
    - Add policies for users to manage their own mood entries
*/

-- Create mood type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE mood_type AS ENUM ('great', 'good', 'okay', 'stressed', 'overwhelmed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  mood mood_type NOT NULL,
  study_hours numeric(4,2) DEFAULT 0,
  notes text,
  energy_level integer DEFAULT 5 CHECK (energy_level >= 1 AND energy_level <= 10),
  motivation_level integer DEFAULT 5 CHECK (motivation_level >= 1 AND motivation_level <= 10),
  stress_factors text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_energy_motivation ON mood_entries(user_id, energy_level, motivation_level);
CREATE INDEX IF NOT EXISTS idx_mood_entries_stress_factors ON mood_entries USING gin(stress_factors);

-- Enable Row Level Security
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    CREATE POLICY "Users can view own mood entries"
      ON mood_entries
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own mood entries"
      ON mood_entries
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own mood entries"
      ON mood_entries
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own mood entries"
      ON mood_entries
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;