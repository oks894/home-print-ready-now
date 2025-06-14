
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredPrintJobs: any[];
  filteredFeedback: any[];
  setData: (printJobs: any[], feedback: any[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPrintJobs, setAllPrintJobs] = useState<any[]>([]);
  const [allFeedback, setAllFeedback] = useState<any[]>([]);

  const filterPrintJobs = (jobs: any[], query: string) => {
    if (!query.trim()) return jobs;
    
    const lowerQuery = query.toLowerCase();
    return jobs.filter(job => 
      job.name?.toLowerCase().includes(lowerQuery) ||
      job.phone?.toLowerCase().includes(lowerQuery) ||
      job.tracking_id?.toLowerCase().includes(lowerQuery) ||
      job.institute?.toLowerCase().includes(lowerQuery) ||
      job.status?.toLowerCase().includes(lowerQuery) ||
      job.selected_services?.some((service: any) => 
        service.name?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const filterFeedback = (feedback: any[], query: string) => {
    if (!query.trim()) return feedback;
    
    const lowerQuery = query.toLowerCase();
    return feedback.filter(item => 
      item.name?.toLowerCase().includes(lowerQuery) ||
      item.email?.toLowerCase().includes(lowerQuery) ||
      item.service?.toLowerCase().includes(lowerQuery) ||
      item.comments?.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredPrintJobs = filterPrintJobs(allPrintJobs, searchQuery);
  const filteredFeedback = filterFeedback(allFeedback, searchQuery);

  const setData = (printJobs: any[], feedback: any[]) => {
    setAllPrintJobs(printJobs);
    setAllFeedback(feedback);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      filteredPrintJobs,
      filteredFeedback,
      setData
    }}>
      {children}
    </SearchContext.Provider>
  );
};
