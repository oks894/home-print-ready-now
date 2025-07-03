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
import { useIsMobile } from '@/hooks/use-mobile';

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
  activeTab?: string;
  onTabChange?: (tab: string) => void;
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
  onDeleteFeedback,
  activeTab = 'orders',
  onTabChange
}: AdminTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState('orders');
  const { filteredPrintJobs, filteredFeedback, setData, searchQuery } = useSearch();
  const isMobile = useIsMobile();

  // Use external tab control if provided, otherwise use internal state
  const currentTab = onTabChange ? activeTab : internalActiveTab;
  const handleTabChange = onTabChange || setInternalActiveTab;

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
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      {/* Stats Cards */}
      <div className={`grid gap-4 mb-6 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'
      }`}>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${
            isMobile ? 'pb-1' : 'pb-2'
          }`}>
            <CardTitle className={isMobile ? 'text-xs font-medium' : 'text-sm font-medium'}>
              Total Orders
            </CardTitle>
            <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {filteredPrintJobs.length}
            </div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {searchQuery ? 'Filtered results' : 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${
            isMobile ? 'pb-1' : 'pb-2'
          }`}>
            <CardTitle className={isMobile ? 'text-xs font-medium' : 'text-sm font-medium'}>
              Pending
            </CardTitle>
            <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : ''}>
            <div className={`font-bold text-orange-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {pendingJobs}
            </div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${
            isMobile ? 'pb-1' : 'pb-2'
          }`}>
            <CardTitle className={isMobile ? 'text-xs font-medium' : 'text-sm font-medium'}>
              Completed
            </CardTitle>
            <TrendingUp className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : ''}>
            <div className={`font-bold text-green-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {completedJobs}
            </div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${
            isMobile ? 'pb-1' : 'pb-2'
          }`}>
            <CardTitle className={isMobile ? 'text-xs font-medium' : 'text-sm font-medium'}>
              Avg Rating
            </CardTitle>
            <MessageSquare className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : ''}>
            <div className={`font-bold text-blue-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {averageRating}
            </div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {filteredFeedback.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className={`p-3 bg-blue-50 border border-blue-200 rounded-lg ${isMobile ? 'mb-4' : 'mb-4'}`}>
          <p className={`text-blue-800 ${isMobile ? 'text-sm' : 'text-sm'}`}>
            Showing results for "<span className="font-medium">{searchQuery}</span>" - 
            Found {filteredPrintJobs.length} orders and {filteredFeedback.length} feedback items
          </p>
        </div>
      )}

      {/* Mobile tabs are handled by drawer, desktop shows normal tabs */}
      {!isMobile && (
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
      )}

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
            job={selectedJob}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDeleteJob}
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
