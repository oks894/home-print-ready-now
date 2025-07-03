
import { X } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrintJob } from '@/types/printJob';

interface JobDetailsHeaderProps {
  job: PrintJob;
}

export const JobDetailsHeader = ({ job }: JobDetailsHeaderProps) => {
  return (
    <CardHeader className="pb-3 sm:pb-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl">Job Details</CardTitle>
          <CardDescription className="text-sm">
            Submitted on {new Date(job.timestamp).toLocaleDateString()}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};
