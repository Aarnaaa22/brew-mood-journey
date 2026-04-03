import { motion } from "framer-motion";

interface PaintingPromptProps {
  onStartPainting: () => void;
  onSkip: () => void;
}

const PaintingPrompt = ({ onStartPainting, onSkip }: PaintingPromptProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center max-w-md mx-auto px-6"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        {/* Glow behind text */}
        <motion.div
          className="absolute inset-0 -z-10 mx-auto w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.15), transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.p
          className="font-handwritten text-2xl text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          while your coffee is being prepared...
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Would you like to paint?
        </motion.h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onStartPainting}
            className="px-10 py-4 rounded-2xl bg-accent text-accent-foreground font-handwritten text-2xl shadow-soft cursor-pointer relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(var(--accent) / 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-2xl"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10">Start Painting</span>
          </motion.button>

          <motion.button
            onClick={onSkip}
            className="px-8 py-3 rounded-2xl bg-secondary/50 text-muted-foreground font-handwritten text-lg border border-border/50 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Skip for now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaintingPrompt;
