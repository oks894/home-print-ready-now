-- Phase 1: Database Architecture for Corporate Edition

-- Create payment_settings table (single-row config)
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upi_id text NOT NULL DEFAULT 'dynamicedu@paytm',
  qr_code_url text,
  whatsapp_number text NOT NULL DEFAULT '+919876543210',
  enable_manual_payments boolean NOT NULL DEFAULT true,
  payment_instructions text DEFAULT 'Please pay using the UPI ID or scan the QR code. After payment, click "I''ve Paid on WhatsApp" to confirm.',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create pending_payments table (payment verification queue)
CREATE TABLE IF NOT EXISTS public.pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('resume', 'print', 'assignment')),
  reference_id text NOT NULL,
  amount numeric NOT NULL,
  tracking_id text,
  whatsapp_message_sent boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  verified_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz,
  payment_proof_url text
);

-- Create activity_log table (audit trail)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL,
  description text NOT NULL,
  user_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create platform_settings table (global config)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name text NOT NULL DEFAULT 'Ellio',
  tagline text NOT NULL DEFAULT 'Empowering Students, One Service at a Time.',
  currency text NOT NULL DEFAULT '₹',
  contact_email text,
  contact_phone text,
  support_whatsapp text,
  support_hours text DEFAULT '9:00 AM - 6:00 PM',
  welcome_message text DEFAULT 'Welcome to Ellio - Your Student Services Platform',
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#10B981',
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add payment tracking columns to existing tables
ALTER TABLE public.resume_purchases 
  ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_proof_url text;

ALTER TABLE public.print_jobs
  ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE public.assignments
  ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_reference text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON public.pending_payments(status);
CREATE INDEX IF NOT EXISTS idx_pending_payments_created ON public.pending_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON public.activity_log(activity_type);

-- Enable RLS on new tables
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_settings (admin only can view/edit)
CREATE POLICY "Anyone can view payment settings"
  ON public.payment_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update payment settings"
  ON public.payment_settings FOR ALL
  USING (true);

-- RLS Policies for pending_payments
CREATE POLICY "Anyone can create pending payments"
  ON public.pending_payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view pending payments"
  ON public.pending_payments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update pending payments"
  ON public.pending_payments FOR UPDATE
  USING (true);

-- RLS Policies for activity_log (admin only)
CREATE POLICY "Anyone can create activity logs"
  ON public.activity_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view activity logs"
  ON public.activity_log FOR SELECT
  USING (true);

-- RLS Policies for platform_settings
CREATE POLICY "Anyone can view platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update platform settings"
  ON public.platform_settings FOR ALL
  USING (true);

-- Insert default payment settings
INSERT INTO public.payment_settings (upi_id, whatsapp_number, enable_manual_payments)
VALUES ('dynamicedu@paytm', '+919876543210', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default platform settings
INSERT INTO public.platform_settings (platform_name, tagline, currency)
VALUES ('Ellio', 'Empowering Students, One Service at a Time.', '₹')
ON CONFLICT (id) DO NOTHING;

-- Create function to log activities automatically
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_log (activity_type, description, metadata)
  VALUES (
    TG_ARGV[0],
    TG_ARGV[1],
    jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP, 'record_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for payment verifications
CREATE TRIGGER log_payment_verification
  AFTER UPDATE ON public.pending_payments
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected'))
  EXECUTE FUNCTION public.log_activity('payment_verification', 'Payment status changed');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();