import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { MobileJobCardOptimized } from './MobileJobCardOptimized';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface MobileJobsListProps {
  jobs: PrintJob[];
  selectedJob: PrintJob | null;
  onJobSelect: (job: PrintJob) => void;
  onStatusUpdate?: (jobId: string, status: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalCount: number;
}

const statusFilters = [
  { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
  { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const MobileJobsList = ({
  jobs,
  selectedJob,
  onJobSelect,
  onStatusUpdate,
  isLoading,
  hasMore,
  onLoadMore,
  totalCount
}: MobileJobsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    if (status === 'all') return jobs.length;
    return jobs.filter(job => job.status === status).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search and Filters */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 space-y-3 safe-area-top">
        {/* Search Toggle and Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Print Jobs</h2>
            <p className="text-sm text-gray-500">{totalCount} total jobs</p>
          </div>
          
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2"
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </TouchButton>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              placeholder="Search by name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </motion.div>
        )}

        {/* Status Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((filter) => (
            <TouchButton
              key={filter.id}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(filter.id)}
              className="flex-shrink-0 px-3 py-1 h-8"
            >
              <Badge 
                className={`${
                  statusFilter === filter.id 
                    ? 'bg-primary text-white' 
                    : filter.color
                } text-xs`}
              >
                {filter.label} ({getStatusCount(filter.id)})
              </Badge>
            </TouchButton>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 safe-area-bottom">
        {isLoading && jobs.length === 0 ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No print jobs available'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MobileJobCardOptimized
                  job={job}
                  onSelect={onJobSelect}
                  isSelected={selectedJob?.id === job.id}
                  onStatusUpdate={onStatusUpdate}
                />
              </motion.div>
            ))}

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading more jobs...</span>
                    </div>
                  </div>
                ) : (
                  <TouchButton
                    variant="outline"
                    onClick={onLoadMore}
                    className="w-full"
                  >
                    Load More Jobs
                  </TouchButton>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};