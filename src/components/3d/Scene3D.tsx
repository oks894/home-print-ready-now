
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei';
import { Suspense } from 'react';
import PrinterModel from './PrinterModel';

const Scene3D = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        className="rounded-lg"
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Float
            speed={2}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <PrinterModel position={[0, 0, 0]} />
          </Float>
          
          <Float
            speed={1.5}
            rotationIntensity={0.05}
            floatIntensity={0.1}
          >
            <PrinterModel position={[4, 0, -2]} />
          </Float>
          
          <Float
            speed={2.5}
            rotationIntensity={0.15}
            floatIntensity={0.3}
          >
            <PrinterModel position={[-4, 0, -1]} />
          </Float>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
