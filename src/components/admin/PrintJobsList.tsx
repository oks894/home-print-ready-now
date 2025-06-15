
import { FileText, Clock, ChevronRight, Filter, SortDesc, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PrintJob } from '@/types/printJob';

interface PrintJobsListProps {
  printJobs: PrintJob[];
  selectedJob: PrintJob | null;
  onJobSelect: (job: PrintJob) => void;
  isLoading: boolean;
  isRetrying?: boolean;
}

const JobSkeleton = () => (
  <div className="p-4 border rounded-xl bg-white shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-16 flex-shrink-0" />
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending_payment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'pending_payment': return '💳';
      case 'printing': return '🖨️';
      case 'ready': return '✅';
      case 'completed': return '📦';
      default: return '📄';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              Print Jobs
              {isRetrying && (
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {printJobs.length} total jobs • Manage and track all requests
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <SortDesc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : printJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium mb-2">No print jobs found</p>
            <p className="text-sm">Jobs will appear here when customers submit orders</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {printJobs.map((job) => (
              <div
                key={job.id}
                className={`group p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedJob?.id === job.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
                onClick={() => onJobSelect(job)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{job.name}</h3>
                      <span className="text-lg">{getStatusIcon(job.status)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{job.phone}</p>
                    {job.institute && (
                      <p className="text-sm text-gray-500 truncate">{job.institute}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="font-mono text-xs px-2 py-1">
                        #{job.tracking_id}
                      </Badge>
                      {job.total_amount && job.total_amount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          ₹{job.total_amount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(job.status)} text-xs font-medium border`}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    {job.files.length} files
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{job.time_slot}</span>
                  </span>
                  <span className="text-gray-400 hidden sm:inline">
                    {new Date(job.timestamp).toLocaleDateString()}
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
