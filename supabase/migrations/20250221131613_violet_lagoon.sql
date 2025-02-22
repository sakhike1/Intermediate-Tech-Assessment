/*
  # Initial Schema Setup for Office Space Management

  1. New Tables
    - `offices`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `capacity` (integer)
      - `color` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `workers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `position` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `office_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create offices table
CREATE TABLE IF NOT EXISTS offices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  office_id uuid REFERENCES offices(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Policies for offices
CREATE POLICY "Users can view their own offices"
  ON offices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create offices"
  ON offices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offices"
  ON offices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own offices"
  ON offices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for workers
CREATE POLICY "Users can view workers in their offices"
  ON workers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM offices 
      WHERE offices.id = workers.office_id 
      AND offices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workers in their offices"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM offices 
      WHERE offices.id = workers.office_id 
      AND offices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workers in their offices"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM offices 
      WHERE offices.id = workers.office_id 
      AND offices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workers in their offices"
  ON workers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM offices 
      WHERE offices.id = workers.office_id 
      AND offices.user_id = auth.uid()
    )
  );