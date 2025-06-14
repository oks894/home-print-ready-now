
import { useState, useEffect } from 'react';
import { mysticalWords } from '../constants/mysticalWords';

export const useFloatingWords = (isRotating: boolean) => {
  const [floatingWords, setFloatingWords] = useState<Array<{word: string, position: [number, number, number], rotation: [number, number, number]}>>([]);

  useEffect(() => {
    // Generate random floating words inside the ball
    const words = [];
    for (let i = 0; i < 8; i++) {
      const word = mysticalWords[Math.floor(Math.random() * mysticalWords.length)];
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ];
      const rotation: [number, number, number] = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      words.push({ word, position, rotation });
    }
    setFloatingWords(words);
  }, [isRotating]);

  return floatingWords;
};
