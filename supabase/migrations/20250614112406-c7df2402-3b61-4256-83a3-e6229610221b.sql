
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON public.services;

-- Create more permissive policies for service management
-- Allow anyone to insert services (for admin functionality)
CREATE POLICY "Anyone can create services" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update services (for admin functionality)
CREATE POLICY "Anyone can update services" 
  ON public.services 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

-- Allow anyone to delete services (for admin functionality)
CREATE POLICY "Anyone can delete services" 
  ON public.services 
  FOR DELETE 
  USING (true);
