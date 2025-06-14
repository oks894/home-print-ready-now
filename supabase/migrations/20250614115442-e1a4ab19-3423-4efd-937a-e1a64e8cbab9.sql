
-- Update the print_jobs table status constraint to include all valid statuses
ALTER TABLE public.print_jobs 
DROP CONSTRAINT IF EXISTS print_jobs_status_check;

-- Add the updated constraint with all valid status values
ALTER TABLE public.print_jobs 
ADD CONSTRAINT print_jobs_status_check 
CHECK (status IN ('pending', 'pending_payment', 'printing', 'ready', 'completed'));
