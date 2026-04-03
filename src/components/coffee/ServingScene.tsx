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

const ServingScene = ({ coffee, quantity, userName, gender, selectedSnack, paintingDataUrl, onRestart }: ServingSceneProps) => {
  const [messageIdx, setMessageIdx] = useState(0);
  const [npcPhase, setNpcPhase] = useState<"walking" | "picking" | "leaving" | "done">("walking");
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // NPC walk cycle: walk in -> pick up coffee -> walk away
    const t1 = setTimeout(() => setNpcPhase("picking"), 2000);
    const t2 = setTimeout(() => setNpcPhase("leaving"), 3500);
    const t3 = setTimeout(() => {
      setNpcPhase("done");
      setShowTable(true);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % emotionalMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // NPC position based on phase
  const npcX = npcPhase === "walking" ? "100%" : npcPhase === "picking" ? "50%" : npcPhase === "leaving" ? "-20%" : "-20%";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative z-10">
      {/* Warm spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(35 60% 50% / 0.06), transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Walking NPC - gender-based */}
      {npcPhase !== "done" && (
        <motion.div
          className="fixed bottom-[15%] z-20"
          animate={{ left: npcX }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Head */}
            <motion.div
              className="w-6 h-6 rounded-full bg-foreground/20"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            {/* Hair */}
            {gender === "female" ? (
              <div className="absolute -top-1 w-7 h-4 rounded-t-full bg-foreground/15" />
            ) : (
              <div className="absolute -top-0.5 w-6 h-2 rounded-t-full bg-foreground/15" />
            )}
            {/* Body */}
            <div
              className="w-8 h-12 rounded-b-lg mt-0.5"
              style={{
                backgroundColor: gender === "female"
                  ? "hsl(330 40% 50% / 0.15)"
                  : "hsl(220 30% 40% / 0.15)",
              }}
            />
            {/* Walking legs */}
            <motion.div className="flex gap-1">
              <motion.div
                className="w-1.5 h-4 bg-foreground/12 rounded-b"
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                className="w-1.5 h-4 bg-foreground/12 rounded-b"
                animate={{ rotate: [15, -15, 15] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </motion.div>
            {/* Holding cup when picking */}
            {npcPhase === "picking" && (
              <motion.div
                className="absolute top-8 -right-3 w-3 h-3 rounded-sm bg-accent/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </div>
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
            {/* Café table setup */}
            <div className="glass-panel rounded-3xl p-6 md:p-10 shadow-warm relative overflow-hidden">
              {/* Focus light on table */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(35 50% 50% / 0.08), transparent 70%)",
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Table surface */}
              <div className="relative">
                {/* Items on table */}
                <div className="flex items-end justify-center gap-6 mb-6">
                  {/* Coffee cup + saucer */}
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    {/* Saucer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full bg-secondary/60 border border-border/20" />
                    {/* Cup */}
                    <div className="relative w-28 h-28">
                      <motion.div
                        className="absolute inset-[-15px] rounded-full"
                        style={{
                          background: "radial-gradient(circle, hsl(var(--accent) / 0.1), transparent 60%)",
                          filter: "blur(10px)",
                        }}
                        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
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
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute bg-coffee-steam/20 rounded-full z-20"
                          style={{
                            width: 1.5 + i * 0.3,
                            height: 14 + i * 3,
                            left: `${18 + i * 16}%`,
                            top: -6,
                          }}
                          animate={{
                            y: [-4, -40, -55],
                            opacity: [0.2, 0.08, 0],
                            scaleX: [1, 1.8, 0.5],
                            rotate: [0, i % 2 === 0 ? 20 : -20, i % 2 === 0 ? -8 : 8],
                          }}
                          transition={{
                            duration: 3 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.35,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>
                    {/* Table shadow ripple */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 rounded-full bg-foreground/[0.06] blur-sm"
                      animate={{ scaleX: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Snack plated */}
                  {selectedSnack && (
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <div className="relative">
                        {/* Plate */}
                        <div className="w-20 h-3 rounded-full bg-secondary/50 border border-border/20 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        <div className="w-14 h-14 rounded-full bg-secondary/30 border border-border/20 flex items-center justify-center text-3xl">
                          {selectedSnack.emoji}
                        </div>
                      </div>
                      <span className="font-handwritten text-sm text-muted-foreground mt-2">{selectedSnack.name}</span>
                    </motion.div>
                  )}
                </div>

                {/* User's painting as framed canvas */}
                {paintingDataUrl && (
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="relative">
                      {/* Frame */}
                      <div className="p-2 rounded-lg border-2 border-accent/30 bg-secondary/20 shadow-soft">
                        <img
                          src={paintingDataUrl}
                          alt="Your artwork"
                          className="rounded max-h-28 max-w-48"
                        />
                      </div>
                      <p className="font-handwritten text-xs text-muted-foreground mt-1 text-center">your artwork</p>
                    </div>
                  </motion.div>
                )}

                {/* Wooden table edge */}
                <div className="w-full h-2 rounded-full bg-foreground/[0.06] mb-4" />
              </div>

              {/* Personalized message */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Your {coffee.name} is ready
                </h2>
                <p className="font-handwritten text-lg text-muted-foreground mb-3">
                  {quantity > 1 ? `${quantity} cups, crafted with love` : "Crafted with love, just for you"}
                </p>

                <motion.div
                  className="inline-block rounded-2xl px-6 py-3 mb-4 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--accent) / 0.08), hsl(var(--accent) / 0.03))",
                    border: "1px solid hsl(var(--accent) / 0.15)",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <p className="font-handwritten text-xl text-accent">
                    Made for {userName}
                  </p>
                </motion.div>

                <p className="font-handwritten text-sm text-accent/70 mb-3">
                  Made with: {coffee.ingredients.join(" · ")}
                </p>
              </motion.div>
            </div>

            {/* Background NPC customers in final scene */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-around opacity-[0.05] pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 1.5 }}
                >
                  <div className="w-4 h-4 rounded-full bg-foreground" />
                  <div className="w-3 h-7 bg-foreground rounded-b mt-0.5" />
                </motion.div>
              ))}
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

      {/* "Hey, your coffee is ready!" announcement before table shows */}
      {!showTable && (
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="font-display text-3xl md:text-4xl text-foreground mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Hey, your coffee is ready!
          </motion.h2>
          <p className="font-handwritten text-xl text-muted-foreground">
            {gender === "female" ? "She's" : "He's"} bringing it to your table...
          </p>
        </motion.div>
      )}

      {/* Bottom vignette */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)" }}
      />
    </div>
  );
};

export default ServingScene;
