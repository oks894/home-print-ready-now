import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePendingRechargeCount = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('coin_recharge_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      setPendingCount(count || 0);
    } catch (err) {
      console.error('Error fetching pending recharge count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    // Set up realtime subscription
    const channel = supabase
      .channel('recharge-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coin_recharge_requests'
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pendingCount, isLoading, refresh: fetchPendingCount };
};
