-- Create custom_domains table
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT false,
  verification_code VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT domain_format CHECK (domain ~* '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$')
);

-- Add RLS policies
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

-- Users can view their own domains
DROP POLICY IF EXISTS "Users can view their own domains" ON custom_domains;
CREATE POLICY "Users can view their own domains"
  ON custom_domains
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own domains
DROP POLICY IF EXISTS "Users can insert their own domains" ON custom_domains;
CREATE POLICY "Users can insert their own domains"
  ON custom_domains
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own domains
DROP POLICY IF EXISTS "Users can update their own domains" ON custom_domains;
CREATE POLICY "Users can update their own domains"
  ON custom_domains
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own domains
DROP POLICY IF EXISTS "Users can delete their own domains" ON custom_domains;
CREATE POLICY "Users can delete their own domains"
  ON custom_domains
  FOR DELETE
  USING (user_id = auth.uid());

-- Enable realtime for custom_domains table
ALTER PUBLICATION supabase_realtime ADD TABLE custom_domains;

-- Add has_custom_domain to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_custom_domain BOOLEAN DEFAULT false;
