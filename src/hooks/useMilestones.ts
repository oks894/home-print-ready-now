
import { useState, useEffect } from 'react';
import { getAdaptiveConfig } from '@/utils/connectionUtils';

interface Milestone {
  count: number;
  timestamp: number;
}

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const adaptiveConfig = getAdaptiveConfig();

  // Load saved milestones on mount
  useEffect(() => {
    if (!adaptiveConfig.ultraLightMode) {
      try {
        const savedMilestones = localStorage.getItem('online_users_milestones');
        if (savedMilestones) {
          setMilestones(JSON.parse(savedMilestones));
        }
      } catch (e) {
        console.warn('useMilestones: Error loading saved milestones:', e);
      }
    }
  }, [adaptiveConfig.ultraLightMode]);

  // Save milestones with throttling
  useEffect(() => {
    if (milestones.length > 0 && !adaptiveConfig.ultraLightMode) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('online_users_milestones', JSON.stringify(milestones));
        } catch (e) {
          console.warn('useMilestones: Failed to save milestones:', e);
        }
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [milestones, adaptiveConfig.ultraLightMode]);

  const addMilestone = (count: number) => {
    if (count % 10 === 0 && count > 0 && !adaptiveConfig.ultraLightMode) {
      setMilestones(prev => {
        const exists = prev.some(m => m.count === count);
        if (!exists) {
          return [...prev.slice(-2), { count, timestamp: Date.now() }];
        }
        return prev;
      });
    }
  };

  return {
    milestones,
    addMilestone
  };
};
