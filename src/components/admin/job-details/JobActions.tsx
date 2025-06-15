
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminStatusManager } from '@/components/admin/AdminStatusManager';
import { PrintJob } from '@/types/printJob';

interface JobActionsProps {
  job: PrintJob;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
  onDeleteJob: (jobId: string) => void;
}

export const JobActions = ({ job, onStatusUpdate, onDeleteJob }: JobActionsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2 text-sm sm:text-base">Status</h4>
        <AdminStatusManager
          job={job}
          onStatusUpdate={onStatusUpdate}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeleteJob(job.id)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
