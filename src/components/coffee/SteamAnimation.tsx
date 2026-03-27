import { motion } from "framer-motion";

const SteamAnimation = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-coffee-steam/40"
          style={{ height: 20 + Math.random() * 10 }}
          animate={{
            y: [-0, -30, -50],
            opacity: [0.4, 0.2, 0],
            scaleX: [1, 1.3, 0.6],
          }}
          transition={{
            duration: 2.5 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default SteamAnimation;
