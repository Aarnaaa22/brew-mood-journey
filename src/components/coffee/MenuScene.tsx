import { motion } from "framer-motion";
import cafeInterior from "@/assets/cafe-interior.jpg";
import SteamAnimation from "./SteamAnimation";

export interface CoffeeType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  ingredients: string[];
}

const coffeeOptions: CoffeeType[] = [
  { id: "espresso", name: "Espresso", description: "Bold & intense", emoji: "☕", ingredients: ["Espresso"] },
  { id: "cappuccino", name: "Cappuccino", description: "Creamy & balanced", emoji: "🤎", ingredients: ["Espresso", "Steamed Milk", "Foam"] },
  { id: "latte", name: "Latte", description: "Smooth & milky", emoji: "🥛", ingredients: ["Espresso", "Steamed Milk", "Light Foam"] },
  { id: "mocha", name: "Mocha", description: "Chocolate bliss", emoji: "🍫", ingredients: ["Espresso", "Chocolate", "Steamed Milk", "Whipped Cream"] },
  { id: "americano", name: "Americano", description: "Classic & clean", emoji: "💧", ingredients: ["Espresso", "Hot Water"] },
];

interface MenuSceneProps {
  onSelect: (coffee: CoffeeType) => void;
}

const MenuScene = ({ onSelect }: MenuSceneProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={cafeInterior}
          alt="Café interior"
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16">
        {/* Menu card */}
        <motion.div
          className="bg-card/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-warm border border-border/50"
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
            className="w-16 h-0.5 bg-accent mx-auto mb-8 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />

          <div className="space-y-3">
            {coffeeOptions.map((coffee, i) => (
              <motion.button
                key={coffee.id}
                onClick={() => onSelect(coffee)}
                className="group w-full text-left p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-accent/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl relative">
                      {coffee.emoji}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <SteamAnimation count={2} />
                      </div>
                    </span>
                    <div>
                      <span className="font-display text-lg text-foreground block">{coffee.name}</span>
                      <span className="font-handwritten text-muted-foreground text-sm">{coffee.description}</span>
                    </div>
                  </div>
                  <motion.span
                    className="text-accent opacity-0 group-hover:opacity-100 font-handwritten text-lg"
                    initial={false}
                  >
                    select →
                  </motion.span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuScene;
export { coffeeOptions };
export type { CoffeeType as CoffeeTypeExport };
