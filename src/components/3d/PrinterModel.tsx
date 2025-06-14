
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';

interface PrinterModelProps {
  position?: [number, number, number];
  scale?: number;
}

const PrinterModel = ({ position = [0, 0, 0], scale = 1 }: PrinterModelProps) => {
  const printerRef = useRef<Mesh>(null);
  const paperRef = useRef<Mesh>(null);
  const nozzleRef = useRef<Mesh>(null);
  const bedRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (printerRef.current) {
      printerRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }
    
    if (paperRef.current) {
      paperRef.current.position.y = Math.sin(time * 2) * 0.2 + 1.2;
      paperRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    }
    
    if (nozzleRef.current) {
      nozzleRef.current.position.z = Math.sin(time * 1.5) * 0.1;
    }
    
    if (bedRef.current) {
      bedRef.current.position.y = Math.sin(time * 0.8) * 0.05 - 0.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Main Printer Body */}
      <mesh ref={printerRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.2, 2]} />
        <meshStandardMaterial 
          color="#1e40af" 
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Display Panel */}
      <mesh position={[1.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive="#003366" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Print Bed */}
      <mesh ref={bedRef} position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.8]} />
        <meshStandardMaterial 
          color="#4b5563" 
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Extruder Assembly */}
      <group position={[0, 0.8, 0]}>
        {/* Horizontal Rail */}
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.2]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Print Head */}
        <mesh ref={nozzleRef} position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#dc2626" metalness={0.2} roughness={0.3} />
        </mesh>
        
        {/* Nozzle */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.05, 0.2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Floating Printed Object */}
      <mesh ref={paperRef} position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Status LEDs */}
      <mesh position={[1, 0.8, 0.8]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      <mesh position={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={0.6} 
        />
      </mesh>
      
      {/* Support Columns */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 1.1, 0.4, -0.8]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.6]} />
          <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

export default PrinterModel;
