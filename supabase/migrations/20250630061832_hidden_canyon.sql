/*
  # Create library books and book bookings tables

  1. New Tables
    - `library_books`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `author` (text, not null)
      - `subject` (text, not null)
      - `isbn` (text, unique, nullable)
      - `publisher` (text, nullable)
      - `publication_year` (integer, nullable)
      - `total_copies` (integer, default 1)
      - `available_copies` (integer, default 1)
      - `description` (text, nullable)
      - `cover_url` (text, nullable)
      - `rating` (numeric, default 0, check 0-5)
      - `location` (text, nullable)
      - `language` (text, default English)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `book_bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `book_id` (uuid, foreign key to library_books)
      - `booking_date` (date, not null)
      - `due_date` (date, not null)
      - `status` (booking_status enum, default pending)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for book management and bookings
*/

-- Create booking status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'returned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create library_books table
CREATE TABLE IF NOT EXISTS library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  subject text NOT NULL,
  isbn text UNIQUE,
  publisher text,
  publication_year integer,
  total_copies integer DEFAULT 1 CHECK (total_copies >= 0),
  available_copies integer DEFAULT 1 CHECK (available_copies >= 0 AND available_copies <= total_copies),
  description text,
  cover_url text,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  location text,
  language text DEFAULT 'English',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create book_bookings table
CREATE TABLE IF NOT EXISTS book_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  due_date date NOT NULL CHECK (due_date >= booking_date),
  status booking_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_library_books_title ON library_books(title);
CREATE INDEX IF NOT EXISTS idx_library_books_author ON library_books(author);
CREATE INDEX IF NOT EXISTS idx_library_books_subject ON library_books(subject);
CREATE INDEX IF NOT EXISTS idx_library_books_isbn ON library_books(isbn);
CREATE INDEX IF NOT EXISTS idx_library_books_availability ON library_books(available_copies);

CREATE INDEX IF NOT EXISTS idx_book_bookings_user_id ON book_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_book_bookings_book_id ON book_bookings(book_id);
CREATE INDEX IF NOT EXISTS idx_book_bookings_status ON book_bookings(status);
CREATE INDEX IF NOT EXISTS idx_book_bookings_dates ON book_bookings(booking_date, due_date);

-- Enable Row Level Security
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for library_books (publicly readable)
DO $$ BEGIN
    CREATE POLICY "Anyone can view library books"
      ON library_books
      FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create policies for book_bookings
DO $$ BEGIN
    CREATE POLICY "Users can view own bookings"
      ON book_bookings
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create own bookings"
      ON book_bookings
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own bookings"
      ON book_bookings
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert some sample books
INSERT INTO library_books (title, author, subject, isbn, publisher, publication_year, total_copies, available_copies, description, rating) VALUES
  ('Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', '9780262033848', 'MIT Press', 2009, 5, 3, 'Comprehensive guide to algorithms and data structures', 4.8),
  ('Clean Code', 'Robert C. Martin', 'Software Engineering', '9780132350884', 'Prentice Hall', 2008, 3, 2, 'A handbook of agile software craftsmanship', 4.6),
  ('Design Patterns', 'Gang of Four', 'Software Engineering', '9780201633610', 'Addison-Wesley', 1994, 2, 1, 'Elements of reusable object-oriented software', 4.5),
  ('Calculus: Early Transcendentals', 'James Stewart', 'Mathematics', '9781285741550', 'Cengage Learning', 2015, 4, 4, 'Comprehensive calculus textbook', 4.3),
  ('Physics for Scientists and Engineers', 'Raymond A. Serway', 'Physics', '9781133947271', 'Cengage Learning', 2013, 3, 2, 'Comprehensive physics textbook', 4.4)
ON CONFLICT (isbn) DO NOTHING;