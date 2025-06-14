
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { PrintJob } from '@/types/printJob';

interface AdminStatusManagerProps {
  job: PrintJob;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
}

export const AdminStatusManager: React.FC<AdminStatusManagerProps> = ({
  job,
  onStatusUpdate
}) => {
  const statusOptions: { value: PrintJob['status']; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending_payment', label: 'Pending Payment', color: 'bg-orange-100 text-orange-800' },
    { value: 'printing', label: 'Printing', color: 'bg-blue-100 text-blue-800' },
    { value: 'ready', label: 'Ready', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' }
  ];

  const currentStatus = statusOptions.find(s => s.value === job.status);

  return (
    <div className="flex items-center gap-2">
      <Badge className={currentStatus?.color}>
        {currentStatus?.label}
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            Change Status
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusOptions.map(status => (
            <DropdownMenuItem
              key={status.value}
              onClick={() => onStatusUpdate(job.id, status.value)}
              className={job.status === status.value ? 'bg-gray-100' : ''}
            >
              {status.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
