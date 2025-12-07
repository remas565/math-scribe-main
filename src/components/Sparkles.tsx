import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface SparklesProps {
  trigger: boolean;
  count?: number;
}

const colors = ['#C8A2FF', '#A7C7FF', '#FFF6B7', '#B8F5D0', '#FEBCC8'];

export function Sparkles({ trigger, count = 12 }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setSparkles(newSparkles);

      const timeout = setTimeout(() => setSparkles([]), 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
          }}
        />
      ))}
    </div>
  );
}

export function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces: Sparkle[] = [];
      for (let i = 0; i < 20; i++) {
        newPieces.push({
          id: Date.now() + i,
          x: 40 + Math.random() * 20,
          y: 50,
          size: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setPieces(newPieces);

      const timeout = setTimeout(() => setPieces([]), 1200);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece, i) => (
        <span
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size * 1.5,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animationDelay: `${i * 30}ms`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
