-- Create legal_pages table for Terms of Service and Privacy Policy
CREATE TABLE public.legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view legal pages
CREATE POLICY "Anyone can view legal pages"
ON public.legal_pages
FOR SELECT
USING (true);

-- Allow anyone to manage legal pages (for admin panel)
CREATE POLICY "Anyone can manage legal pages"
ON public.legal_pages
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default pages
INSERT INTO public.legal_pages (slug, title, content) VALUES
('terms', 'Terms of Service', '# Terms of Service

## Welcome to Ellio

Last updated: December 2025

By using our services, you agree to these terms.

### 1. Service Description
Ellio provides student services including printing, notes sharing, assignment help, and resume building.

### 2. User Accounts
- You must provide accurate information when creating an account
- You are responsible for maintaining the security of your account
- One account per person

### 3. Coin System
- Coins are the virtual currency used on Ellio
- Coins have no cash value and cannot be refunded
- Welcome bonus coins are provided on signup

### 4. Assignment Help
- Solutions are provided by verified solvers
- We do not guarantee grades or outcomes
- Academic integrity is your responsibility

### 5. Printing Services
- We are not responsible for content printed
- Orders are processed during business hours
- Refunds are provided for service failures only

### 6. Intellectual Property
- Notes uploaded remain property of uploaders
- Do not upload copyrighted material without permission

### 7. Termination
We may suspend or terminate accounts for violations of these terms.

### 8. Contact
For questions, contact us via WhatsApp or email.'),
('privacy', 'Privacy Policy', '# Privacy Policy

## Your Privacy Matters

Last updated: December 2025

### 1. Information We Collect
- **Account Information**: Name, email, phone number
- **Usage Data**: Services used, orders placed
- **Payment Information**: Transaction records (we do not store payment details)

### 2. How We Use Information
- To provide and improve our services
- To process transactions
- To communicate with you about orders
- To prevent fraud and abuse

### 3. Information Sharing
We do not sell your personal information. We may share data:
- With service providers who assist our operations
- When required by law
- To protect our rights and safety

### 4. Data Security
We implement industry-standard security measures to protect your data.

### 5. Your Rights
- Access your personal data
- Request correction of inaccurate data
- Request deletion of your account
- Opt out of marketing communications

### 6. Cookies
We use cookies to improve your experience and remember preferences.

### 7. Changes to This Policy
We may update this policy. Changes will be posted on this page.

### 8. Contact
For privacy concerns, contact us via WhatsApp or email.');