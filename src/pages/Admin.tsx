
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { NotificationManager } from '@/components/admin/NotificationManager';
import { SearchProvider } from '@/components/admin/AdminSearch';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useAdminData } from '@/hooks/useAdminData';
import OnlineUsersMonitor from '@/components/OnlineUsersMonitor';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  const {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    loadData,
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob
  } = useAdminData();

  console.log('Admin render - Print jobs:', printJobs.length, 'Feedback:', feedback.length);

  if (!isAuthenticated) {
    return (
      <MobileLayout>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </MobileLayout>
    );
  }

  return (
    <SearchProvider>
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          <AdminHeader 
            onLogout={() => setIsAuthenticated(false)}
            isRetrying={isRetrying}
            onRefresh={loadData}
          />

          {/* Admin Live Monitor with Milestones */}
          <OnlineUsersMonitor 
            showMilestones={true}
            className="admin-monitor"
          />

          <div className={`max-w-7xl mx-auto safe-area-inset ${
            isMobile ? 'px-2 py-4' : 'px-4 sm:px-6 lg:px-8 py-6'
          }`}>
            <div className={isMobile ? 'mb-6' : 'mb-8'}>
              <h1 className={`font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ${
                isMobile ? 'text-2xl' : 'text-3xl'
              }`}>
                Dashboard Overview
              </h1>
              <p className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
                Manage your print services and track customer orders
              </p>
              {isLoading && (
                <div className="mt-2 text-sm text-blue-600">Loading data...</div>
              )}
            </div>

            {/* Add Notification Manager */}
            <div className={isMobile ? 'mb-4' : 'mb-6'}>
              <NotificationManager />
            </div>

            <AdminTabs
              printJobs={printJobs}
              feedback={feedback}
              selectedJob={selectedJob}
              isLoading={isLoading}
              isRetrying={isRetrying}
              onJobSelect={setSelectedJob}
              onStatusUpdate={updateJobStatus}
              onDeleteJob={deleteJob}
              onDeleteFeedback={deleteFeedback}
            />
          </div>
        </div>
      </MobileLayout>
    </SearchProvider>
  );
};

export default Admin;
