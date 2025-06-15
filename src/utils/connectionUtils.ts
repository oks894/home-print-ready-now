
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

export const isVerySlowConnection = () => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (!connection) {
    // Assume slow if we can't detect
    return true;
  }
  
  return connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' ||
         (connection.downlink && connection.downlink < 0.5);
};

// Adaptive configuration based on connection speed
export const getAdaptiveConfig = () => {
  const connectionInfo = getConnectionInfo();
  const isSlow = connectionInfo.speed === 'slow';
  const isVerySlow = isVerySlowConnection();
  
  return {
    // Animation settings
    animationDuration: isVerySlow ? 0 : isSlow ? 0.1 : 0.8,
    enableHeavyAnimations: !isSlow && !isVerySlow,
    enableParticles: !isSlow && !isVerySlow,
    enableBackdropBlur: !isSlow,
    
    // Loading settings
    enableLazyLoading: true,
    preloadImages: !isSlow && !isVerySlow,
    enableImageOptimization: isSlow || isVerySlow,
    
    // UI settings
    simplifiedUI: isSlow || isVerySlow,
    enableTransitions: !isVerySlow,
    enableHoverEffects: !isSlow && !isVerySlow,
    
    // Performance settings
    reducedQuality: isSlow || isVerySlow,
    enableCompression: isSlow || isVerySlow,
    ultraLightMode: isVerySlow,
    
    connectionInfo
  };
};
