-- Drop the restrictive UPDATE policy that blocks admin coin updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create permissive UPDATE policy to allow admin operations
CREATE POLICY "Allow updates on user_profiles"
ON public.user_profiles FOR UPDATE
USING (true)
WITH CHECK (true);