
// Connection speed detection utility
export interface ConnectionInfo {
  speed: 'slow' | 'fast' | 'unknown';
  effectiveType?: string;
  downlink?: number;
}

export const getConnectionInfo = (): ConnectionInfo => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (!connection) {
    return { speed: 'unknown' };
  }
  
  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;
  
  // Determine if connection is slow based on effective type and downlink
  const isSlowConnection = 
    effectiveType === 'slow-2g' || 
    effectiveType === '2g' || 
    effectiveType === '3g' ||
    (downlink && downlink < 1.5); // Less than 1.5 Mbps
  
  return {
    speed: isSlowConnection ? 'slow' : 'fast',
    effectiveType,
    downlink
  };
};

export const isSlowConnection = () => {
  return getConnectionInfo().speed === 'slow';
};

// Adaptive configuration based on connection speed
export const getAdaptiveConfig = () => {
  const connectionInfo = getConnectionInfo();
  const isSlow = connectionInfo.speed === 'slow';
  
  return {
    // Animation settings
    animationDuration: isSlow ? 0.1 : 0.8,
    enableHeavyAnimations: !isSlow,
    enableParticles: !isSlow,
    enableBackdropBlur: !isSlow,
    
    // Loading settings
    enableLazyLoading: true,
    preloadImages: !isSlow,
    enableImageOptimization: isSlow,
    
    // UI settings
    simplifiedUI: isSlow,
    enableTransitions: !isSlow,
    enableHoverEffects: !isSlow,
    
    // Performance settings
    reducedQuality: isSlow,
    enableCompression: isSlow,
    
    connectionInfo
  };
};
