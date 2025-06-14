
import React, { useEffect, useState } from 'react';
import { Users, Star, FileText } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    totalJobs: 0
  });

  const calculateStats = () => {
    const printJobs = JSON.parse(localStorage.getItem('printJobs') || '[]');
    const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    
    const totalUsers = printJobs.length;
    const totalJobs = printJobs.length;
    const averageRating = feedback.length > 0 
      ? feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / feedback.length 
      : 4.8; // Default high rating for demo

    setStats({ totalUsers, averageRating, totalJobs });
  };

  useEffect(() => {
    // Initial calculation
    calculateStats();
    
    // Set up auto-refresh every 5 minutes (300000ms)
    const interval = setInterval(calculateStats, 300000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
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
