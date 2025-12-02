import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

type DateRange = 'week' | 'month' | 'year' | 'all';

export const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return startOfWeek(now).toISOString();
      case 'month':
        return startOfMonth(now).toISOString();
      case 'year':
        return startOfYear(now).toISOString();
      default:
        return null;
    }
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const dateFilter = getDateFilter();

      let printQuery = supabase.from('print_jobs').select('*');
      let notesQuery = supabase.from('notes').select('*');
      let assignQuery = supabase.from('assignments').select('*');
      let paymentQuery = supabase.from('pending_payments').select('*').eq('status', 'approved');

      if (dateFilter) {
        printQuery = printQuery.gte('created_at', dateFilter);
        notesQuery = notesQuery.gte('created_at', dateFilter);
        assignQuery = assignQuery.gte('created_at', dateFilter);
        paymentQuery = paymentQuery.gte('created_at', dateFilter);
      }

      const [printJobs, notes, assignments, paymentsRes] = await Promise.all([
        printQuery,
        notesQuery,
        assignQuery,
        paymentQuery,
      ]);

      // Calculate metrics
      const totalRevenue = paymentsRes.data?.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0) || 0;
      const avgOrderValue = printJobs.data?.length
        ? (printJobs.data.reduce((sum: number, j: any) => sum + (Number(j.total_amount) || 0), 0) / printJobs.data.length)
        : 0;

      // Group by service type
      const serviceBreakdown = {
        prints: printJobs.data?.length || 0,
        notes: notes.data?.length || 0,
        assignments: assignments.data?.length || 0,
      };

      const mostPopular = Object.entries(serviceBreakdown).sort(([, a], [, b]) => b - a)[0];

      setStats({
        totalOrders: printJobs.data?.length || 0,
        totalNotes: notes.data?.length || 0,
        totalAssignments: assignments.data?.length || 0,
        totalRevenue,
        avgOrderValue,
        serviceBreakdown,
        mostPopularService: mostPopular ? mostPopular[0] : 'prints',
        recentOrders: printJobs.data?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = async (type: 'orders' | 'assignments' | 'notes' | 'all') => {
    try {
      let data: any[] = [];
      let filename = `ellio-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;

      if (type === 'orders' || type === 'all') {
        const { data: orders } = await supabase
          .from('print_jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (orders) {
          const csv = [
            ['ID', 'Name', 'Phone', 'Institute', 'Status', 'Amount', 'Date'].join(','),
            ...orders.map((order) =>
              [
                order.id,
                order.name,
                order.phone,
                order.institute,
                order.status,
                order.total_amount || 0,
                format(new Date(order.timestamp), 'yyyy-MM-dd HH:mm'),
              ].join(',')
            ),
          ].join('\n');

          downloadCSV(csv, `ellio-print-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        }
      }

      if (type === 'assignments' || type === 'all') {
        const { data: assignments } = await supabase
          .from('assignments')
          .select('*')
          .order('created_at', { ascending: false });

        if (assignments) {
          const csv = [
            ['ID', 'Student', 'Subject', 'Class', 'Status', 'Total Fee', 'Date'].join(','),
            ...assignments.map((a) =>
              [
                a.id,
                a.student_name,
                a.subject,
                a.class_level,
                a.status,
                a.total_fee,
                format(new Date(a.created_at), 'yyyy-MM-dd HH:mm'),
              ].join(',')
            ),
          ].join('\n');

          downloadCSV(csv, `ellio-assignments-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        }
      }

      if (type === 'notes' || type === 'all') {
        const { data: notes } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (notes) {
          const csv = [
            ['ID', 'Title', 'Subject', 'Class', 'Uploader', 'Status', 'Downloads', 'Date'].join(','),
            ...notes.map((note) =>
              [
                note.id,
                note.title,
                note.subject,
                note.class_level,
                note.uploader_name,
                note.status,
                note.download_count,
                format(new Date(note.created_at), 'yyyy-MM-dd HH:mm'),
              ].join(',')
            ),
          ].join('\n');

          downloadCSV(csv, `ellio-notes-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        }
      }

      toast({
        title: 'Export Complete',
        description: `Data exported successfully`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const dateRanges: { value: DateRange; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap gap-2">
        {dateRanges.map((range) => (
          <Button
            key={range.value}
            variant={dateRange === range.value ? 'default' : 'outline'}
            onClick={() => setDateRange(range.value)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {range.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Print jobs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats?.totalRevenue?.toFixed(0) || 0}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Verified payments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-3xl font-bold">₹{stats?.avgOrderValue?.toFixed(0) || 0}</p>
              <p className="text-xs text-muted-foreground">Per order</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Most Popular</p>
              <p className="text-3xl font-bold capitalize">{stats?.mostPopularService || '-'}</p>
              <p className="text-xs text-muted-foreground">Top service</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Service Breakdown</CardTitle>
          <CardDescription>Distribution across services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Print Orders</span>
                <span className="text-sm font-semibold">{stats?.serviceBreakdown?.prints || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${
                      ((stats?.serviceBreakdown?.prints || 0) /
                        ((stats?.serviceBreakdown?.prints || 0) +
                          (stats?.serviceBreakdown?.notes || 0) +
                          (stats?.serviceBreakdown?.assignments || 0) || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Notes</span>
                <span className="text-sm font-semibold">{stats?.serviceBreakdown?.notes || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${
                      ((stats?.serviceBreakdown?.notes || 0) /
                        ((stats?.serviceBreakdown?.prints || 0) +
                          (stats?.serviceBreakdown?.notes || 0) +
                          (stats?.serviceBreakdown?.assignments || 0) || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Assignments</span>
                <span className="text-sm font-semibold">{stats?.serviceBreakdown?.assignments || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${
                      ((stats?.serviceBreakdown?.assignments || 0) /
                        ((stats?.serviceBreakdown?.prints || 0) +
                          (stats?.serviceBreakdown?.notes || 0) +
                          (stats?.serviceBreakdown?.assignments || 0) || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download reports as CSV files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => exportToCSV('orders')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Print Orders
            </Button>
            <Button onClick={() => exportToCSV('assignments')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Assignments
            </Button>
            <Button onClick={() => exportToCSV('notes')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Notes
            </Button>
            <Button onClick={() => exportToCSV('all')} variant="default">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
