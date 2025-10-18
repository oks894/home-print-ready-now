
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Settings, Package, Link2 } from 'lucide-react';
import { PrintJobsList } from './PrintJobsList';
import { JobDetails } from './JobDetails';
import { FeedbackList } from './FeedbackList';
import { ServicesManager } from './ServicesManager';
import { ExternalLinksManager } from './ExternalLinksManager';
import { MobileJobsList } from './mobile/MobileJobsList';
import { PrintJob } from '@/types/printJob';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: any[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onJobSelect: (job: PrintJob | null) => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
  onDeleteFeedback: (id: string) => Promise<void>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  isRetrying,
  hasMore,
  onLoadMore,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback,
  activeTab,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  const pendingJobs = printJobs.filter(job => job.status === 'pending').length;

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 mb-4' : 'grid-cols-5 mb-6'}`}>
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {!isMobile && 'Orders'}
          {pendingJobs > 0 && (
            <Badge variant="destructive" className="ml-1 text-xs">
              {pendingJobs}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="feedback" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {!isMobile && 'Feedback'}
          {feedback.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {feedback.length}
            </Badge>
          )}
        </TabsTrigger>
        {!isMobile && (
          <>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="orders" className="space-y-6">
        {isMobile ? (
          <div className="h-full">
            <MobileJobsList
              jobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={onJobSelect}
              onStatusUpdate={onStatusUpdate}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              totalCount={printJobs.length}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PrintJobsList
              jobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={onJobSelect}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              totalCount={printJobs.length}
            />
            {selectedJob && (
              <JobDetails
                job={selectedJob}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDeleteJob}
              />
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackList
          feedback={feedback}
          onDeleteFeedback={onDeleteFeedback}
          isLoading={isLoading}
        />
      </TabsContent>

      {!isMobile && (
        <>
          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="links">
            <ExternalLinksManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
              <p className="text-gray-600">Advanced settings and configuration options coming soon.</p>
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
