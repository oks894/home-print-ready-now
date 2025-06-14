
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/types/admin';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const { toast } = useToast();

  const loadFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error loading feedback:', error);
      throw new Error('Failed to load feedback');
    }

    setFeedback(data || []);
  };

  const deleteFeedback = async (feedbackId: string, retryFn: (fn: () => Promise<void>) => Promise<void>) => {
    const originalFeedback = [...feedback];
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));

    try {
      await retryFn(async () => {
        const { error } = await supabase
          .from('feedback')
          .delete()
          .eq('id', feedbackId);

        if (error) {
          throw error;
        }
      });

      toast({
        title: "Feedback deleted",
        description: "Feedback has been removed",
      });

      return true;
    } catch (error) {
      setFeedback(originalFeedback);
      
      console.error('Error deleting feedback:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete feedback. Please try again.",
        variant: "destructive"
      });

      return false;
    }
  };

  return {
    feedback,
    setFeedback,
    loadFeedback,
    deleteFeedback
  };
};
