-- Create enum for assignment status
CREATE TYPE assignment_status AS ENUM (
  'pending',
  'assigned',
  'in_progress',
  'submitted',
  'approved',
  'rejected',
  'completed'
);

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'released',
  'refunded'
);

-- Create enum for solution status
CREATE TYPE solution_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'revision_needed'
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_contact TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL,
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('file_upload', 'text')),
  assignment_text TEXT,
  assignment_files JSONB DEFAULT '[]'::jsonb,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  deadline TIMESTAMP WITH TIME ZONE,
  base_fee NUMERIC NOT NULL DEFAULT 15,
  urgent_fee NUMERIC NOT NULL DEFAULT 0,
  total_fee NUMERIC NOT NULL,
  status assignment_status NOT NULL DEFAULT 'pending',
  solver_id UUID,
  solver_name TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  dynamic_edu_fee NUMERIC NOT NULL DEFAULT 6,
  solver_payment NUMERIC NOT NULL DEFAULT 9,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_solutions table
CREATE TABLE public.assignment_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  solver_id UUID,
  solver_name TEXT NOT NULL,
  solver_contact TEXT NOT NULL,
  solution_text TEXT,
  solution_files JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT,
  status solution_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_solvers table
CREATE TABLE public.assignment_solvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  class_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_solved INTEGER NOT NULL DEFAULT 0,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_rate_settings table
CREATE TABLE public.assignment_rate_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL UNIQUE,
  base_rate NUMERIC NOT NULL DEFAULT 15,
  urgent_fee_normal NUMERIC NOT NULL DEFAULT 5,
  urgent_fee_high NUMERIC NOT NULL DEFAULT 10,
  solver_percentage NUMERIC NOT NULL DEFAULT 60,
  dynamic_edu_percentage NUMERIC NOT NULL DEFAULT 40,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_transactions table
CREATE TABLE public.assignment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  solver_name TEXT,
  total_amount NUMERIC NOT NULL,
  dynamic_edu_amount NUMERIC NOT NULL,
  solver_amount NUMERIC NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assignment-files',
  'assignment-files',
  true,
  20971520,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain']
);

-- Enable RLS on all tables
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_solvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_rate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments (public can create and view their own)
CREATE POLICY "Anyone can create assignments"
  ON public.assignments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view all assignments"
  ON public.assignments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update assignments"
  ON public.assignments
  FOR UPDATE
  USING (true);

-- RLS Policies for solutions
CREATE POLICY "Anyone can create solutions"
  ON public.assignment_solutions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view solutions"
  ON public.assignment_solutions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update solutions"
  ON public.assignment_solutions
  FOR UPDATE
  USING (true);

-- RLS Policies for solvers
CREATE POLICY "Anyone can register as solver"
  ON public.assignment_solvers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solvers are viewable by everyone"
  ON public.assignment_solvers
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update solver profiles"
  ON public.assignment_solvers
  FOR UPDATE
  USING (true);

-- RLS Policies for rate settings
CREATE POLICY "Rate settings are viewable by everyone"
  ON public.assignment_rate_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage rate settings"
  ON public.assignment_rate_settings
  FOR ALL
  USING (true);

-- RLS Policies for transactions
CREATE POLICY "Transactions are viewable by everyone"
  ON public.assignment_transactions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create transactions"
  ON public.assignment_transactions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update transactions"
  ON public.assignment_transactions
  FOR UPDATE
  USING (true);

-- Create storage policies for assignment files
CREATE POLICY "Anyone can upload assignment files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'assignment-files');

CREATE POLICY "Anyone can view assignment files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'assignment-files');

CREATE POLICY "Anyone can update assignment files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'assignment-files');

CREATE POLICY "Anyone can delete assignment files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'assignment-files');

-- Insert default rate settings
INSERT INTO public.assignment_rate_settings (subject, base_rate, urgent_fee_normal, urgent_fee_high)
VALUES
  ('Mathematics', 15, 5, 10),
  ('Physics', 15, 5, 10),
  ('Chemistry', 15, 5, 10),
  ('Biology', 15, 5, 10),
  ('English', 15, 5, 10),
  ('Computer Science', 20, 7, 15),
  ('Economics', 15, 5, 10),
  ('Accounts', 15, 5, 10);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for assignments
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_assignments_updated_at();