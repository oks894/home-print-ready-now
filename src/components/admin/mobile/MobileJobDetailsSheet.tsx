import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Calendar, FileText, Package, MapPin, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { TouchButton } from '@/components/mobile/TouchButton';
import { PrintJob } from '@/types/printJob';
import { AdminStatusManager } from '@/components/admin/AdminStatusManager';
import { AdminNotesInput } from '@/components/admin/AdminNotesInput';
import { EstimatedCompletionInput } from '@/components/admin/EstimatedCompletionInput';

interface MobileJobDetailsSheetProps {
  job: PrintJob | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (jobId: string, status: string) => void;
}

export const MobileJobDetailsSheet = ({
  job,
  isOpen,
  onClose,
  onStatusUpdate
}: MobileJobDetailsSheetProps) => {
  if (!job) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending_payment': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${job.phone}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <SheetHeader className="flex-1">
            <SheetTitle className="text-left">Job Details</SheetTitle>
            <SheetDescription className="text-left text-xs">
              #{job.tracking_id}
            </SheetDescription>
          </SheetHeader>
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-5 h-5" />
          </TouchButton>
        </div>

        <div className="p-4 space-y-6">
          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <Badge className={`${getStatusColor(job.status)} px-4 py-2 text-base`}>
              {job.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </motion.div>

          {/* Customer Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{job.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{job.phone}</p>
                </div>
              </div>
              {job.institute && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Institute</p>
                    <p className="font-medium">{job.institute}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Time Slot</p>
                  <p className="font-medium">{job.time_slot}</p>
                </div>
              </div>
            </div>
            <TouchButton
              onClick={handleCall}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Customer
            </TouchButton>
          </div>

          {/* Files */}
          {job.files && job.files.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Files ({job.files.length})
              </h3>
              <div className="space-y-2">
                {job.files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded border text-sm flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    {file.url && (
                      <TouchButton
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        View
                      </TouchButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {job.selected_services && job.selected_services.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Selected Services
              </h3>
              <div className="space-y-2">
                {job.selected_services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded border text-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-gray-500">Qty: {service.quantity}</p>
                    </div>
                    <p className="font-semibold text-purple-600">
                      ₹{service.price * service.quantity}
                    </p>
                  </div>
                ))}
              </div>
              {job.total_amount && (
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-purple-600">
                    ₹{job.total_amount}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-600" />
                Customer Notes
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Estimated Completion */}
          {job.estimated_completion && (
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Estimated Completion
              </h3>
              <p className="text-sm">{new Date(job.estimated_completion).toLocaleString()}</p>
            </div>
          )}

          {/* Admin Actions */}
          <div className="space-y-4 pt-4 border-t">
            <AdminStatusManager
              job={job}
              onStatusUpdate={onStatusUpdate}
            />
            
            <EstimatedCompletionInput
              value={job.estimated_completion}
              onChange={(value) => {}}
            />
            
            <AdminNotesInput
              value={job.admin_notes || ''}
              onChange={(value) => {}}
            />
          </div>

          {/* Delivery Status */}
          {job.delivery_requested && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800">
                🚚 Delivery Requested
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-center text-gray-500 pb-4">
            Submitted: {new Date(job.timestamp).toLocaleString()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
