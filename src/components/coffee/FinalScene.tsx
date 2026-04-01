import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coffeeCupImg from "@/assets/coffee-cup.jpg";
import type { CoffeeType } from "./MenuScene";

interface FinalSceneProps {
  coffee: CoffeeType;
  quantity: number;
  userName: string;
  selectedSnack: CoffeeType | null;
  onRestart: () => void;
}

const emotionalMessages = [
  "Take a breath… this moment is yours ☕",
  "Slow down, you're doing fine 🌧️",
  "Warm coffee, quiet rain… ✨",
  "Life is better one sip at a time 🤎",
  "A warm cup, a quiet moment 🌿",
  "Slow moments matter 💛",
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
      {/* Golden spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(35 60% 50% / 0.08), transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Coffee cup with glow & cinematic steam */}
        <motion.div
          className="relative mx-auto w-52 h-52 mb-8"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-[-20px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 60%)",
              filter: "blur(15px)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <img
            src={coffeeCupImg}
            alt={`Your ${coffee.name}`}
            className="w-full h-full object-cover rounded-full shadow-glow relative z-10"
            loading="lazy"
            width={800}
            height={800}
          />
          {/* Cup reflection */}
          <div
            className="absolute inset-0 rounded-full z-20 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, hsl(40 40% 90% / 0.15) 0%, transparent 40%)",
            }}
          />
          {/* Curved organic steam */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-coffee-steam/25 rounded-full z-20"
              style={{
                width: 1.5 + i * 0.3,
                height: 16 + i * 4,
                left: `${20 + i * 12}%`,
                top: -8,
              }}
              animate={{
                y: [-5, -50, -70],
                opacity: [0.25, 0.1, 0],
                scaleX: [1, 2, 0.5],
                rotate: [0, i % 2 === 0 ? 25 : -25, i % 2 === 0 ? -10 : 10],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        <motion.h2
          className="font-display text-3xl md:text-4xl text-foreground mb-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Your {coffee.name} is ready ☕
        </motion.h2>

        <motion.p
          className="font-handwritten text-xl text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {quantity > 1 ? `${quantity} cups, crafted with love` : "Crafted with love, just for you"}
        </motion.p>

        {/* Snack display beside coffee */}
        {selectedSnack && (
          <motion.div
            className="glass-panel rounded-2xl p-4 mb-4 inline-flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            <span className="text-3xl">{selectedSnack.emoji}</span>
            <div className="text-left">
              <p className="font-display text-foreground">{selectedSnack.name}</p>
              <p className="font-handwritten text-sm text-muted-foreground">plated beside your coffee</p>
            </div>
          </motion.div>
        )}

        {/* Personalized plate message */}
        <motion.div
          className="glass-panel rounded-2xl p-5 mb-4 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          {/* Handwritten style decoration */}
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-accent/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          />
          <p className="font-handwritten text-2xl text-accent">
            Made for {userName} 💛
          </p>
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-accent/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          />
        </motion.div>

        <motion.p
          className="font-handwritten text-lg text-accent/80 mb-2"
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
          className="px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-xl border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-500 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--accent) / 0.15)" }}
          whileTap={{ scale: 0.97 }}
        >
          Order Another ↻
        </motion.button>
      </motion.div>

      {/* Bottom vignette */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)" }}
      />
    </div>
  );
};

export default FinalScene;