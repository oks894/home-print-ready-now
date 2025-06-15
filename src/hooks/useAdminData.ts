
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
    if (!force && hasInitialized) {
      console.log('useAdminData: Skipping reload, already initialized');
      return;
    }

    console.log('useAdminData: Loading admin data...', { force, hasInitialized });
    setIsLoading(true);
    
    try {
      // Load data with shorter timeout and better error handling
      const results = await Promise.allSettled([
        Promise.race([
          loadPrintJobs(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Print jobs timeout')), 5000)
          )
        ]),
        Promise.race([
          loadFeedback(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Feedback timeout')), 5000)
          )
        ])
      ]);

      // Check results and handle partial failures
      const printJobsResult = results[0];
      const feedbackResult = results[1];

      if (printJobsResult.status === 'rejected') {
        console.warn('Print jobs failed to load:', printJobsResult.reason);
      }
      
      if (feedbackResult.status === 'rejected') {
        console.warn('Feedback failed to load:', feedbackResult.reason);
      }

      // If both failed, show error
      if (printJobsResult.status === 'rejected' && feedbackResult.status === 'rejected') {
        throw new Error('Both print jobs and feedback failed to load');
      }

      setHasInitialized(true);
      console.log('useAdminData: Admin data loaded successfully');
    } catch (error) {
      console.error('useAdminData: Failed to load data:', error);
      toast({
        title: "Partial loading failure",
        description: "Some data may not be available. Click refresh to try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [hasInitialized, loadPrintJobs, loadFeedback, toast, setIsRetrying]);

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

  // Load data on component mount - only once with error recovery
  useEffect(() => {
    if (!hasInitialized) {
      console.log('useAdminData: Initial load triggered');
      loadData(true);
    }
  }, [loadData, hasInitialized]);

  console.log('useAdminData: Current state - printJobs:', printJobs.length, 'feedback:', feedback.length, 'isLoading:', isLoading);

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
    setSelectedJob
  };
};
