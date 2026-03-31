import { useState } from "react";
import { motion } from "framer-motion";
import cafeInterior from "@/assets/cafe-interior.jpg";
import SteamAnimation from "./SteamAnimation";

export interface CoffeeType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  ingredients: string[];
  category: "coffee" | "snack";
}

const menuItems: CoffeeType[] = [
  { id: "espresso", name: "Espresso", description: "Bold & intense", emoji: "☕", ingredients: ["Espresso"], category: "coffee" },
  { id: "cappuccino", name: "Cappuccino", description: "Creamy & balanced", emoji: "🤎", ingredients: ["Espresso", "Steamed Milk", "Foam"], category: "coffee" },
  { id: "latte", name: "Latte", description: "Smooth & milky", emoji: "🥛", ingredients: ["Espresso", "Steamed Milk", "Light Foam"], category: "coffee" },
  { id: "mocha", name: "Mocha", description: "Chocolate bliss", emoji: "🍫", ingredients: ["Espresso", "Chocolate", "Steamed Milk", "Whipped Cream"], category: "coffee" },
  { id: "americano", name: "Americano", description: "Classic & clean", emoji: "💧", ingredients: ["Espresso", "Hot Water"], category: "coffee" },
  { id: "croissant", name: "Croissant", description: "Flaky & buttery", emoji: "🥐", ingredients: ["Butter", "Flour", "Love"], category: "snack" },
  { id: "muffin", name: "Muffin", description: "Warm & fluffy", emoji: "🧁", ingredients: ["Blueberry", "Batter"], category: "snack" },
  { id: "chocolate-cake", name: "Chocolate Cake", description: "Rich & decadent", emoji: "🍰", ingredients: ["Chocolate", "Cream", "Joy"], category: "snack" },
  { id: "cookies", name: "Cookies", description: "Crispy & sweet", emoji: "🍪", ingredients: ["Butter", "Chocolate Chips"], category: "snack" },
  { id: "sandwich", name: "Sandwich", description: "Hearty & fresh", emoji: "🥪", ingredients: ["Bread", "Cheese", "Greens"], category: "snack" },
];

interface MenuSceneProps {
  userName: string;
  onSelectCoffee: (item: CoffeeType) => void;
  onSelectSnack: (item: CoffeeType) => void;
  selectedSnack: CoffeeType | null;
}

const MenuScene = ({ userName, onSelectCoffee, onSelectSnack, selectedSnack }: MenuSceneProps) => {
  const [tab, setTab] = useState<"coffee" | "snack">("coffee");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filtered = menuItems.filter((m) => m.category === tab);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setMousePos({ x, y });
  };

  const handleItemClick = (item: CoffeeType) => {
    if (item.category === "coffee") {
      onSelectCoffee(item);
    } else {
      onSelectSnack(item);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={cafeInterior} alt="Café interior" className="w-full h-full object-cover opacity-30" loading="lazy" width={1280} height={800} />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      {/* NPC silhouettes */}
      {[20, 75].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[15%] opacity-10 blur-[2px]"
          style={{ left: `${pos}%` }}
          animate={{ y: [0, -4, 0], x: [0, i % 2 === 0 ? 3 : -3, 0] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-foreground" />
            <div className="w-4 h-12 bg-foreground rounded-b-lg mt-1" />
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16">
        {/* Welcome message */}
        <motion.p
          className="font-handwritten text-2xl text-center text-muted-foreground mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome, {userName}! ✨
        </motion.p>

        {/* Selected snack indicator */}
        {selectedSnack && (
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2">
              <span>{selectedSnack.emoji}</span>
              <span className="font-handwritten text-foreground">{selectedSnack.name} added!</span>
              <span className="text-accent">✓</span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="glass-panel rounded-3xl p-8 md:p-10 shadow-warm"
          style={{
            transform: `perspective(800px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="font-handwritten text-5xl text-center text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our Menu
          </motion.h2>
          <motion.div
            className="w-16 h-0.5 bg-accent mx-auto mb-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />

          <div className="flex justify-center gap-2 mb-6">
            {(["coffee", "snack"] as const).map((t) => (
              <motion.button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full font-handwritten text-lg cursor-pointer transition-all duration-300 ${
                  tab === t
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t === "coffee" ? "☕ Coffee" : "🥐 Snacks"}
              </motion.button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group w-full text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  selectedSnack?.id === item.id
                    ? "bg-accent/20 border-accent/40"
                    : "bg-secondary/40 hover:bg-secondary/70 border-transparent hover:border-accent/30"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ x: 6, boxShadow: "0 0 20px hsl(var(--accent) / 0.15)" }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl relative">
                      {item.emoji}
                      {item.category === "coffee" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <SteamAnimation count={2} />
                        </div>
                      )}
                    </span>
                    <div>
                      <span className="font-display text-lg text-foreground block">{item.name}</span>
                      <span className="font-handwritten text-muted-foreground text-sm">{item.description}</span>
                    </div>
                  </div>
                  <motion.span
                    className="text-accent opacity-0 group-hover:opacity-100 font-handwritten text-lg"
                    initial={false}
                  >
                    {item.category === "coffee" ? "brew →" : "add ✓"}
                  </motion.span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Prompt to select coffee if snack tab is active and snack selected */}
          {tab === "snack" && selectedSnack && (
            <motion.p
              className="font-handwritten text-center text-accent mt-4 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Now pick a coffee from the ☕ tab!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MenuScene;
export { menuItems };
