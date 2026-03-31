import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cafeExterior from "@/assets/cafe-exterior.jpg";

interface EntrySceneProps {
  onEnter: (name: string) => void;
}

const EntryScene = ({ onEnter }: EntrySceneProps) => {
  const [doorOpen, setDoorOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleEnter = () => {
    if (!userName.trim()) return;
    setDoorOpen(true);
    setTimeout(() => onEnter(userName.trim()), 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-coffee-dark">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        animate={doorOpen ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <img
          src={cafeExterior}
          alt="Cozy café exterior in rain"
          className="w-full h-full object-cover opacity-80"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/30 to-transparent" />
      </motion.div>

      {/* Door opening overlay */}
      <AnimatePresence>
        {doorOpen && (
          <motion.div
            className="absolute inset-0 z-20 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-1/2 h-full bg-coffee-dark"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="w-1/2 h-full bg-coffee-dark"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={doorOpen ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
        transition={{ duration: doorOpen ? 0.5 : 1.2, ease: "easeOut" }}
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
          className="font-handwritten text-2xl md:text-3xl text-coffee-cream/70 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          A rainy day journey for your soul 🌧️☕
        </motion.p>

        {/* Name input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <label className="font-handwritten text-xl text-coffee-cream/80 block mb-3">
            What's your name?
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="Enter your name…"
            className="w-64 px-6 py-3 rounded-full bg-coffee-dark/50 border border-coffee-cream/20 text-coffee-cream font-handwritten text-xl text-center placeholder:text-coffee-cream/30 focus:outline-none focus:border-coffee-caramel/50 focus:ring-2 focus:ring-coffee-caramel/20 backdrop-blur-sm transition-all duration-300"
          />
        </motion.div>

        <motion.button
          onClick={handleEnter}
          className={`group relative px-10 py-4 rounded-full font-handwritten text-2xl shadow-glow backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
            userName.trim()
              ? "bg-coffee-caramel/90 text-coffee-cream border-coffee-cream/20"
              : "bg-coffee-dark/40 text-coffee-cream/40 border-coffee-cream/10 cursor-not-allowed"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={userName.trim() ? { scale: 1.05, boxShadow: "0 0 50px hsl(30 60% 50% / 0.3)" } : {}}
          whileTap={userName.trim() ? { scale: 0.97 } : {}}
        >
          <span className="relative z-10">Enter the Café</span>
        </motion.button>
      </motion.div>

      {/* Floating rain particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 rounded-full bg-rain-blue/30"
          style={{
            left: `${10 + i * 12}%`,
            height: 15 + Math.random() * 20,
            top: "-5%",
          }}
          animate={{
            y: [0, typeof window !== "undefined" ? window.innerHeight + 100 : 900],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default EntryScene;
