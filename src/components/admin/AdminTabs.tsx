
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { AdminStats } from './AdminStats';
import { AdminTabsNavigation } from './AdminTabsNavigation';
import { AdminTabsContent } from './AdminTabsContent';
import { AdminSearchInfo } from './AdminSearchInfo';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';
import { useSearch } from '@/components/admin/AdminSearch';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  onJobSelect: (job: PrintJob | null) => void;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => Promise<boolean>;
  onDeleteJob: (jobId: string) => Promise<boolean>;
  onDeleteFeedback: (feedbackId: string) => Promise<void>;
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
  const [activeTab, setActiveTab] = useState('orders');
  
  // Always call hooks at the top level - no conditional usage
  const searchHook = useSearch();
  const { filteredPrintJobs, filteredFeedback, setData, searchQuery } = searchHook;

  // Update search data when props change
  React.useEffect(() => {
    try {
      setData(printJobs, feedback);
    } catch (error) {
      console.error('Error updating search data:', error);
    }
  }, [printJobs, feedback, setData]);

  // Ensure we have fallback data to prevent rendering issues
  const safePrintJobs = filteredPrintJobs || [];
  const safeFeedback = filteredFeedback || [];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <AdminStats
        printJobs={safePrintJobs}
        feedback={safeFeedback}
        isLoading={isLoading}
        searchQuery={searchQuery || ''}
      />

      <AdminSearchInfo
        searchQuery={searchQuery || ''}
        printJobsCount={safePrintJobs.length}
        feedbackCount={safeFeedback.length}
        isLoading={isLoading}
      />

      <AdminTabsNavigation
        printJobs={safePrintJobs}
        feedback={safeFeedback}
        selectedJob={selectedJob}
        isLoading={isLoading}
      />

      <AdminTabsContent
        printJobs={safePrintJobs}
        feedback={safeFeedback}
        selectedJob={selectedJob}
        isLoading={isLoading}
        isRetrying={isRetrying}
        onJobSelect={onJobSelect}
        onStatusUpdate={onStatusUpdate}
        onDeleteJob={onDeleteJob}
        onDeleteFeedback={onDeleteFeedback}
      />
    </Tabs>
  );
};
