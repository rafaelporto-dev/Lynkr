-- Add missing columns to profiles table
ALTER TABLE IF EXISTS profiles 
  ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'rounded',
  ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'inter',
  ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'list',
  ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'gradient',
  ADD COLUMN IF NOT EXISTS background_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_css TEXT,
  ADD COLUMN IF NOT EXISTS has_free_plan BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS has_custom_domain BOOLEAN DEFAULT FALSE;

-- Update profiles with default values if they don't exist
UPDATE profiles
SET 
  button_style = COALESCE(button_style, 'rounded'),
  font_family = COALESCE(font_family, 'inter'),
  layout = COALESCE(layout, 'list'),
  background_type = COALESCE(background_type, 'gradient'),
  has_free_plan = COALESCE(has_free_plan, TRUE),
  has_custom_domain = COALESCE(has_custom_domain, FALSE); 