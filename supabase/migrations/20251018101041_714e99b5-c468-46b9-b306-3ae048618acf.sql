-- Create external_links table for managing footer links
CREATE TABLE public.external_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (so footer can display links)
CREATE POLICY "External links are viewable by everyone" 
ON public.external_links 
FOR SELECT 
USING (is_active = true);

-- Create policy for admin full access (no auth system, so allow all for now)
CREATE POLICY "Anyone can manage external links" 
ON public.external_links 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_external_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_external_links_updated_at
BEFORE UPDATE ON public.external_links
FOR EACH ROW
EXECUTE FUNCTION public.update_external_links_updated_at();

-- Insert some default links
INSERT INTO public.external_links (title, url, description, icon, display_order, is_active) VALUES
  ('Portfolio', 'https://example.com', 'Check out our portfolio', 'Briefcase', 1, true),
  ('GitHub', 'https://github.com', 'View our projects', 'Github', 2, true),
  ('LinkedIn', 'https://linkedin.com', 'Connect with us', 'Linkedin', 3, true);