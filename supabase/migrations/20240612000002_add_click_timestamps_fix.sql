-- Add created_at column to links table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'created_at') THEN
    ALTER TABLE links ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Create clicks table to track individual click events with timestamps if it doesn't exist
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT
);

-- Create function to increment link click count and add click record
CREATE OR REPLACE FUNCTION increment_link_click_with_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the click_count in the links table
  UPDATE links SET click_count = click_count + 1 WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new click is added
DROP TRIGGER IF EXISTS on_click_insert ON clicks;
CREATE TRIGGER on_click_insert
  AFTER INSERT ON clicks
  FOR EACH ROW
  EXECUTE FUNCTION increment_link_click_with_timestamp();

-- Add RLS policies for clicks table
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own clicks
DROP POLICY IF EXISTS "Users can view their own clicks" ON clicks;
CREATE POLICY "Users can view their own clicks"
  ON clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = clicks.link_id
      AND links.user_id = auth.uid()
    )
  );

-- Allow insert for anyone (for tracking clicks)
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
CREATE POLICY "Anyone can insert clicks"
  ON clicks
  FOR INSERT
  WITH CHECK (true);

-- Check if the table is already in the publication before adding it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'clicks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE clicks;
  END IF;
END
$$;