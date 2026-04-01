import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WindowSceneProps {
  ambiance: "morning" | "evening" | "night";
}

const WindowScene = ({ ambiance }: WindowSceneProps) => {
  const [lightning, setLightning] = useState(false);

  // Random lightning flashes
  useEffect(() => {
    const triggerLightning = () => {
      const delay = 8000 + Math.random() * 20000;
      const timeout = setTimeout(() => {
        setLightning(true);
        setTimeout(() => setLightning(false), 150);
        setTimeout(() => {
          setLightning(true);
          setTimeout(() => setLightning(false), 80);
        }, 200);
        triggerLightning();
      }, delay);
      return timeout;
    };
    const t = triggerLightning();
    return () => clearTimeout(t);
  }, []);

  const bgGradient = {
    morning: "linear-gradient(180deg, hsl(210 30% 75%) 0%, hsl(35 40% 80%) 100%)",
    evening: "linear-gradient(180deg, hsl(25 50% 40%) 0%, hsl(15 60% 30%) 60%, hsl(220 30% 20%) 100%)",
    night: "linear-gradient(180deg, hsl(220 40% 12%) 0%, hsl(230 35% 18%) 100%)",
  };

  const windowDroplets = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: Math.random() * 30,
      size: 3 + Math.random() * 8,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 10,
      trailLength: 20 + Math.random() * 60,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Slow camera drift */}
      <motion.div
        className="absolute inset-[-2%] w-[104%] h-[104%]"
        animate={{ x: [0, 8, -4, 0], y: [0, -6, 4, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Sky / outside gradient */}
        <div className="absolute inset-0 transition-all duration-[2s]" style={{ background: bgGradient[ambiance] }} />

        {/* Street level */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[hsl(220,15%,12%)] to-transparent" />

        {/* Streetlights with bloom */}
        {[15, 50, 85].map((pos, i) => (
          <div key={i} className="absolute bottom-[28%]" style={{ left: `${pos}%` }}>
            <div className="w-1 h-16 bg-[hsl(30,10%,30%)]" />
            <motion.div
              className="absolute -top-2 -left-5 w-11 h-11 rounded-full"
              style={{
                background: ambiance === "morning"
                  ? "radial-gradient(circle, hsl(45 80% 70% / 0.5), transparent 70%)"
                  : ambiance === "evening"
                  ? "radial-gradient(circle, hsl(35 90% 55% / 0.7), transparent 70%)"
                  : "radial-gradient(circle, hsl(45 50% 60% / 0.6), transparent 70%)",
                filter: "blur(2px)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, delay: i }}
            />
            {/* Bloom halo */}
            <motion.div
              className="absolute -top-4 -left-8 w-16 h-16 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(40 60% 60% / 0.15), transparent 60%)",
                filter: "blur(6px)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.5 }}
            />
            {/* Light cone on wet ground */}
            <motion.div
              className="absolute top-16 -left-8 w-16 h-8 rounded-full opacity-20"
              style={{
                background: "radial-gradient(ellipse, hsl(45 60% 60% / 0.6), transparent 70%)",
              }}
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, delay: i }}
            />
          </div>
        ))}

        {/* Moving cars with light streaks */}
        {[0, 1].map((i) => (
          <div
            key={`car-${i}`}
            className="absolute bottom-[22%]"
            style={{
              animation: `car-pass ${12 + i * 6}s linear ${i * 7}s infinite`,
            }}
          >
            <div className="w-20 h-6 rounded-lg bg-[hsl(220,15%,25%)] relative opacity-40">
              {/* Headlights with streak */}
              <div className="absolute -left-8 top-0 w-10 h-2 rounded-full opacity-50"
                style={{ background: "linear-gradient(to left, hsl(45 80% 70% / 0.6), transparent)" }}
              />
              <div className="absolute -left-1 top-0 w-3 h-2 rounded-full bg-[hsl(45,80%,65%)] opacity-70" />
              {/* Taillights */}
              <div className="absolute -right-6 top-1 w-8 h-1.5 rounded-full opacity-40"
                style={{ background: "linear-gradient(to right, hsl(0 70% 50% / 0.5), transparent)" }}
              />
              <div className="absolute -right-1 top-1 w-2 h-1.5 rounded-full bg-[hsl(0,70%,50%)] opacity-50" />
            </div>
          </div>
        ))}

        {/* Walking people silhouettes with umbrellas */}
        {[0, 1, 2].map((i) => (
          <div
            key={`person-${i}`}
            className="absolute bottom-[27%] opacity-15"
            style={{
              animation: `person-walk ${18 + i * 5}s linear ${i * 6}s infinite`,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Umbrella */}
              <div className="w-8 h-4 rounded-t-full bg-foreground/60 mb-0" />
              <div className="w-0.5 h-2 bg-foreground/40" />
              <div className="w-3 h-3 rounded-full bg-foreground" />
              <div className="w-2 h-6 bg-foreground rounded-b" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Glass distortion layer */}
      <div className="absolute inset-0"
        style={{
          backdropFilter: "blur(0.5px)",
          background: "linear-gradient(135deg, hsl(210 20% 80% / 0.03) 0%, transparent 50%, hsl(210 20% 80% / 0.02) 100%)",
        }}
      />

      {/* Window droplets with trails */}
      <div className="absolute inset-0">
        {windowDroplets.map((d) => (
          <div key={d.id} className="absolute" style={{ left: `${d.left}%`, top: `${d.top}%` }}>
            {/* Trail */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: d.size * 0.4,
                height: d.trailLength,
                top: d.size,
                left: d.size * 0.3,
                background: `linear-gradient(to bottom, hsl(210 30% 80% / 0.2), transparent)`,
              }}
              animate={{
                height: [0, d.trailLength, d.trailLength * 0.5],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                repeat: Infinity,
                ease: "easeIn",
              }}
            />
            {/* Droplet */}
            <div
              className="rounded-full"
              style={{
                width: d.size,
                height: d.size,
                background: "radial-gradient(circle at 30% 30%, hsl(210 30% 85% / 0.5), hsl(210 20% 60% / 0.15))",
                boxShadow: "inset 0 -1px 2px hsl(210 30% 90% / 0.3)",
                animation: `droplet-slide ${d.duration}s ease-in ${d.delay}s infinite`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Lightning flash */}
      <AnimatePresence>
        {lightning && (
          <motion.div
            className="absolute inset-0 z-20"
            style={{ background: "hsl(220 20% 90% / 0.15)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          />
        )}
      </AnimatePresence>

      {/* Night candle flicker */}
      {ambiance === "night" && (
        <motion.div
          className="absolute bottom-[40%] left-[70%] w-20 h-20 rounded-full z-10"
          style={{
            background: "radial-gradient(circle, hsl(35 80% 55% / 0.12), transparent 60%)",
            filter: "blur(8px)",
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1.1, 1],
            opacity: [0.4, 0.6, 0.35, 0.55, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Ambient light overlay */}
      <div
        className="absolute inset-0 transition-all duration-[2s]"
        style={{
          background: ambiance === "morning"
            ? "radial-gradient(ellipse at 50% 30%, hsl(var(--ambient-morning)), transparent 70%)"
            : ambiance === "evening"
            ? "radial-gradient(ellipse at 50% 40%, hsl(var(--ambient-evening)), transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, hsl(var(--ambient-night)), transparent 60%)",
        }}
      />

      {/* Depth-of-field vignette */}
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, hsl(20 30% 8% / 0.4) 100%)",
        }}
      />
    </div>
  );
};

export default WindowScene;