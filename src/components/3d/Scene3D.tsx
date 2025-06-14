
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center, Stars, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import PrinterModel from './PrinterModel';
import { motion } from 'framer-motion';

const Scene3D = () => {
  return (
    <div className="h-[600px] w-full relative">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        className="rounded-3xl"
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset="city" background={false} />
          <fog attach="fog" args={['#f0f9ff', 5, 50]} />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.3} color="#e0f2fe" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, 5, -10]} intensity={0.8} color="#3b82f6" />
          <spotLight 
            position={[0, 15, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1} 
            castShadow
            color="#8b5cf6"
          />
          
          {/* Stars Background */}
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main Printers with Enhanced Animations */}
          <Float
            speed={1.5}
            rotationIntensity={0.05}
            floatIntensity={0.15}
          >
            <PrinterModel position={[0, 0, 0]} scale={1.2} />
          </Float>
          
          <Float
            speed={2}
            rotationIntensity={0.08}
            floatIntensity={0.2}
          >
            <PrinterModel position={[6, -1, -3]} scale={0.8} />
          </Float>
          
          <Float
            speed={1.8}
            rotationIntensity={0.06}
            floatIntensity={0.18}
          >
            <PrinterModel position={[-6, -0.5, -2]} scale={0.9} />
          </Float>
          
          <Float
            speed={2.2}
            rotationIntensity={0.04}
            floatIntensity={0.12}
          >
            <PrinterModel position={[3, 2, -6]} scale={0.6} />
          </Float>
          
          <Float
            speed={1.3}
            rotationIntensity={0.07}
            floatIntensity={0.25}
          >
            <PrinterModel position={[-4, 1.5, -5]} scale={0.7} />
          </Float>
          
          {/* 3D Text */}
          <Float
            speed={0.8}
            rotationIntensity={0.02}
            floatIntensity={0.1}
          >
            <Center position={[0, 4, -8]}>
              <Text3D
                font="/fonts/helvetiker_regular.typeface.json"
                size={1.2}
                height={0.3}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
              >
                PrintReady
                <meshStandardMaterial 
                  color="#3b82f6" 
                  metalness={0.8} 
                  roughness={0.2}
                  emissive="#1e40af"
                  emissiveIntensity={0.1}
                />
              </Text3D>
            </Center>
          </Float>
          
          {/* Ground Plane with Contact Shadows */}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4} 
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
            maxDistance={20}
            minDistance={4}
          />
        </Suspense>
      </Canvas>
      
      {/* Overlay UI Elements */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
        <p className="text-xs">🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
      </div>
    </div>
  );
};

export default Scene3D;
