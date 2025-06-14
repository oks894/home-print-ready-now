
import { useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { useAdminData } from '@/hooks/useAdminData';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <AdminHeader 
        onLogout={() => setIsAuthenticated(false)}
        isRetrying={isRetrying}
        onRefresh={loadData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">Manage your print services and track customer orders</p>
          {isLoading && (
            <div className="mt-2 text-sm text-blue-600">Loading data...</div>
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
  );
};

export default Admin;
