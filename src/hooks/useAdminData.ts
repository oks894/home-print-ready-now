
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PrintJob } from '@/types/printJob';
import { useToast } from '@/hooks/use-toast';

interface UseAdminDataReturn {
  printJobs: PrintJob[];
  feedback: any[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  hasMore: boolean;
  totalCount: number;
  loadData: () => Promise<void>;
  loadMore: () => Promise<void>;
  updateJobStatus: (id: string, status: string, notes?: string) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  setSelectedJob: (job: PrintJob | null) => void;
}

const ITEMS_PER_PAGE = 20;

// Helper function to transform database data to PrintJob type
const transformToPrintJob = (data: any): PrintJob => {
  return {
    id: data.id,
    tracking_id: data.tracking_id || '',
    name: data.name || '',
    phone: data.phone || '',
    institute: data.institute || '',
    time_slot: data.time_slot || '',
    notes: data.notes || '',
    files: Array.isArray(data.files) ? data.files as Array<{ name: string; size: number; type: string; url?: string; data?: string }> : [],
    timestamp: data.timestamp,
    status: data.status as PrintJob['status'] || 'pending',
    selected_services: data.selected_services as Array<{ id: string; name: string; quantity: number; price: number }> || [],
    total_amount: data.total_amount || 0,
    delivery_requested: data.delivery_requested || false,
    estimated_completion: data.estimated_completion
  };
};

export const useAdminData = (): UseAdminDataReturn => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurrentPage(0);
      
      // Load first page of print jobs with count
      const { data: jobs, error: jobsError, count } = await supabase
        .from('print_jobs')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(0, ITEMS_PER_PAGE - 1);

      if (jobsError) throw jobsError;

      const transformedJobs = (jobs || []).map(transformToPrintJob);
      setPrintJobs(transformedJobs);
      setTotalCount(count || 0);
      setHasMore((count || 0) > ITEMS_PER_PAGE);

      // Load feedback (keep all for now as it's typically smaller)
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('timestamp', { ascending: false });

      if (feedbackError) throw feedbackError;

      setFeedback(feedbackData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      const nextPage = currentPage + 1;
      const start = nextPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data: moreJobs, error } = await supabase
        .from('print_jobs')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(start, end);

      if (error) throw error;

      if (moreJobs && moreJobs.length > 0) {
        const transformedMoreJobs = moreJobs.map(transformToPrintJob);
        setPrintJobs(prev => [...prev, ...transformedMoreJobs]);
        setCurrentPage(nextPage);
        setHasMore(moreJobs.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
      toast({
        title: "Error loading more data",
        description: "Failed to load additional data.",
        variant: "destructive",
      });
    }
  }, [currentPage, hasMore, isLoading, toast]);

  const updateJobStatus = async (id: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('print_jobs')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setPrintJobs(prev => prev.map(job => 
        job.id === id ? { ...job, status: status as PrintJob['status'] } : job
      ));

      if (selectedJob?.id === id) {
        setSelectedJob(prev => prev ? { ...prev, status: status as PrintJob['status'] } : null);
      }

      toast({
        title: "Status updated",
        description: `Job status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('print_jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrintJobs(prev => prev.filter(job => job.id !== id));
      
      if (selectedJob?.id === id) {
        setSelectedJob(null);
      }

      toast({
        title: "Job deleted",
        description: "Print job has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error deleting job",
        description: "Failed to delete the job.",
        variant: "destructive",
      });
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeedback(prev => prev.filter(item => item.id !== id));

      toast({
        title: "Feedback deleted",
        description: "Feedback has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Error deleting feedback",
        description: "Failed to delete the feedback.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    hasMore,
    totalCount,
    loadData,
    loadMore,
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob,
  };
};
