import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Search, Users, Coins, Plus, Minus, Ban, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
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

const MobileUsersManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
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
        u.full_name?.toLowerCase().includes(query)
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
    if (!selectedUser || adjustmentAmount === 0) {
      toast.error('Please enter an amount');
      return;
    }

    setIsProcessing(true);
    try {
      const newBalance = selectedUser.coin_balance + adjustmentAmount;
      
      if (newBalance < 0) {
        toast.error('Balance cannot be negative');
        return;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          coin_balance: newBalance,
          total_coins_earned: adjustmentAmount > 0 
            ? selectedUser.total_coins_earned + adjustmentAmount 
            : selectedUser.total_coins_earned
        })
        .eq('id', selectedUser.id);

      if (updateError) throw updateError;

      await supabase.from('coin_transactions').insert({
        user_id: selectedUser.id,
        amount: adjustmentAmount,
        transaction_type: 'admin_adjustment',
        description: adjustmentReason || 'Admin adjustment',
        balance_after: newBalance
      });

      toast.success(`${adjustmentAmount > 0 ? '+' : ''}${adjustmentAmount} coins applied`);
      setSelectedUser(null);
      setAdjustmentAmount(0);
      setAdjustmentReason('');
      fetchUsers();
    } catch (err) {
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
      toast.error('Failed to update user');
    }
  };

  const totalUsers = users.length;
  const totalCoins = users.reduce((sum, u) => sum + u.coin_balance, 0);

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
              <div className="w-10 h-10 rounded-xl bg-ellio-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-ellio-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ellio-green/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-ellio-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Coins</p>
                <p className="text-xl font-bold">{totalCoins.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* User Cards */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Sheet key={user.id}>
            <SheetTrigger asChild>
              <Card className="cursor-pointer active:scale-[0.98] transition-transform">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ellio-blue to-ellio-purple flex items-center justify-center text-white font-semibold">
                          {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.full_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Coins className="w-3 h-3 text-ellio-blue" />
                            <span className="text-sm font-semibold">{user.coin_balance}</span>
                          </div>
                          {user.is_suspended && (
                            <Badge variant="destructive" className="text-xs">Suspended</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
              <SheetHeader className="text-left">
                <SheetTitle>User Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ellio-blue to-ellio-purple flex items-center justify-center text-white text-xl font-semibold">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{user.full_name || 'No Name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Balance Card */}
                <Card className="bg-gradient-to-r from-ellio-blue to-ellio-purple text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Current Balance</p>
                        <p className="text-3xl font-bold">{user.coin_balance}</p>
                      </div>
                      <Coins className="w-10 h-10 text-white/50" />
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-white/80">Earned: +{user.total_coins_earned}</span>
                      <span className="text-white/80">Spent: -{user.total_coins_spent}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Adjust Coins */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Adjust Coins</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-12 w-12"
                      onClick={() => setAdjustmentAmount(prev => prev - 10)}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <Input
                      type="number"
                      value={adjustmentAmount}
                      onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                      className="text-center text-xl h-12 font-semibold"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-12 w-12"
                      onClick={() => setAdjustmentAmount(prev => prev + 10)}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Reason for adjustment..."
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="h-12"
                  />
                  <Button 
                    onClick={() => {
                      setSelectedUser(user);
                      handleAdjustCoins();
                    }}
                    disabled={isProcessing || adjustmentAmount === 0}
                    className="w-full h-12 bg-ellio-green hover:bg-ellio-green/90"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Adjustment'}
                  </Button>
                </div>

                {/* Suspend Button */}
                <Button
                  variant={user.is_suspended ? 'default' : 'destructive'}
                  className="w-full h-12"
                  onClick={() => handleToggleSuspension(user)}
                >
                  {user.is_suspended ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Unsuspend User
                    </>
                  ) : (
                    <>
                      <Ban className="w-5 h-5 mr-2" />
                      Suspend User
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
};

export default MobileUsersManagement;
