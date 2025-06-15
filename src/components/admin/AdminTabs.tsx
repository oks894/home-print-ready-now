
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
  const { filteredPrintJobs, filteredFeedback, setData, searchQuery } = useSearch();

  // Update search data when props change
  React.useEffect(() => {
    setData(printJobs, feedback);
  }, [printJobs, feedback, setData]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <AdminStats
        printJobs={filteredPrintJobs}
        feedback={filteredFeedback}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />

      <AdminSearchInfo
        searchQuery={searchQuery}
        printJobsCount={filteredPrintJobs.length}
        feedbackCount={filteredFeedback.length}
        isLoading={isLoading}
      />

      <AdminTabsNavigation
        printJobs={filteredPrintJobs}
        feedback={filteredFeedback}
        selectedJob={selectedJob}
        isLoading={isLoading}
      />

      <AdminTabsContent
        printJobs={filteredPrintJobs}
        feedback={filteredFeedback}
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
