/*
  # Create profiles table with user information

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `full_name` (text, nullable)
      - `surname` (text, nullable)
      - `date_of_birth` (date, nullable)
      - `gender` (gender_type enum, nullable)
      - `completed_education` (education_level array, default empty)
      - `currently_pursuing` (text, nullable)
      - `skills` (text array, default empty)
      - `interested_topics` (text array, default empty)
      - `hobbies` (text array, default empty)
      - `employment_status` (employment_status enum, nullable)
      - `employment_domain` (text, nullable)
      - `profile_completed` (boolean, default false)
      - `avatar_url` (text, nullable)
      - `study_streak` (integer, default 0)
      - `total_study_hours` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to manage their own profiles
*/

-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE education_level AS ENUM ('10th', '12th', 'diploma', 'btech', 'mtech', 'bsc', 'msc', 'ba', 'ma', 'phd', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_status AS ENUM ('employed', 'unemployed', 'student', 'freelancer', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  surname text,
  date_of_birth date,
  gender gender_type,
  completed_education education_level[] DEFAULT '{}',
  currently_pursuing text,
  skills text[] DEFAULT '{}',
  interested_topics text[] DEFAULT '{}',
  hobbies text[] DEFAULT '{}',
  employment_status employment_status,
  employment_domain text,
  profile_completed boolean DEFAULT false,
  avatar_url text,
  study_streak integer DEFAULT 0,
  total_study_hours integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;