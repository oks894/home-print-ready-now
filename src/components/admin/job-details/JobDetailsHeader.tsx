
import { X } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JobDetailsHeaderProps {
  timestamp: string;
  onBack: () => void;
}

export const JobDetailsHeader = ({ timestamp, onBack }: JobDetailsHeaderProps) => {
  return (
    <CardHeader className="pb-3 sm:pb-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl">Job Details</CardTitle>
          <CardDescription className="text-sm">
            Submitted on {new Date(timestamp).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
          className="lg:hidden p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
  );
};
