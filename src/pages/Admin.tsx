
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MobileAdminHeader } from '@/components/admin/MobileAdminHeader';
import { MobileDrawer } from '@/components/admin/MobileDrawer';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { NotificationManager } from '@/components/admin/NotificationManager';
import { OfflineIndicator } from '@/components/admin/OfflineIndicator';
import { SearchProvider } from '@/components/admin/AdminSearch';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useAdminData } from '@/hooks/useAdminData';
import OnlineUsersMonitor from '@/components/OnlineUsersMonitor';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    printJobs,
    feedback,
    selectedJob,
    isLoading,
    isRetrying,
    hasMore,
    totalCount,
    loadData,
    loadMore,
    updateJobStatus,
    deleteJob,
    deleteFeedback,
    setSelectedJob
  } = useAdminData();

  // Register service worker for offline capability
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <MobileLayout>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </MobileLayout>
    );
  }

  const pendingJobs = printJobs.filter(job => job.status === 'pending').length;

  return (
    <SearchProvider>
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          {/* Offline Indicator */}
          <OfflineIndicator />

          {/* Mobile Navigation Drawer */}
          {isMobile && (
            <MobileDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              pendingCount={pendingJobs}
              feedbackCount={feedback.length}
            />
          )}

          {/* Headers */}
          {isMobile ? (
            <MobileAdminHeader
              onLogout={() => setIsAuthenticated(false)}
              onRefresh={loadData}
              isRetrying={isRetrying}
              onMenuToggle={() => setIsDrawerOpen(true)}
            />
          ) : (
            <AdminHeader 
              onLogout={() => setIsAuthenticated(false)}
              isRetrying={isRetrying}
              onRefresh={loadData}
            />
          )}

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
                {totalCount > 0 && ` • ${totalCount} total jobs`}
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
              hasMore={hasMore}
              onLoadMore={loadMore}
              onJobSelect={setSelectedJob}
              onStatusUpdate={updateJobStatus}
              onDeleteJob={deleteJob}
              onDeleteFeedback={deleteFeedback}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </MobileLayout>
    </SearchProvider>
  );
};

export default Admin;
