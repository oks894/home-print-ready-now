
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

  // Load the new uploaded image
  const texture = useLoader(THREE.TextureLoader, '/lovable-uploads/41429559-f828-40dd-9799-33dc1eedc3c2.png');

  // Configure texture for better visibility
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

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
      {/* Outer mystical sphere - transparent to see inside clearly */}
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
          transmission={0.9}
          thickness={0.1}
          ior={1.5}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Image texture - clearly visible inside the crystal ball */}
      <mesh ref={imageRef} scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          transparent={false}
          opacity={1.0}
          side={THREE.DoubleSide}
          emissive={isGlowing ? "#ffffff" : "#444444"}
          emissiveIntensity={isGlowing ? 0.4 : 0.2}
          color="#ffffff"
          metalness={0}
          roughness={0.3}
        />
      </mesh>
      
      {/* Inner glowing core - smaller and subtle */}
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
