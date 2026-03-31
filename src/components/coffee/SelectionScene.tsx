import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoffeeType } from "./MenuScene";

interface SelectionSceneProps {
  coffee: CoffeeType;
  onConfirm: (quantity: number, cupSize: string) => void;
  onBack: () => void;
}

const cupSizes = [
  { id: "small", label: "Small", scale: 0.7, ml: "200ml" },
  { id: "medium", label: "Medium", scale: 0.85, ml: "350ml" },
  { id: "large", label: "Large", scale: 1, ml: "500ml" },
];

const SelectionScene = ({ coffee, onConfirm, onBack }: SelectionSceneProps) => {
  const [quantity, setQuantity] = useState(1);
  const [cupSize, setCupSize] = useState("medium");
  const fillPercent = Math.min(quantity * 20, 100);
  const currentSize = cupSizes.find((s) => s.id === cupSize) || cupSizes[1];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
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

        <div className="glass-panel rounded-3xl p-8 shadow-warm">
          <h2 className="font-display text-3xl text-foreground mb-1">{coffee.name}</h2>
          <p className="font-handwritten text-xl text-muted-foreground mb-6">{coffee.description}</p>

          {/* Cup size selector */}
          <div className="flex justify-center gap-4 mb-6">
            {cupSizes.map((size) => (
              <motion.button
                key={size.id}
                onClick={() => setCupSize(size.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  cupSize === size.id
                    ? "bg-accent/20 border border-accent/40"
                    : "bg-secondary/30 border border-transparent hover:border-border"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-handwritten text-lg text-foreground">{size.label}</span>
                <span className="text-xs text-muted-foreground font-handwritten">{size.ml}</span>
              </motion.button>
            ))}
          </div>

          {/* Cup visualization */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ scale: currentSize.scale }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-32 h-40">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-36 rounded-b-3xl rounded-t-lg border-2 border-coffee-medium/40 bg-coffee-foam/20 overflow-hidden">
                  {/* Liquid fill with smooth animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
                    style={{
                      background: coffee.category === "coffee"
                        ? "linear-gradient(to top, hsl(20 40% 18%), hsl(25 45% 30%), hsl(30 35% 55%))"
                        : "linear-gradient(to top, hsl(35 50% 60%), hsl(40 45% 75%))",
                    }}
                    initial={{ height: "20%" }}
                    animate={{ height: `${fillPercent}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                  {/* Foam layer */}
                  <AnimatePresence>
                    {fillPercent > 40 && coffee.category === "coffee" && (
                      <motion.div
                        className="absolute left-0 right-0 h-3 bg-coffee-foam/80 rounded-full"
                        style={{ bottom: `${fillPercent}%` }}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Surface shimmer */}
                  <motion.div
                    className="absolute left-2 right-2 h-1 rounded-full bg-coffee-cream/30"
                    style={{ bottom: `${Math.max(fillPercent - 2, 0)}%` }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                {/* Handle */}
                <div className="absolute right-[-12px] top-1/3 w-4 h-10 border-2 border-coffee-medium/40 rounded-r-full" />
              </div>
            </motion.div>
          </div>

          {/* Quantity selector */}
          <div className="text-center mb-6">
            <p className="font-handwritten text-xl text-muted-foreground mb-4">How many?</p>
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-display text-xl flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.15, backgroundColor: "hsl(var(--accent) / 0.2)" }}
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
                whileHover={{ scale: 1.15, backgroundColor: "hsl(var(--accent) / 0.2)" }}
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
                background: `linear-gradient(to right, hsl(var(--accent)) ${(quantity - 1) * 25}%, hsl(var(--secondary)) ${(quantity - 1) * 25}%)`,
              }}
            />
          </div>

          <motion.button
            onClick={() => onConfirm(quantity, cupSize)}
            className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-handwritten text-2xl shadow-soft cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(28 60% 45% / 0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            {coffee.category === "coffee" ? "Start Brewing ✨" : "Add to Order ✨"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectionScene;
