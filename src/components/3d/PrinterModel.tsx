
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
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
      <Box
        ref={printerRef}
        args={[2, 0.8, 1.5]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#2563eb" />
      </Box>
      
      {/* Printer Top */}
      <Box
        args={[1.8, 0.4, 1.3]}
        position={[0, 0.6, 0]}
      >
        <meshStandardMaterial color="#1d4ed8" />
      </Box>
      
      {/* Paper Tray */}
      <Box
        args={[1.6, 0.1, 1.1]}
        position={[0, -0.4, -0.2]}
      >
        <meshStandardMaterial color="#64748b" />
      </Box>
      
      {/* Floating Paper */}
      <Box
        ref={paperRef}
        args={[0.8, 0.02, 1.1]}
        position={[0, 0.5, 0.8]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Status Light */}
      <Sphere
        args={[0.05]}
        position={[0.8, 0.8, 0.6]}
      >
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
};

export default PrinterModel;
