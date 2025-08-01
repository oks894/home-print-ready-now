import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface MobileJobCardOptimizedProps {
  job: PrintJob;
  onSelect: (job: PrintJob) => void;
  isSelected: boolean;
  onStatusUpdate?: (jobId: string, status: string) => void;
}

export const MobileJobCardOptimized = ({ 
  job, 
  onSelect, 
  isSelected,
  onStatusUpdate 
}: MobileJobCardOptimizedProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📄';
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${job.phone}`, '_self');
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    onStatusUpdate?.(job.id, newStatus);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-primary shadow-lg' : 'border-gray-200'
      }`}
    >
      <TouchButton
        variant="ghost"
        onClick={() => onSelect(job)}
        className="w-full p-0 h-auto"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">{getStatusEmoji(job.status)}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {job.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  ID: {job.tracking_id}
                </p>
              </div>
            </div>
            
            <Badge className={`${getStatusColor(job.status)} text-xs`}>
              {job.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(job.timestamp))} ago</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{job.files?.length || 0} files</span>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ₹{job.total_amount || 0}
            </span>
            
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </TouchButton>
          </div>
        </div>
      </TouchButton>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Contact & Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{job.phone}</span>
                </div>
                
                <TouchButton
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="px-3 py-1 h-8 text-xs"
                >
                  Call
                </TouchButton>
              </div>

              {job.delivery_requested && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-words">Delivery Requested</span>
                </div>
              )}

              {/* Time Slot */}
              {job.time_slot && (
                <div className="text-sm text-gray-600">
                  <strong>Time:</strong> {job.time_slot}
                </div>
              )}

              {/* Quick Actions */}
              {job.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleStatusChange(e, 'printing')}
                    className="flex-1 text-xs h-8"
                  >
                    Start
                  </TouchButton>
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleStatusChange(e, 'cancelled')}
                    className="flex-1 text-xs h-8 text-red-600 border-red-200"
                  >
                    Cancel
                  </TouchButton>
                </div>
              )}

              {job.status === 'printing' && (
                <TouchButton
                  variant="default"
                  size="sm"
                  onClick={(e) => handleStatusChange(e, 'ready')}
                  className="w-full text-xs h-8"
                >
                  Mark Ready
                </TouchButton>
              )}

              {job.status === 'ready' && (
                <TouchButton
                  variant="default"
                  size="sm"
                  onClick={(e) => handleStatusChange(e, 'completed')}
                  className="w-full text-xs h-8"
                >
                  Mark Complete
                </TouchButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};