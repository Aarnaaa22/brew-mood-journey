import { useState } from "react";
import { motion } from "framer-motion";
import type { CoffeeType } from "./MenuScene";

export type RoastType = "light" | "medium" | "dark";

interface BeanSelectionSceneProps {
  coffee: CoffeeType;
  onSelect: (roast: RoastType) => void;
  onBack: () => void;
}

const roasts: { id: RoastType; label: string; description: string; color: string }[] = [
  { id: "light", label: "Light Roast", description: "Bright & fruity, delicate aroma", color: "hsl(25 45% 55%)" },
  { id: "medium", label: "Medium Roast", description: "Balanced & smooth, rich body", color: "hsl(20 50% 35%)" },
  { id: "dark", label: "Dark Roast", description: "Bold & smoky, intense flavor", color: "hsl(15 40% 18%)" },
];

const BeanSelectionScene = ({ coffee, onSelect, onBack }: BeanSelectionSceneProps) => {
  const [hoveredRoast, setHoveredRoast] = useState<RoastType | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.button
          onClick={onBack}
          className="font-handwritten text-muted-foreground mb-6 text-lg hover:text-foreground transition-colors cursor-pointer"
          whileHover={{ x: -4 }}
        >
          ← back to selection
        </motion.button>

        <motion.h2
          className="font-display text-4xl text-center text-foreground mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose Your Beans 🌱
        </motion.h2>
        <motion.p
          className="font-handwritten text-xl text-center text-muted-foreground mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          for your {coffee.name}
        </motion.p>

        <div className="grid grid-cols-3 gap-4">
          {roasts.map((roast, i) => (
            <motion.button
              key={roast.id}
              onClick={() => onSelect(roast.id)}
              onMouseEnter={() => setHoveredRoast(roast.id)}
              onMouseLeave={() => setHoveredRoast(null)}
              className="glass-panel rounded-3xl p-6 cursor-pointer border border-transparent hover:border-accent/40 transition-colors duration-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Bean visual */}
              <motion.div
                className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-4xl relative"
                style={{ backgroundColor: roast.color }}
                animate={hoveredRoast === roast.id ? { y: -4, rotate: [0, -5, 5, 0] } : { y: 0 }}
                transition={{ duration: 0.6 }}
              >
                🫘
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${roast.color.replace(")", " / 0.3)")}, transparent 70%)` }}
                  animate={hoveredRoast === roast.id ? { scale: 1.4, opacity: 0.6 } : { scale: 1, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>

              {/* Scattered beans decoration */}
              {[...Array(3)].map((_, j) => (
                <motion.span
                  key={j}
                  className="absolute text-sm opacity-40"
                  style={{
                    top: `${20 + j * 25}%`,
                    left: `${15 + j * 30}%`,
                  }}
                  animate={hoveredRoast === roast.id ? { y: [-2, 2, -2], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                >
                  🫘
                </motion.span>
              ))}

              <span className="font-display text-lg text-foreground mb-1">{roast.label}</span>
              <span className="font-handwritten text-sm text-muted-foreground leading-tight">{roast.description}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BeanSelectionScene;
