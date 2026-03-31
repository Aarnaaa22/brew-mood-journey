import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoffeeType } from "./MenuScene";
import type { RoastType } from "./BeanSelectionScene";

interface GrindingSceneProps {
  coffee: CoffeeType;
  roastType: RoastType;
  onComplete: () => void;
}

const GrindingScene = ({ coffee, roastType, onComplete }: GrindingSceneProps) => {
  const [grinding, setGrinding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const roastColors: Record<RoastType, string> = {
    light: "hsl(25 45% 55%)",
    medium: "hsl(20 50% 35%)",
    dark: "hsl(15 40% 18%)",
  };

  useEffect(() => {
    if (!grinding) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDone(true);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [grinding, onComplete]);

  const handleGrind = () => {
    if (!grinding && !done) setGrinding(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="font-display text-3xl text-foreground mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Grinding Beans ⚙️
        </motion.h2>
        <motion.p
          className="font-handwritten text-xl text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {roastType} roast for your {coffee.name}
        </motion.p>

        {/* Grinder visual */}
        <div className="glass-panel rounded-3xl p-8 shadow-warm mb-6">
          <div className="flex flex-col items-center relative">
            {/* Grinder body */}
            <motion.div
              className="relative w-32 h-40 flex flex-col items-center"
              animate={grinding && !done ? { x: [-1, 1, -1, 0] } : {}}
              transition={{ duration: 0.15, repeat: grinding && !done ? Infinity : 0 }}
            >
              {/* Hopper (top) with beans */}
              <div
                className="w-24 h-16 rounded-t-2xl border-2 border-coffee-medium/40 relative overflow-hidden"
                style={{ backgroundColor: `${roastColors[roastType]}20` }}
              >
                {/* Beans inside hopper */}
                <AnimatePresence>
                  {!done && [...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-xs"
                      style={{
                        left: `${15 + (i % 3) * 30}%`,
                        top: `${10 + Math.floor(i / 3) * 35}%`,
                      }}
                      animate={grinding ? {
                        y: [0, 40],
                        opacity: [1, 0],
                        scale: [1, 0.5],
                      } : {}}
                      transition={{
                        duration: 0.8,
                        repeat: grinding ? Infinity : 0,
                        delay: i * 0.15,
                      }}
                    >
                      🫘
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Grinder middle */}
              <div className="w-28 h-6 bg-secondary border-x-2 border-coffee-medium/30 flex items-center justify-center">
                <motion.div
                  className="w-8 h-3 rounded-full bg-accent/60"
                  animate={grinding && !done ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5, repeat: grinding && !done ? Infinity : 0, ease: "linear" }}
                />
              </div>

              {/* Collection chamber */}
              <div className="w-24 h-16 rounded-b-2xl border-2 border-t-0 border-coffee-medium/40 bg-secondary/30 relative overflow-hidden">
                {/* Ground coffee filling up */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
                  style={{ backgroundColor: roastColors[roastType] }}
                  animate={{ height: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Particles flying out while grinding */}
            <AnimatePresence>
              {grinding && !done && [...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: roastColors[roastType],
                    top: "45%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 80],
                    y: [0, (Math.random() - 0.5) * 40],
                    opacity: [0.8, 0],
                    scale: [1, 0.3],
                  }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Sound indicator */}
            {grinding && !done && (
              <motion.div
                className="mt-4 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-accent rounded-full"
                    animate={{ height: [6, 14 + i * 3, 6] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
                <span className="font-handwritten text-sm text-muted-foreground ml-2">grinding…</span>
              </motion.div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="font-handwritten text-muted-foreground mt-2">{Math.round(progress)}% ground</p>
          </div>
        </div>

        {!grinding && !done && (
          <motion.button
            onClick={handleGrind}
            className="px-10 py-4 rounded-2xl bg-accent text-accent-foreground font-handwritten text-2xl shadow-soft cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            ⚙️ Start Grinding
          </motion.button>
        )}

        {done && (
          <motion.p
            className="font-handwritten text-2xl text-accent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Perfectly ground! ✓
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default GrindingScene;
