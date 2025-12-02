import { useState } from 'react';
import { PrintJob } from '@/types/printJob';
import { Feedback } from '@/types/admin';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PrintJobsList } from './PrintJobsList';
import { JobDetails } from './JobDetails';
import { FeedbackList } from './FeedbackList';
import { ServicesManager } from './ServicesManager';
import { ExternalLinksManager } from './ExternalLinksManager';
import { MobileJobsList } from './mobile/MobileJobsList';
import { MobileJobDetailsSheet } from './mobile/MobileJobDetailsSheet';
import { MobileFeedbackManager } from './mobile/MobileFeedbackManager';
import { MobileServicesManager } from './mobile/MobileServicesManager';
import { MobileLinksManager } from './mobile/MobileLinksManager';
import { MobileSettingsPanel } from './mobile/MobileSettingsPanel';
import { AssignmentPendingVerification } from './assignment-help/AssignmentPendingVerification';
import { AssignmentsOverview } from './assignment-help/AssignmentsOverview';
import { PaymentManagement } from './assignment-help/PaymentManagement';
import { RateSettings } from './assignment-help/RateSettings';
import { SolverManagement } from './assignment-help/SolverManagement';
import { TransactionHistory } from './assignment-help/TransactionHistory';
import ResumeLabAdmin from './resume-lab/ResumeLabAdmin';
import { DashboardOverview } from './DashboardOverview';
import { PaymentSettings } from './PaymentSettings';
import { PendingPayments } from './PendingPayments';
import { GlobalSettings } from './GlobalSettings';
import { Analytics } from './Analytics';
import { LayoutDashboard, CreditCard, Clock, Settings, BarChart3, Printer, MessageSquare, GraduationCap, FileText, Cog, Link } from 'lucide-react';

interface AdminTabsProps {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onJobSelect: (job: PrintJob | null) => void;
  onStatusUpdate: (jobId: string, status: string) => void;
  onDeleteJob: (jobId: string) => void;
  onDeleteFeedback: (feedbackId: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export const AdminTabs = ({
  printJobs,
  feedback,
  selectedJob,
  isLoading,
  hasMore,
  onLoadMore,
  onJobSelect,
  onStatusUpdate,
  onDeleteJob,
  onDeleteFeedback,
  activeTab,
  onTabChange,
  onLogout
}: AdminTabsProps) => {
  const isMobile = useIsMobile();
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  const handleJobSelect = (job: PrintJob | null) => {
    onJobSelect(job);
    if (isMobile && job) {
      setIsJobDetailsOpen(true);
    }
  };

  if (isMobile) {
    return (
      <>
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'printJobs' && (
          <>
            <MobileJobsList
              jobs={printJobs}
              selectedJob={selectedJob}
              onJobSelect={handleJobSelect}
              onStatusUpdate={onStatusUpdate}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              totalCount={printJobs.length}
            />
            {selectedJob && (
              <MobileJobDetailsSheet
                job={selectedJob}
                isOpen={isJobDetailsOpen}
                onClose={() => {
                  setIsJobDetailsOpen(false);
                  onJobSelect(null);
                }}
                onStatusUpdate={onStatusUpdate}
              />
            )}
          </>
        )}
        {activeTab === 'feedback' && (
          <MobileFeedbackManager
            feedback={feedback}
            onDeleteFeedback={onDeleteFeedback}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'pendingPayments' && <PendingPayments />}
        {activeTab === 'services' && <MobileServicesManager />}
        {activeTab === 'links' && <MobileLinksManager />}
        {activeTab === 'paymentSettings' && <PaymentSettings />}
        {activeTab === 'globalSettings' && <GlobalSettings />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && onLogout && (
          <MobileSettingsPanel onLogout={onLogout} />
        )}
      </>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6 h-auto gap-1">
        <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <LayoutDashboard className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="printJobs" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <Printer className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Orders</span>
        </TabsTrigger>
        <TabsTrigger value="pendingPayments" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Payments</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <GraduationCap className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="resumeLab" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Resume</span>
        </TabsTrigger>
        <TabsTrigger value="feedback" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Feedback</span>
        </TabsTrigger>
        <TabsTrigger value="services" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <Cog className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Services</span>
        </TabsTrigger>
        <TabsTrigger value="paymentSettings" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <CreditCard className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Pay Config</span>
        </TabsTrigger>
        <TabsTrigger value="globalSettings" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Settings</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs lg:text-sm py-2">
          <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="hidden lg:inline">Analytics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <DashboardOverview />
      </TabsContent>

      <TabsContent value="printJobs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PrintJobsList jobs={printJobs} selectedJob={selectedJob} onJobSelect={onJobSelect} isLoading={isLoading} hasMore={hasMore} onLoadMore={onLoadMore} totalCount={printJobs.length} />
          </div>
          <div className="lg:col-span-1 sticky top-6">
            <JobDetails job={selectedJob} onStatusUpdate={onStatusUpdate} onDelete={onDeleteJob} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pendingPayments">
        <PendingPayments />
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackList feedback={feedback} onDeleteFeedback={onDeleteFeedback} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="assignments">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="solvers">Solvers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="pending"><AssignmentPendingVerification /></TabsContent>
          <TabsContent value="overview"><AssignmentsOverview /></TabsContent>
          <TabsContent value="payments"><PaymentManagement /></TabsContent>
          <TabsContent value="rates"><RateSettings /></TabsContent>
          <TabsContent value="solvers"><SolverManagement /></TabsContent>
          <TabsContent value="transactions"><TransactionHistory /></TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="resumeLab"><ResumeLabAdmin /></TabsContent>
      <TabsContent value="services"><ServicesManager /></TabsContent>
      <TabsContent value="links"><ExternalLinksManager /></TabsContent>
      <TabsContent value="paymentSettings"><PaymentSettings /></TabsContent>
      <TabsContent value="globalSettings"><GlobalSettings /></TabsContent>
      <TabsContent value="analytics"><Analytics /></TabsContent>
    </Tabs>
  );
};
