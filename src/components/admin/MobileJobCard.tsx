
import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Clock, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TouchButton } from '@/components/mobile/TouchButton';
import { PrintJob } from '@/types/printJob';

interface MobileJobCardProps {
  job: PrintJob;
  onSelect: (job: PrintJob) => void;
  isSelected: boolean;
}

export const MobileJobCard = ({ job, onSelect, isSelected }: MobileJobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-100'
      }`}
    >
      <TouchButton
        variant="ghost"
        onClick={() => onSelect(job)}
        className="w-full p-0 h-auto text-left hover:bg-gray-50 rounded-2xl"
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">{job.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{job.phone}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-1 ${getStatusColor(job.status)}`}
              >
                {job.status.toUpperCase()}
              </Badge>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{job.time_slot}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="font-mono text-xs">{job.tracking_id}</span>
            </div>

            {job.files && job.files.length > 0 && (
              <div className="text-xs text-gray-500">
                {job.files.length} file{job.files.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {new Date(job.timestamp).toLocaleDateString()}
            </span>
            {job.total_amount && (
              <span className="text-sm font-semibold text-green-600">
                ₹{job.total_amount}
              </span>
            )}
          </div>
        </div>
      </TouchButton>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 right-0 h-1 bg-blue-500"
        />
      )}
    </motion.div>
  );
};
