
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';

interface AdminTabsNavigationProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
}

export const AdminTabsNavigation = ({ 
  printJobs, 
  feedback, 
  selectedJob, 
  isLoading 
}: AdminTabsNavigationProps) => {
  const pendingJobs = printJobs.filter(job => job.status === 'pending').length;

  return (
    <TabsList className="grid w-full grid-cols-4 mb-6">
      <TabsTrigger value="orders" className="relative">
        Print Jobs
        {pendingJobs > 0 && !isLoading && (
          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
            {pendingJobs}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="feedback">
        Feedback
        {!isLoading && (
          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
            {feedback.length}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="details" disabled={!selectedJob}>
        Job Details
      </TabsTrigger>
      <TabsTrigger value="services">
        Services
      </TabsTrigger>
    </TabsList>
  );
};
