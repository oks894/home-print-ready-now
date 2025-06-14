
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BallLightingProps {
  isGlowing: boolean;
}

export const BallLighting = ({ isGlowing }: BallLightingProps) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const glowLight1Ref = useRef<THREE.PointLight>(null);
  const glowLight2Ref = useRef<THREE.PointLight>(null);
  const glowLight3Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const baseIntensity = isGlowing ? 5 : 1;
      lightRef.current.intensity = baseIntensity + Math.sin(state.clock.elapsedTime * 4) * (isGlowing ? 2 : 0.5);
    }

    // Fantasy glow lights with different patterns
    if (glowLight1Ref.current && isGlowing) {
      glowLight1Ref.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 3) * 1.5;
      glowLight1Ref.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 3;
      glowLight1Ref.current.position.y = Math.cos(state.clock.elapsedTime * 1.5) * 2;
    }

    if (glowLight2Ref.current && isGlowing) {
      glowLight2Ref.current.intensity = 2.5 + Math.cos(state.clock.elapsedTime * 4) * 1;
      glowLight2Ref.current.position.x = Math.cos(state.clock.elapsedTime * 1.8) * 2.5;
      glowLight2Ref.current.position.z = Math.sin(state.clock.elapsedTime * 2.2) * 3;
    }

    if (glowLight3Ref.current && isGlowing) {
      glowLight3Ref.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 5) * 0.8;
      glowLight3Ref.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 2.5;
      glowLight3Ref.current.position.z = Math.cos(state.clock.elapsedTime * 1.7) * 2;
    }
  });

  return (
    <>
      {/* Main dynamic lighting */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={isGlowing ? 5 : 1}
        color={isGlowing ? "#fbbf24" : "#a855f7"}
        distance={15}
        decay={2}
      />
      
      {/* Fantasy glow lights - only when glowing */}
      {isGlowing && (
        <>
          <pointLight
            ref={glowLight1Ref}
            position={[3, 2, 0]}
            intensity={3}
            color="#ec4899"
            distance={12}
            decay={1.5}
          />
          <pointLight
            ref={glowLight2Ref}
            position={[-2, 0, 3]}
            intensity={2.5}
            color="#8b5cf6"
            distance={10}
            decay={1.8}
          />
          <pointLight
            ref={glowLight3Ref}
            position={[0, -2, -2]}
            intensity={2}
            color="#06b6d4"
            distance={8}
            decay={2}
          />
          {/* Additional ambient glow */}
          <pointLight
            position={[0, 0, 0]}
            intensity={1.5}
            color="#fbbf24"
            distance={20}
            decay={0.5}
          />
        </>
      )}
    </>
  );
};
