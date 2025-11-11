import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Loader2 } from 'lucide-react';

export const PaymentSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Initialize default settings
        setSettings({
          upi_id: 'dynamicedu@paytm',
          whatsapp_number: '+919876543210',
          enable_manual_payments: true,
          payment_instructions: 'Please pay using the UPI ID or scan the QR code. After payment, click "I\'ve Paid on WhatsApp" to confirm.',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qr-${Date.now()}.${fileExt}`;
      const filePath = `payment-qr/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('print-files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('print-files')
        .getPublicUrl(filePath);

      setSettings({ ...settings, qr_code_url: publicUrl });
      
      toast({
        title: 'Success',
        description: 'QR code uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload QR code',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Upsert settings
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          id: settings?.id,
          upi_id: settings.upi_id,
          whatsapp_number: settings.whatsapp_number,
          qr_code_url: settings.qr_code_url,
          enable_manual_payments: settings.enable_manual_payments,
          payment_instructions: settings.payment_instructions,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment settings saved successfully',
      });

      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Configuration</CardTitle>
          <CardDescription>
            Manage your manual payment settings. These details will be shown to users during checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Manual Payments */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Manual Payments</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to make manual WhatsApp payments
              </p>
            </div>
            <Switch
              checked={settings?.enable_manual_payments}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_manual_payments: checked })
              }
            />
          </div>

          {/* UPI ID */}
          <div className="space-y-2">
            <Label htmlFor="upi_id">UPI ID</Label>
            <Input
              id="upi_id"
              value={settings?.upi_id || ''}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              placeholder="yourname@paytm"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number (with country code)</Label>
            <Input
              id="whatsapp"
              value={settings?.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="+919876543210"
            />
          </div>

          {/* QR Code Upload */}
          <div className="space-y-2">
            <Label>Payment QR Code</Label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setQrFile(file);
                      handleQrUpload(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a QR code image for easy payment
                </p>
              </div>
              {settings?.qr_code_url && (
                <div className="w-24 h-24 border rounded overflow-hidden">
                  <img
                    src={settings.qr_code_url}
                    alt="QR Code"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Payment Instructions</Label>
            <Textarea
              id="instructions"
              value={settings?.payment_instructions || ''}
              onChange={(e) =>
                setSettings({ ...settings, payment_instructions: e.target.value })
              }
              placeholder="Enter instructions for users"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              These instructions will be shown to users when making a payment
            </p>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Preview</CardTitle>
          <CardDescription>This is what users will see during payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div>
              <p className="text-sm font-medium">UPI ID</p>
              <p className="font-mono text-lg">{settings?.upi_id}</p>
            </div>

            {settings?.qr_code_url && (
              <div>
                <p className="text-sm font-medium mb-2">Scan QR Code</p>
                <div className="bg-white p-4 rounded inline-block">
                  <img
                    src={settings.qr_code_url}
                    alt="QR Code Preview"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-1">Instructions</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {settings?.payment_instructions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
