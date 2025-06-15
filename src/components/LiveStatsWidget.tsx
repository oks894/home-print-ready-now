
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const LiveStatsWidget: React.FC = () => {
  const { stats, isLoading: isLoadingStats } = useStats();
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="relative bg-[#2563eb] w-[330px] sm:w-[370px] rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center text-white"
      style={{ minHeight: 460 }}>
      {/* LIVE Badge */}
      <span className="absolute top-3 right-4 flex items-center gap-1 bg-green-500/90 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide z-10">
        LIVE
        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse ml-1" />
      </span>
      {/* Stats vertical layout */}
      <div className="flex flex-col items-center w-full h-full justify-center">
        {/* Online/Customers (top) */}
        <Users className="w-9 h-9 mb-3" />
        <div className="w-full flex flex-col items-center mb-3">
          <span className="text-white text-base font-medium">{isLoadingStats ? '—' : `${stats.totalUsers}`}</span>
          <span className="text-sm mt-1 mb-2">Happy Customers</span>
        </div>
        {/* Divider */}
        <div className="w-12 border-t border-white/60 my-1" />
        {/* Star/Ratings (middle) */}
        <Star className="w-9 h-9 mb-3 fill-yellow-300 text-yellow-300" />
        <div className="w-full flex flex-col items-center mb-3">
          <span className="text-white text-base font-medium">
            {isLoadingStats ? '—' : stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '5.0'}
          </span>
          <span className="text-sm mt-1 mb-2">Average Rating</span>
        </div>
        {/* Divider */}
        <div className="w-12 border-t border-white/60 my-1" />
        {/* Print Jobs (bottom) */}
        <FileText className="w-9 h-9 mb-3" />
        <div className="w-full flex flex-col items-center mb-1">
          <span className="text-white text-base font-medium">{isLoadingStats ? '—' : `${stats.totalJobs}`}</span>
          <span className="text-sm mt-1 mb-2">Print Jobs Completed</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsWidget;
