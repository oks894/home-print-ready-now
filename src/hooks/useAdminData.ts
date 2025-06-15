
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import { useRetry } from '@/hooks/useRetry';
import { usePrintJobs } from '@/hooks/usePrintJobs';
import { useFeedback } from '@/hooks/useFeedback';

export const useAdminData = () => {
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
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

  const loadData = useCallback(async (force = false) => {
    // Prevent infinite loops and excessive loading
    if (!force && hasInitialized) {
      console.log('useAdminData: Skipping reload, already initialized');
      return;
    }

    if (loadAttempts > 3) {
      console.warn('useAdminData: Too many load attempts, stopping');
      setIsLoading(false);
      setIsRetrying(false);
      return;
    }

    console.log('useAdminData: Loading admin data...', { force, hasInitialized, attempt: loadAttempts + 1 });
    setIsLoading(true);
    setLoadAttempts(prev => prev + 1);
    
    try {
      // Load with timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Loading timeout')), 15000)
      );

      const loadPromises = [
        Promise.race([loadPrintJobs(), timeoutPromise]),
        Promise.race([loadFeedback(), timeoutPromise])
      ];

      const results = await Promise.allSettled(loadPromises);

      // Check results and handle partial failures gracefully
      const printJobsResult = results[0];
      const feedbackResult = results[1];

      let hasAnySuccess = false;

      if (printJobsResult.status === 'fulfilled') {
        hasAnySuccess = true;
        console.log('useAdminData: Print jobs loaded successfully');
      } else {
        console.warn('useAdminData: Print jobs failed:', printJobsResult.reason);
      }
      
      if (feedbackResult.status === 'fulfilled') {
        hasAnySuccess = true;
        console.log('useAdminData: Feedback loaded successfully');
      } else {
        console.warn('useAdminData: Feedback failed:', feedbackResult.reason);
      }

      if (hasAnySuccess) {
        setHasInitialized(true);
        console.log('useAdminData: Admin data loaded with partial success');
        
        // Only show error toast if print jobs failed (more critical)
        if (printJobsResult.status === 'rejected') {
          toast({
            title: "Print jobs loading issue",
            description: "Some data may not be fully loaded. Try refreshing if needed.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('All data loading failed');
      }
    } catch (error) {
      console.error('useAdminData: Failed to load data:', error);
      
      // Don't show error toast on every failure to avoid spam
      if (loadAttempts <= 2) {
        toast({
          title: "Connection issue",
          description: "Having trouble loading data. Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [hasInitialized, loadAttempts, loadPrintJobs, loadFeedback, toast, setIsRetrying]);

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

  // Load data on component mount - with better control
  useEffect(() => {
    if (!hasInitialized && loadAttempts === 0) {
      console.log('useAdminData: Initial load triggered');
      // Small delay to ensure component is mounted properly
      const timer = setTimeout(() => loadData(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loadData, hasInitialized, loadAttempts]);

  console.log('useAdminData: Current state - printJobs:', printJobs.length, 'feedback:', feedback.length, 'isLoading:', isLoading, 'attempts:', loadAttempts);

  return {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    loadData: () => {
      setLoadAttempts(0); // Reset attempts on manual reload
      loadData(true);
    },
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob
  };
};
