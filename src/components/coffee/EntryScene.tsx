import { motion } from "framer-motion";
import cafeExterior from "@/assets/cafe-exterior.jpg";

interface EntrySceneProps {
  onEnter: () => void;
}

const EntryScene = ({ onEnter }: EntrySceneProps) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-coffee-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={cafeExterior}
          alt="Cozy café exterior"
          className="w-full h-full object-cover opacity-80"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/30 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className="font-display text-6xl md:text-8xl text-coffee-cream mb-4 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Cozy Coffee
        </motion.h1>
        <motion.p
          className="font-handwritten text-2xl md:text-3xl text-coffee-cream/70 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          A little journey for your soul ☕
        </motion.p>

        <motion.button
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-full bg-coffee-caramel/90 text-coffee-cream font-handwritten text-2xl shadow-glow backdrop-blur-sm border border-coffee-cream/20 cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(30 60% 50% / 0.3)" }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10">Enter the Café</span>
          <motion.div
            className="absolute inset-0 rounded-full bg-coffee-caramel"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.2 }}
          />
        </motion.button>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-coffee-cream/20"
          style={{
            left: `${15 + i * 15}%`,
            bottom: "10%",
          }}
          animate={{
            y: [-20, -80, -20],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default EntryScene;
