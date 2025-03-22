-- Add is_adult_content flag to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_adult_content BOOLEAN DEFAULT FALSE;

-- Comment on the column
COMMENT ON COLUMN links.is_adult_content IS 'Flag indicating if the link contains adult content (18+)'; 