
import { FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

interface PrintJobsListProps {
  printJobs: PrintJob[];
  selectedJob: PrintJob | null;
  onJobSelect: (job: PrintJob) => void;
  isLoading: boolean;
  isRetrying?: boolean;
}

const JobSkeleton = () => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start justify-between mb-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const PrintJobsList = ({ printJobs, selectedJob, onJobSelect, isLoading, isRetrying = false }: PrintJobsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Print Jobs ({printJobs.length})
          {isRetrying && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </CardTitle>
        <CardDescription>
          Manage and track all print job requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : printJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No print jobs yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {printJobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedJob?.id === job.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onJobSelect(job)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold truncate">{job.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{job.phone}</p>
                    {job.institute && (
                      <p className="text-sm text-gray-500 truncate">{job.institute}</p>
                    )}
                    {job.tracking_id && (
                      <p className="text-xs text-blue-600 font-mono truncate">{job.tracking_id}</p>
                    )}
                  </div>
                  <Badge className={`${getStatusColor(job.status)} flex-shrink-0`}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    {job.files.length} files
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    {job.time_slot}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
