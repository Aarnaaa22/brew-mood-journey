import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coffeeCupImg from "@/assets/coffee-cup.jpg";
import type { CoffeeType } from "./MenuScene";
import { menuItems } from "./MenuScene";

interface FinalSceneProps {
  coffee: CoffeeType;
  quantity: number;
  userName: string;
  selectedSnack: CoffeeType | null;
  onRestart: () => void;
}

const emotionalMessages = [
  "Take a break, you deserve this ☕",
  "Slow moments matter 🌧️",
  "Breathe in the aroma… ✨",
  "Life is better with coffee 🤎",
  "A warm cup, a quiet moment 🌿",
];

const FinalScene = ({ coffee, quantity, userName, selectedSnack, onRestart }: FinalSceneProps) => {
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % emotionalMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 overflow-hidden relative z-10">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Coffee cup with glow */}
        <motion.div
          className="relative mx-auto w-56 h-56 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl" />
          <img
            src={coffeeCupImg}
            alt={`Your ${coffee.name}`}
            className="w-full h-full object-cover rounded-full shadow-glow relative z-10"
            loading="lazy"
            width={800}
            height={800}
          />
          {/* Curved steam */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-coffee-steam/30 rounded-full z-20"
              style={{
                height: 15 + i * 5,
                left: `${25 + i * 12}%`,
                top: -10,
              }}
              animate={{
                y: [-5, -40, -60],
                opacity: [0.3, 0.15, 0],
                scaleX: [1, 1.5, 0.5],
                rotate: [0, i % 2 === 0 ? 15 : -15, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        <motion.h2
          className="font-display text-4xl md:text-5xl text-foreground mb-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Your {coffee.name} is ready ☕
        </motion.h2>

        <motion.p
          className="font-handwritten text-2xl text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {quantity > 1 ? `${quantity} cups, crafted with love` : "Crafted with love, just for you"}
        </motion.p>

        {/* Snack display */}
        {selectedSnack && (
          <motion.div
            className="glass-panel rounded-2xl p-4 mb-4 inline-flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <span className="text-3xl">{selectedSnack.emoji}</span>
            <div className="text-left">
              <p className="font-display text-foreground">{selectedSnack.name}</p>
              <p className="font-handwritten text-sm text-muted-foreground">served on the side</p>
            </div>
          </motion.div>
        )}

        {/* Personalized plate message */}
        <motion.div
          className="glass-panel rounded-2xl p-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          <p className="font-handwritten text-2xl text-accent">
            Made for {userName} 💛
          </p>
        </motion.div>

        <motion.p
          className="font-handwritten text-lg text-accent mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          Made with: {coffee.ingredients.join(" · ")}
        </motion.p>

        {/* Rotating emotional messages */}
        <div className="h-10 mb-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIdx}
              className="font-handwritten text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
            >
              {emotionalMessages[messageIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={onRestart}
          className="px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-xl border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Order Another ↻
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FinalScene;
