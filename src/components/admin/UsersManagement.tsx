import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Users, Coins, Plus, Minus, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  coin_balance: number;
  total_coins_earned: number;
  total_coins_spent: number;
  referral_code: string | null;
  is_suspended: boolean;
  created_at: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adjustmentUser, setAdjustmentUser] = useState<UserProfile | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.email.toLowerCase().includes(query) ||
        u.full_name?.toLowerCase().includes(query) ||
        u.referral_code?.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustCoins = async () => {
    if (!adjustmentUser || adjustmentAmount === 0) {
      toast.error('Please enter an amount');
      return;
    }

    setIsProcessing(true);
    try {
      const newBalance = adjustmentUser.coin_balance + adjustmentAmount;
      
      if (newBalance < 0) {
        toast.error('Resulting balance cannot be negative');
        return;
      }

      // Update balance
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          coin_balance: newBalance,
          total_coins_earned: adjustmentAmount > 0 
            ? adjustmentUser.total_coins_earned + adjustmentAmount 
            : adjustmentUser.total_coins_earned
        })
        .eq('id', adjustmentUser.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('coin_transactions').insert({
        user_id: adjustmentUser.id,
        amount: adjustmentAmount,
        transaction_type: 'admin_adjustment',
        description: adjustmentReason || 'Admin adjustment',
        balance_after: newBalance
      });

      toast.success(`Adjusted ${adjustmentAmount > 0 ? '+' : ''}${adjustmentAmount} coins for ${adjustmentUser.full_name || adjustmentUser.email}`);
      setAdjustmentUser(null);
      setAdjustmentAmount(0);
      setAdjustmentReason('');
      fetchUsers();
    } catch (err) {
      console.error('Error adjusting coins:', err);
      toast.error('Failed to adjust coins');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSuspension = async (user: UserProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_suspended: !user.is_suspended })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(user.is_suspended ? 'User unsuspended' : 'User suspended');
      fetchUsers();
    } catch (err) {
      console.error('Error toggling suspension:', err);
      toast.error('Failed to update user');
    }
  };

  const totalUsers = users.length;
  const totalCoinsInCirculation = users.reduce((sum, u) => sum + u.coin_balance, 0);
  const suspendedUsers = users.filter(u => u.is_suspended).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ellio-blue/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-ellio-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ellio-green/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-ellio-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coins in Circulation</p>
                <p className="text-2xl font-bold">{totalCoinsInCirculation.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{suspendedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or referral code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Earned/Spent</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ellio-blue to-ellio-purple flex items-center justify-center text-white text-sm font-semibold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.full_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-ellio-blue" />
                        <span className="font-semibold">{user.coin_balance}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-ellio-green">+{user.total_coins_earned}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-red-500">-{user.total_coins_spent}</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        {user.referral_code || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      {user.is_suspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-ellio-green/10 text-ellio-green">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setAdjustmentUser(user)}
                            >
                              <Coins className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Coins for {adjustmentUser?.full_name || adjustmentUser?.email}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label>Current Balance</Label>
                                <p className="text-2xl font-bold">{adjustmentUser?.coin_balance} coins</p>
                              </div>
                              <div>
                                <Label>Adjustment Amount</Label>
                                <div className="flex gap-2 mt-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentAmount(Math.abs(adjustmentAmount) * -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={adjustmentAmount}
                                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                    className="text-center"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentAmount(Math.abs(adjustmentAmount))}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label>Reason</Label>
                                <Input
                                  placeholder="Admin adjustment reason..."
                                  value={adjustmentReason}
                                  onChange={(e) => setAdjustmentReason(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={handleAdjustCoins} 
                                disabled={isProcessing || adjustmentAmount === 0}
                                className="w-full"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Apply Adjustment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant={user.is_suspended ? 'default' : 'destructive'}
                          onClick={() => handleToggleSuspension(user)}
                        >
                          {user.is_suspended ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
