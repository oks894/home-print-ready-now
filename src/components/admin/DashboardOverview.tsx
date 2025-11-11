import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Printer, BookOpen, GraduationCap, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { StatsCardSkeleton } from '@/components/skeletons/CardSkeleton';
import { format } from 'date-fns';

interface DashboardStats {
  totalOrders: number;
  totalNotes: number;
  totalAssignments: number;
  estimatedRevenue: number;
  pendingOrders: number;
  pendingPayments: number;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Subscribe to activity log updates
    const channel = supabase
      .channel('activity-log-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_log'
        },
        () => {
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load stats in parallel
      const [ordersRes, notesRes, assignmentsRes, paymentsRes] = await Promise.all([
        supabase.from('print_jobs').select('*', { count: 'exact', head: true }),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('assignments').select('*', { count: 'exact', head: true }),
        supabase.from('pending_payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const pendingOrders = await supabase
        .from('print_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Calculate estimated revenue (manual tracking)
      const revenueRes = await supabase
        .from('pending_payments')
        .select('amount')
        .eq('status', 'approved');

      const estimatedRevenue = revenueRes.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      setStats({
        totalOrders: ordersRes.count || 0,
        totalNotes: notesRes.count || 0,
        totalAssignments: assignmentsRes.count || 0,
        estimatedRevenue,
        pendingOrders: pendingOrders.count || 0,
        pendingPayments: paymentsRes.count || 0,
      });

      await loadActivities();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: Printer,
      trend: stats?.pendingOrders ? `${stats.pendingOrders} pending` : 'All caught up',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Notes',
      value: stats?.totalNotes || 0,
      icon: BookOpen,
      trend: 'Approved',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Assignments',
      value: stats?.totalAssignments || 0,
      icon: GraduationCap,
      trend: 'All time',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Revenue',
      value: `₹${stats?.estimatedRevenue || 0}`,
      icon: DollarSign,
      trend: 'Verified payments',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Actions Alert */}
      {stats && (stats.pendingOrders > 0 || stats.pendingPayments > 0) && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.pendingOrders > 0 && (
                <li className="text-sm">
                  • {stats.pendingOrders} pending print order{stats.pendingOrders > 1 ? 's' : ''} awaiting review
                </li>
              )}
              {stats.pendingPayments > 0 && (
                <li className="text-sm">
                  • {stats.pendingPayments} payment{stats.pendingPayments > 1 ? 's' : ''} need verification
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {format(new Date(activity.created_at), 'MMM dd, yyyy • hh:mm a')}
                      {activity.user_email && (
                        <span>• {activity.user_email}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
