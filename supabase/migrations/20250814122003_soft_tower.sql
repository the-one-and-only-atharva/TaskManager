/*
  # TaskManager Database Schema

  1. New Tables
    - `stars` - Main goal/project containers
    - `planets` - Sub-projects within stars
    - `moons` - Task groups within planets
    - `todos` - Individual tasks within moons

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Features
    - Hierarchical structure: Stars -> Planets -> Moons -> Todos
    - Position tracking for orbital visualization
    - Priority and status management
    - Rich metadata support
*/

-- Create stars table
CREATE TABLE IF NOT EXISTS stars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  x numeric DEFAULT 0,
  y numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create planets table
CREATE TABLE IF NOT EXISTS planets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  star_id uuid REFERENCES stars(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'blocked', 'done')),
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  start_date date,
  due_date date,
  estimated_time text,
  risk_level text CHECK (risk_level IN ('low', 'medium', 'high')),
  risk_factors text,
  mitigation text,
  notes text,
  tags text[] DEFAULT '{}',
  dependencies uuid[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create moons table
CREATE TABLE IF NOT EXISTS moons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id uuid REFERENCES planets(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moon_id uuid REFERENCES moons(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  due_date date,
  estimated_hours numeric,
  tags text[] DEFAULT '{}',
  notes text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id uuid REFERENCES planets(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  due_date date,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outcomes table
CREATE TABLE IF NOT EXISTS outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id uuid REFERENCES planets(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  target text,
  achieved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id uuid REFERENCES planets(id) ON DELETE CASCADE NOT NULL,
  title text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stars_user_id ON stars(user_id);
CREATE INDEX IF NOT EXISTS idx_planets_star_id ON planets(star_id);
CREATE INDEX IF NOT EXISTS idx_moons_planet_id ON moons(planet_id);
CREATE INDEX IF NOT EXISTS idx_todos_moon_id ON todos(moon_id);
CREATE INDEX IF NOT EXISTS idx_milestones_planet_id ON milestones(planet_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_planet_id ON outcomes(planet_id);
CREATE INDEX IF NOT EXISTS idx_links_planet_id ON links(planet_id);

-- Enable Row Level Security
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE moons ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stars
CREATE POLICY "Users can view their own stars"
  ON stars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stars"
  ON stars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stars"
  ON stars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stars"
  ON stars FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for planets
CREATE POLICY "Users can view planets in their stars"
  ON planets FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM stars 
    WHERE stars.id = planets.star_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can create planets in their stars"
  ON planets FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM stars 
    WHERE stars.id = planets.star_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can update planets in their stars"
  ON planets FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM stars 
    WHERE stars.id = planets.star_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete planets in their stars"
  ON planets FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM stars 
    WHERE stars.id = planets.star_id 
    AND stars.user_id = auth.uid()
  ));

-- Create RLS policies for moons
CREATE POLICY "Users can view moons in their planets"
  ON moons FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = moons.planet_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can create moons in their planets"
  ON moons FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = moons.planet_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can update moons in their planets"
  ON moons FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = moons.planet_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete moons in their planets"
  ON moons FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = moons.planet_id 
    AND stars.user_id = auth.uid()
  ));

-- Create RLS policies for todos
CREATE POLICY "Users can view todos in their moons"
  ON todos FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM moons 
    JOIN planets ON planets.id = moons.planet_id
    JOIN stars ON stars.id = planets.star_id
    WHERE moons.id = todos.moon_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can create todos in their moons"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM moons 
    JOIN planets ON planets.id = moons.planet_id
    JOIN stars ON stars.id = planets.star_id
    WHERE moons.id = todos.moon_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can update todos in their moons"
  ON todos FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM moons 
    JOIN planets ON planets.id = moons.planet_id
    JOIN stars ON stars.id = planets.star_id
    WHERE moons.id = todos.moon_id 
    AND stars.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete todos in their moons"
  ON todos FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM moons 
    JOIN planets ON planets.id = moons.planet_id
    JOIN stars ON stars.id = planets.star_id
    WHERE moons.id = todos.moon_id 
    AND stars.user_id = auth.uid()
  ));

-- Create RLS policies for milestones
CREATE POLICY "Users can manage milestones in their planets"
  ON milestones FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = milestones.planet_id 
    AND stars.user_id = auth.uid()
  ));

-- Create RLS policies for outcomes
CREATE POLICY "Users can manage outcomes in their planets"
  ON outcomes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = outcomes.planet_id 
    AND stars.user_id = auth.uid()
  ));

-- Create RLS policies for links
CREATE POLICY "Users can manage links in their planets"
  ON links FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM planets 
    JOIN stars ON stars.id = planets.star_id
    WHERE planets.id = links.planet_id 
    AND stars.user_id = auth.uid()
  ));

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_stars_updated_at BEFORE UPDATE ON stars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planets_updated_at BEFORE UPDATE ON planets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moons_updated_at BEFORE UPDATE ON moons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();