-- Add thumbnail_url column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
