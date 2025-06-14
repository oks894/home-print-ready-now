
import { Download, Eye, Trash2, User, Phone, Building, Clock, FileText, Package, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import { AdminStatusManager } from '@/components/admin/AdminStatusManager';
import { Badge } from '@/components/ui/badge';

interface JobDetailsProps {
  selectedJob: PrintJob | null;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
  onDeleteJob: (jobId: string) => void;
}

export const JobDetails = ({ selectedJob, onStatusUpdate, onDeleteJob }: JobDetailsProps) => {
  const { toast } = useToast();

  const downloadFile = (fileName: string, fileData?: string) => {
    if (fileData) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } else {
      toast({
        title: "File not available",
        description: "This file cannot be downloaded",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    // On mobile, this could be used to close the details view
    // For now, we'll just scroll to top
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

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl">Job Details</CardTitle>
            <CardDescription className="text-sm">
              Submitted on {new Date(selectedJob.timestamp).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBack}
            className="lg:hidden p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[70vh] lg:max-h-none overflow-y-auto">
        {/* Customer Info */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium truncate">{selectedJob.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <a href={`tel:${selectedJob.phone}`} className="text-blue-600 hover:underline">
              {selectedJob.phone}
            </a>
          </div>
          {selectedJob.institute && (
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="truncate">{selectedJob.institute}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>{selectedJob.time_slot}</span>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <Badge variant="outline" className="font-mono text-xs px-2 py-1">
              {selectedJob.tracking_id}
            </Badge>
          </div>
        </div>

        {/* Selected Services */}
        {selectedJob.selected_services && selectedJob.selected_services.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Package className="w-4 h-4" />
              Selected Services
            </h4>
            <div className="space-y-2">
              {selectedJob.selected_services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium truncate block">{service.name}</span>
                    <span className="text-xs text-gray-500">Quantity: {service.quantity}</span>
                  </div>
                  <span className="font-medium flex-shrink-0 ml-2">₹{(service.price * service.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded font-semibold text-sm">
                <span>Total Amount</span>
                <span>₹{selectedJob.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedJob.delivery_requested && (
                <div className="p-2 sm:p-3 bg-green-50 rounded text-green-800 text-xs sm:text-sm">
                  ✓ Delivery requested (₹200+ order)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Files to Print</h4>
          <div className="space-y-2">
            {selectedJob.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadFile(file.name, file.data)}
                  className="ml-2 flex-shrink-0"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {selectedJob.notes && (
          <div>
            <h4 className="font-medium mb-2 text-sm sm:text-base">Special Instructions</h4>
            <p className="text-xs sm:text-sm text-gray-600 p-2 sm:p-3 bg-gray-50 rounded break-words">
              {selectedJob.notes}
            </p>
          </div>
        )}

        {/* Status Update */}
        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Status</h4>
          <AdminStatusManager
            job={selectedJob}
            onStatusUpdate={onStatusUpdate}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteJob(selectedJob.id)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
