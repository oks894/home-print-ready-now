import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Check, X, Coins, Clock, Loader2, ExternalLink, Image } from 'lucide-react';
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

const MobileCoinManagement = () => {
  const [pendingRequests, setPendingRequests] = useState<RechargeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null);

  useEffect(() => {
    fetchRequests();

    // Set up realtime subscription
    const channel = supabase
      .channel('coin-recharge-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'coin_recharge_requests' },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coin_recharge_requests')
        .select('*, user_profiles(email, full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingRequests(data as any || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (request: RechargeRequest) => {
    setProcessingId(request.id);
    try {
      const totalCoins = request.coins_requested + request.bonus_coins;

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('coin_balance, total_coins_earned')
        .eq('id', request.user_id)
        .single();

      if (profileError) throw profileError;

      const newBalance = (profileData.coin_balance || 0) + totalCoins;

      await supabase
        .from('user_profiles')
        .update({
          coin_balance: newBalance,
          total_coins_earned: (profileData.total_coins_earned || 0) + totalCoins
        })
        .eq('id', request.user_id);

      await supabase.from('coin_transactions').insert({
        user_id: request.user_id,
        amount: totalCoins,
        transaction_type: 'recharge',
        description: `Recharge: ${request.coins_requested} + ${request.bonus_coins} bonus`,
        reference_type: 'recharge_request',
        reference_id: request.id,
        balance_after: newBalance
      });

      await supabase
        .from('coin_recharge_requests')
        .update({ status: 'approved', verified_at: new Date().toISOString() })
        .eq('id', request.id);

      toast.success('Recharge approved!');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to approve');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: RechargeRequest) => {
    setProcessingId(request.id);
    try {
      await supabase
        .from('coin_recharge_requests')
        .update({ 
          status: 'rejected', 
          rejection_reason: 'Payment not verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', request.id);

      toast.success('Request rejected');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject');
    } finally {
      setProcessingId(null);
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
    <div className="space-y-4 px-4 pb-24">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ellio-blue/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-ellio-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold">
                  ₹{pendingRequests.reduce((sum, r) => sum + r.amount_paid, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Coins className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No pending recharge requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.user_profiles?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{request.user_profiles?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">₹{request.amount_paid}</Badge>
                      <Badge variant="secondary">
                        {request.coins_requested}
                        {request.bonus_coins > 0 && `+${request.bonus_coins}`} coins
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      className="bg-ellio-green hover:bg-ellio-green/90 h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request);
                      }}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(request);
                      }}
                      disabled={processingId === request.id}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Details Sheet */}
      <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Recharge Request Details</SheetTitle>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              {/* User Info */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-semibold text-lg">{selectedRequest.user_profiles?.full_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user_profiles?.email}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Requested: {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              {/* Amount Details */}
              <Card className="bg-gradient-to-r from-ellio-blue to-ellio-purple text-white">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/80 text-sm">Amount Paid</p>
                      <p className="text-2xl font-bold">₹{selectedRequest.amount_paid}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Coins to Credit</p>
                      <p className="text-2xl font-bold">
                        {selectedRequest.coins_requested + selectedRequest.bonus_coins}
                      </p>
                    </div>
                  </div>
                  {selectedRequest.bonus_coins > 0 && (
                    <p className="text-sm text-white/80 mt-2">
                      ({selectedRequest.coins_requested} + {selectedRequest.bonus_coins} bonus)
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Proof */}
              {selectedRequest.payment_proof_url ? (
                <div>
                  <p className="text-sm font-semibold mb-2">Payment Proof</p>
                  <a 
                    href={selectedRequest.payment_proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="overflow-hidden">
                      <img 
                        src={selectedRequest.payment_proof_url} 
                        alt="Payment proof" 
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-3 flex items-center justify-center gap-2 text-primary">
                        <ExternalLink className="w-4 h-4" />
                        View Full Image
                      </CardContent>
                    </Card>
                  </a>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No payment proof uploaded
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="destructive"
                  className="h-12"
                  onClick={() => handleReject(selectedRequest)}
                  disabled={processingId === selectedRequest.id}
                >
                  <X className="w-5 h-5 mr-2" />
                  Reject
                </Button>
                <Button
                  className="h-12 bg-ellio-green hover:bg-ellio-green/90"
                  onClick={() => handleApprove(selectedRequest)}
                  disabled={processingId === selectedRequest.id}
                >
                  {processingId === selectedRequest.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileCoinManagement;
