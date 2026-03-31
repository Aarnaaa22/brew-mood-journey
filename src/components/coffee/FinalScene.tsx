import { motion } from "framer-motion";
import coffeeCupImg from "@/assets/coffee-cup.jpg";
import type { CoffeeType } from "./MenuScene";

interface FinalSceneProps {
  coffee: CoffeeType;
  quantity: number;
  onRestart: () => void;
}

const FinalScene = ({ coffee, quantity, onRestart }: FinalSceneProps) => {
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
        {/* Coffee image with glow */}
        <motion.div
          className="relative mx-auto w-64 h-64 mb-8"
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
          {/* Continuous steam */}
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

        <motion.p
          className="font-handwritten text-lg text-accent mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Made with: {coffee.ingredients.join(" · ")}
        </motion.p>

        <motion.button
          onClick={onRestart}
          className="px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-xl border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
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
