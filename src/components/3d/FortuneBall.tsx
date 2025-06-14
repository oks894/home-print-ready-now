
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface FortuneBallProps {
  onClick: () => void;
  isGlowing: boolean;
  isRotating: boolean;
}

const mysticalWords = [
  'DESTINY', 'WISDOM', 'POWER', 'MAGIC', 'FUTURE', 'DREAMS', 'HOPE',
  'FORTUNE', 'MYSTIC', 'ORACLE', 'SPIRIT', 'ENERGY', 'COSMIC', 'VISION',
  'HARMONY', 'BALANCE', 'TRUTH', 'LIGHT', 'SHADOW', 'STARS', 'MOON'
];

export const FortuneBall = ({ onClick, isGlowing, isRotating }: FortuneBallProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const [floatingWords, setFloatingWords] = useState<Array<{word: string, position: [number, number, number], rotation: [number, number, number]}>>([]);

  useEffect(() => {
    // Generate random floating words inside the ball
    const words = [];
    for (let i = 0; i < 8; i++) {
      const word = mysticalWords[Math.floor(Math.random() * mysticalWords.length)];
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ];
      const rotation: [number, number, number] = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      words.push({ word, position, rotation });
    }
    setFloatingWords(words);
  }, [isRotating]);

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
    
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x += delta * 0.3;
      innerSphereRef.current.rotation.y -= delta * 0.2;
    }
    
    if (lightRef.current && (isGlowing || !isRotating)) {
      const baseIntensity = isGlowing ? 3 : 1;
      lightRef.current.intensity = baseIntensity + Math.sin(state.clock.elapsedTime * 3) * 0.8;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* Outer mystical sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.6, 128, 128]} />
          <meshPhysicalMaterial
            color={isGlowing ? "#a855f7" : "#6d28d9"}
            emissive={isGlowing ? "#7c3aed" : "#4c1d95"}
            emissiveIntensity={isGlowing ? 0.8 : 0.3}
            metalness={0.1}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0}
            transmission={0.3}
            thickness={0.8}
            ior={1.5}
          />
        </mesh>
        
        {/* Inner glowing core */}
        <mesh ref={innerSphereRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial
            color={isGlowing ? "#ec4899" : "#8b5cf6"}
            emissive={isGlowing ? "#f97316" : "#a855f7"}
            emissiveIntensity={isGlowing ? 1.2 : 0.6}
            metalness={0}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Floating mystical words inside the ball */}
        {floatingWords.map((item, index) => (
          <Float
            key={`${item.word}-${index}`}
            speed={0.5 + Math.random() * 0.5}
            rotationIntensity={0.2}
            floatIntensity={0.1}
            position={item.position}
          >
            <Text
              fontSize={0.08}
              maxWidth={0.5}
              textAlign="center"
              font="https://fonts.gstatic.com/s/orbitron/v29/yMJRMIlzdpvBhQQL_Qq7dys.woff"
              rotation={item.rotation}
            >
              {item.word}
              <meshBasicMaterial 
                color={isGlowing ? "#fbbf24" : "#a855f7"} 
                transparent 
                opacity={0.6}
              />
            </Text>
          </Float>
        ))}
        
        {/* Dynamic lighting */}
        <pointLight
          ref={lightRef}
          position={[0, 0, 0]}
          intensity={isGlowing ? 3 : 1}
          color={isGlowing ? "#f59e0b" : "#a855f7"}
          distance={12}
          decay={2}
        />
        
        {/* Ambient magical glow */}
        {(isGlowing || !isRotating) && (
          <pointLight
            position={[0, 0, 0]}
            intensity={0.5}
            color="#ec4899"
            distance={8}
            decay={1}
          />
        )}
      </group>
    </Float>
  );
};
