import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CoinTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  reference_type: string | null;
  reference_id: string | null;
  balance_after: number;
  created_at: string;
}

export const useCoinBalance = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const coinBalance = profile?.coin_balance ?? 0;

  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deductCoins = async (amount: number, description: string, referenceType?: string, referenceId?: string) => {
    if (!user || !profile) {
      toast.error('Please sign in to continue');
      return { success: false, error: 'Not authenticated' };
    }

    if (profile.coin_balance < amount) {
      toast.error('Insufficient coin balance');
      return { success: false, error: 'Insufficient balance' };
    }

    try {
      const newBalance = profile.coin_balance - amount;

      // Update balance
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          coin_balance: newBalance,
          total_coins_spent: profile.total_coins_spent + amount
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Log transaction
      const { error: txError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          transaction_type: 'purchase',
          description,
          reference_type: referenceType,
          reference_id: referenceId,
          balance_after: newBalance
        });

      if (txError) throw txError;

      await refreshProfile();
      return { success: true, newBalance };
    } catch (err) {
      console.error('Error deducting coins:', err);
      toast.error('Failed to process payment');
      return { success: false, error: 'Transaction failed' };
    }
  };

  const hasEnoughCoins = (amount: number) => {
    return coinBalance >= amount;
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return {
    coinBalance,
    transactions,
    isLoading,
    deductCoins,
    hasEnoughCoins,
    fetchTransactions,
    refreshProfile
  };
};
