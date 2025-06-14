
-- Add columns to print_jobs table for service selection and pricing
ALTER TABLE public.print_jobs 
ADD COLUMN selected_services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN delivery_requested BOOLEAN DEFAULT false;

-- Update the status field to include pending_payment
ALTER TABLE public.print_jobs 
ALTER COLUMN status TYPE TEXT;

-- Update existing records to have the new default values
UPDATE public.print_jobs 
SET selected_services = '[]'::jsonb, 
    total_amount = 0, 
    delivery_requested = false 
WHERE selected_services IS NULL;
