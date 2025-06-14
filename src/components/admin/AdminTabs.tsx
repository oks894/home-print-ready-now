
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintJobsList } from '@/components/admin/PrintJobsList';
import { JobDetails } from '@/components/admin/JobDetails';
import { FeedbackList } from '@/components/admin/FeedbackList';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { NotificationManager } from '@/components/admin/NotificationManager';
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
    <Tabs defaultValue="jobs" className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized tab list */}
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
        <TabsTrigger value="jobs" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
          <span className="hidden sm:inline">Print Jobs</span>
          <span className="sm:hidden">Jobs</span>
          <span className="ml-1">({printJobs.length})</span>
        </TabsTrigger>
        <TabsTrigger value="feedback" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
          <span className="hidden sm:inline">Feedback</span>
          <span className="sm:hidden">Reviews</span>
          <span className="ml-1">({feedback.length})</span>
        </TabsTrigger>
        <TabsTrigger value="services" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
          Services
        </TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
          <span className="hidden sm:inline">Notifications</span>
          <span className="sm:hidden">Alerts</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="jobs" className="space-y-4">
        {/* Mobile: Stack layout, Desktop: Grid layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <PrintJobsList
              printJobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={onJobSelect}
              isLoading={isLoading}
              isRetrying={isRetrying}
            />
          </div>
          
          {/* Mobile: Show job details only when job is selected */}
          <div className={`${selectedJob ? 'block' : 'hidden lg:block'}`}>
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

      <TabsContent value="notifications">
        <NotificationManager />
      </TabsContent>
    </Tabs>
  );
};
