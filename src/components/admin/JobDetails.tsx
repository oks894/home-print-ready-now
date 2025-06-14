
import { Download, Eye, Trash2, User, Phone, Building, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PrintJob {
  id: string;
  tracking_id?: string;
  name: string;
  phone: string;
  institute: string;
  time_slot: string;
  notes: string;
  files: Array<{ name: string; size: number; type: string; data?: string }>;
  timestamp: string;
  status: 'pending' | 'printing' | 'ready' | 'completed';
}

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
          {selectedJob.tracking_id && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-mono text-sm">{selectedJob.tracking_id}</span>
            </div>
          )}
        </div>

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
          <Label>Update Status</Label>
          <Select
            value={selectedJob.status}
            onValueChange={(value) => onStatusUpdate(selectedJob.id, value as PrintJob['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="printing">Printing</SelectItem>
              <SelectItem value="ready">Ready for Pickup</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
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
