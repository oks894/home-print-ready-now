
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Package, ChevronDown } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileJobCard } from './MobileJobCard';
import { useInView } from 'react-intersection-observer';

interface PrintJobsListProps {
  jobs: PrintJob[];
  selectedJob: PrintJob | null;
  onJobSelect: (job: PrintJob) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const PrintJobsList: React.FC<PrintJobsListProps> = ({
  jobs,
  selectedJob,
  onJobSelect,
  isLoading,
  hasMore,
  onLoadMore,
  totalCount
}) => {
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Print Jobs</h3>
          {totalCount !== undefined && (
            <Badge variant="outline">{totalCount} total</Badge>
          )}
        </div>
        
        {jobs.map((job, index) => (
          <MobileJobCard
            key={job.id}
            job={job}
            onSelect={onJobSelect}
            isSelected={selectedJob?.id === job.id}
            index={index}
          />
        ))}
        
        {hasMore && (
          <div ref={ref} className="py-4">
            {isLoading ? (
              <div className="text-center text-sm text-gray-500">Loading more...</div>
            ) : (
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="w-full"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Jobs
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Print Jobs</h3>
        {totalCount !== undefined && (
          <Badge variant="outline">{totalCount} total</Badge>
        )}
      </div>
      
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedJob?.id === job.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onJobSelect(job)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{job.name}</span>
              </div>
              <Badge className={getStatusColor(job.status)}>
                {job.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(job.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>₹{job.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              ID: {job.tracking_id}
            </div>
          </motion.div>
        ))}
        
        {hasMore && (
          <div ref={ref} className="py-4">
            {isLoading ? (
              <div className="text-center text-sm text-gray-500">Loading more...</div>
            ) : (
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="w-full"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Jobs
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
