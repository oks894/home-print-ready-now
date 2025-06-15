
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';

interface AdminStatsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  isLoading: boolean;
  searchQuery: string;
}

export const AdminStats = ({ printJobs, feedback, isLoading, searchQuery }: AdminStatsProps) => {
  const pendingJobs = printJobs.filter(job => job.status === 'pending').length;
  const completedJobs = printJobs.filter(job => job.status === 'completed').length;
  const averageRating = feedback.length > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="transition-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '...' : printJobs.length}</div>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? 'Filtered results' : 'All time'}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {isLoading ? '...' : pendingJobs}
          </div>
          <p className="text-xs text-muted-foreground">
            Awaiting processing
          </p>
        </CardContent>
      </Card>

      <Card className="transition-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {isLoading ? '...' : completedJobs}
          </div>
          <p className="text-xs text-muted-foreground">
            Successfully finished
          </p>
        </CardContent>
      </Card>

      <Card className="transition-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {isLoading ? '...' : averageRating}
          </div>
          <p className="text-xs text-muted-foreground">
            {feedback.length} reviews
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
