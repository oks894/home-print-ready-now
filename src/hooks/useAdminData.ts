
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
  const [hasInitialized, setHasInitialized] = useState(false);
  
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

  const CACHE_DURATION = 30000; // 30 seconds
  const REFRESH_INTERVAL = 120000; // 2 minutes

  const shouldRefetchData = useCallback(() => {
    return Date.now() - lastFetchTime > CACHE_DURATION;
  }, [lastFetchTime]);

  const loadData = useCallback(async (force = false) => {
    if (!force && !shouldRefetchData() && hasInitialized) {
      console.log('useAdminData: Using cached data, skipping fetch');
      return;
    }

    console.log('useAdminData: Loading admin data...', { force, hasInitialized });
    setIsLoading(true);
    
    try {
      await retryWithBackoff(async () => {
        console.log('useAdminData: Attempting to load print jobs and feedback...');
        const promises = [loadPrintJobs(), loadFeedback()];
        await Promise.allSettled(promises);
        setLastFetchTime(Date.now());
        setHasInitialized(true);
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
  }, [shouldRefetchData, hasInitialized, retryWithBackoff, loadPrintJobs, loadFeedback, toast, setIsRetrying]);

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
    if (!hasInitialized) {
      console.log('useAdminData: Component mounted, loading data...');
      loadData(true);
    }
  }, [loadData, hasInitialized]);

  // Auto-refresh data periodically but less frequently
  useEffect(() => {
    if (!hasInitialized) return;

    const interval = setInterval(() => {
      if (!isLoading && !isRetrying) {
        console.log('useAdminData: Auto-refresh triggered');
        loadData(false);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoading, isRetrying, hasInitialized, loadData]);

  console.log('useAdminData: Current state - printJobs:', printJobs.length, 'feedback:', feedback.length, 'isLoading:', isLoading, 'hasInitialized:', hasInitialized);

  return {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    loadData: () => loadData(true),
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob,
    shouldRefetchData
  };
};
