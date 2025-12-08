-- Update user_profiles RLS policies to allow admin panel access
-- Drop restrictive policies and add permissive ones for viewing

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Create a policy that allows anyone to view user profiles (for admin panel)
CREATE POLICY "Anyone can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (true);

-- Update coin_recharge_requests policies
DROP POLICY IF EXISTS "Admins can view all requests" ON public.coin_recharge_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.coin_recharge_requests;

-- Allow anyone to view all recharge requests (for admin panel)
CREATE POLICY "Anyone can view all requests" 
ON public.coin_recharge_requests 
FOR SELECT 
USING (true);

-- Allow anyone to update recharge requests (for admin panel)
CREATE POLICY "Anyone can update requests" 
ON public.coin_recharge_requests 
FOR UPDATE 
USING (true);