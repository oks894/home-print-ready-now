
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ChevronDown, Clock, Bell } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStatusManagerProps {
  job: PrintJob;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
}

export const AdminStatusManager: React.FC<AdminStatusManagerProps> = ({
  job,
  onStatusUpdate
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PrintJob['status']>(job.status);
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusOptions: { value: PrintJob['status']; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending_payment', label: 'Pending Payment', color: 'bg-orange-100 text-orange-800' },
    { value: 'printing', label: 'Printing', color: 'bg-blue-100 text-blue-800' },
    { value: 'ready', label: 'Ready', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' }
  ];

  const currentStatus = statusOptions.find(s => s.value === job.status);

  const handleStatusUpdate = async () => {
    if (selectedStatus === job.status && !estimatedCompletion && !notes) {
      toast({
        title: "No Changes",
        description: "No changes were made to update.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Update the job status and estimated completion
      const updateData: any = {};
      
      if (selectedStatus !== job.status) {
        updateData.status = selectedStatus;
      }
      
      if (estimatedCompletion) {
        updateData.estimated_completion = new Date(estimatedCompletion).toISOString();
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('print_jobs')
          .update(updateData)
          .eq('id', job.id);

        if (updateError) {
          throw updateError;
        }
      }

      // Add manual status history entry with notes if provided
      if (notes || selectedStatus !== job.status) {
        const { error: historyError } = await supabase
          .from('status_history')
          .insert({
            print_job_id: job.id,
            status: selectedStatus,
            notes: notes || `Status manually updated to ${selectedStatus}`,
            changed_by: 'Admin'
          });

        if (historyError) {
          console.error('Error adding status history:', historyError);
        }
      }

      // Send notifications
      try {
        await supabase.functions.invoke('send-notifications', {
          body: {
            jobId: job.id,
            status: selectedStatus,
            customerName: job.name,
            phone: job.phone,
            trackingId: job.tracking_id
          }
        });
      } catch (notifError) {
        console.error('Notification sending failed:', notifError);
        // Don't fail the update if notifications fail
      }

      // Update the parent component
      onStatusUpdate(job.id, selectedStatus);

      toast({
        title: "Status Updated",
        description: `Job status updated to ${selectedStatus.replace('_', ' ')} successfully`,
      });

      setIsDialogOpen(false);
      setNotes('');
      setEstimatedCompletion('');

    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update job status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={currentStatus?.color}>
        {currentStatus?.label}
      </Badge>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update Status
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Update Job Status
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {statusOptions.find(s => s.value === selectedStatus)?.label}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {statusOptions.map(status => (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => setSelectedStatus(status.value)}
                      className={selectedStatus === status.value ? 'bg-gray-100' : ''}
                    >
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label htmlFor="estimated-completion" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Estimated Completion (Optional)
              </Label>
              <Input
                id="estimated-completion"
                type="datetime-local"
                value={estimatedCompletion}
                onChange={(e) => setEstimatedCompletion(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this status change..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleStatusUpdate} 
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? 'Updating...' : 'Update & Notify'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
