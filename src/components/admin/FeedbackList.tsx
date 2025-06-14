
import { MessageSquare, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Feedback {
  id: string;
  name: string;
  email: string;
  service: string;
  comments: string;
  rating: number;
  timestamp: string;
}

interface FeedbackListProps {
  feedback: Feedback[];
  onDeleteFeedback: (feedbackId: string) => void;
  isLoading?: boolean;
}

const FeedbackSkeleton = () => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-4 h-4 rounded" />
          ))}
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
    <Skeleton className="h-16 w-full rounded" />
    <Skeleton className="h-3 w-40 mt-2" />
  </div>
);

export const FeedbackList = ({ feedback, onDeleteFeedback, isLoading = false }: FeedbackListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Feedback ({feedback.length})</CardTitle>
        <CardDescription>
          Review customer feedback and ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <FeedbackSkeleton key={i} />
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No feedback yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {feedback.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{item.email}</p>
                    {item.service && (
                      <p className="text-sm text-gray-500">Service: {item.service}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteFeedback(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {item.comments && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded break-words">
                    {item.comments}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Submitted on {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
