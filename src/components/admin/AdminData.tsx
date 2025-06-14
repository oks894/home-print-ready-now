
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrintJob {
  id: string;
  tracking_id?: string;
  name: string;
  phone: string;
  institute: string;
  time_slot: string;
  notes: string;
  files: Array<{ name: string; size: number; type: string; data?: string }>;
  timestamp: string;
  status: 'pending' | 'printing' | 'ready' | 'completed';
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  service: string;
  comments: string;
  rating: number;
  timestamp: string;
}

interface AdminDataState {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  lastFetchTime: number;
}

export const useAdminData = () => {
  const [state, setState] = useState<AdminDataState>({
    printJobs: [],
    feedback: [],
    selectedJob: null,
    isLoading: false,
    isRetrying: false,
    lastFetchTime: 0
  });
  
  const { toast } = useToast();
  const CACHE_DURATION = 30000;

  const shouldRefetchData = useCallback(() => {
    return Date.now() - state.lastFetchTime > CACHE_DURATION;
  }, [state.lastFetchTime]);

  const retryWithBackoff = async (fn: () => Promise<void>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        setState(prev => ({ ...prev, isRetrying: true }));
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        setState(prev => ({ ...prev, isRetrying: false }));
      }
    }
  };

  const loadPrintJobs = async () => {
    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error loading print jobs:', error);
      throw new Error('Failed to load print jobs');
    }

    const typedJobs: PrintJob[] = (data || []).map(job => ({
      ...job,
      institute: job.institute || '',
      notes: job.notes || '',
      status: job.status as 'pending' | 'printing' | 'ready' | 'completed',
      files: Array.isArray(job.files) ? job.files as Array<{ name: string; size: number; type: string; data?: string }> : []
    }));

    setState(prev => ({ ...prev, printJobs: typedJobs }));
  };

  const loadFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error loading feedback:', error);
      throw new Error('Failed to load feedback');
    }

    setState(prev => ({ ...prev, feedback: data || [] }));
  };

  const loadData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await retryWithBackoff(async () => {
        await Promise.all([loadPrintJobs(), loadFeedback()]);
        setState(prev => ({ ...prev, lastFetchTime: Date.now() }));
      });
    } catch (error) {
      console.error('Failed to load data after retries:', error);
      toast({
        title: "Connection issues",
        description: "Having trouble loading data. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false, isRetrying: false }));
    }
  };

  const updateJobStatus = async (jobId: string, status: PrintJob['status']) => {
    const originalJobs = [...state.printJobs];
    setState(prev => ({
      ...prev,
      printJobs: prev.printJobs.map(job => 
        job.id === jobId ? { ...job, status } : job
      ),
      selectedJob: prev.selectedJob?.id === jobId ? { ...prev.selectedJob, status } : prev.selectedJob
    }));

    try {
      await retryWithBackoff(async () => {
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
        description: `Job status changed to ${status}`,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        printJobs: originalJobs,
        selectedJob: prev.selectedJob?.id === jobId ? originalJobs.find(job => job.id === jobId) || null : prev.selectedJob
      }));
      
      console.error('Error updating job status:', error);
      toast({
        title: "Update failed",
        description: "Could not update job status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    const originalJobs = [...state.printJobs];
    setState(prev => ({
      ...prev,
      printJobs: prev.printJobs.filter(job => job.id !== jobId),
      selectedJob: null
    }));

    try {
      await retryWithBackoff(async () => {
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
    } catch (error) {
      setState(prev => ({ ...prev, printJobs: originalJobs }));
      
      console.error('Error deleting job:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    const originalFeedback = [...state.feedback];
    setState(prev => ({
      ...prev,
      feedback: prev.feedback.filter(f => f.id !== feedbackId)
    }));

    try {
      await retryWithBackoff(async () => {
        const { error } = await supabase
          .from('feedback')
          .delete()
          .eq('id', feedbackId);

        if (error) {
          throw error;
        }
      });

      toast({
        title: "Feedback deleted",
        description: "Feedback has been removed",
      });
    } catch (error) {
      setState(prev => ({ ...prev, feedback: originalFeedback }));
      
      console.error('Error deleting feedback:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const setSelectedJob = (job: PrintJob | null) => {
    setState(prev => ({ ...prev, selectedJob: job }));
  };

  useEffect(() => {
    if (shouldRefetchData()) {
      loadData();
    }
  }, [shouldRefetchData]);

  return {
    ...state,
    loadData,
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob,
    shouldRefetchData
  };
};
