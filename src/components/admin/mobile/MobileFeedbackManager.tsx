import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '@/types/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MobileFeedbackManagerProps {
  feedback: Feedback[];
  onDeleteFeedback: (feedbackId: string) => void;
  isLoading?: boolean;
}

export const MobileFeedbackManager = ({
  feedback,
  onDeleteFeedback,
  isLoading = false
}: MobileFeedbackManagerProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-50 to-pink-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Feedback</h2>
            <p className="text-sm text-gray-600">{feedback.length} total reviews</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {feedback.length}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">No feedback yet</p>
            <p className="text-gray-400 text-sm mt-2">Customer reviews will appear here</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {feedback.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-lg border overflow-hidden"
                >
                  <TouchButton
                    variant="ghost"
                    className="w-full p-4 flex items-start justify-between hover:bg-gray-50 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <Badge className={getRatingColor(item.rating)}>
                          {item.rating} ⭐
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.email}</p>
                      {item.service && (
                        <p className="text-xs text-blue-600 mt-1">{item.service}</p>
                      )}
                      {!isExpanded && item.comments && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {item.comments}
                        </p>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </TouchButton>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t"
                      >
                        <div className="p-4 space-y-4">
                          {/* Star Rating */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= item.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Comments */}
                          {item.comments && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {item.comments}
                              </p>
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(item.timestamp).toLocaleString()}
                          </p>

                          {/* Delete Button */}
                          <TouchButton
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Feedback
                          </TouchButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDeleteFeedback(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
