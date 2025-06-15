
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { SearchProvider } from '@/components/admin/AdminSearch';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useAdminData } from '@/hooks/useAdminData';
import OnlineUsersMonitor from '@/components/OnlineUsersMonitor';
import { useLiveTracking } from '@/hooks/useLiveTracking';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const AdminContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFullFeatures, setShowFullFeatures] = useState(false);
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

  // Show full features after initial load is complete with fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFullFeatures(true);
    }, 2000); // Show features after 2 seconds regardless of loading state
    
    return () => clearTimeout(timer);
  }, []);

  console.log('Admin render - authenticated:', isAuthenticated, 'loading:', isLoading, 'showFullFeatures:', showFullFeatures);

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

          {/* Show monitor after delay to prevent loading issues */}
          {showFullFeatures && (
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
                  Loading dashboard...
                </div>
              )}
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

const Admin = () => {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Admin Panel Error
          </h2>
          <p className="text-gray-600 mb-4">
            The admin panel encountered an error. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    }>
      <AdminContent />
    </ErrorBoundary>
  );
};

export default Admin;
