
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    totalJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Get total print jobs count
      const { count: jobsCount } = await supabase
        .from('print_jobs')
        .select('*', { count: 'exact', head: true });

      // Get average rating from feedback
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('rating');

      // Calculate average rating
      let averageRating = 0;
      if (feedbackData && feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
        averageRating = totalRating / feedbackData.length;
      }

      // Get unique customers count (based on unique emails/phones from print jobs)
      const { data: customersData } = await supabase
        .from('print_jobs')
        .select('phone');

      const uniqueCustomers = customersData 
        ? new Set(customersData.map(job => job.phone)).size 
        : 0;

      setStats({
        totalUsers: uniqueCustomers,
        averageRating: averageRating,
        totalJobs: jobsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time listeners for live updates
    const printJobsChannel = supabase
      .channel('print_jobs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'print_jobs'
      }, () => {
        fetchStats();
      })
      .subscribe();

    const feedbackChannel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feedback'
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(printJobsChannel);
      supabase.removeChannel(feedbackChannel);
    };
  }, []);

  return { stats, isLoading, refetch: fetchStats };
};
