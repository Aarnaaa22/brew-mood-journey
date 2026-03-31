import { useMemo } from "react";
import { motion } from "framer-motion";

interface WindowSceneProps {
  ambiance: "morning" | "evening" | "night";
}

const WindowScene = ({ ambiance }: WindowSceneProps) => {
  const bgGradient = {
    morning: "linear-gradient(180deg, hsl(210 30% 75%) 0%, hsl(35 40% 80%) 100%)",
    evening: "linear-gradient(180deg, hsl(25 50% 40%) 0%, hsl(15 60% 30%) 60%, hsl(220 30% 20%) 100%)",
    night: "linear-gradient(180deg, hsl(220 40% 12%) 0%, hsl(230 35% 18%) 100%)",
  };

  const windowDroplets = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: Math.random() * 40,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sky / outside gradient */}
      <div className="absolute inset-0 transition-all duration-[2s]" style={{ background: bgGradient[ambiance] }} />

      {/* Street level */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[hsl(220,15%,12%)] to-transparent" />

      {/* Streetlights */}
      {[15, 50, 85].map((pos, i) => (
        <div key={i} className="absolute bottom-[28%]" style={{ left: `${pos}%` }}>
          <div className="w-1 h-16 bg-[hsl(30,10%,30%)]" />
          <motion.div
            className="absolute -top-1 -left-3 w-7 h-7 rounded-full"
            style={{
              background: ambiance === "morning"
                ? "radial-gradient(circle, hsl(45 80% 70% / 0.4), transparent 70%)"
                : ambiance === "evening"
                ? "radial-gradient(circle, hsl(35 90% 55% / 0.6), transparent 70%)"
                : "radial-gradient(circle, hsl(45 50% 60% / 0.5), transparent 70%)",
              animation: "streetlight-flicker 8s ease-in-out infinite",
              animationDelay: `${i * 2}s`,
            }}
          />
          {/* Light cone reflection on wet ground */}
          <motion.div
            className="absolute top-16 -left-6 w-14 h-6 rounded-full opacity-20"
            style={{
              background: "radial-gradient(ellipse, hsl(45 60% 60% / 0.6), transparent 70%)",
            }}
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: i }}
          />
        </div>
      ))}

      {/* Moving cars */}
      {[0, 1].map((i) => (
        <motion.div
          key={`car-${i}`}
          className="absolute bottom-[22%]"
          style={{
            animation: `car-pass ${12 + i * 6}s linear ${i * 7}s infinite`,
          }}
        >
          <div className="w-20 h-6 rounded-lg bg-[hsl(220,15%,25%)] relative opacity-40">
            <div className="absolute -left-1 top-0 w-3 h-2 rounded-full bg-[hsl(45,80%,65%)] opacity-60" />
            <div className="absolute -right-1 top-1 w-2 h-1.5 rounded-full bg-[hsl(0,70%,50%)] opacity-50" />
          </div>
        </motion.div>
      ))}

      {/* Walking people silhouettes */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`person-${i}`}
          className="absolute bottom-[27%] opacity-20"
          style={{
            animation: `person-walk ${18 + i * 5}s linear ${i * 6}s infinite`,
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-foreground" />
            <div className="w-2 h-6 bg-foreground rounded-b" />
          </div>
        </motion.div>
      ))}

      {/* Window frame overlay */}
      <div className="absolute inset-0">
        {/* Window droplets on glass */}
        {windowDroplets.map((d) => (
          <div
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              background: "radial-gradient(circle at 30% 30%, hsl(210 30% 80% / 0.5), hsl(210 20% 60% / 0.15))",
              animation: `droplet-slide ${d.duration}s ease-in ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

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
    </div>
  );
};

export default WindowScene;
