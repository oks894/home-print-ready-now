
-- Add status history tracking table
CREATE TABLE public.status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  print_job_id UUID NOT NULL REFERENCES public.print_jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by TEXT,
  notes TEXT
);

-- Add estimated completion time to print_jobs
ALTER TABLE public.print_jobs ADD COLUMN estimated_completion TIMESTAMPTZ;

-- Add notification preferences to print_jobs
ALTER TABLE public.print_jobs ADD COLUMN sms_notifications BOOLEAN DEFAULT true;
ALTER TABLE public.print_jobs ADD COLUMN email_notifications BOOLEAN DEFAULT true;

-- Enable RLS for status_history
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- Create policy for status_history (public access for now, matching print_jobs)
CREATE POLICY "Allow public access to status_history" ON public.status_history
  FOR ALL USING (true);

-- Create function to automatically insert status history when print_jobs status changes
CREATE OR REPLACE FUNCTION insert_status_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_history (print_job_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically track status changes
CREATE TRIGGER track_status_changes
  AFTER UPDATE ON public.print_jobs
  FOR EACH ROW
  EXECUTE FUNCTION insert_status_history();

-- Insert initial status history for existing jobs
INSERT INTO public.status_history (print_job_id, status, notes)
SELECT id, status, 'Initial status recorded'
FROM public.print_jobs;

-- Add realtime publication for status_history
ALTER PUBLICATION supabase_realtime ADD TABLE public.status_history;
