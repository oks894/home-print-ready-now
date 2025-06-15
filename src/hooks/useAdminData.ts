
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
    // Prevent multiple simultaneous loads
    if (isLoading && !force) {
      console.log('useAdminData: Already loading, skipping');
      return;
    }

    if (hasInitialized && !force) {
      console.log('useAdminData: Already initialized, skipping');
      return;
    }

    console.log('useAdminData: Starting data load...');
    setIsLoading(true);
    
    try {
      // Simple parallel loading with error handling
      const [printJobsResult, feedbackResult] = await Promise.allSettled([
        loadPrintJobs(),
        loadFeedback()
      ]);

      let hasErrors = false;

      if (printJobsResult.status === 'rejected') {
        console.error('Print jobs failed:', printJobsResult.reason);
        hasErrors = true;
      }
      
      if (feedbackResult.status === 'rejected') {
        console.error('Feedback failed:', feedbackResult.reason);
        hasErrors = true;
      }

      if (hasErrors) {
        toast({
          title: "Partial loading issue",
          description: "Some data may not be available. Try refreshing.",
          variant: "destructive"
        });
      }

      setHasInitialized(true);
      console.log('useAdminData: Data loaded successfully');
    } catch (error) {
      console.error('useAdminData: Critical loading error:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load admin data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [isLoading, hasInitialized, loadPrintJobs, loadFeedback, toast, setIsRetrying]);

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

  // Initial load effect - simplified and more reliable
  useEffect(() => {
    if (!hasInitialized) {
      console.log('useAdminData: Triggering initial load');
      const timer = setTimeout(() => loadData(true), 100);
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, loadData]);

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
