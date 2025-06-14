import { useFrame, useLoader } from '@react-three/fiber';
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
  const imageRef = useRef<THREE.Mesh>(null);
  const glowLight1Ref = useRef<THREE.PointLight>(null);
  const glowLight2Ref = useRef<THREE.PointLight>(null);
  const glowLight3Ref = useRef<THREE.PointLight>(null);
  const [floatingWords, setFloatingWords] = useState<Array<{word: string, position: [number, number, number], rotation: [number, number, number]}>>([]);

  // Load the texture
  const texture = useLoader(THREE.TextureLoader, '/lovable-uploads/e092d64c-a177-44ad-801b-965cecbbed1a.png');

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
    // ... keep existing code (meshRef rotation logic)
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

    // Slow rotation for the faint image
    if (imageRef.current) {
      imageRef.current.rotation.x += delta * 0.1;
      imageRef.current.rotation.y += delta * 0.05;
      imageRef.current.rotation.z += delta * 0.08;
    }
    
    // ... keep existing code (enhanced fantasy lighting effects)
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
            color={isGlowing ? "#d946ef" : "#6d28d9"}
            emissive={isGlowing ? "#a855f7" : "#4c1d95"}
            emissiveIntensity={isGlowing ? 1.2 : 0.3}
            metalness={0.1}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0}
            transmission={0.3}
            thickness={0.8}
            ior={1.5}
          />
        </mesh>
        
        {/* Faint image texture inside the ball */}
        <mesh ref={imageRef} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={isGlowing ? 0.4 : 0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Inner glowing core */}
        <mesh ref={innerSphereRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial
            color={isGlowing ? "#f59e0b" : "#8b5cf6"}
            emissive={isGlowing ? "#fbbf24" : "#a855f7"}
            emissiveIntensity={isGlowing ? 2 : 0.6}
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
                opacity={isGlowing ? 0.9 : 0.6}
              />
            </Text>
          </Float>
        ))}
        
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
      </group>
    </Float>
  );
};
