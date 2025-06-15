import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Users, Star, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 4.8,
    totalJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const mountedRef = useRef(true);
  const CACHE_DURATION = 60000; // 1 minute cache

  const calculateStats = useCallback(async () => {
    // Check if we should use cached data
    const now = Date.now();
    if (now - lastFetchTime < CACHE_DURATION && !isLoading) {
      console.log('Stats: Using cached data, skipping fetch');
      return;
    }

    console.log('Stats: Fetching fresh data...');
    
    try {
      // Fetch data in parallel with limits for better performance
      const [jobsResult, feedbackResult] = await Promise.allSettled([
        supabase
          .from('print_jobs')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('feedback')
          .select('rating')
          .limit(100) // Limit for performance
      ]);

      if (!mountedRef.current) return;

      let totalJobs = 0;
      let totalUsers = 0;
      let averageRating = 4.8;

      // Handle jobs result
      if (jobsResult.status === 'fulfilled' && !jobsResult.value.error) {
        totalJobs = jobsResult.value.count || 0;
        totalUsers = totalJobs; // Simple assumption: one user per job
      } else {
        console.error('Stats: Error fetching jobs:', jobsResult.status === 'rejected' ? jobsResult.reason : jobsResult.value.error);
      }

      // Handle feedback result
      if (feedbackResult.status === 'fulfilled' && !feedbackResult.value.error && feedbackResult.value.data) {
        const feedback = feedbackResult.value.data;
        if (feedback.length > 0) {
          const totalRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0);
          averageRating = totalRating / feedback.length;
        }
      } else {
        console.error('Stats: Error fetching feedback:', feedbackResult.status === 'rejected' ? feedbackResult.reason : feedbackResult.value.error);
      }

      const newStats = {
        totalUsers,
        averageRating,
        totalJobs
      };

      console.log('Stats: Updated stats:', newStats);
      setStats(newStats);
      setLastFetchTime(now);
    } catch (error) {
      console.error('Stats: Error calculating stats:', error);
      // Keep existing values on error
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [lastFetchTime, isLoading]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial calculation
    calculateStats();
    
    // Set up auto-refresh every 2 minutes (less frequent)
    const interval = setInterval(() => {
      if (mountedRef.current && !isLoading) {
        calculateStats();
      }
    }, 120000);
    
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [calculateStats]);

  // Simplified loading state - no skeleton that causes flickering
  if (isLoading && stats.totalJobs === 0) {
    return (
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center opacity-50">
              <Users className="w-12 h-12 mb-4" />
              <div className="text-3xl font-bold mb-2">...</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            
            <div className="flex flex-col items-center opacity-50">
              <Star className="w-12 h-12 mb-4 fill-yellow-400 text-yellow-400" />
              <div className="text-3xl font-bold mb-2">...</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            
            <div className="flex flex-col items-center opacity-50">
              <FileText className="w-12 h-12 mb-4" />
              <div className="text-3xl font-bold mb-2">...</div>
              <div className="text-blue-100">Print Jobs Completed</div>
            </div>
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
