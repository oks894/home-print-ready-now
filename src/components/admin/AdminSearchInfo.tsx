
import React from 'react';

interface AdminSearchInfoProps {
  searchQuery: string;
  printJobsCount: number;
  feedbackCount: number;
  isLoading: boolean;
}

export const AdminSearchInfo = ({ 
  searchQuery, 
  printJobsCount, 
  feedbackCount, 
  isLoading 
}: AdminSearchInfoProps) => {
  if (!searchQuery || isLoading) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-800">
        Showing results for "<span className="font-medium">{searchQuery}</span>" - 
        Found {printJobsCount} orders and {feedbackCount} feedback items
      </p>
    </div>
  );
};
