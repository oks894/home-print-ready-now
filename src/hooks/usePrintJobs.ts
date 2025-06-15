
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrintJob } from '@/types/printJob';

export const usePrintJobs = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const { toast } = useToast();

  const loadPrintJobs = useCallback(async () => {
    console.log('usePrintJobs: Loading print jobs...');
    try {
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100); // Limit to improve performance

      if (error) {
        console.error('usePrintJobs: Error loading print jobs:', error);
        throw new Error(`Failed to load print jobs: ${error.message}`);
      }

      console.log('usePrintJobs: Raw print jobs data:', data?.length || 0, 'items');

      const typedJobs: PrintJob[] = (data || []).map(job => {
        return {
          id: job.id,
          tracking_id: job.tracking_id || `TID-${job.id.slice(0, 8)}`,
          name: job.name || '',
          phone: job.phone || '',
          institute: job.institute || '',
          time_slot: job.time_slot || '',
          notes: job.notes || '',
          files: Array.isArray(job.files) ? job.files as Array<{ name: string; size: number; type: string; data?: string }> : [],
          timestamp: job.timestamp,
          status: (job.status as PrintJob['status']) || 'pending',
          selected_services: job.selected_services as Array<{ id: string; name: string; quantity: number; price: number }> || [],
          total_amount: job.total_amount || 0,
          delivery_requested: job.delivery_requested || false
        };
      });

      console.log('usePrintJobs: Processed print jobs:', typedJobs.length, 'items');
      setPrintJobs(typedJobs);
    } catch (error) {
      console.error('usePrintJobs: Error in loadPrintJobs:', error);
      // Don't re-throw to prevent infinite loading
      setPrintJobs([]);
    }
  }, []);

  const updateJobStatus = async (jobId: string, status: PrintJob['status'], retryFn: (fn: () => Promise<void>) => Promise<void>) => {
    const originalJobs = [...printJobs];
    setPrintJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));

    try {
      await retryFn(async () => {
        const { error } = await supabase
          .from('print_jobs')
          .update({ status })
          .eq('id', jobId);

        if (error) {
          throw error;
        }
      });

      toast({
        title: "Status updated",
        description: `Job status changed to ${status.replace('_', ' ')}`,
      });

      return true;
    } catch (error) {
      setPrintJobs(originalJobs);
      
      console.error('usePrintJobs: Error updating job status:', error);
      toast({
        title: "Update failed",
        description: "Could not update job status. Please try again.",
        variant: "destructive"
      });

      return false;
    }
  };

  const deleteJob = async (jobId: string, retryFn: (fn: () => Promise<void>) => Promise<void>) => {
    const originalJobs = [...printJobs];
    setPrintJobs(prev => prev.filter(job => job.id !== jobId));

    try {
      await retryFn(async () => {
        const { error } = await supabase
          .from('print_jobs')
          .delete()
          .eq('id', jobId);

        if (error) {
          throw error;
        }
      });

      toast({
        title: "Job deleted",
        description: "Print job has been removed",
      });

      return true;
    } catch (error) {
      setPrintJobs(originalJobs);
      
      console.error('usePrintJobs: Error deleting job:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete job. Please try again.",
        variant: "destructive"
      });

      return false;
    }
  };

  return {
    printJobs,
    setPrintJobs,
    loadPrintJobs,
    updateJobStatus,
    deleteJob
  };
};
