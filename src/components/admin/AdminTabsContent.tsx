
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintJobsList } from './PrintJobsList';
import { FeedbackList } from './FeedbackList';
import { JobDetails } from './JobDetails';
import { ServicesManager } from './ServicesManager';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';

interface AdminTabsContentProps {
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

export const AdminTabsContent = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  isRetrying,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback
}: AdminTabsContentProps) => {
  return (
    <>
      <TabsContent value="orders" className="space-y-4">
        <PrintJobsList
          printJobs={printJobs}
          onJobSelect={onJobSelect}
          selectedJob={selectedJob}
          isLoading={isLoading}
          isRetrying={isRetrying}
        />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <FeedbackList
          feedback={feedback}
          onDeleteFeedback={onDeleteFeedback}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        {selectedJob ? (
          <JobDetails
            selectedJob={selectedJob}
            onStatusUpdate={onStatusUpdate}
            onDeleteJob={onDeleteJob}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Job Selected</CardTitle>
              <CardDescription>
                Select a print job from the orders tab to view its details.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        <ServicesManager />
      </TabsContent>
    </>
  );
};
