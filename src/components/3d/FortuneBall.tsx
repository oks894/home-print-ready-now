
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface FortuneBallProps {
  onClick: () => void;
  isGlowing: boolean;
  isRotating: boolean;
}

export const FortuneBall = ({ onClick, isGlowing, isRotating }: FortuneBallProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRotating) {
        meshRef.current.rotation.x += delta * 2;
        meshRef.current.rotation.y += delta * 3;
      } else {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.1;
      }
    }
    
    if (lightRef.current && isGlowing) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#8b5cf6" : "#4c1d95"}
          emissive={isGlowing ? "#6d28d9" : "#312e81"}
          emissiveIntensity={isGlowing ? 0.5 : 0.1}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
        {isGlowing && (
          <pointLight
            ref={lightRef}
            position={[0, 0, 0]}
            intensity={2}
            color="#8b5cf6"
            distance={10}
          />
        )}
      </mesh>
    </Float>
  );
};
