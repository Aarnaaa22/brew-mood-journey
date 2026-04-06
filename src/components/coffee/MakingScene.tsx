import { useState, useCallback, useRef, useEffect } from "react";
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
  target: "machine" | "milk" | "foam" | "beans";
}

const getSteps = (coffee: CoffeeType): Step[] => {
  const steps: Step[] = [
    { label: "Insert Grounds", icon: "🫘", action: "Tap the beans to load grounds", target: "beans" },
  ];
  if (coffee.ingredients.includes("Espresso")) {
    steps.push({ label: "Pull Espresso", icon: "☕", action: "Tap the machine to pull a shot", target: "machine" });
  }
  if (coffee.ingredients.includes("Chocolate")) {
    steps.push({ label: "Add Chocolate", icon: "🍫", action: "Tap the machine to add chocolate", target: "machine" });
  }
  if (coffee.ingredients.includes("Hot Water")) {
    steps.push({ label: "Add Hot Water", icon: "💧", action: "Tap the machine to add water", target: "machine" });
  }
  if (coffee.ingredients.includes("Steamed Milk")) {
    steps.push({ label: "Pour Milk", icon: "🥛", action: "Tap the milk jug to pour", target: "milk" });
  }
  if (coffee.ingredients.includes("Foam") || coffee.ingredients.includes("Light Foam")) {
    steps.push({ label: "Add Foam", icon: "☁️", action: "Press & drag on the cup to spray foam!", target: "foam" });
  }
  if (coffee.ingredients.includes("Whipped Cream")) {
    steps.push({ label: "Whipped Cream", icon: "🍦", action: "Press & drag on the cup to spray cream!", target: "foam" });
  }
  return steps;
};

