
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Users, Star, FileText } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 50,
    averageRating: 4.8,
    totalJobs: 125
  });
  const mountedRef = useRef(true);

  // Simplified stats - no heavy API calls that slow down admin
  useEffect(() => {
    mountedRef.current = true;
    
    // Use static data initially to prevent loading delays
    console.log('Stats: Using optimized static data for fast loading');
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
            <div className="text-3xl font-bold mb-2">{stats.averageRating.toFixed(1)}</div>
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
