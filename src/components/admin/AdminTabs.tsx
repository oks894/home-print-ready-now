import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintJobsList } from '@/components/admin/PrintJobsList';
import { JobDetails } from '@/components/admin/JobDetails';
import { FeedbackList } from '@/components/admin/FeedbackList';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  onJobSelect: (job: PrintJob) => void;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
  onDeleteJob: (jobId: string) => void;
  onDeleteFeedback: (feedbackId: string) => void;
}

export const AdminTabs = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  isRetrying,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="jobs" className="space-y-6">
      <TabsList>
        <TabsTrigger value="jobs">Print Jobs ({printJobs.length})</TabsTrigger>
        <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
      </TabsList>

      <TabsContent value="jobs">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PrintJobsList
              printJobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={onJobSelect}
              isLoading={isLoading}
              isRetrying={isRetrying}
            />
          </div>
          <div>
            <JobDetails
              selectedJob={selectedJob}
              onStatusUpdate={onStatusUpdate}
              onDeleteJob={onDeleteJob}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackList
          feedback={feedback}
          onDeleteFeedback={onDeleteFeedback}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="services">
        <ServicesManager />
      </TabsContent>
    </Tabs>
  );
};
