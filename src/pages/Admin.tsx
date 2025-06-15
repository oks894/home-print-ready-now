
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
import { useLiveTracking } from '@/hooks/useLiveTracking';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  
  // Enable live tracking for admin page - simplified
  useLiveTracking('admin');
  
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

  console.log('Admin render - authenticated:', isAuthenticated, 'loading:', isLoading);

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
        <div className="min-h-screen bg-gray-50">
          <AdminHeader 
            onLogout={() => setIsAuthenticated(false)}
            isRetrying={isRetrying}
            onRefresh={loadData}
          />

          {/* Simplified Admin Monitor - no heavy features during loading */}
          {!isLoading && (
            <OnlineUsersMonitor 
              showMilestones={true}
              className="admin-monitor"
            />
          )}

          <div className={`max-w-7xl mx-auto safe-area-inset ${
            isMobile ? 'px-2 py-4' : 'px-4 sm:px-6 lg:px-8 py-6'
          }`}>
            <div className={isMobile ? 'mb-6' : 'mb-8'}>
              <h1 className={`font-bold text-gray-900 ${
                isMobile ? 'text-2xl' : 'text-3xl'
              }`}>
                Dashboard Overview
              </h1>
              <p className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
                Manage your print services and track customer orders
              </p>
              {isLoading && (
                <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading data...
                </div>
              )}
            </div>

            {/* Only show notifications when not loading */}
            {!isLoading && (
              <div className={isMobile ? 'mb-4' : 'mb-6'}>
                <NotificationManager />
              </div>
            )}

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
