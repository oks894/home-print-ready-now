import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MobileAdminHeader } from '@/components/admin/MobileAdminHeader';
import { MobileBottomNav } from '@/components/admin/mobile/MobileBottomNav';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { OfflineIndicator } from '@/components/admin/OfflineIndicator';
import { SearchProvider } from '@/components/admin/AdminSearch';
import { MobileAdminLayout } from '@/components/mobile/MobileAdminLayout';
import { useAdminData } from '@/hooks/useAdminData';
import OnlineUsersMonitor from '@/components/OnlineUsersMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <MobileAdminLayout>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </MobileAdminLayout>
    );
  }

  const pendingJobs = printJobs.filter(job => job.status === 'pending').length;

  return (
    <ErrorBoundary>
      <MobileAdminLayout>
        <SearchProvider>
          <OfflineIndicator />

        {!isMobile && (
          <AdminHeader 
            onLogout={handleLogout}
            isRetrying={isRetrying}
            onRefresh={loadData}
          />
        )}

        {isMobile && (
          <MobileAdminHeader
            onLogout={handleLogout}
            onRefresh={loadData}
            isRetrying={isRetrying}
            onMenuToggle={() => {}}
          />
        )}

        <OnlineUsersMonitor 
          showMilestones={true}
          className="admin-monitor"
        />

        <div className={`max-w-7xl mx-auto ${
          isMobile ? 'px-0 pt-2 pb-24' : 'px-4 sm:px-6 lg:px-8 py-6'
        }`}>
          {!isMobile && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your print services and track customer orders
                {totalCount > 0 && ` • ${totalCount} total jobs`}
              </p>
              {isLoading && (
                <div className="mt-2 text-sm text-blue-600">Loading data...</div>
              )}
            </div>
          )}

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
            onLogout={handleLogout}
          />
        </div>

        {isMobile && (
          <MobileBottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingCount={pendingJobs}
            feedbackCount={feedback.length}
            onRefresh={loadData}
            isRefreshing={isRetrying}
          />
        )}
        </SearchProvider>
      </MobileAdminLayout>
    </ErrorBoundary>
  );
};

export default Admin;
