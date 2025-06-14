
import { useState, useEffect } from 'react';
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
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadPrintJobs();
      loadFeedback();
    }
  }, [isAuthenticated]);

  const loadPrintJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading print jobs:', error);
        toast({
          title: "Error loading print jobs",
          description: "Could not fetch print jobs from database",
          variant: "destructive"
        });
        return;
      }

      // Cast the data to match our PrintJob interface
      const typedJobs: PrintJob[] = (data || []).map(job => ({
        ...job,
        institute: job.institute || '',
        notes: job.notes || '',
        status: job.status as 'pending' | 'printing' | 'ready' | 'completed',
        files: Array.isArray(job.files) ? job.files as Array<{ name: string; size: number; type: string; data?: string }> : []
      }));

      setPrintJobs(typedJobs);
    } catch (error) {
      console.error('Error loading print jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading feedback:', error);
        return;
      }

      setFeedback(data || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const updateJobStatus = async (jobId: string, status: PrintJob['status']) => {
    try {
      const { error } = await supabase
        .from('print_jobs')
        .update({ status })
        .eq('id', jobId);

      if (error) {
        console.error('Error updating job status:', error);
        toast({
          title: "Error updating status",
          description: "Could not update job status",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setPrintJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      ));

      // Update selected job if it's the one being updated
      if (selectedJob?.id === jobId) {
        setSelectedJob(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: "Status updated",
        description: `Job status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('print_jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('Error deleting job:', error);
        toast({
          title: "Error deleting job",
          description: "Could not delete job from database",
          variant: "destructive"
        });
        return;
      }

      setPrintJobs(prev => prev.filter(job => job.id !== jobId));
      setSelectedJob(null);
      toast({
        title: "Job deleted",
        description: "Print job has been removed",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) {
        console.error('Error deleting feedback:', error);
        toast({
          title: "Error deleting feedback",
          description: "Could not delete feedback from database",
          variant: "destructive"
        });
        return;
      }

      setFeedback(prev => prev.filter(f => f.id !== feedbackId));
      toast({
        title: "Feedback deleted",
        description: "Feedback has been removed",
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={() => setIsAuthenticated(false)} />

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
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
