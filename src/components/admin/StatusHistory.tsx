
import { Clock, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStatusHistory } from '@/hooks/useStatusHistory';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface StatusHistoryProps {
  printJobId: string;
}

export const StatusHistory = ({ printJobId }: StatusHistoryProps) => {
  const { statusHistory, isLoading } = useStatusHistory(printJobId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending_payment': return 'bg-orange-100 text-orange-800';
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No status history available</p>
          ) : (
            statusHistory.map((entry, index) => (
              <div key={entry.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(entry.status)}>
                      {formatStatus(entry.status)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.changed_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {entry.notes && (
                    <div className="flex items-start gap-2 mt-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600">{entry.notes}</p>
                    </div>
                  )}
                  
                  {entry.changed_by && (
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Changed by: {entry.changed_by}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
