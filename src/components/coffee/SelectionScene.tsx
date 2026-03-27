import { useState } from "react";
import { motion } from "framer-motion";
import type { CoffeeType } from "./MenuScene";

interface SelectionSceneProps {
  coffee: CoffeeType;
  onConfirm: (quantity: number) => void;
  onBack: () => void;
}

const SelectionScene = ({ coffee, onConfirm, onBack }: SelectionSceneProps) => {
  const [quantity, setQuantity] = useState(1);
  const fillPercent = Math.min(quantity * 20, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.button
          onClick={onBack}
          className="font-handwritten text-muted-foreground mb-6 text-lg hover:text-foreground transition-colors cursor-pointer"
          whileHover={{ x: -4 }}
        >
          ← back to menu
        </motion.button>

        <div className="bg-card/80 backdrop-blur rounded-3xl p-8 shadow-warm border border-border/50">
          <h2 className="font-display text-3xl text-foreground mb-1">{coffee.name}</h2>
          <p className="font-handwritten text-xl text-muted-foreground mb-8">{coffee.description}</p>

          {/* Cup visualization */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-40">
              {/* Cup shape */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-36 rounded-b-3xl rounded-t-lg border-2 border-coffee-medium/40 bg-coffee-foam/30 overflow-hidden">
                {/* Fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
                  style={{
                    background: `linear-gradient(to top, hsl(20 40% 18%), hsl(25 45% 30%), hsl(30 35% 55%))`,
                  }}
                  initial={{ height: "20%" }}
                  animate={{ height: `${fillPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Foam layer */}
                {fillPercent > 40 && (
                  <motion.div
                    className="absolute left-0 right-0 h-3 bg-coffee-foam/80 rounded-full"
                    style={{ bottom: `${fillPercent}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                )}
              </div>
              {/* Handle */}
              <div className="absolute right-[-12px] top-1/3 w-4 h-10 border-2 border-coffee-medium/40 rounded-r-full" />
            </div>
          </div>

          {/* Quantity selector */}
          <div className="text-center mb-6">
            <p className="font-handwritten text-xl text-muted-foreground mb-4">How many cups?</p>
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-display text-xl flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                −
              </motion.button>
              <motion.span
                key={quantity}
                className="font-display text-4xl text-foreground w-12 text-center"
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {quantity}
              </motion.span>
              <motion.button
                onClick={() => setQuantity(Math.min(5, quantity + 1))}
                className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-display text-xl flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <input
              type="range"
              min={1}
              max={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(28 60% 45%) ${(quantity - 1) * 25}%, hsl(30 20% 82%) ${(quantity - 1) * 25}%)`,
              }}
            />
          </div>

          <motion.button
            onClick={() => onConfirm(quantity)}
            className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-handwritten text-2xl shadow-soft cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(28 60% 45% / 0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            Start Brewing ✨
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectionScene;
