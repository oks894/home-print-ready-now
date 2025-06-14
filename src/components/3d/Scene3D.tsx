
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { FortuneBall } from './FortuneBall';
import { FortuneDisplay } from './FortuneDisplay';
import { getDailyFortune, checkDailyUsage, saveDailyFortune } from '@/utils/fortuneUtils';

const Scene3D = () => {
  const [hasUsedToday, setHasUsedToday] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    const { hasUsedToday: usedToday, savedFortune } = checkDailyUsage();
    
    if (usedToday && savedFortune) {
      setHasUsedToday(true);
      setFortune(savedFortune);
      setShowFortune(true);
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
      saveDailyFortune(dailyFortune);
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
      
      <FortuneDisplay
        hasUsedToday={hasUsedToday}
        showFortune={showFortune}
        isRotating={isRotating}
        fortune={fortune}
      />
    </div>
  );
};

export default Scene3D;
