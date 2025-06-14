
import { Float, Text } from '@react-three/drei';

interface FloatingWordsProps {
  words: Array<{word: string, position: [number, number, number], rotation: [number, number, number]}>;
  isGlowing: boolean;
}

export const FloatingWords = ({ words, isGlowing }: FloatingWordsProps) => {
  return (
    <>
      {words.map((item, index) => (
        <Float
          key={`${item.word}-${index}`}
          speed={0.5 + Math.random() * 0.5}
          rotationIntensity={0.2}
          floatIntensity={0.1}
          position={item.position}
        >
          <Text
            fontSize={0.08}
            maxWidth={0.5}
            textAlign="center"
            font="https://fonts.gstatic.com/s/orbitron/v29/yMJRMIlzdpvBhQQL_Qq7dys.woff"
            rotation={item.rotation}
          >
            {item.word}
            <meshBasicMaterial 
              color={isGlowing ? "#fbbf24" : "#a855f7"} 
              transparent 
              opacity={isGlowing ? 0.9 : 0.6}
            />
          </Text>
        </Float>
      ))}
    </>
  );
};
