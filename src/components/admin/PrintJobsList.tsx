import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Package, ChevronDown, Search, Filter } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileAdminCard } from '@/components/mobile/MobileAdminCard';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';

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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.phone.includes(searchTerm) ||
                         job.tracking_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-4 -mx-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Print Jobs</h3>
            {totalCount !== undefined && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {totalCount} total
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, phone, or tracking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'pending', 'printing', 'ready', 'completed'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="whitespace-nowrap"
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <MobileAdminCard
              key={job.id}
              job={job}
              onSelect={onJobSelect}
              isSelected={selectedJob?.id === job.id}
              index={index}
            />
          ))}
        </div>
        
        {hasMore && (
          <div ref={ref} className="py-6">
            {isLoading ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Loading more jobs...</span>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="w-full py-3 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
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
