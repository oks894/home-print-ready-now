
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrintJob } from '@/types/printJob';

interface JobActionsProps {
  job: PrintJob;
  onDelete: (jobId: string) => void;
}

export const JobActions = ({ job, onDelete }: JobActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 pt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(job.id)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
