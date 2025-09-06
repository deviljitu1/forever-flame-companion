-- Update profiles RLS policy to allow users to see all profiles (needed for invite code matching)
-- This is safe because profiles only contain display_name and basic info, no sensitive data

DROP POLICY IF EXISTS "Users can view their own profile and their partner's profile" ON public.profiles;

-- Allow users to view all profiles (needed for invite code matching and general app functionality)
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep the existing insert and update policies
-- Users can still only insert/update their own profiles