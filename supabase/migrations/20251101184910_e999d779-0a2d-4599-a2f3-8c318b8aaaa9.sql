-- Create enum for note status
CREATE TYPE note_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for request status
CREATE TYPE request_status AS ENUM ('pending', 'fulfilled', 'rejected');

-- Create note_categories table for organization
CREATE TABLE public.note_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_level TEXT NOT NULL UNIQUE,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploader_name TEXT NOT NULL,
  uploader_contact TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  status note_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create note_requests table
CREATE TABLE public.note_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  contact TEXT,
  class_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  additional_details TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.note_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for note_categories
CREATE POLICY "Note categories are viewable by everyone"
ON public.note_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Anyone can manage note categories"
ON public.note_categories FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for notes
CREATE POLICY "Approved notes are viewable by everyone"
ON public.notes FOR SELECT
USING (is_approved = true AND status = 'approved');

CREATE POLICY "Anyone can insert notes"
ON public.notes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update notes"
ON public.notes FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete notes"
ON public.notes FOR DELETE
USING (true);

-- RLS Policies for note_requests
CREATE POLICY "Note requests are viewable by everyone"
ON public.note_requests FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert note requests"
ON public.note_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update note requests"
ON public.note_requests FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete note requests"
ON public.note_requests FOR DELETE
USING (true);

-- Create storage bucket for student notes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-notes',
  'student-notes',
  true,
  10485760, -- 10MB in bytes
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
);

-- Storage policies for student-notes bucket
CREATE POLICY "Student notes are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-notes');

CREATE POLICY "Anyone can upload student notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student-notes');

CREATE POLICY "Anyone can update their student notes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student-notes');

CREATE POLICY "Anyone can delete student notes"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-notes');

-- Insert default note categories
INSERT INTO public.note_categories (class_level, subjects, display_order) VALUES
('Class 6', '["Mathematics", "Science", "English", "Hindi", "Social Studies"]'::jsonb, 1),
('Class 7', '["Mathematics", "Science", "English", "Hindi", "Social Studies"]'::jsonb, 2),
('Class 8', '["Mathematics", "Science", "English", "Hindi", "Social Studies"]'::jsonb, 3),
('Class 9', '["Mathematics", "Science", "English", "Hindi", "Social Studies"]'::jsonb, 4),
('Class 10', '["Mathematics", "Science", "English", "Hindi", "Social Studies"]'::jsonb, 5),
('Class 11', '["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"]'::jsonb, 6),
('Class 12', '["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"]'::jsonb, 7),
('B.Tech 1st Year', '["Engineering Mathematics", "Physics", "Chemistry", "Programming", "Engineering Drawing"]'::jsonb, 8),
('B.Tech 2nd Year', '["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Computer Networks"]'::jsonb, 9),
('B.Tech 3rd Year', '["Software Engineering", "Web Development", "Machine Learning", "Computer Graphics", "Compiler Design"]'::jsonb, 10),
('B.Tech 4th Year', '["Cloud Computing", "Artificial Intelligence", "Blockchain", "IoT", "Project Work"]'::jsonb, 11);

-- Create trigger to update updated_at timestamp for notes
CREATE OR REPLACE FUNCTION public.update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_timestamp
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_notes_updated_at();

-- Create trigger to update updated_at timestamp for note_requests
CREATE TRIGGER update_note_requests_timestamp
BEFORE UPDATE ON public.note_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_notes_updated_at();