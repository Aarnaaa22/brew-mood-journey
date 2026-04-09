import { motion } from "framer-motion";

interface GamesButtonProps {
  onClick: () => void;
}

const GamesButton = ({ onClick }: GamesButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-20 z-50 glass-panel w-12 h-12 rounded-xl flex items-center justify-center text-xl cursor-pointer border border-border/30"
      whileHover={{ scale: 1.15, boxShadow: "0 0 20px hsl(var(--accent) / 0.2)" }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      title="Games"
    >
      🎮
    </motion.button>
  );
};

export default GamesButton;
