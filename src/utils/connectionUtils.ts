
// Connection speed detection utility
export interface ConnectionInfo {
  speed: 'slow' | 'fast' | 'unknown';
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export const getConnectionInfo = (): ConnectionInfo => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (!connection) {
    // Fallback detection based on user agent and performance
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    return { 
      speed: isMobile ? 'slow' : 'unknown',
      effectiveType: isMobile ? '3g' : 'unknown'
    };
  }
  
  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;
  const rtt = connection.rtt;
  
  // Enhanced detection logic
  const isSlowConnection = 
    effectiveType === 'slow-2g' || 
    effectiveType === '2g' || 
    effectiveType === '3g' ||
    (downlink && downlink < 1.5) || // Less than 1.5 Mbps
    (rtt && rtt > 300); // High latency
  
  return {
    speed: isSlowConnection ? 'slow' : 'fast',
    effectiveType,
    downlink,
    rtt
  };
};

export const isSlowConnection = () => {
  return getConnectionInfo().speed === 'slow';
};

export const isVerySlowConnection = () => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (!connection) {
    // Conservative approach - assume slow if we can't detect
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    return isMobile;
  }
  
  return connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' ||
         (connection.downlink && connection.downlink < 0.5) ||
         (connection.rtt && connection.rtt > 500);
};

// Adaptive configuration based on connection speed and device
export const getAdaptiveConfig = () => {
  const connectionInfo = getConnectionInfo();
  const isSlow = connectionInfo.speed === 'slow';
  const isVerySlow = isVerySlowConnection();
  const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
  const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  
  // More aggressive optimization for mobile + slow connection
  const needsHeavyOptimization = (isMobile && isSlow) || isVerySlow || hasLowMemory;
  
  return {
    // Animation settings
    animationDuration: needsHeavyOptimization ? 0 : isSlow ? 0.15 : 0.8,
    enableHeavyAnimations: !isSlow && !isVerySlow && !isMobile,
    enableParticles: !needsHeavyOptimization,
    enableBackdropBlur: !needsHeavyOptimization,
    
    // Loading settings
    enableLazyLoading: true,
    preloadImages: !needsHeavyOptimization,
    enableImageOptimization: needsHeavyOptimization,
    
    // UI settings
    simplifiedUI: needsHeavyOptimization,
    enableTransitions: !isVerySlow,
    enableHoverEffects: !needsHeavyOptimization,
    
    // Performance settings
    reducedQuality: needsHeavyOptimization,
    enableCompression: needsHeavyOptimization,
    ultraLightMode: isVerySlow || (hasLowMemory && isMobile),
    
    // Device info
    isMobile,
    hasLowMemory,
    connectionInfo
  };
};

// Network status monitoring
export const createNetworkMonitor = (callback: (isOnline: boolean, connectionInfo: ConnectionInfo) => void) => {
  const handleOnline = () => callback(true, getConnectionInfo());
  const handleOffline = () => callback(false, getConnectionInfo());
  const handleConnectionChange = () => callback(navigator.onLine, getConnectionInfo());

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (connection) {
    connection.addEventListener('change', handleConnectionChange);
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    if (connection) {
      connection.removeEventListener('change', handleConnectionChange);
    }
  };
};
