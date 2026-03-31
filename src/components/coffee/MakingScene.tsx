import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoffeeType } from "./MenuScene";

interface MakingSceneProps {
  coffee: CoffeeType;
  onComplete: () => void;
}

interface Step {
  label: string;
  icon: string;
  action: string;
}

const getSteps = (coffee: CoffeeType): Step[] => {
  const steps: Step[] = [
    { label: "Select Roast", icon: "🫘", action: "Grinding fresh beans..." },
  ];
  if (coffee.ingredients.includes("Espresso")) {
    steps.push({ label: "Pull Espresso", icon: "☕", action: "Pulling a perfect shot..." });
  }
  if (coffee.ingredients.includes("Chocolate")) {
    steps.push({ label: "Add Chocolate", icon: "🍫", action: "Melting rich chocolate..." });
  }
  if (coffee.ingredients.includes("Hot Water")) {
    steps.push({ label: "Add Hot Water", icon: "💧", action: "Pouring hot water..." });
  }
  if (coffee.ingredients.includes("Steamed Milk")) {
    steps.push({ label: "Steam Milk", icon: "🥛", action: "Steaming silky milk..." });
  }
  if (coffee.ingredients.includes("Foam") || coffee.ingredients.includes("Light Foam")) {
    steps.push({ label: "Add Foam", icon: "☁️", action: "Creating velvety foam..." });
  }
  if (coffee.ingredients.includes("Whipped Cream")) {
    steps.push({ label: "Whipped Cream", icon: "🍦", action: "Topping with cream..." });
  }
  return steps;
};

const MakingScene = ({ coffee, onComplete }: MakingSceneProps) => {
  const steps = getSteps(coffee);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);

  const progress = (completedSteps.length / steps.length) * 100;
  const step = steps[currentStep];

  const handleStep = useCallback(() => {
    setCompletedSteps((prev) => [...prev, currentStep]);
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 600);
    } else {
      setTimeout(onComplete, 800);
    }
  }, [currentStep, steps.length, onComplete]);

  const handleDrop = useCallback(() => {
    if (dragging) {
      setDragging(null);
      handleStep();
    }
  }, [dragging, handleStep]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-display text-3xl text-center text-foreground mb-2">
          Brewing Your {coffee.name}
        </h2>
        <p className="font-handwritten text-xl text-center text-muted-foreground mb-8">
          Drag ingredients or tap to craft
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center font-handwritten text-muted-foreground mb-6">
          Brewing… {Math.round(progress)}%
        </p>

        <div className="glass-panel rounded-3xl p-8 shadow-warm mb-6">
          {/* Coffee station */}
          <div className="flex justify-between items-end mb-6 px-4">
            {/* Coffee machine */}
            <motion.div
              className="flex flex-col items-center"
              animate={completedSteps.length > 0 ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-20 bg-secondary rounded-lg border border-border relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-coffee-medium rounded-b" />
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Machine</span>
            </motion.div>

            {/* Milk jug */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-14 bg-coffee-cream rounded-b-xl rounded-t-lg border border-border relative">
                <div className="absolute -right-2 top-1 w-3 h-5 border-2 border-border rounded-r-full" />
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Milk</span>
            </div>

            {/* Beans */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-10 bg-coffee-medium/30 rounded-xl border border-border flex items-center justify-center text-lg">
                🫘
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Beans</span>
            </div>
          </div>

          {/* Cup with layers */}
          <div className="flex justify-center mb-8">
            <div
              className="relative w-40 h-48"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-44 rounded-b-3xl rounded-t-lg border-2 border-coffee-medium/30 bg-coffee-foam/20 overflow-hidden">
                {completedSteps.map((stepIdx, i) => {
                  const layerColors: Record<string, string> = {
                    "Select Roast": "hsl(20 40% 15%)",
                    "Pull Espresso": "hsl(20 50% 22%)",
                    "Add Chocolate": "hsl(15 40% 25%)",
                    "Add Hot Water": "hsl(30 15% 60%)",
                    "Steam Milk": "hsl(35 30% 85%)",
                    "Add Foam": "hsl(40 25% 92%)",
                    "Whipped Cream": "hsl(40 20% 95%)",
                  };
                  const color = layerColors[steps[stepIdx].label] || "hsl(25 40% 40%)";
                  const layerHeight = 100 / steps.length;
                  return (
                    <motion.div
                      key={stepIdx}
                      className="absolute left-0 right-0"
                      style={{
                        bottom: `${i * layerHeight}%`,
                        height: `${layerHeight}%`,
                        backgroundColor: color,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  );
                })}
                {/* Steam particles */}
                {completedSteps.length > 0 && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`steam-${i}`}
                        className="absolute w-1 bg-coffee-steam/30 rounded-full"
                        style={{ left: `${25 + i * 25}%`, top: -15, height: 12 }}
                        animate={{ y: [-5, -25], opacity: [0.3, 0], scaleX: [1, 1.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="absolute right-[-14px] top-1/3 w-5 h-12 border-2 border-coffee-medium/30 rounded-r-full" />
            </div>
          </div>

          {/* Current step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {step.icon}
              </motion.div>
              <p className="font-display text-xl text-foreground mb-1">{step.label}</p>
              {completedSteps.includes(currentStep) ? (
                <p className="font-handwritten text-lg text-accent">Done! ✓</p>
              ) : (
                <p className="font-handwritten text-lg text-muted-foreground">{step.action}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Draggable ingredient + step pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              draggable={i === currentStep && !completedSteps.includes(i)}
              onDragStart={() => setDragging(s.label)}
              className={`px-3 py-1.5 rounded-full text-sm font-handwritten transition-all duration-300 ${
                completedSteps.includes(i)
                  ? "bg-accent text-accent-foreground"
                  : i === currentStep
                  ? "bg-primary text-primary-foreground cursor-grab active:cursor-grabbing"
                  : "bg-secondary text-secondary-foreground"
              }`}
              animate={i === currentStep && !completedSteps.includes(i) ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {s.icon} {s.label}
            </motion.div>
          ))}
        </div>

        {!completedSteps.includes(currentStep) && (
          <motion.button
            onClick={handleStep}
            className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-handwritten text-2xl shadow-soft cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {step.icon} {step.label}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default MakingScene;
