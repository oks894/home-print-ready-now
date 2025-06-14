
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintJobsList } from '@/components/admin/PrintJobsList';
import { JobDetails } from '@/components/admin/JobDetails';
import { FeedbackList } from '@/components/admin/FeedbackList';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { NotificationManager } from '@/components/admin/NotificationManager';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';
import { FileText, MessageSquare, Settings, Bell, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  onJobSelect: (job: PrintJob) => void;
  onStatusUpdate: (jobId: string, status: PrintJob['status']) => void;
  onDeleteJob: (jobId: string) => void;
  onDeleteFeedback: (feedbackId: string) => void;
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
  // Calculate stats
  const activeJobs = printJobs.filter(job => ['pending', 'printing'].includes(job.status)).length;
  const completedJobs = printJobs.filter(job => job.status === 'completed').length;
  const avgRating = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-xl font-bold text-gray-900">{printJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 text-white rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">{activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-xl font-bold text-gray-900">{avgRating}★</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">{completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-white border shadow-sm">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Print Jobs</span>
            <span className="sm:hidden">Jobs</span>
            <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
              {printJobs.length}
            </span>
          </TabsTrigger>
          
          <TabsTrigger value="feedback" className="data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-200">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Feedback</span>
            <span className="sm:hidden">Reviews</span>
            <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
              {feedback.length}
            </span>
          </TabsTrigger>
          
          <TabsTrigger value="services" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-200">
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">Services</span>
            <span className="lg:hidden">Config</span>
          </TabsTrigger>
          
          <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all duration-200">
            <Bell className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">Notifications</span>
            <span className="lg:hidden">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <PrintJobsList
                printJobs={printJobs}
                selectedJob={selectedJob}
                onJobSelect={onJobSelect}
                isLoading={isLoading}
                isRetrying={isRetrying}
              />
            </div>
            
            <div className={`${selectedJob ? 'block' : 'hidden lg:block'}`}>
              <JobDetails
                selectedJob={selectedJob}
                onStatusUpdate={onStatusUpdate}
                onDeleteJob={onDeleteJob}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackList
            feedback={feedback}
            onDeleteFeedback={onDeleteFeedback}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
