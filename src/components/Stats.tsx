
import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { useStats } from '@/hooks/useStats';

const Stats = () => {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 mb-4 bg-blue-500 animate-pulse rounded"></div>
                <div className="text-3xl font-bold mb-2 bg-blue-500 animate-pulse h-8 w-16 rounded"></div>
                <div className="text-blue-100 bg-blue-500 animate-pulse h-4 w-24 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-4" />
            <div className="text-3xl font-bold mb-2">{stats.totalUsers}+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          
          <div className="flex flex-col items-center">
            <Star className="w-12 h-12 mb-4 fill-yellow-400 text-yellow-400" />
            <div className="text-3xl font-bold mb-2">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '5.0'}
            </div>
            <div className="text-blue-100">Average Rating</div>
          </div>
          
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 mb-4" />
            <div className="text-3xl font-bold mb-2">{stats.totalJobs}+</div>
            <div className="text-blue-100">Print Jobs Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
