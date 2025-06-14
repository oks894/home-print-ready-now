
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import PrinterModel from './PrinterModel';

// Daily fortune generator
const getDailyFortune = () => {
  const fortunes = [
    "✨ Today brings unexpected creative breakthroughs in your projects",
    "🌟 Your patience will be rewarded with remarkable results",
    "💫 A small decision today will lead to big opportunities",
    "🔮 Trust your instincts - they're guiding you toward success",
    "⭐ Someone will offer valuable advice that changes your perspective",
    "🌙 Embrace new technologies - they hold the key to your growth",
    "💎 Your hard work is about to pay off in surprising ways",
    "🌸 Collaboration with others will unlock hidden potential",
    "🦋 A challenge today will become tomorrow's greatest strength",
    "🌺 Focus on quality over quantity - excellence is your path",
    "🍀 Lucky encounters await in unexpected places",
    "🌈 Your creativity will inspire others around you",
    "⚡ Energy and enthusiasm will open new doors",
    "🌻 Share your knowledge - teaching others enriches your soul",
    "🎯 Precision and attention to detail will set you apart",
    "🌊 Go with the flow - adaptability is your superpower today",
    "🔥 Passion projects will gain momentum and recognition",
    "🌟 A moment of clarity will illuminate your next steps",
    "💝 Kindness to others returns to you tenfold",
    "🚀 Innovation and bold thinking lead to breakthrough moments"
  ];

  // Use current date as seed for consistent daily fortune
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % fortunes.length;
  
  return fortunes[index];
};

const Scene3D = () => {
  const dailyFortune = getDailyFortune();

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
      
      {/* Daily Fortune Teller Overlay */}
      <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl animate-pulse">🔮</div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Daily Fortune
          </h3>
          <div className="text-2xl animate-pulse">⭐</div>
        </div>
        
        <p className="text-sm leading-relaxed text-purple-100 font-medium">
          {dailyFortune}
        </p>
        
        <div className="mt-3 text-xs text-purple-200/70 text-center">
          ✨ Your fortune updates daily ✨
        </div>
      </div>
    </div>
  );
};

export default Scene3D;
