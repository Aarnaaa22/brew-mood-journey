import { useMemo } from "react";
import { motion } from "framer-motion";

interface RainEffectProps {
  intensity?: number;
}

const RainEffect = ({ intensity = 60 }: RainEffectProps) => {
  const drops = useMemo(() => {
    return Array.from({ length: intensity }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.8 + Math.random() * 0.6,
      width: 1 + Math.random() * 1.5,
      height: 15 + Math.random() * 25,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute rounded-full bg-rain-blue"
          style={{
            left: `${drop.left}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animation: `rain-fall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;
