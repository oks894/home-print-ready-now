
import React, { useEffect, useState } from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 4.8,
    totalJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateStats = async () => {
    try {
      // Get print jobs count
      const { data: printJobs, error: jobsError } = await supabase
        .from('print_jobs')
        .select('*');

      if (jobsError) {
        console.error('Error fetching print jobs:', jobsError);
      }

      // Get feedback data for rating calculation
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('rating');

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      }

      const totalJobs = printJobs?.length || 0;
      const totalUsers = totalJobs; // Assuming one user per job for now
      
      let averageRating = 4.8; // Default rating
      if (feedback && feedback.length > 0) {
        const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
        averageRating = totalRating / feedback.length;
      }

      setStats({
        totalUsers,
        averageRating,
        totalJobs
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Keep default values if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial calculation
    calculateStats();
    
    // Set up auto-refresh every 5 minutes (300000ms)
    const interval = setInterval(calculateStats, 300000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 mb-4 bg-blue-500 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-blue-500 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-blue-500 rounded animate-pulse"></div>
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
