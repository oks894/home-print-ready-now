
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PrinterModelProps {
  position?: [number, number, number];
}

const PrinterModel = ({ position = [0, 0, 0] }: PrinterModelProps) => {
  const printerRef = useRef<Mesh>(null);
  const paperRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (printerRef.current) {
      printerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (paperRef.current) {
      paperRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Printer Base */}
      <mesh ref={printerRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.8, 1.5]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      
      {/* Printer Top */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 0.4, 1.3]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      
      {/* Paper Tray */}
      <mesh position={[0, -0.4, -0.2]}>
        <boxGeometry args={[1.6, 0.1, 1.1]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      
      {/* Floating Paper */}
      <mesh ref={paperRef} position={[0, 0.5, 0.8]}>
        <boxGeometry args={[0.8, 0.02, 1.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Status Light */}
      <mesh position={[0.8, 0.8, 0.6]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export default PrinterModel;
