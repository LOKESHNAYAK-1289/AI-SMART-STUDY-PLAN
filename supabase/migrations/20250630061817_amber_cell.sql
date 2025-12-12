/*
  # Create resources table

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `topic` (text, not null)
      - `title` (text, not null)
      - `resource_type` (resource_type enum, default article)
      - `url` (text, not null)
      - `duration` (integer, nullable)
      - `rating` (numeric, default 0, check 0-5)
      - `description` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `resources` table
    - Add policies for public read access
*/

-- Create resource type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM ('video', 'article', 'summary', 'practice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  title text NOT NULL,
  resource_type resource_type DEFAULT 'article',
  url text NOT NULL,
  duration integer,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies (resources are publicly readable)
DO $$ BEGIN
    CREATE POLICY "Anyone can view resources"
      ON resources
      FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert some sample resources
INSERT INTO resources (topic, title, resource_type, url, duration, rating, description) VALUES
  ('Recursion', 'Understanding Recursion in Programming', 'video', 'https://example.com/recursion-video', 1800, 4.5, 'Comprehensive guide to recursive functions'),
  ('Data Structures', 'Arrays and Linked Lists Explained', 'article', 'https://example.com/data-structures', NULL, 4.2, 'Fundamental data structures every programmer should know'),
  ('Algorithms', 'Big O Notation Made Simple', 'video', 'https://example.com/big-o', 1200, 4.8, 'Learn time and space complexity analysis'),
  ('Dynamic Programming', 'DP Practice Problems', 'practice', 'https://example.com/dp-practice', NULL, 4.0, 'Collection of dynamic programming exercises')
ON CONFLICT DO NOTHING;