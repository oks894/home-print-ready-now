
export interface Feedback {
  id: string;
  name: string;
  email: string;
  service: string;
  comments: string;
  rating: number;
  timestamp: string;
}

export interface AdminDataState {
  printJobs: PrintJob[];
  feedback: Feedback[];
  selectedJob: PrintJob | null;
  isLoading: boolean;
  isRetrying: boolean;
  lastFetchTime: number;
}
