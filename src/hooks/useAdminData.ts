
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import { useRetry } from '@/hooks/useRetry';
import { usePrintJobs } from '@/hooks/usePrintJobs';
import { useFeedback } from '@/hooks/useFeedback';

export const useAdminData = () => {
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  const { toast } = useToast();
  const { isRetrying, retryWithBackoff, setIsRetrying } = useRetry();
  const { 
    printJobs, 
    loadPrintJobs, 
    updateJobStatus: updateJobStatusInternal,
    deleteJob: deleteJobInternal 
  } = usePrintJobs();
  const { 
    feedback, 
    loadFeedback, 
    deleteFeedback: deleteFeedbackInternal 
  } = useFeedback();

  const CACHE_DURATION = 30000;

  const shouldRefetchData = useCallback(() => {
    return Date.now() - lastFetchTime > CACHE_DURATION;
  }, [lastFetchTime]);

  const loadData = async () => {
    console.log('useAdminData: Loading admin data...');
    setIsLoading(true);
    try {
      await retryWithBackoff(async () => {
        console.log('useAdminData: Attempting to load print jobs and feedback...');
        await Promise.all([loadPrintJobs(), loadFeedback()]);
        setLastFetchTime(Date.now());
        console.log('useAdminData: Admin data loaded successfully');
      });
    } catch (error) {
      console.error('useAdminData: Failed to load data after retries:', error);
      toast({
        title: "Connection issues",
        description: "Having trouble loading data. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: PrintJob['status']) => {
    console.log('useAdminData: Updating job status:', jobId, status);
    const success = await updateJobStatusInternal(jobId, status, retryWithBackoff);
    if (success && selectedJob?.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, status } : null);
    }
    return success;
  };

  const deleteJob = async (jobId: string) => {
    console.log('useAdminData: Deleting job:', jobId);
    const success = await deleteJobInternal(jobId, retryWithBackoff);
    if (success && selectedJob?.id === jobId) {
      setSelectedJob(null);
    }
    return success;
  };

  const deleteFeedback = async (feedbackId: string) => {
    console.log('useAdminData: Deleting feedback:', feedbackId);
    await deleteFeedbackInternal(feedbackId, retryWithBackoff);
  };

  // Load data on component mount
  useEffect(() => {
    console.log('useAdminData: Component mounted, loading data...');
    loadData();
  }, []);

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isRetrying) {
        console.log('useAdminData: Auto-refresh triggered');
        loadData();
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [isLoading, isRetrying]);

  console.log('useAdminData: Current state - printJobs:', printJobs.length, 'feedback:', feedback.length, 'isLoading:', isLoading);

  return {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    loadData,
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob,
    shouldRefetchData
  };
};
