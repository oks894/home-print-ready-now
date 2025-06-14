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

  // Load the texture
  const texture = useLoader(THREE.TextureLoader, '/lovable-uploads/e092d64c-a177-44ad-801b-965cecbbed1a.png');

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
          transmission={0.3}
          thickness={0.8}
          ior={1.5}
        />
      </mesh>
      
      {/* Visible image texture inside the ball */}
      <mesh ref={imageRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={isGlowing ? 0.9 : 0.7}
          side={THREE.DoubleSide}
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
    </>
  );
});

BallSpheres.displayName = 'BallSpheres';
