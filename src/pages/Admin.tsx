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
import { toast } from "@/components/ui/use-toast";

const AdminContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  
  // Always call hooks at the top level
  const adminDataHook = useAdminData();
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
  } = adminDataHook;

  // Enable live tracking only after authentication
  useLiveTracking(isAuthenticated ? 'admin' : null);

  console.log('Admin render - authenticated:', isAuthenticated, 'loading:', isLoading);

  // Login screen
  if (!isAuthenticated) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        </div>
      </MobileLayout>
    );
  }

  // Main admin interface
  return (
    <SearchProvider>
      <MobileLayout>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader 
            onLogout={() => {
              setIsAuthenticated(false);
            }}
            isRetrying={isRetrying}
            onRefresh={loadData}
          />

          {/* Always show live monitor instantly in admin, show milestones on desktop */}
          <OnlineUsersMonitor 
            showMilestones={!isMobile}
            className="admin-monitor"
          />

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
                  Loading dashboard data...
                </div>
              )}
              {isRetrying && (
                <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  Retrying connection...
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
              onDeleteJob={async (jobId: string) => {
                try {
                  await deleteJob(jobId);
                  toast({
                    title: "Order deleted",
                    description: "The print job was successfully deleted.",
                    variant: "default",
                  });
                  // Refresh data after deletion
                  await loadData();
                  return true;
                } catch (err) {
                  toast({
                    title: "Failed to delete order",
                    description: "There was an error deleting the print job.",
                    variant: "destructive",
                  });
                  return false;
                }
              }}
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
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Admin Panel Error
          </h2>
          <p className="text-gray-600 mb-4">
            The admin panel encountered an error. This might be due to a connection issue.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    }>
      <AdminContent />
    </ErrorBoundary>
  );
};

export default Admin;
