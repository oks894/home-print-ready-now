import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { PrintJobsList } from './PrintJobsList';
import { FeedbackList } from './FeedbackList';
import { JobDetails } from './JobDetails';
import { ServicesManager } from './ServicesManager';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';
import { useSearch } from '@/components/admin/AdminSearch';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  onJobSelect: (job: PrintJob | null) => void;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => Promise<boolean>;
  onDeleteJob: (jobId: string) => Promise<boolean>;
  onDeleteFeedback: (feedbackId: string) => Promise<void>;
}

export const AdminTabs = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  isRetrying,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback
}: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState('orders');
  const { filteredPrintJobs, filteredFeedback, setData, searchQuery } = useSearch();

  // Update search data when props change
  React.useEffect(() => {
    setData(printJobs, feedback);
  }, [printJobs, feedback, setData]);

  const pendingJobs = filteredPrintJobs.filter(job => job.status === 'pending').length;
  const completedJobs = filteredPrintJobs.filter(job => job.status === 'completed').length;
  const averageRating = filteredFeedback.length > 0 
    ? (filteredFeedback.reduce((sum, item) => sum + item.rating, 0) / filteredFeedback.length).toFixed(1)
    : '0';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPrintJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? 'Filtered results' : 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingJobs}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageRating}</div>
            <p className="text-xs text-muted-foreground">
              {filteredFeedback.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing results for "<span className="font-medium">{searchQuery}</span>" - 
            Found {filteredPrintJobs.length} orders and {filteredFeedback.length} feedback items
          </p>
        </div>
      )}

      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="orders" className="relative">
          Print Jobs
          {pendingJobs > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {pendingJobs}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="feedback">
          Feedback
          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
            {filteredFeedback.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="details" disabled={!selectedJob}>
          Job Details
        </TabsTrigger>
        <TabsTrigger value="services">
          Services
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="space-y-4">
        <PrintJobsList
          printJobs={filteredPrintJobs}
          onJobSelect={onJobSelect}
          selectedJob={selectedJob}
          isLoading={isLoading}
          isRetrying={isRetrying}
        />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <FeedbackList
          feedback={filteredFeedback}
          onDeleteFeedback={onDeleteFeedback}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        {selectedJob ? (
          <JobDetails
            selectedJob={selectedJob}
            onStatusUpdate={onStatusUpdate}
            onDeleteJob={onDeleteJob}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Job Selected</CardTitle>
              <CardDescription>
                Select a print job from the orders tab to view its details.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        <ServicesManager />
      </TabsContent>
    </Tabs>
  );
};
