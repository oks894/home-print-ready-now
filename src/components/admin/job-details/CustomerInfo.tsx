
import { User, Phone, Building, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PrintJob } from '@/types/printJob';

interface CustomerInfoProps {
  job: PrintJob;
}

export const CustomerInfo = ({ job }: CustomerInfoProps) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="font-medium truncate">{job.name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <a href={`tel:${job.phone}`} className="text-blue-600 hover:underline">
          {job.phone}
        </a>
      </div>
      {job.institute && (
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">{job.institute}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span>{job.time_slot}</span>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <Badge variant="outline" className="font-mono text-xs px-2 py-1">
          {job.tracking_id}
        </Badge>
      </div>
    </div>
  );
};
