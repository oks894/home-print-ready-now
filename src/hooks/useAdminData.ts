
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import { useRetry } from '@/hooks/useRetry';
import { usePrintJobs } from '@/hooks/usePrintJobs';
import { useFeedback } from '@/hooks/useFeedback';

export const useAdminData = () => {
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      await retryWithBackoff(async () => {
        await Promise.all([loadPrintJobs(), loadFeedback()]);
        setLastFetchTime(Date.now());
      });
    } catch (error) {
      console.error('Failed to load data after retries:', error);
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
    const success = await updateJobStatusInternal(jobId, status, retryWithBackoff);
    if (success && selectedJob?.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, status } : null);
    }
  };

  const deleteJob = async (jobId: string) => {
    const success = await deleteJobInternal(jobId, retryWithBackoff);
    if (success && selectedJob?.id === jobId) {
      setSelectedJob(null);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    await deleteFeedbackInternal(feedbackId, retryWithBackoff);
  };

  useEffect(() => {
    if (shouldRefetchData()) {
      loadData();
    }
  }, [shouldRefetchData]);

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
