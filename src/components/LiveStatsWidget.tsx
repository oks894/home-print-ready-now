
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const LiveStatsWidget: React.FC = () => {
  const { stats, isLoading: isLoadingStats } = useStats();
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="relative w-full max-w-4xl bg-[#2563eb] rounded-2xl shadow-lg mx-auto flex flex-row items-center justify-between px-2 py-4 sm:py-5 sm:px-6 text-white min-h-[86px]">
      {/* LIVE Badge */}
      <span className="absolute -top-3 left-1 sm:left-6 flex items-center gap-1 bg-green-500/90 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide z-20 shadow-md border border-green-400">
        LIVE
        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse ml-1" />
      </span>
      {/* Stats - horizontal */}
      <div className="flex flex-1 flex-row justify-between items-center w-full relative z-10">
        {/* Happy Customers */}
        <div className="flex flex-col items-center flex-1 basis-0 min-w-[94px]">
          <Users className="w-7 h-7 mb-1" />
          <span className="text-lg font-bold">{isLoadingStats ? '—' : stats.totalUsers}</span>
          <span className="text-xs mt-1 opacity-90 whitespace-nowrap">Happy Customers</span>
        </div>
        {/* Divider */}
        <div className="h-12 border-l border-white/60 mx-2" />
        {/* Average Rating */}
        <div className="flex flex-col items-center flex-1 basis-0 min-w-[94px]">
          <Star className="w-7 h-7 mb-1 fill-yellow-300 text-yellow-300" />
          <span className="text-lg font-bold">
            {isLoadingStats
              ? '—'
              : stats.averageRating > 0
                ? stats.averageRating.toFixed(1)
                : '5.0'}
          </span>
          <span className="text-xs mt-1 opacity-90 whitespace-nowrap">Average Rating</span>
        </div>
        {/* Divider */}
        <div className="h-12 border-l border-white/60 mx-2" />
        {/* Print Jobs */}
        <div className="flex flex-col items-center flex-1 basis-0 min-w-[94px]">
          <FileText className="w-7 h-7 mb-1" />
          <span className="text-lg font-bold">{isLoadingStats ? '—' : stats.totalJobs}</span>
          <span className="text-xs mt-1 opacity-90 whitespace-nowrap">Print Jobs</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsWidget;
