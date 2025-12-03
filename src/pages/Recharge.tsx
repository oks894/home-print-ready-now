import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, Star, Upload, MessageCircle, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { openWhatsApp } from '@/utils/whatsapp';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  bonus_coins: number;
  price_inr: number;
  is_popular: boolean;
}

interface CoinSettings {
  upi_id: string;
  qr_code_url: string | null;
  whatsapp_number: string;
}

const Recharge = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [settings, setSettings] = useState<CoinSettings | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    fetchPackagesAndSettings();
  }, []);

  const fetchPackagesAndSettings = async () => {
    try {
      const [packagesRes, settingsRes] = await Promise.all([
        supabase.from('coin_packages').select('*').eq('is_active', true).order('display_order'),
        supabase.from('coin_settings').select('*').single()
      ]);

      if (packagesRes.data) setPackages(packagesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleSubmitRecharge = async () => {
    if (!selectedPackage || !user || !profile) {
      toast.error('Please select a package');
      return;
    }

    setIsSubmitting(true);
    try {
      let proofUrl = null;

      // Upload payment proof if provided
      if (paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assignment-files')
          .upload(fileName, paymentProof);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('assignment-files')
          .getPublicUrl(fileName);
        
        proofUrl = urlData.publicUrl;
      }

      // Create recharge request
      const { error } = await supabase
        .from('coin_recharge_requests')
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          amount_paid: selectedPackage.price_inr,
          coins_requested: selectedPackage.coins,
          bonus_coins: selectedPackage.bonus_coins,
          payment_proof_url: proofUrl
        });

      if (error) throw error;

      // Open WhatsApp with message
      const message = `Hi Ellio Team,\n\nI've made a coin recharge payment.\n\nName: ${profile.full_name}\nEmail: ${profile.email}\nPackage: ${selectedPackage.name}\nAmount: ₹${selectedPackage.price_inr}\nCoins: ${selectedPackage.coins + selectedPackage.bonus_coins}\n\nPlease verify my payment. Thank you!`;
      
      if (settings?.whatsapp_number) {
        openWhatsApp(settings.whatsapp_number, message);
      }

      toast.success('Recharge request submitted! We\'ll verify your payment soon.');
      setSelectedPackage(null);
      setPaymentProof(null);
    } catch (err) {
      console.error('Error submitting recharge:', err);
      toast.error('Failed to submit recharge request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Recharge Coins</h1>
          <p className="text-muted-foreground">Choose a package and top up your wallet</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Coins className="w-5 h-5 text-ellio-blue" />
            <span className="text-lg font-semibold">Current Balance: {profile?.coin_balance || 0} coins</span>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative ${
                selectedPackage?.id === pkg.id 
                  ? 'border-2 border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              } ${pkg.is_popular ? 'ring-2 ring-ellio-purple/30' : ''}`}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.is_popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-ellio-purple">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-6 h-6 text-ellio-blue" />
                  <span className="text-3xl font-bold">{pkg.coins}</span>
                </div>
                {pkg.bonus_coins > 0 && (
                  <Badge variant="secondary" className="bg-ellio-green/10 text-ellio-green mb-3">
                    +{pkg.bonus_coins} Bonus
                  </Badge>
                )}
                <p className="text-2xl font-bold text-primary mt-2">₹{pkg.price_inr}</p>
                {selectedPackage?.id === pkg.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Section */}
        {selectedPackage && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold">₹{selectedPackage.price_inr}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <div className="flex items-center gap-2">
                      <Input value={settings?.upi_id || ''} readOnly />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(settings?.upi_id || '');
                          toast.success('UPI ID copied!');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {settings?.qr_code_url && (
                    <div className="flex justify-center">
                      <img 
                        src={settings.qr_code_url} 
                        alt="Payment QR" 
                        className="w-48 h-48 rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-2">
                <Label>Upload Payment Screenshot (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    {paymentProof ? (
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-ellio-green" />
                        <span>{paymentProof.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmitRecharge}
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-ellio-green to-ellio-teal hover:opacity-90"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit & Notify on WhatsApp'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After payment, we'll verify and credit coins within 15 minutes during business hours.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recharge;
