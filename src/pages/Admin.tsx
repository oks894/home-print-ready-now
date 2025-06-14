
import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PrintJobsList } from '@/components/admin/PrintJobsList';
import { JobDetails } from '@/components/admin/JobDetails';
import { FeedbackList } from '@/components/admin/FeedbackList';

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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();

  // Cache data for 30 seconds to reduce network requests
  const CACHE_DURATION = 30000;

  const shouldRefetchData = useCallback(() => {
    return Date.now() - lastFetchTime > CACHE_DURATION;
  }, [lastFetchTime]);

  const retryWithBackoff = async (fn: () => Promise<void>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        setIsRetrying(true);
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        setIsRetrying(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && shouldRefetchData()) {
      loadData();
    }
  }, [isAuthenticated, shouldRefetchData]);

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

    setPrintJobs(typedJobs);
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

    setFeedback(data || []);
  };

  const updateJobStatus = async (jobId: string, status: PrintJob['status']) => {
    // Optimistic update
    const originalJobs = [...printJobs];
    setPrintJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
    
    if (selectedJob?.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, status } : null);
    }

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
      // Revert optimistic update on error
      setPrintJobs(originalJobs);
      if (selectedJob?.id === jobId) {
        const originalJob = originalJobs.find(job => job.id === jobId);
        setSelectedJob(originalJob || null);
      }
      
      console.error('Error updating job status:', error);
      toast({
        title: "Update failed",
        description: "Could not update job status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    // Optimistic update
    const originalJobs = [...printJobs];
    setPrintJobs(prev => prev.filter(job => job.id !== jobId));
    setSelectedJob(null);

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
      // Revert optimistic update on error
      setPrintJobs(originalJobs);
      
      console.error('Error deleting job:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    // Optimistic update
    const originalFeedback = [...feedback];
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));

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
      // Revert optimistic update on error
      setFeedback(originalFeedback);
      
      console.error('Error deleting feedback:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onLogout={() => setIsAuthenticated(false)}
        isRetrying={isRetrying}
        onRefresh={loadData}
      />

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Print Jobs ({printJobs.length})</TabsTrigger>
            <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PrintJobsList
                  printJobs={printJobs}
                  selectedJob={selectedJob}
                  onJobSelect={setSelectedJob}
                  isLoading={isLoading}
                  isRetrying={isRetrying}
                />
              </div>
              <div>
                <JobDetails
                  selectedJob={selectedJob}
                  onStatusUpdate={updateJobStatus}
                  onDeleteJob={deleteJob}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackList
              feedback={feedback}
              onDeleteFeedback={deleteFeedback}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
