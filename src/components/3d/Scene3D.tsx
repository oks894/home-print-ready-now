
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { FortuneBall } from './FortuneBall';
import { getDailyFortune, checkDailyUsage, saveDailyFortune } from '@/utils/fortuneUtils';

const Scene3D = () => {
  const [hasUsedToday, setHasUsedToday] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    const { hasUsedToday: usedToday, savedFortune } = checkDailyUsage();
    
    if (usedToday && savedFortune) {
      setHasUsedToday(true);
      setFortune(savedFortune);
      // Don't automatically show fortune - only show when clicked
    }
  }, []);

  const handleBallClick = () => {
    if (hasUsedToday) {
      // If already used today, just make it glow briefly
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 3000);
      return;
    }

    // Start glowing and rotating animation for new fortune
    setIsGlowing(true);
    setIsRotating(true);

    // After 2.5 seconds, stop rotating but keep glowing
    setTimeout(() => {
      const dailyFortune = getDailyFortune();
      setFortune(dailyFortune);
      setHasUsedToday(true);
      setIsRotating(false);

      // Save to localStorage
      saveDailyFortune(dailyFortune);
      
      // Keep glowing for a few more seconds
      setTimeout(() => setIsGlowing(false), 4000);
    }, 2500);
  };

  return (
    <div className="h-96 w-full aspect-square relative bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        className="rounded-3xl"
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset="night" background={false} />
          <fog attach="fog" args={['#0f0f23', 8, 60]} />
          
          {/* Enhanced atmospheric lighting */}
          <ambientLight intensity={0.15} color="#1e1b4b" />
          <directionalLight 
            position={[15, 15, 8]} 
            intensity={0.4} 
            color="#6366f1"
            castShadow
          />
          <pointLight position={[-12, 8, -12]} intensity={0.3} color="#8b5cf6" />
          <pointLight position={[8, -5, 10]} intensity={0.2} color="#ec4899" />
          
          {/* Enhanced starfield */}
          <Stars 
            radius={150} 
            depth={80} 
            count={3000} 
            factor={6} 
            saturation={0.2} 
            fade 
            speed={0.3} 
          />
          
          {/* Fortune Ball */}
          <FortuneBall 
            onClick={handleBallClick}
            isGlowing={isGlowing}
            isRotating={isRotating}
          />
          
          {/* Enhanced ground shadows */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={15} 
            blur={3} 
            far={5}
            color="#1e1b4b"
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={!isRotating && !hasUsedToday}
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 8}
            maxDistance={12}
            minDistance={4}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
