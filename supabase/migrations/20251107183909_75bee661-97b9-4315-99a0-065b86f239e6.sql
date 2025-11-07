-- Create enum for template status
CREATE TYPE public.template_status AS ENUM ('active', 'inactive', 'draft');

-- Create resume_templates table
CREATE TABLE public.resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  price NUMERIC NOT NULL DEFAULT 50,
  category TEXT NOT NULL DEFAULT 'professional',
  status template_status NOT NULL DEFAULT 'active',
  template_data JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume_purchases table
CREATE TABLE public.resume_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES public.resume_templates(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  amount_paid NUMERIC NOT NULL,
  payment_reference TEXT,
  UNIQUE(user_email, template_id)
);

-- Create resume_profiles table
CREATE TABLE public.resume_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES public.resume_templates(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL DEFAULT '{}',
  customization JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_email, template_id)
);

-- Enable RLS
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resume_templates
CREATE POLICY "Templates are viewable by everyone"
ON public.resume_templates
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage templates"
ON public.resume_templates
FOR ALL
USING (true);

-- RLS Policies for resume_purchases
CREATE POLICY "Users can view their own purchases"
ON public.resume_purchases
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create purchases"
ON public.resume_purchases
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage purchases"
ON public.resume_purchases
FOR ALL
USING (true);

-- RLS Policies for resume_profiles
CREATE POLICY "Users can view their own profiles"
ON public.resume_profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own profiles"
ON public.resume_profiles
FOR ALL
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_resume_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_resume_templates_updated_at
BEFORE UPDATE ON public.resume_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_resume_updated_at();

CREATE TRIGGER update_resume_profiles_updated_at
BEFORE UPDATE ON public.resume_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_resume_updated_at();

-- Insert default templates
INSERT INTO public.resume_templates (name, description, price, category, display_order, template_data) VALUES
('Harvard ATS Pro', 'ATS-optimized resume template used by Harvard graduates. Clean, professional, and passes all applicant tracking systems.', 50, 'professional', 1, '{"layout": "single-column", "sections": ["header", "summary", "experience", "education", "skills"]}'),
('McKinsey Consultant CV', 'Premium consulting resume format trusted by top-tier consulting firms. Emphasizes impact and achievements.', 50, 'professional', 2, '{"layout": "two-column", "sections": ["header", "summary", "experience", "education", "skills", "certifications"]}'),
('Modern LinkedIn Resume', 'Contemporary design optimized for LinkedIn and modern companies. Perfect for tech and creative roles.', 50, 'modern', 3, '{"layout": "modern", "sections": ["header", "summary", "experience", "skills", "projects", "education"]}'),
('Europass Elite Edition', 'Enhanced version of the European standard CV format. Perfect for international applications.', 50, 'international', 4, '{"layout": "europass", "sections": ["header", "summary", "experience", "education", "skills", "languages"]}'),
('Creative Minimal Portfolio CV', 'Minimalist design for creative professionals. Stand out with clean typography and smart layout.', 50, 'creative', 5, '{"layout": "minimal", "sections": ["header", "portfolio", "experience", "skills", "education"]}');