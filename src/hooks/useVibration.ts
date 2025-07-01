
import { useState, useEffect } from 'react';

export const useVibration = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if vibration is supported
    const supported = 'vibrate' in navigator;
    setIsSupported(supported);
    
    // Load user preference from localStorage
    const savedPreference = localStorage.getItem('vibrationEnabled');
    setIsEnabled(savedPreference === 'true');
  }, []);

  const enableVibration = () => {
    setIsEnabled(true);
    localStorage.setItem('vibrationEnabled', 'true');
  };

  const disableVibration = () => {
    setIsEnabled(false);
    localStorage.setItem('vibrationEnabled', 'false');
  };

  const vibrate = (pattern: number | number[]) => {
    if (isSupported && isEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Predefined vibration patterns
  const patterns = {
    newOrder: [200, 100, 200, 100, 400], // Short-short-long pattern
    urgent: [100, 50, 100, 50, 100, 50, 500], // Quick bursts
    test: [300], // Simple test vibration
    gentle: [150, 100, 150], // Gentle notification
  };

  return {
    isSupported,
    isEnabled,
    enableVibration,
    disableVibration,
    vibrate,
    patterns
  };
};
