-- Create a function to check if a username is available
CREATE OR REPLACE FUNCTION public.is_username_available(username_to_check TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  username_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE username = username_to_check
  ) INTO username_exists;
  
  RETURN NOT username_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add username to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'username'
  ) THEN
    ALTER TABLE users ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- Update the handle_new_user function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'username', 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an API function to check username availability
CREATE OR REPLACE FUNCTION public.check_username_availability(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_username_available(username);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles table is already in the realtime publication, so we don't need to add it again
