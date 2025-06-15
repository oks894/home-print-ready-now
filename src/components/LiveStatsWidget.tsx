
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const LiveStatsWidget: React.FC = () => {
  const { stats, isLoading: isLoadingStats } = useStats();
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="w-full max-w-lg mx-auto bg-blue-600 rounded-2xl px-6 py-6 my-6 flex flex-col items-center text-white shadow-lg">
      <span className="absolute top-2 right-4 inline-flex items-center gap-1 bg-green-500/90 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
        LIVE
        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse ml-1" />
      </span>
      <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-8">
        {/* Current Online Users */}
        <div className="flex flex-col items-center space-y-1">
          <Users className="w-9 h-9 mb-1" />
          <span className="text-2xl font-bold">{onlineCount}</span>
          <span className="text-blue-100 text-xs sm:text-sm">Active Right Now</span>
        </div>
        {/* Happy Customers */}
        <div className="flex flex-col items-center space-y-1">
          <Star className="w-9 h-9 mb-1 fill-yellow-300 text-yellow-300" />
          <span className="text-2xl font-bold">{isLoadingStats ? '—' : `${stats.totalUsers}+`}</span>
          <span className="text-blue-100 text-xs sm:text-sm">Happy Customers</span>
        </div>
        {/* Print Jobs Completed */}
        <div className="flex flex-col items-center space-y-1">
          <FileText className="w-9 h-9 mb-1" />
          <span className="text-2xl font-bold">{isLoadingStats ? '—' : `${stats.totalJobs}+`}</span>
          <span className="text-blue-100 text-xs sm:text-sm">Print Jobs Completed</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsWidget;
