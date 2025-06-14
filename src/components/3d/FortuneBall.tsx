
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { BallSpheres } from './components/BallSpheres';
import { BallLighting } from './components/BallLighting';
import { FloatingWords } from './components/FloatingWords';
import { useFloatingWords } from './hooks/useFloatingWords';

interface FortuneBallProps {
  onClick: () => void;
  isGlowing: boolean;
  isRotating: boolean;
}

export const FortuneBall = ({ onClick, isGlowing, isRotating }: FortuneBallProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const floatingWords = useFloatingWords(isRotating);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRotating) {
        meshRef.current.rotation.x += delta * 2.5;
        meshRef.current.rotation.y += delta * 3.2;
      } else {
        meshRef.current.rotation.x += delta * 0.1;
        meshRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <BallSpheres ref={meshRef} isGlowing={isGlowing} isRotating={isRotating} />
        <FloatingWords words={floatingWords} isGlowing={isGlowing} />
        <BallLighting isGlowing={isGlowing} />
      </group>
    </Float>
  );
};
