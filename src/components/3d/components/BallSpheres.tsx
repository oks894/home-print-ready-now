
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

  // Load the new artistic image
  const texture = useLoader(THREE.TextureLoader, '/lovable-uploads/2830db9f-9823-4e67-b6a8-db96f3368687.png');

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
      {/* Outer mystical sphere - more transparent */}
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 128, 128]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#d946ef" : "#6d28d9"}
          emissive={isGlowing ? "#a855f7" : "#4c1d95"}
          emissiveIntensity={isGlowing ? 0.8 : 0.2}
          metalness={0.1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.8}
          thickness={0.2}
          ior={1.5}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Image texture - perfectly positioned inside like a crystal ball vision */}
      <mesh ref={imageRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          opacity={0.9}
          side={THREE.BackSide}
          emissive={isGlowing ? "#ffffff" : "#000000"}
          emissiveIntensity={isGlowing ? 0.15 : 0}
        />
      </mesh>
      
      {/* Inner glowing core - much smaller and more subtle */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.3, 64, 64]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#f59e0b" : "#8b5cf6"}
          emissive={isGlowing ? "#fbbf24" : "#a855f7"}
          emissiveIntensity={isGlowing ? 0.8 : 0.2}
          metalness={0}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
});

BallSpheres.displayName = 'BallSpheres';
