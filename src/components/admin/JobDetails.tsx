import React from 'react';
import { PrintJob } from '@/types/printJob';
import { useIsMobile } from '@/hooks/use-mobile';
import { JobDetailsHeader } from './job-details/JobDetailsHeader';
import { CustomerInfo } from './job-details/CustomerInfo';
import { SelectedServices } from './job-details/SelectedServices';
import { FilesList } from './job-details/FilesList';
import { JobNotes } from './job-details/JobNotes';
import { JobActions } from './job-details/JobActions';
import { AdminStatusManager } from './AdminStatusManager';
import { StatusHistory } from './StatusHistory';

interface JobDetailsProps {
  job: PrintJob;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
  onDelete: (jobId: string) => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  onStatusUpdate,
  onDelete
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
      isMobile ? 'mx-2' : ''
    }`}>
      <JobDetailsHeader job={job} />
      
      <div className={`${isMobile ? 'p-4 space-y-4' : 'p-6 space-y-6'}`}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <CustomerInfo job={job} />
            <AdminStatusManager job={job} onStatusUpdate={onStatusUpdate} />
          </div>
          
          <div className="space-y-4">
            <SelectedServices job={job} />
            <FilesList job={job} />
          </div>
        </div>

        {/* Add Status History */}
        <StatusHistory printJobId={job.id} />

        <JobNotes job={job} />
        <JobActions job={job} onDelete={onDelete} />
      </div>
    </div>
  );
};
