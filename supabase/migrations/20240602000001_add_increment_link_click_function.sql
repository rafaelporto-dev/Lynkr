-- Create a function to increment the click count for a link
CREATE OR REPLACE FUNCTION increment_link_click(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE links
  SET 
    click_count = click_count + 1,
    updated_at = now()
  WHERE id = link_id;
END;
$$;

-- Create a policy to allow anyone to call this function
DROP POLICY IF EXISTS "Allow anyone to increment link clicks" ON links;
CREATE POLICY "Allow anyone to increment link clicks"
  ON links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create a policy to allow anyone to read links
DROP POLICY IF EXISTS "Allow anyone to read links" ON links;
CREATE POLICY "Allow anyone to read links"
  ON links
  FOR SELECT
  USING (true);

-- Create a policy to allow anyone to read profiles
DROP POLICY IF EXISTS "Allow anyone to read profiles" ON profiles;
CREATE POLICY "Allow anyone to read profiles"
  ON profiles
  FOR SELECT
  USING (true);
