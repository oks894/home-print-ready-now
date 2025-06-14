
import { useRef, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface BallSpheresProps {
  isGlowing: boolean;
  isRotating: boolean;
}

export const BallSpheres = forwardRef<THREE.Mesh, BallSpheresProps>(({ isGlowing, isRotating }, ref) => {
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const imageRef = useRef<THREE.Mesh>(null);

  // Load the new texture
  const texture = useLoader(THREE.TextureLoader, '/lovable-uploads/352a0e16-01f2-4d3a-9ee9-b3587643113a.png');

  useFrame((state, delta) => {
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x += delta * 0.3;
      innerSphereRef.current.rotation.y -= delta * 0.2;
    }

    // Slow rotation for the image
    if (imageRef.current) {
      imageRef.current.rotation.x += delta * 0.1;
      imageRef.current.rotation.y += delta * 0.05;
      imageRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <>
      {/* Outer mystical sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 128, 128]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#d946ef" : "#6d28d9"}
          emissive={isGlowing ? "#a855f7" : "#4c1d95"}
          emissiveIntensity={isGlowing ? 1.2 : 0.3}
          metalness={0.1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.4}
          thickness={0.6}
          ior={1.5}
        />
      </mesh>
      
      {/* Visible image texture inside the ball - more prominent */}
      <mesh ref={imageRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={isGlowing ? 1.0 : 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner glowing core - smaller to not interfere */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#f59e0b" : "#8b5cf6"}
          emissive={isGlowing ? "#fbbf24" : "#a855f7"}
          emissiveIntensity={isGlowing ? 1.5 : 0.4}
          metalness={0}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
});

BallSpheres.displayName = 'BallSpheres';
