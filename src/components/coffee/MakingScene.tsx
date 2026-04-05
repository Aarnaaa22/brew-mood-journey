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
    { label: "Insert Grounds", icon: "🫘", action: "Loading fresh grounds into machine..." },
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
    steps.push({ label: "Pour Milk", icon: "🥛", action: "Steaming silky milk..." });
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
  const [machineVibrating, setMachineVibrating] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [perfectBrew, setPerfectBrew] = useState(true);

  const progress = (completedSteps.length / steps.length) * 100;
  const step = steps[currentStep];
  const allDone = completedSteps.length === steps.length;

  const handleStep = useCallback(() => {
    setMachineVibrating(true);
    setPouring(true);
    setTimeout(() => setMachineVibrating(false), 600);
    setTimeout(() => setPouring(false), 800);

    setCompletedSteps((prev) => [...prev, currentStep]);
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 700);
    } else {
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, steps.length, onComplete]);

  const handleDrop = useCallback(() => {
    if (dragging) {
      setDragging(null);
      handleStep();
    }
  }, [dragging, handleStep]);

  const layerColors: Record<string, string> = {
    "Insert Grounds": "hsl(20 40% 15%)",
    "Pull Espresso": "hsl(20 50% 22%)",
    "Add Chocolate": "hsl(15 40% 25%)",
    "Add Hot Water": "hsl(30 15% 55%)",
    "Pour Milk": "hsl(35 30% 82%)",
    "Add Foam": "hsl(40 25% 90%)",
    "Whipped Cream": "hsl(40 20% 94%)",
  };

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
        <p className="font-handwritten text-xl text-center text-muted-foreground mb-6">
          Tap the machine to brew
        </p>

        {/* Circular progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" />
              <motion.circle
                cx="20" cy="20" r="16" fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={100.5}
                animate={{ strokeDashoffset: 100.5 - (progress / 100) * 100.5 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-handwritten text-xs text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-warm mb-6 relative">
          {/* Coffee station */}
          <div className="flex justify-between items-end mb-6 px-4">
            {/* Machine */}
            <motion.div
              className="flex flex-col items-center"
              animate={machineVibrating ? { x: [-2, 2, -1, 1, 0] } : {}}
              transition={{ duration: 0.1, repeat: machineVibrating ? 5 : 0 }}
            >
              <div className="w-16 h-20 bg-secondary rounded-lg border border-border relative shadow-soft">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent" />
                <motion.div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)" }}
                  animate={machineVibrating ? { scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] } : {}}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-coffee-medium rounded-b" />
                {/* Espresso pour stream */}
                {pouring && (
                  <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1 bg-coffee-dark rounded-full"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 30, opacity: 0.7 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Machine</span>
            </motion.div>

            {/* Milk jug */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-10 h-14 bg-coffee-cream rounded-b-xl rounded-t-lg border border-border relative shadow-soft"
                animate={pouring && step?.label === "Pour Milk" ? { rotate: [-15, 0] } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute -right-2 top-1 w-3 h-5 border-2 border-border rounded-r-full" />
                {/* Milk pour */}
                {pouring && step?.label === "Pour Milk" && (
                  <motion.div
                    className="absolute -bottom-6 left-2 w-0.5 h-6 bg-coffee-cream rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1, opacity: [0.8, 0.4] }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Milk</span>
            </div>

            {/* Beans */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-10 bg-coffee-medium/30 rounded-xl border border-border flex items-center justify-center text-lg shadow-soft">
                🫘
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Beans</span>
            </div>
          </div>

          {/* Cup with layers */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative w-40 h-48"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              animate={pouring ? { y: [0, 1, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Table shadow ripple */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full bg-coffee-dark/15 blur-sm"
                animate={pouring ? { scaleX: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : {}}
                transition={{ duration: 0.5 }}
              />

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-44 rounded-b-3xl rounded-t-lg border-2 border-coffee-medium/30 bg-coffee-foam/15 overflow-hidden relative">
                {/* Cup inner reflection */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(135deg, hsl(40 30% 90% / 0.1) 0%, transparent 40%, hsl(40 30% 90% / 0.05) 100%)",
                  }}
                />
                {completedSteps.map((stepIdx, i) => {
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
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  );
                })}

                {/* Splash particles when pouring */}
                <AnimatePresence>
                  {pouring && [...Array(4)].map((_, i) => (
                    <motion.div
                      key={`splash-${i}`}
                      className="absolute w-1 h-1 rounded-full bg-coffee-cream/40"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        bottom: `${(completedSteps.length / steps.length) * 100}%`,
                      }}
                      initial={{ y: 0, opacity: 0.6 }}
                      animate={{
                        y: -(10 + Math.random() * 15),
                        x: (Math.random() - 0.5) * 20,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    />
                  ))}
                </AnimatePresence>

                {/* Curved steam */}
                {completedSteps.length > 0 && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`steam-${i}`}
                        className="absolute bg-coffee-steam/25 rounded-full"
                        style={{
                          left: `${20 + i * 20}%`,
                          top: -12,
                          width: 2,
                          height: 14,
                        }}
                        animate={{
                          y: [-5, -35],
                          opacity: [0.25, 0],
                          scaleX: [1, 1.8],
                          rotate: [0, i % 2 === 0 ? 20 : -20],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      />
                    ))}
                  </>
                )}
              </div>
              {/* Handle */}
              <div className="absolute right-[-14px] top-1/3 w-5 h-12 border-2 border-coffee-medium/30 rounded-r-full" />
            </motion.div>
          </div>

          {/* Current step display */}
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
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {step?.icon}
              </motion.div>
              <p className="font-display text-xl text-foreground mb-1">{step?.label}</p>
              {completedSteps.includes(currentStep) ? (
                <p className="font-handwritten text-lg text-accent">Done! ✓</p>
              ) : (
                <p className="font-handwritten text-lg text-muted-foreground">{step?.action}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Live recipe */}
          {completedSteps.length > 0 && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-handwritten text-sm text-muted-foreground">
                {coffee.name} = {completedSteps.map((s) => steps[s].label.replace("Insert ", "").replace("Pull ", "").replace("Add ", "").replace("Pour ", "")).join(" + ")}
                {!allDone && " + …"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Step pills */}
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
                  ? "bg-primary text-primary-foreground cursor-grab active:cursor-grabbing shadow-soft"
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
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(var(--accent) / 0.25)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {step?.icon} {step?.label}
          </motion.button>
        )}

        {/* Perfect brew feedback */}
        {allDone && perfectBrew && (
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <p className="font-handwritten text-2xl text-accent">Perfect Brew ✨</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MakingScene;