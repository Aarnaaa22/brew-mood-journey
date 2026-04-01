import { motion } from "framer-motion";

const SteamAnimation = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-coffee-steam/35"
          style={{ height: 16 + i * 4 }}
          animate={{
            y: [-0, -25, -40],
            opacity: [0.35, 0.15, 0],
            scaleX: [1, 1.5, 0.4],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default SteamAnimation;