-- Create app_role enum if not exists (already exists from user_roles)
-- DO NOTHING - enum exists

-- Create user_profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  coin_balance integer NOT NULL DEFAULT 0,
  total_coins_earned integer NOT NULL DEFAULT 0,
  total_coins_spent integer NOT NULL DEFAULT 0,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES public.user_profiles(id),
  is_suspended boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create coin_transactions table for audit trail
CREATE TABLE public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('welcome_bonus', 'recharge', 'purchase', 'refund', 'referral_bonus', 'admin_adjustment')),
  description text NOT NULL,
  reference_type text,
  reference_id uuid,
  balance_after integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create coin_packages table for recharge options
CREATE TABLE public.coin_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  coins integer NOT NULL,
  bonus_coins integer NOT NULL DEFAULT 0,
  price_inr numeric NOT NULL,
  is_popular boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create coin_recharge_requests table
CREATE TABLE public.coin_recharge_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.coin_packages(id),
  amount_paid numeric NOT NULL,
  coins_requested integer NOT NULL,
  bonus_coins integer NOT NULL DEFAULT 0,
  payment_proof_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  verified_by text,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create coin_settings table
CREATE TABLE public.coin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  welcome_bonus integer NOT NULL DEFAULT 50,
  referral_bonus integer NOT NULL DEFAULT 10,
  min_recharge_amount numeric NOT NULL DEFAULT 10,
  upi_id text NOT NULL DEFAULT 'dynamicedu@paytm',
  qr_code_url text,
  whatsapp_number text NOT NULL DEFAULT '+919876543210',
  is_recharge_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_recharge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

-- RLS Policies for coin_transactions
CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.coin_transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for coin_packages
CREATE POLICY "Anyone can view active packages" ON public.coin_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.coin_packages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coin_recharge_requests
CREATE POLICY "Users can view their own requests" ON public.coin_recharge_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create recharge requests" ON public.coin_recharge_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" ON public.coin_recharge_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update requests" ON public.coin_recharge_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coin_settings
CREATE POLICY "Anyone can view coin settings" ON public.coin_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage coin settings" ON public.coin_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists_check boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE referral_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN code;
END;
$$;

-- Function to handle new user signup with welcome bonus
CREATE OR REPLACE FUNCTION public.handle_new_user_with_coins()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  welcome_coins integer;
  new_referral_code text;
BEGIN
  -- Get welcome bonus from settings
  SELECT COALESCE(welcome_bonus, 50) INTO welcome_coins FROM public.coin_settings LIMIT 1;
  
  -- Generate unique referral code
  new_referral_code := public.generate_referral_code();
  
  -- Create user profile with welcome bonus
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, coin_balance, total_coins_earned, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    welcome_coins,
    welcome_coins,
    new_referral_code
  );
  
  -- Log the welcome bonus transaction
  INSERT INTO public.coin_transactions (user_id, amount, transaction_type, description, balance_after)
  VALUES (NEW.id, welcome_coins, 'welcome_bonus', 'Welcome bonus on signup', welcome_coins);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_coins ON auth.users;
CREATE TRIGGER on_auth_user_created_coins
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_coins();

-- Insert default coin settings
INSERT INTO public.coin_settings (welcome_bonus, referral_bonus, min_recharge_amount, upi_id, whatsapp_number)
VALUES (50, 10, 10, 'dynamicedu@paytm', '+919876543210')
ON CONFLICT DO NOTHING;

-- Insert default coin packages
INSERT INTO public.coin_packages (name, coins, bonus_coins, price_inr, is_popular, display_order) VALUES
  ('Starter', 50, 0, 50, false, 1),
  ('Popular', 100, 10, 100, true, 2),
  ('Value', 200, 30, 200, false, 3),
  ('Premium', 500, 100, 500, false, 4)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON public.coin_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_recharge_requests_user_id ON public.coin_recharge_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_recharge_requests_status ON public.coin_recharge_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON public.user_profiles(referral_code);