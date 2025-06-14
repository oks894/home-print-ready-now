
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows, Stars, Sphere } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Fortune Ball Component
const FortuneBall = ({ onClick, isGlowing, isRotating }) => {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRotating) {
        meshRef.current.rotation.x += delta * 2;
        meshRef.current.rotation.y += delta * 3;
      } else {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.1;
      }
    }
    
    if (lightRef.current && isGlowing) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color={isGlowing ? "#8b5cf6" : "#4c1d95"}
          emissive={isGlowing ? "#6d28d9" : "#312e81"}
          emissiveIntensity={isGlowing ? 0.5 : 0.1}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
        {isGlowing && (
          <pointLight
            ref={lightRef}
            position={[0, 0, 0]}
            intensity={2}
            color="#8b5cf6"
            distance={10}
          />
        )}
      </mesh>
    </Float>
  );
};

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

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % fortunes.length;
  
  return fortunes[index];
};

const Scene3D = () => {
  const [hasUsedToday, setHasUsedToday] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    // Check if user has already used fortune today
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem('fortuneLastUsed');
    
    if (lastUsed === today) {
      setHasUsedToday(true);
      const savedFortune = localStorage.getItem('todaysFortune');
      if (savedFortune) {
        setFortune(savedFortune);
        setShowFortune(true);
      }
    }
  }, []);

  const handleBallClick = () => {
    if (hasUsedToday) return;

    // Start glowing and rotating animation
    setIsGlowing(true);
    setIsRotating(true);

    // After 2 seconds, show fortune
    setTimeout(() => {
      const dailyFortune = getDailyFortune();
      setFortune(dailyFortune);
      setShowFortune(true);
      setHasUsedToday(true);
      setIsRotating(false);

      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem('fortuneLastUsed', today);
      localStorage.setItem('todaysFortune', dailyFortune);
    }, 2000);
  };

  return (
    <div className="h-[600px] w-full relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        className="rounded-3xl"
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset="night" background={false} />
          <fog attach="fog" args={['#0f0f23', 5, 50]} />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.2} color="#1e1b4b" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            color="#6366f1"
          />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#8b5cf6" />
          
          {/* Stars Background */}
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
          
          {/* Fortune Ball */}
          <FortuneBall 
            onClick={handleBallClick}
            isGlowing={isGlowing}
            isRotating={isRotating}
          />
          
          {/* Ground Plane with Contact Shadows */}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.3} 
            scale={10} 
            blur={2} 
            far={4} 
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={!isRotating}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
            maxDistance={10}
            minDistance={3}
          />
        </Suspense>
      </Canvas>
      
      {/* Instructions */}
      {!hasUsedToday && !showFortune && (
        <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">🔮</div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Fortune Crystal
            </h3>
          </div>
          <p className="text-sm text-purple-100">
            Touch the mystical orb to reveal your daily fortune!
          </p>
        </div>
      )}

      {/* Loading State */}
      {isRotating && (
        <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl animate-spin">🔮</div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Consulting the Stars...
            </h3>
          </div>
          <p className="text-sm text-purple-100 animate-pulse">
            The cosmic energies are aligning for you...
          </p>
        </div>
      )}
      
      {/* Daily Fortune Display */}
      {showFortune && (
        <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl animate-pulse">🔮</div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Your Daily Fortune
            </h3>
            <div className="text-2xl animate-pulse">⭐</div>
          </div>
          
          <p className="text-sm leading-relaxed text-purple-100 font-medium mb-3">
            {fortune}
          </p>
          
          <div className="text-xs text-purple-200/70 text-center">
            {hasUsedToday ? "✨ Come back tomorrow for a new fortune ✨" : "✨ Your fortune updates daily ✨"}
          </div>
        </div>
      )}

      {/* Already Used Today Message */}
      {hasUsedToday && !showFortune && (
        <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-gray-800/40 via-slate-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">🌙</div>
            <h3 className="text-lg font-bold text-gray-300">
              Fortune Used Today
            </h3>
          </div>
          <p className="text-sm text-gray-300">
            The crystal's power has been exhausted for today. Return tomorrow for a new fortune!
          </p>
        </div>
      )}
    </div>
  );
};

export default Scene3D;
