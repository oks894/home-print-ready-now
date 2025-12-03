import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Check, X, Coins, Users, Clock, Settings, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RechargeRequest {
  id: string;
  user_id: string;
  amount_paid: number;
  coins_requested: number;
  bonus_coins: number;
  status: string;
  created_at: string;
  payment_proof_url: string | null;
  user_profiles: {
    email: string;
    full_name: string | null;
  } | null;
}

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  bonus_coins: number;
  price_inr: number;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
}

interface CoinSettings {
  id: string;
  welcome_bonus: number;
  referral_bonus: number;
  min_recharge_amount: number;
  upi_id: string;
  qr_code_url: string | null;
  whatsapp_number: string;
  is_recharge_enabled: boolean;
}

const CoinManagement = () => {
  const [pendingRequests, setPendingRequests] = useState<RechargeRequest[]>([]);
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [settings, setSettings] = useState<CoinSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [requestsRes, packagesRes, settingsRes] = await Promise.all([
        supabase
          .from('coin_recharge_requests')
          .select('*, user_profiles(email, full_name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase.from('coin_packages').select('*').order('display_order'),
        supabase.from('coin_settings').select('*').single()
      ]);

      if (requestsRes.data) setPendingRequests(requestsRes.data as any);
      if (packagesRes.data) setPackages(packagesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRecharge = async (request: RechargeRequest) => {
    setProcessingId(request.id);
    try {
      const totalCoins = request.coins_requested + request.bonus_coins;

      // Get current user balance
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('coin_balance, total_coins_earned')
        .eq('id', request.user_id)
        .single();

      if (profileError) throw profileError;

      const newBalance = (profileData.coin_balance || 0) + totalCoins;

      // Update user balance
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          coin_balance: newBalance,
          total_coins_earned: (profileData.total_coins_earned || 0) + totalCoins
        })
        .eq('id', request.user_id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('coin_transactions').insert({
        user_id: request.user_id,
        amount: totalCoins,
        transaction_type: 'recharge',
        description: `Recharge: ${request.coins_requested} coins + ${request.bonus_coins} bonus`,
        reference_type: 'recharge_request',
        reference_id: request.id,
        balance_after: newBalance
      });

      // Update request status
      await supabase
        .from('coin_recharge_requests')
        .update({ status: 'approved', verified_at: new Date().toISOString() })
        .eq('id', request.id);

      toast.success('Recharge approved and coins credited!');
      fetchData();
    } catch (err) {
      console.error('Error approving recharge:', err);
      toast.error('Failed to approve recharge');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRecharge = async (request: RechargeRequest, reason: string) => {
    setProcessingId(request.id);
    try {
      await supabase
        .from('coin_recharge_requests')
        .update({ 
          status: 'rejected', 
          rejection_reason: reason,
          verified_at: new Date().toISOString()
        })
        .eq('id', request.id);

      toast.success('Recharge request rejected');
      fetchData();
    } catch (err) {
      console.error('Error rejecting recharge:', err);
      toast.error('Failed to reject recharge');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      const { error } = await supabase
        .from('coin_settings')
        .update({
          welcome_bonus: settings.welcome_bonus,
          referral_bonus: settings.referral_bonus,
          min_recharge_amount: settings.min_recharge_amount,
          upi_id: settings.upi_id,
          whatsapp_number: settings.whatsapp_number,
          is_recharge_enabled: settings.is_recharge_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    }
  };

  const handleSavePackage = async (pkg: CoinPackage) => {
    try {
      const { error } = await supabase
        .from('coin_packages')
        .update({
          name: pkg.name,
          coins: pkg.coins,
          bonus_coins: pkg.bonus_coins,
          price_inr: pkg.price_inr,
          is_popular: pkg.is_popular,
          is_active: pkg.is_active,
          display_order: pkg.display_order
        })
        .eq('id', pkg.id);

      if (error) throw error;
      toast.success('Package updated');
    } catch (err) {
      console.error('Error updating package:', err);
      toast.error('Failed to update package');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ellio-blue/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-ellio-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Packages</p>
                <p className="text-2xl font-bold">{packages.filter(p => p.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ellio-green/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-ellio-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome Bonus</p>
                <p className="text-2xl font-bold">{settings?.welcome_bonus || 50} coins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Recharges</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Recharge Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Coins</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.user_profiles?.full_name || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{request.user_profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>₹{request.amount_paid}</TableCell>
                        <TableCell>
                          {request.coins_requested}
                          {request.bonus_coins > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              +{request.bonus_coins}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.payment_proof_url ? (
                            <a 
                              href={request.payment_proof_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRecharge(request)}
                              disabled={processingId === request.id}
                              className="bg-ellio-green hover:bg-ellio-green/90"
                            >
                              {processingId === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectRecharge(request, 'Payment not verified')}
                              disabled={processingId === request.id}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Coin Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={pkg.name}
                          onChange={(e) => setPackages(packages.map(p => 
                            p.id === pkg.id ? { ...p, name: e.target.value } : p
                          ))}
                          className="font-semibold text-lg"
                        />
                        <Switch
                          checked={pkg.is_active}
                          onCheckedChange={(checked) => setPackages(packages.map(p => 
                            p.id === pkg.id ? { ...p, is_active: checked } : p
                          ))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Coins</Label>
                          <Input
                            type="number"
                            value={pkg.coins}
                            onChange={(e) => setPackages(packages.map(p => 
                              p.id === pkg.id ? { ...p, coins: parseInt(e.target.value) || 0 } : p
                            ))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Bonus</Label>
                          <Input
                            type="number"
                            value={pkg.bonus_coins}
                            onChange={(e) => setPackages(packages.map(p => 
                              p.id === pkg.id ? { ...p, bonus_coins: parseInt(e.target.value) || 0 } : p
                            ))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Price (₹)</Label>
                          <Input
                            type="number"
                            value={pkg.price_inr}
                            onChange={(e) => setPackages(packages.map(p => 
                              p.id === pkg.id ? { ...p, price_inr: parseFloat(e.target.value) || 0 } : p
                            ))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Order</Label>
                          <Input
                            type="number"
                            value={pkg.display_order}
                            onChange={(e) => setPackages(packages.map(p => 
                              p.id === pkg.id ? { ...p, display_order: parseInt(e.target.value) || 0 } : p
                            ))}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Switch
                            checked={pkg.is_popular}
                            onCheckedChange={(checked) => setPackages(packages.map(p => 
                              p.id === pkg.id ? { ...p, is_popular: checked } : p
                            ))}
                          />
                          Popular
                        </label>
                        <Button size="sm" onClick={() => handleSavePackage(pkg)}>
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Coin System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings && (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Welcome Bonus (coins)</Label>
                      <Input
                        type="number"
                        value={settings.welcome_bonus}
                        onChange={(e) => setSettings({ ...settings, welcome_bonus: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Referral Bonus (coins)</Label>
                      <Input
                        type="number"
                        value={settings.referral_bonus}
                        onChange={(e) => setSettings({ ...settings, referral_bonus: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Min Recharge (₹)</Label>
                      <Input
                        type="number"
                        value={settings.min_recharge_amount}
                        onChange={(e) => setSettings({ ...settings, min_recharge_amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>UPI ID</Label>
                      <Input
                        value={settings.upi_id}
                        onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>WhatsApp Number</Label>
                      <Input
                        value={settings.whatsapp_number}
                        onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={settings.is_recharge_enabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, is_recharge_enabled: checked })}
                      />
                      Enable Recharge
                    </label>
                  </div>
                  <Button onClick={handleSaveSettings} className="mt-4">
                    Save Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoinManagement;
