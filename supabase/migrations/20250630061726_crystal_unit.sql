/*
  # Create subjects table

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `description` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subjects` table
    - Add policies for public read access
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create policies (subjects are publicly readable)
DO $$ BEGIN
    CREATE POLICY "Anyone can view subjects"
      ON subjects
      FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert default subjects
INSERT INTO subjects (name, description) VALUES
  ('Physics', 'Study of matter, energy, and their interactions'),
  ('Mathematics', 'Study of numbers, structures, patterns, and change'),
  ('Chemistry', 'Study of matter and the changes it undergoes'),
  ('Computer Science', 'Study of computation, algorithms, and system design'),
  ('Java Programming', 'Object-oriented programming language'),
  ('Python Programming', 'High-level programming language'),
  ('Biology', 'Study of living organisms'),
  ('English Literature', 'Study of written works in English'),
  ('History', 'Study of past events'),
  ('Economics', 'Study of production, distribution, and consumption'),
  ('Business Studies', 'Study of business operations and management'),
  ('Accountancy', 'Study of financial record-keeping and analysis'),
  ('Political Science', 'Study of government systems and political behavior'),
  ('Geography', 'Study of Earth and its features'),
  ('Psychology', 'Study of mind and behavior'),
  ('Sociology', 'Study of society and social relationships'),
  ('Philosophy', 'Study of fundamental questions about existence'),
  ('Engineering', 'Application of science and mathematics to solve problems'),
  ('Medicine', 'Study of health, disease, and treatment'),
  ('Law', 'System of rules and regulations')
ON CONFLICT (name) DO NOTHING;