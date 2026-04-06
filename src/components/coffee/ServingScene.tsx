import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coffeeCupImg from "@/assets/coffee-cup.jpg";
import type { CoffeeType } from "./MenuScene";

type Gender = "female" | "male";

interface ServingSceneProps {
  coffee: CoffeeType;
  quantity: number;
  userName: string;
  gender: Gender;
  selectedSnack: CoffeeType | null;
  paintingDataUrl: string | null;
  onRestart: () => void;
}

const emotionalMessages = [
  "Take a breath… this moment is yours",
  "Slow down, you're doing fine",
  "Coffee, rain, and creativity",
  "Life is better one sip at a time",
  "This moment is yours",
  "Slow moments matter",
];

type NpcPhase = "sitting" | "stand-up" | "walk-to-counter" | "pickup" | "walk-back" | "sit-down" | "done";

const ServingScene = ({ coffee, quantity, userName, gender, selectedSnack, paintingDataUrl, onRestart }: ServingSceneProps) => {
  const [messageIdx, setMessageIdx] = useState(0);
  const [npcPhase, setNpcPhase] = useState<NpcPhase>("sitting");
  const [showTable, setShowTable] = useState(false);

  const isFemale = gender === "female";

  // NPC sequence: sitting → stand-up → walk-to-counter → pickup → walk-back → sit-down → done
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setNpcPhase("stand-up"), 600));
    timers.push(setTimeout(() => setNpcPhase("walk-to-counter"), 1200));
    timers.push(setTimeout(() => setNpcPhase("pickup"), 3200));
    timers.push(setTimeout(() => setNpcPhase("walk-back"), 4200));
    timers.push(setTimeout(() => setNpcPhase("sit-down"), 6200));
    timers.push(setTimeout(() => {
      setNpcPhase("done");
      setShowTable(true);
    }, 7200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % emotionalMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // NPC positions
  const npcConfig: Record<NpcPhase, { left: string; bottom: string; scale: number; opacity: number }> = {
    "sitting":          { left: "80%", bottom: "16%", scale: 0.9, opacity: 1 },
    "stand-up":         { left: "80%", bottom: "18%", scale: 1, opacity: 1 },
    "walk-to-counter":  { left: "50%", bottom: "18%", scale: 1, opacity: 1 },
    "pickup":           { left: "50%", bottom: "18%", scale: 1, opacity: 1 },
    "walk-back":        { left: "80%", bottom: "18%", scale: 1, opacity: 1 },
    "sit-down":         { left: "80%", bottom: "16%", scale: 0.9, opacity: 1 },
    "done":             { left: "80%", bottom: "16%", scale: 0.9, opacity: 0 },
  };

  const pos = npcConfig[npcPhase];
  const isWalking = npcPhase === "walk-to-counter" || npcPhase === "walk-back";
  const hasCup = npcPhase === "pickup" || npcPhase === "walk-back" || npcPhase === "sit-down";

  // Status text
  const statusText =
    npcPhase === "sitting" ? "Your coffee is ready at the counter!" :
    npcPhase === "stand-up" ? `${isFemale ? "She" : "He"} stands up...` :
    npcPhase === "walk-to-counter" ? `Walking to the counter...` :
    npcPhase === "pickup" ? "Picking up the coffee..." :
    npcPhase === "walk-back" ? "Heading back to the table..." :
    npcPhase === "sit-down" ? "Sitting down..." : "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative z-10">
      {/* Warm spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(35 60% 50% / 0.05), transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Walking NPC */}
      {npcPhase !== "done" && (
        <motion.div
          className="fixed z-20"
          animate={{
            left: pos.left,
            bottom: pos.bottom,
            scale: pos.scale,
            opacity: pos.opacity,
          }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center relative">
            {/* Head */}
            <motion.div
              className="w-7 h-7 rounded-full bg-foreground/20 relative z-10"
              animate={isWalking ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 0.6, repeat: isWalking ? Infinity : 0 }}
            />
            {/* Hair */}
            {isFemale ? (
              <div className="absolute -top-1.5 w-8 h-5 rounded-t-full bg-foreground/12" />
            ) : (
              <div className="absolute -top-0.5 w-7 h-2.5 rounded-t-full bg-foreground/12" />
            )}
            {/* Body */}
            <div
              className="w-8 h-12 rounded-b-lg mt-0.5"
              style={{
                backgroundColor: isFemale
                  ? "hsl(330 35% 50% / 0.12)"
                  : "hsl(220 25% 40% / 0.12)",
              }}
            />
            {/* Legs */}
            <div className="flex gap-0.5">
              <motion.div
                className="w-2 h-5 bg-foreground/10 rounded-b origin-top"
                animate={isWalking ? { rotate: [-15, 15, -15] } : { rotate: 0 }}
                transition={{ duration: 0.6, repeat: isWalking ? Infinity : 0 }}
              />
              <motion.div
                className="w-2 h-5 bg-foreground/10 rounded-b origin-top"
                animate={isWalking ? { rotate: [15, -15, 15] } : { rotate: 0 }}
                transition={{ duration: 0.6, repeat: isWalking ? Infinity : 0 }}
              />
            </div>
            {/* Cup in hand */}
            {hasCup && (
              <motion.div
                className="absolute top-8 -right-3.5 w-3.5 h-4 rounded-sm bg-accent/25 border border-accent/10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Status text while NPC walks */}
      {!showTable && (
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2
            className="font-display text-3xl md:text-4xl text-foreground mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Your coffee is ready!
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={npcPhase}
              className="font-handwritten text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {statusText}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Main café table scene */}
      <AnimatePresence>
        {showTable && (
          <motion.div
            className="relative z-10 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="glass-panel rounded-3xl p-6 md:p-10 shadow-warm relative overflow-hidden">
              {/* Focus light */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(35 50% 50% / 0.07), transparent 70%)",
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Items on table */}
              <div className="flex items-end justify-center gap-6 mb-6 relative">
                {/* Coffee cup + saucer */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full bg-secondary/60 border border-border/20" />
                  <div className="relative w-28 h-28">
                    <motion.div
                      className="absolute inset-[-12px] rounded-full"
                      style={{
                        background: "radial-gradient(circle, hsl(var(--accent) / 0.08), transparent 60%)",
                        filter: "blur(10px)",
                      }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <img
                      src={coffeeCupImg}
                      alt={`Your ${coffee.name}`}
                      className="w-full h-full object-cover rounded-full shadow-glow relative z-10"
                      loading="lazy"
                      width={400}
                      height={400}
                    />
                    {/* Steam */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute bg-coffee-steam/20 rounded-full z-20"
                        style={{
                          width: 1.5 + i * 0.3,
                          height: 12 + i * 3,
                          left: `${20 + i * 18}%`,
                          top: -4,
                        }}
                        animate={{
                          y: [-4, -35, -50],
                          opacity: [0.2, 0.06, 0],
                          scaleX: [1, 1.6, 0.5],
                          rotate: [0, i % 2 === 0 ? 15 : -15, i % 2 === 0 ? -6 : 6],
                        }}
                        transition={{
                          duration: 3 + i * 0.3,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Snack */}
                {selectedSnack && (
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <div className="relative">
                      <div className="w-20 h-3 rounded-full bg-secondary/50 border border-border/20 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                      <div className="w-14 h-14 rounded-full bg-secondary/30 border border-border/20 flex items-center justify-center text-3xl">
                        {selectedSnack.emoji}
                      </div>
                    </div>
                    <span className="font-handwritten text-sm text-muted-foreground mt-2">{selectedSnack.name}</span>
                  </motion.div>
                )}
              </div>

              {/* User's painting framed */}
              {paintingDataUrl && (
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="relative">
                    <div className="p-2 rounded-lg border-2 border-accent/30 bg-secondary/20 shadow-soft">
                      <img src={paintingDataUrl} alt="Your artwork" className="rounded max-h-28 max-w-48" />
                    </div>
                    <p className="font-handwritten text-xs text-muted-foreground mt-1 text-center">your artwork</p>
                  </div>
                </motion.div>
              )}

              {/* Table edge */}
              <div className="w-full h-2 rounded-full bg-foreground/[0.05] mb-4" />

              {/* Text */}
              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Your {coffee.name} is ready
                </h2>
                <p className="font-handwritten text-lg text-muted-foreground mb-3">
                  {quantity > 1 ? `${quantity} cups, crafted with love` : "Crafted with love, just for you"}
                </p>

                <motion.div
                  className="inline-block rounded-2xl px-6 py-3 mb-4"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--accent) / 0.08), hsl(var(--accent) / 0.03))",
                    border: "1px solid hsl(var(--accent) / 0.15)",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <p className="font-handwritten text-xl text-accent">Made for {userName}</p>
                </motion.div>

                <p className="font-handwritten text-sm text-accent/70 mb-3">
                  Made with: {coffee.ingredients.join(" · ")}
                </p>
              </motion.div>
            </div>

            {/* Emotional messages */}
            <div className="h-8 mt-4 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIdx}
                  className="font-handwritten text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                >
                  {emotionalMessages[messageIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-6">
              <motion.button
                onClick={onRestart}
                className="px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-xl border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--accent) / 0.15)" }}
                whileTap={{ scale: 0.97 }}
              >
                Order Another
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom vignette */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)" }}
      />
    </div>
  );
};

export default ServingScene;