const MakingScene = ({ coffee, onComplete }: MakingSceneProps) => {
  const steps = getSteps(coffee);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [machineVibrating, setMachineVibrating] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [milkPouring, setMilkPouring] = useState(false);
  const [perfectBrew] = useState(true);
  const progress = (completedSteps.length / steps.length) * 100;
  const step = steps[currentStep];
  const allDone = completedSteps.length === steps.length;

  // Foam spray state
  const [foamBlobs, setFoamBlobs] = useState<{ x: number; y: number; size: number; id: number }[]>([]);
  const [isSpraying, setIsSpraying] = useState(false);
  const foamCanvasRef = useRef<HTMLDivElement>(null);
  const blobIdRef = useRef(0);
  const foamAmountRef = useRef(0);
  const isFoamStep = step?.target === "foam" && !completedSteps.includes(currentStep) && !allDone;

  const advanceStep = useCallback(() => {
    setCompletedSteps((prev) => [...prev, currentStep]);
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 700);
    } else {
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, steps.length, onComplete]);

  const handleMachineClick = useCallback(() => {
    if (allDone || completedSteps.includes(currentStep)) return;
    if (step?.target !== "machine" && step?.target !== "beans") return;
    setMachineVibrating(true);
    setPouring(true);
    setTimeout(() => setMachineVibrating(false), 600);
    setTimeout(() => setPouring(false), 800);
    advanceStep();
  }, [step, allDone, completedSteps, currentStep, advanceStep]);

  const handleMilkClick = useCallback(() => {
    if (allDone || completedSteps.includes(currentStep)) return;
    if (step?.target !== "milk") return;
    setMilkPouring(true);
    setTimeout(() => setMilkPouring(false), 1200);
    advanceStep();
  }, [step, allDone, completedSteps, currentStep, advanceStep]);

  // Foam spray handlers
  const addFoamBlob = useCallback((clientX: number, clientY: number) => {
    if (!foamCanvasRef.current) return;
    const rect = foamCanvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    // Keep foam in cup area
    if (x < 5 || x > 95 || y < 0 || y > 100) return;
    const size = 8 + Math.random() * 10;
    blobIdRef.current++;
    foamAmountRef.current += size;
    setFoamBlobs((prev) => [...prev, { x, y, size, id: blobIdRef.current }]);
  }, []);

  const handleFoamPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isFoamStep) return;
    setIsSpraying(true);
    addFoamBlob(e.clientX, e.clientY);
  }, [isFoamStep, addFoamBlob]);

  const handleFoamPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isSpraying || !isFoamStep) return;
    addFoamBlob(e.clientX, e.clientY);
  }, [isSpraying, isFoamStep, addFoamBlob]);

  const handleFoamPointerUp = useCallback(() => {
    setIsSpraying(false);
  }, []);

  // Auto-complete foam step when enough foam is sprayed
  useEffect(() => {
    if (isFoamStep && foamAmountRef.current > 120) {
      foamAmountRef.current = 0;
      advanceStep();
    }
  }, [foamBlobs, isFoamStep, advanceStep]);

  const layerColors: Record<string, string> = {
    "Insert Grounds": "hsl(20 40% 15%)",
    "Pull Espresso": "hsl(20 50% 22%)",
    "Add Chocolate": "hsl(15 40% 25%)",
    "Add Hot Water": "hsl(30 15% 55%)",
    "Pour Milk": "hsl(35 30% 82%)",
    "Add Foam": "hsl(40 25% 90%)",
    "Whipped Cream": "hsl(40 20% 94%)",
  };

  // Which item is active target
  const machineActive = step?.target === "machine" || step?.target === "beans";
  const milkActive = step?.target === "milk";

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
          {step?.action || "All done!"}
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
            {/* Machine - clickable for machine/beans steps */}
            <motion.div
              className={`flex flex-col items-center select-none relative ${machineActive && !allDone ? "cursor-pointer" : "cursor-default"}`}
              animate={machineVibrating ? { x: [-2, 2, -1, 1, 0] } : {}}
              transition={{ duration: 0.1, repeat: machineVibrating ? 5 : 0 }}
              onClick={handleMachineClick}
              whileHover={machineActive && !allDone ? { scale: 1.06 } : {}}
              whileTap={machineActive && !allDone ? { scale: 0.95 } : {}}
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
              {/* Pulsing hint for machine steps */}
              {machineActive && !allDone && !completedSteps.includes(currentStep) && (
                <motion.div
                  className="absolute -inset-2 rounded-xl border-2 border-accent/30 pointer-events-none"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Milk jug - clickable for milk step */}
            <motion.div
              className={`flex flex-col items-center relative ${milkActive && !allDone ? "cursor-pointer" : "cursor-default"}`}
              onClick={handleMilkClick}
              whileHover={milkActive && !allDone ? { scale: 1.08 } : {}}
              whileTap={milkActive && !allDone ? { scale: 0.93 } : {}}
            >
              <motion.div
                className="w-10 h-14 bg-coffee-cream rounded-b-xl rounded-t-lg border border-border relative shadow-soft"
                animate={milkPouring ? { rotate: [-25, 0, -25] } : {}}
                transition={{ duration: 1.2, repeat: milkPouring ? 1 : 0 }}
              >
                <div className="absolute -right-2 top-1 w-3 h-5 border-2 border-border rounded-r-full" />
                {milkPouring && (
                  <motion.div
                    className="absolute -bottom-8 left-1 w-1 h-8 bg-coffee-cream rounded-full"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1 }}
                  />
                )}
              </motion.div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Milk</span>
              {/* Pulsing hint for milk step */}
              {milkActive && !allDone && !completedSteps.includes(currentStep) && (
                <motion.div
                  className="absolute -inset-2 rounded-xl border-2 border-accent/30 pointer-events-none"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Beans */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-10 bg-coffee-medium/30 rounded-xl border border-border flex items-center justify-center text-lg shadow-soft">
                🫘
              </div>
              <span className="font-handwritten text-xs text-muted-foreground mt-1">Beans</span>
            </div>
          </div>

          {/* Cup with layers + foam spray zone */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative w-40 h-48"
              animate={pouring || milkPouring ? { y: [0, 1, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Table shadow */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full bg-coffee-dark/15 blur-sm"
                animate={pouring ? { scaleX: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : {}}
                transition={{ duration: 0.5 }}
              />

              <div
                ref={foamCanvasRef}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-44 rounded-b-3xl rounded-t-lg border-2 border-coffee-medium/30 bg-coffee-foam/15 overflow-hidden relative ${isFoamStep ? "cursor-crosshair" : ""}`}
                onPointerDown={handleFoamPointerDown}
                onPointerMove={handleFoamPointerMove}
                onPointerUp={handleFoamPointerUp}
                onPointerLeave={handleFoamPointerUp}
                style={{ touchAction: "none" }}
              >
                {/* Cup inner reflection */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(135deg, hsl(40 30% 90% / 0.1) 0%, transparent 40%, hsl(40 30% 90% / 0.05) 100%)",
                  }}
                />
                {/* Liquid layers */}
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

                {/* Foam blobs from spray */}
                {foamBlobs.map((blob) => (
                  <motion.div
                    key={blob.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: `${blob.x}%`,
                      top: `${blob.y}%`,
                      width: blob.size,
                      height: blob.size * 0.7,
                      background: "radial-gradient(ellipse, hsl(40 30% 95% / 0.95), hsl(40 20% 88% / 0.7))",
                      transform: "translate(-50%, -50%)",
                      filter: "blur(1px)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  />
                ))}

                {/* Foam hint overlay */}
                {isFoamStep && foamBlobs.length === 0 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="font-handwritten text-sm text-foreground/50 bg-background/30 px-3 py-1 rounded-full">
                      spray here ☁️
                    </span>
                  </motion.div>
                )}

                {/* Splash particles */}
                <AnimatePresence>
                  {(pouring || milkPouring) && [...Array(4)].map((_, i) => (
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

                {/* Steam */}
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
              ) : isFoamStep && foamBlobs.length > 0 ? (
                <p className="font-handwritten text-lg text-accent/70">
                  Keep spraying! {Math.min(100, Math.round((foamAmountRef.current / 120) * 100))}%
                </p>
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

        {/* Step indicator dots */}
        <div className="flex gap-2 justify-center mb-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                completedSteps.includes(i)
                  ? "bg-accent"
                  : i === currentStep
                  ? "bg-primary"
                  : "bg-secondary"
              }`}
              animate={i === currentStep && !completedSteps.includes(i) ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              title={s.label}
            />
          ))}
        </div>

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
