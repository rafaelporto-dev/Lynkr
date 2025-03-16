-- Add has_free_plan column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_free_plan BOOLEAN DEFAULT false;

-- Update existing profiles to have has_free_plan = false
UPDATE public.profiles SET has_free_plan = false WHERE has_free_plan IS NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_has_free_plan ON public.profiles(has_free_plan);