
-- Create storage bucket for print job files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'print-files',
  'print-files',
  true,
  104857600, -- 100MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Create storage policies for the print-files bucket
CREATE POLICY "Anyone can upload print files"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'print-files');

CREATE POLICY "Anyone can view print files"
ON storage.objects FOR SELECT
USING (bucket_id = 'print-files');

CREATE POLICY "Anyone can update print files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'print-files');

CREATE POLICY "Anyone can delete print files"
ON storage.objects FOR DELETE
USING (bucket_id = 'print-files');
