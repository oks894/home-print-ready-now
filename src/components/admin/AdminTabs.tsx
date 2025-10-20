import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintJobsList } from './PrintJobsList';
import { JobDetails } from './JobDetails';
import { FeedbackList } from './FeedbackList';
import { ServicesManager } from './ServicesManager';
import { ExternalLinksManager } from './ExternalLinksManager';
import { MobileJobsList } from './mobile/MobileJobsList';
import { MobileJobDetailsSheet } from './mobile/MobileJobDetailsSheet';
import { MobileFeedbackManager } from './mobile/MobileFeedbackManager';
import { MobileServicesManager } from './mobile/MobileServicesManager';
import { MobileLinksManager } from './mobile/MobileLinksManager';
import { MobileSettingsPanel } from './mobile/MobileSettingsPanel';
import { Badge } from '@/components/ui/badge';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onJobSelect: (job: PrintJob | null) => void;
  onStatusUpdate: (jobId: string, status: string) => void;
  onDeleteJob: (jobId: string) => void;
  onDeleteFeedback: (feedbackId: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export const AdminTabs = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  hasMore,
  onLoadMore,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback,
  activeTab,
  onTabChange,
  onLogout
}: AdminTabsProps) => {
  const isMobile = useIsMobile();
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  const handleJobSelect = (job: PrintJob | null) => {
    onJobSelect(job);
    if (isMobile && job) {
      setIsJobDetailsOpen(true);
    }
  };

  if (isMobile) {
    return (
      <>
        {activeTab === 'printJobs' && (
          <>
            <MobileJobsList
              jobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={handleJobSelect}
              onStatusUpdate={onStatusUpdate}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              totalCount={printJobs.length}
            />
            {selectedJob && (
              <MobileJobDetailsSheet
                job={selectedJob}
                isOpen={isJobDetailsOpen}
                onClose={() => {
                  setIsJobDetailsOpen(false);
                  onJobSelect(null);
                }}
                onStatusUpdate={onStatusUpdate}
              />
            )}
          </>
        )}
        {activeTab === 'feedback' && (
          <MobileFeedbackManager
            feedback={feedback}
            onDeleteFeedback={onDeleteFeedback}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'services' && <MobileServicesManager />}
        {activeTab === 'links' && <MobileLinksManager />}
        {activeTab === 'settings' && onLogout && (
          <MobileSettingsPanel onLogout={onLogout} />
        )}
      </>
    );
  }

  const pendingCount = printJobs.filter(job => job.status === 'pending').length;

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="printJobs" className="relative">
          Orders
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
              {pendingCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="printJobs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PrintJobsList
              jobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={onJobSelect}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              totalCount={printJobs.length}
            />
          </div>
          <div className="lg:col-span-1 sticky top-6">
            <JobDetails
              job={selectedJob}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDeleteJob}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackList feedback={feedback} onDeleteFeedback={onDeleteFeedback} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="services">
        <ServicesManager />
      </TabsContent>

      <TabsContent value="links">
        <ExternalLinksManager />
      </TabsContent>

      <TabsContent value="settings">
        <div className="text-center py-12 text-gray-500">Settings coming soon</div>
      </TabsContent>
    </Tabs>
  );
};
