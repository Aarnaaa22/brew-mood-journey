import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cafeExterior from "@/assets/cafe-exterior.jpg";

type Gender = "female" | "male";

interface EntrySceneProps {
  onEnter: (name: string, gender: Gender) => void;
}

const EntryScene = ({ onEnter }: EntrySceneProps) => {
  const [doorOpen, setDoorOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [warmLightVisible, setWarmLightVisible] = useState(false);

  const canEnter = userName.trim() && gender;

  const handleEnter = () => {
    if (!canEnter) return;
    setDoorOpen(true);
    setWarmLightVisible(true);
    setTimeout(() => onEnter(userName.trim(), gender!), 1800);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-coffee-dark">
      {/* Slow camera drift */}
      <motion.div
        className="absolute inset-0"
        animate={doorOpen
          ? { scale: 1.3, opacity: 0, filter: "blur(8px)" }
          : { scale: [1, 1.03, 1], filter: "blur(0px)" }
        }
        transition={doorOpen
          ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
          : { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <img
          src={cafeExterior}
          alt="Cozy café exterior in rain"
          className="w-full h-full object-cover opacity-80"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/90 via-coffee-dark/40 to-transparent" />
      </motion.div>

      {/* Warm light spill when door opens */}
      <AnimatePresence>
        {warmLightVisible && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, hsl(35 70% 50% / 0.35), transparent 60%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Door opening with parallax depth */}
      <AnimatePresence>
        {doorOpen && (
          <motion.div
            className="absolute inset-0 z-20 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-1/2 h-full bg-coffee-dark"
              style={{ boxShadow: "inset -20px 0 60px hsl(35 60% 40% / 0.3)" }}
              initial={{ x: 0 }}
              animate={{ x: "-100%", rotateY: -30 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="w-1/2 h-full bg-coffee-dark"
              style={{ boxShadow: "inset 20px 0 60px hsl(35 60% 40% / 0.3)" }}
              initial={{ x: 0 }}
              animate={{ x: "100%", rotateY: 30 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={doorOpen ? { opacity: 0, y: -50, scale: 0.95 } : { opacity: 1, y: 0 }}
        transition={{ duration: doorOpen ? 0.6 : 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-coffee-cream mb-3 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Aarna's Cozy Café
        </motion.h1>
        <motion.p
          className="font-handwritten text-xl md:text-2xl text-coffee-cream/60 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          a rainy day ritual for your soul 🌧️☕
        </motion.p>

        {/* Name input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <label className="font-handwritten text-lg text-coffee-cream/70 block mb-3">
            Welcome… what should I call you?
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="Your name…"
            className="w-64 px-6 py-3 rounded-full bg-coffee-dark/50 border border-coffee-cream/15 text-coffee-cream font-handwritten text-xl text-center placeholder:text-coffee-cream/25 focus:outline-none focus:border-coffee-caramel/50 focus:ring-2 focus:ring-coffee-caramel/15 backdrop-blur-md transition-all duration-300"
          />
        </motion.div>

        {/* Gender selection */}
        <motion.div
          className="mb-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {([
            { id: "female" as Gender, label: "She / Her", emoji: "👩" },
            { id: "male" as Gender, label: "He / Him", emoji: "👨" },
          ]).map((g) => (
            <motion.button
              key={g.id}
              onClick={() => setGender(g.id)}
              className={`px-5 py-3 rounded-2xl font-handwritten text-lg cursor-pointer backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                gender === g.id
                  ? "bg-coffee-caramel/60 text-coffee-cream border-coffee-cream/30 shadow-glow"
                  : "bg-coffee-dark/40 text-coffee-cream/50 border-coffee-cream/10 hover:border-coffee-cream/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{g.emoji}</span>
              <span>{g.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          onClick={handleEnter}
          className={`group relative px-10 py-4 rounded-full font-handwritten text-2xl backdrop-blur-md border cursor-pointer transition-all duration-500 ${
            canEnter
              ? "bg-coffee-caramel/80 text-coffee-cream border-coffee-cream/15 shadow-glow"
              : "bg-coffee-dark/30 text-coffee-cream/30 border-coffee-cream/10 cursor-not-allowed"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={canEnter ? { scale: 1.05, boxShadow: "0 0 60px hsl(30 60% 50% / 0.4)" } : {}}
          whileTap={canEnter ? { scale: 0.97 } : {}}
        >
          <span className="relative z-10">Enter the Café</span>
          {canEnter && (
            <motion.div
              className="absolute inset-0 rounded-full bg-coffee-caramel/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Floating rain particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 rounded-full bg-rain-blue/25"
          style={{
            left: `${8 + i * 8}%`,
            height: 18 + Math.random() * 24,
            top: "-5%",
          }}
          animate={{
            y: [0, typeof window !== "undefined" ? window.innerHeight + 100 : 900],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear",
          }}
        />
      ))}

      {/* Lens bloom / vignette */}
      <div className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(20 40% 8% / 0.6) 100%)",
        }}
      />
    </div>
  );
};

export default EntryScene;
