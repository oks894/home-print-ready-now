
import { User, Phone, Building, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CustomerInfoProps {
  name: string;
  phone: string;
  institute?: string;
  timeSlot: string;
  trackingId: string;
}

export const CustomerInfo = ({ name, phone, institute, timeSlot, trackingId }: CustomerInfoProps) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="font-medium truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
          {phone}
        </a>
      </div>
      {institute && (
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">{institute}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span>{timeSlot}</span>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <Badge variant="outline" className="font-mono text-xs px-2 py-1">
          {trackingId}
        </Badge>
      </div>
    </div>
  );
};
