import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2, Search, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';

export const PendingPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('pending-payments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_payments'
        },
        () => {
          loadPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (payment: any) => {
    try {
      setIsProcessing(true);

      // Update pending payment status
      const { error: updateError } = await supabase
        .from('pending_payments')
        .update({
          status: 'approved',
          verified_at: new Date().toISOString(),
          verified_by: 'admin'
        })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      // Update the respective service table
      if (payment.service_type === 'resume') {
        await supabase
          .from('resume_purchases')
          .update({ payment_verified: true, verified_at: new Date().toISOString() })
          .eq('id', payment.reference_id);
      } else if (payment.service_type === 'print') {
        await supabase
          .from('print_jobs')
          .update({ payment_verified: true, payment_reference: payment.id })
          .eq('id', payment.reference_id);
      } else if (payment.service_type === 'assignment') {
        await supabase
          .from('assignments')
          .update({ 
            payment_verified: true, 
            payment_reference: payment.id,
            payment_status: 'paid'
          })
          .eq('id', payment.reference_id);
      }

      // Log activity
      await supabase.from('activity_log').insert({
        activity_type: 'payment_approved',
        description: `Payment approved for ${payment.service_type} - ₹${payment.amount}`,
        user_email: payment.user_email,
        metadata: { payment_id: payment.id, reference_id: payment.reference_id }
      });

      toast({
        title: 'Payment Approved',
        description: `Payment of ₹${payment.amount} has been verified successfully`,
      });

      await loadPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      const { error } = await supabase
        .from('pending_payments')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          verified_at: new Date().toISOString(),
          verified_by: 'admin'
        })
        .eq('id', selectedPayment.id);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_log').insert({
        activity_type: 'payment_rejected',
        description: `Payment rejected for ${selectedPayment.service_type} - ${rejectionReason}`,
        user_email: selectedPayment.user_email,
        metadata: { payment_id: selectedPayment.id }
      });

      toast({
        title: 'Payment Rejected',
        description: 'User will be notified of the rejection',
      });

      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedPayment(null);
      await loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsApp = (payment: any) => {
    const message = `Hello ${payment.user_name}, regarding your payment of ₹${payment.amount} for ${payment.service_type}...`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${payment.user_email.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingPayments = filteredPayments.filter((p) => p.status === 'pending');
  const otherPayments = filteredPayments.filter((p) => p.status !== 'pending');

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {payments.filter((p) => p.status === 'rejected').length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or tracking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pending Payments Table */}
      {pendingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Verification ({pendingPayments.length})</CardTitle>
            <CardDescription>These payments need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {format(new Date(payment.created_at), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user_name}</p>
                        <p className="text-xs text-muted-foreground">{payment.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.service_type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {payment.tracking_id || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(payment)}
                          disabled={isProcessing}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsRejectDialogOpen(true);
                          }}
                          disabled={isProcessing}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {otherPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherPayments.slice(0, 10).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {format(new Date(payment.verified_at || payment.created_at), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user_name}</p>
                        <p className="text-xs text-muted-foreground">{payment.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.service_type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === 'approved' ? 'default' : 'destructive'}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No payments found</p>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment. The user will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
