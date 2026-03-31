import { motion } from "framer-motion";
import type { CoffeeType } from "./MenuScene";

interface RecipeSceneProps {
  coffee: CoffeeType;
  onContinue: () => void;
}

const RecipeScene = ({ coffee, onContinue }: RecipeSceneProps) => {
  const recipeText = coffee.ingredients.join(" + ");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="glass-panel rounded-3xl p-10 shadow-warm"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.p
            className="font-handwritten text-2xl text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The Recipe
          </motion.p>

          <motion.h2
            className="font-display text-4xl text-foreground mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {coffee.name}
          </motion.h2>

          <motion.div
            className="w-12 h-0.5 bg-accent mx-auto mb-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          />

          {/* Ingredients */}
          <div className="space-y-3 mb-8">
            {coffee.ingredients.map((ingredient, i) => (
              <motion.div
                key={ingredient}
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
              >
                {i > 0 && <span className="font-handwritten text-accent text-xl">+</span>}
                <span className="font-display text-lg text-foreground">{ingredient}</span>
              </motion.div>
            ))}
          </div>

          {/* Formula */}
          <motion.div
            className="bg-secondary/40 rounded-2xl p-4 mb-8 border border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-handwritten text-xl text-foreground">
              {coffee.name} = {recipeText}
            </p>
          </motion.div>

          <motion.button
            onClick={onContinue}
            className="px-8 py-3 rounded-2xl bg-accent text-accent-foreground font-handwritten text-xl shadow-soft cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            See Your Coffee →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecipeScene;
