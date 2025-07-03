
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatusHistoryEntry {
  id: string;
  status: string;
  changed_at: string;
  changed_by: string | null;
  notes: string | null;
}

export const useStatusHistory = (printJobId: string) => {
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadStatusHistory = async () => {
    if (!printJobId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('status_history')
        .select('*')
        .eq('print_job_id', printJobId)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('Error loading status history:', error);
        toast({
          title: "Error",
          description: "Failed to load status history",
          variant: "destructive"
        });
        return;
      }

      setStatusHistory(data || []);
    } catch (error) {
      console.error('Error in loadStatusHistory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStatusEntry = async (status: string, notes?: string, changedBy?: string) => {
    try {
      const { error } = await supabase
        .from('status_history')
        .insert({
          print_job_id: printJobId,
          status,
          notes,
          changed_by: changedBy
        });

      if (error) {
        console.error('Error adding status entry:', error);
        return false;
      }

      // Reload history after adding
      await loadStatusHistory();
      return true;
    } catch (error) {
      console.error('Error in addStatusEntry:', error);
      return false;
    }
  };

  useEffect(() => {
    loadStatusHistory();
  }, [printJobId]);

  // Listen for real-time updates
  useEffect(() => {
    if (!printJobId) return;

    const channel = supabase
      .channel(`status-history-${printJobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'status_history',
          filter: `print_job_id=eq.${printJobId}`
        },
        () => {
          loadStatusHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [printJobId]);

  return {
    statusHistory,
    isLoading,
    loadStatusHistory,
    addStatusEntry
  };
};
