
import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PrintJob } from '@/types/printJob';
import { JobDetailsHeader } from '@/components/admin/job-details/JobDetailsHeader';
import { CustomerInfo } from '@/components/admin/job-details/CustomerInfo';
import { SelectedServices } from '@/components/admin/job-details/SelectedServices';
import { FilesList } from '@/components/admin/job-details/FilesList';
import { JobNotes } from '@/components/admin/job-details/JobNotes';
import { JobActions } from '@/components/admin/job-details/JobActions';

interface JobDetailsProps {
  selectedJob: PrintJob | null;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => Promise<void>;
  onDeleteJob: (jobId: string) => Promise<void>;
}

export const JobDetails = ({ selectedJob, onStatusUpdate, onDeleteJob }: JobDetailsProps) => {
  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedJob) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40 sm:h-64 text-gray-500">
          <div className="text-center">
            <Eye className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Select a print job to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pass fully async handlers to JobActions
  const handleStatusUpdate = async (jobId: string, status: PrintJob['status']) => {
    await onStatusUpdate(jobId, status);
  };
  const handleDeleteJob = async (jobId: string) => {
    await onDeleteJob(jobId);
  };

  return (
    <Card className="h-fit">
      <JobDetailsHeader 
        timestamp={selectedJob.timestamp}
        onBack={handleBack}
      />
      
      <CardContent className="space-y-4 max-h-[70vh] lg:max-h-none overflow-y-auto">
        <CustomerInfo
          name={selectedJob.name}
          phone={selectedJob.phone}
          institute={selectedJob.institute}
          timeSlot={selectedJob.time_slot}
          trackingId={selectedJob.tracking_id}
        />

        <SelectedServices
          services={selectedJob.selected_services || []}
          totalAmount={selectedJob.total_amount}
          deliveryRequested={selectedJob.delivery_requested}
        />

        <FilesList files={selectedJob.files} />

        <JobNotes notes={selectedJob.notes} />

        <JobActions
          job={selectedJob}
          onStatusUpdate={handleStatusUpdate}
          onDeleteJob={handleDeleteJob}
        />
      </CardContent>
    </Card>
  );
};
