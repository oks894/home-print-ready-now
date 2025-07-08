
import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Clock, FileText, ChevronRight, MapPin, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TouchButton } from '@/components/mobile/TouchButton';
import { PrintJob } from '@/types/printJob';

interface MobileAdminCardProps {
  job: PrintJob;
  onSelect: (job: PrintJob) => void;
  isSelected: boolean;
  index?: number;
}

export const MobileAdminCard = ({ job, onSelect, isSelected, index = 0 }: MobileAdminCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'printing': return '🖨️';
      case 'ready': return '✅';
      case 'completed': return '🎉';
      default: return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative bg-white rounded-3xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
        isSelected ? 'border-blue-500 shadow-2xl scale-[1.02]' : 'border-gray-100 hover:shadow-xl'
      }`}
    >
      <TouchButton
        variant="ghost"
        onClick={() => onSelect(job)}
        className="w-full p-0 h-auto text-left hover:bg-transparent rounded-3xl"
      >
        <div className="p-5 space-y-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs px-3 py-1.5 font-semibold ${getStatusColor(job.status)}`}
            >
              {getStatusEmoji(job.status)} {job.status.toUpperCase()}
            </Badge>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{job.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{job.phone}</span>
                </div>
              </div>
            </div>

            {job.institute && (
              <div className="flex items-center gap-2 text-sm text-gray-600 ml-13">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{job.institute}</span>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span className="font-medium">Time Slot</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 ml-6">{job.time_slot}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span className="font-medium">Files</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 ml-6">
                {job.files?.length || 0} file{(job.files?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Tracking ID</p>
              <p className="text-sm font-mono font-bold text-blue-600">{job.tracking_id}</p>
            </div>
            
            {job.total_amount && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                  <IndianRupee className="w-4 h-4" />
                  <span>{job.total_amount}</span>
                </div>
                <p className="text-xs text-gray-500">Total Amount</p>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {new Date(job.timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </TouchButton>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
        />
      )}
    </motion.div>
  );
};
