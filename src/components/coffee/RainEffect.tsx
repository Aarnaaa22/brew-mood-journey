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
      duration: 0.6 + Math.random() * 0.5,
      width: 1 + Math.random() * 1.2,
      height: 18 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, [intensity]);

  // Splash effects at bottom
  const splashes = useMemo(() => {
    return Array.from({ length: Math.floor(intensity / 4) }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.4 + Math.random() * 0.3,
    }));
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute rounded-full"
          style={{
            left: `${drop.left}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            background: "linear-gradient(to bottom, hsl(210 30% 70% / 0.1), hsl(210 30% 70% / 0.4))",
            animation: `rain-fall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        />
      ))}
      {/* Splash ripples */}
      {splashes.map((s) => (
        <motion.div
          key={`splash-${s.id}`}
          className="absolute bottom-0 w-2 h-1 rounded-full border border-rain-blue/20"
          style={{ left: `${s.left}%` }}
          animate={{
            scaleX: [0, 2, 3],
            scaleY: [0, 1, 0.5],
            opacity: [0.4, 0.2, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;