-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload their own avatars
DROP POLICY IF EXISTS "Avatar upload policy" ON storage.objects;
CREATE POLICY "Avatar upload policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up storage policy to allow authenticated users to update their own avatars
DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;
CREATE POLICY "Avatar update policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up storage policy to allow public read access to avatars
DROP POLICY IF EXISTS "Avatar read policy" ON storage.objects;
CREATE POLICY "Avatar read policy"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
