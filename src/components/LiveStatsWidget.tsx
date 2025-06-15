
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const LiveStatsWidget: React.FC = () => {
  const { stats, isLoading: isLoadingStats } = useStats();
  const { onlineCount } = useOnlineUsers();

  // Format for plus sign if nonzero
  const totalUsersDisplay = isLoadingStats
    ? '—'
    : stats.totalUsers > 5
      ? `${stats.totalUsers}+`
      : stats.totalUsers;

  const printJobsDisplay = isLoadingStats
    ? '—'
    : stats.totalJobs > 14
      ? `${stats.totalJobs}+`
      : stats.totalJobs;

  return (
    <div className="relative w-full max-w-3xl bg-[#2563eb] rounded-xl shadow-xl mx-auto flex flex-row items-center justify-between px-3 py-5 sm:px-10 sm:py-7 text-white min-h-[92px] animate-fade-in">
      {/* LIVE Badge */}
      <span className="absolute -top-3 left-1 sm:left-6 flex items-center gap-1 bg-green-500/95 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider z-30 shadow border border-green-400 animate-pulse">
        LIVE
        <span className="w-2 h-2 rounded-full bg-green-300 animate-ping ml-1" />
      </span>
      {/* Stats - horizontal layout with dividers */}
      <div className="flex flex-1 flex-row justify-between items-center w-full relative z-20">
        {/* Happy Customers */}
        <div className="flex flex-col items-center flex-1 min-w-[90px]">
          <Users className="w-8 h-8 mb-2" />
          <span className="text-2xl font-black leading-tight">{totalUsersDisplay}</span>
          <span className="text-sm mt-1 opacity-90 whitespace-nowrap font-medium">Happy Customers</span>
        </div>
        {/* Divider */}
        <div className="h-11 border-l border-white/40 mx-4" />
        {/* Average Rating */}
        <div className="flex flex-col items-center flex-1 min-w-[90px]">
          <Star className="w-8 h-8 mb-2 fill-yellow-400 text-yellow-400 drop-shadow-md" />
          <span className="text-2xl font-black leading-tight">
            {isLoadingStats
              ? '—'
              : stats.averageRating > 0
                ? stats.averageRating.toFixed(1)
                : '5.0'}
          </span>
          <span className="text-sm mt-1 opacity-90 whitespace-nowrap font-medium">Average Rating</span>
        </div>
        {/* Divider */}
        <div className="h-11 border-l border-white/40 mx-4" />
        {/* Print Jobs */}
        <div className="flex flex-col items-center flex-1 min-w-[90px]">
          <FileText className="w-8 h-8 mb-2" />
          <span className="text-2xl font-black leading-tight">{printJobsDisplay}</span>
          <span className="text-sm mt-1 opacity-90 whitespace-nowrap font-medium">Print Jobs</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsWidget;
