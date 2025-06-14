
-- Create services table for storing printing services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - since this is for public services, we'll make it readable by everyone
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view services (public data)
CREATE POLICY "Anyone can view services" 
  ON public.services 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert services (admin functionality)
CREATE POLICY "Authenticated users can create services" 
  ON public.services 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update services (admin functionality)
CREATE POLICY "Authenticated users can update services" 
  ON public.services 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Only authenticated users can delete services (admin functionality)
CREATE POLICY "Authenticated users can delete services" 
  ON public.services 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Insert default services
INSERT INTO public.services (name, description, price, category) VALUES
('Document Printing', 'High-quality black and white document printing', '₹3.5/page', 'Printing'),
('Color Printing', 'Vibrant color printing for presentations, photos, and graphics', '₹5/page', 'Color'),
('Doorstep Delivery', 'Powered by DROPEE - Standard pricing applies for orders below ₹900', 'FREE for orders ₹900+', 'Delivery');
