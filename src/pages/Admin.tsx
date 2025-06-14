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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onLogout={() => setIsAuthenticated(false)}
        isRetrying={isRetrying}
        onRefresh={loadData}
      />

      <div className="max-w-7xl mx-auto p-4">
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
