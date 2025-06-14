
import { Download, Eye, Trash2, User, Phone, Building, Clock, FileText, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import { AdminStatusManager } from '@/components/admin/AdminStatusManager';

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

  if (!selectedJob) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a print job to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>
          Submitted on {new Date(selectedJob.timestamp).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{selectedJob.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{selectedJob.phone}</span>
          </div>
          {selectedJob.institute && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span>{selectedJob.institute}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{selectedJob.time_slot}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-sm">{selectedJob.tracking_id}</span>
          </div>
        </div>

        {/* Selected Services */}
        {selectedJob.selected_services && selectedJob.selected_services.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Selected Services
            </h4>
            <div className="space-y-2">
              {selectedJob.selected_services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-500 ml-2">x{service.quantity}</span>
                  </div>
                  <span className="font-medium">₹{(service.price * service.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded font-semibold">
                <span>Total Amount</span>
                <span>₹{selectedJob.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedJob.delivery_requested && (
                <div className="p-2 bg-green-50 rounded text-green-800 text-sm">
                  ✓ Delivery requested (₹200+ order)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h4 className="font-medium mb-2">Files to Print</h4>
          <div className="space-y-2">
            {selectedJob.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadFile(file.name, file.data)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {selectedJob.notes && (
          <div>
            <h4 className="font-medium mb-2">Special Instructions</h4>
            <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
              {selectedJob.notes}
            </p>
          </div>
        )}

        {/* Status Update */}
        <div>
          <h4 className="font-medium mb-2">Status</h4>
          <AdminStatusManager
            job={selectedJob}
            onStatusUpdate={onStatusUpdate}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteJob(selectedJob.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
