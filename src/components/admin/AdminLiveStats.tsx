
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';

const AdminLiveStats: React.FC = () => {
  const { stats, isLoading } = useStats();

  return (
    <div className="relative w-full max-w-xs mx-auto bg-blue-600 rounded-2xl px-6 py-7 mt-6 mb-10 flex flex-col items-center text-white shadow-lg">
      <span className="absolute top-2 right-4 inline-flex items-center gap-1 bg-green-500/90 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
        LIVE
        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse ml-1" />
      </span>
      <div className="flex flex-col items-center space-y-8 w-full">
        {/* Happy Customers */}
        <div className="flex flex-col items-center space-y-1">
          <Users className="w-10 h-10 mb-1" />
          <span className="text-3xl font-bold">{isLoading ? '—' : `${stats.totalUsers}+`}</span>
          <span className="text-blue-100 text-sm">Happy Customers</span>
        </div>
        {/* Average Rating */}
        <div className="flex flex-col items-center space-y-1">
          <Star className="w-10 h-10 mb-1 fill-yellow-300 text-yellow-300" />
          <span className="text-3xl font-bold">{isLoading ? '—' : stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '5.0'}</span>
          <span className="text-blue-100 text-sm">Average Rating</span>
        </div>
        {/* Print Jobs Completed */}
        <div className="flex flex-col items-center space-y-1">
          <FileText className="w-10 h-10 mb-1" />
          <span className="text-3xl font-bold">{isLoading ? '—' : `${stats.totalJobs}+`}</span>
          <span className="text-blue-100 text-sm">Print Jobs Completed</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveStats;
