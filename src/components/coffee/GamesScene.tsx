import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryGame from "./MemoryGame";

type GameMode = "menu" | "mode-select" | "playing";
type PlayerMode = "two-player" | "vs-computer";

interface GamesSceneProps {
  onClose: () => void;
}

const GamesScene = ({ onClose }: GamesSceneProps) => {
  const [stage, setStage] = useState<GameMode>("menu");
  const [playerMode, setPlayerMode] = useState<PlayerMode>("two-player");
  const [gridSize, setGridSize] = useState<"small" | "large">("small");

  const handleSelectMode = (mode: PlayerMode) => {
    setPlayerMode(mode);
    setStage("mode-select");
  };

  const handleStartGame = (size: "small" | "large") => {
    setGridSize(size);
    setStage("playing");
  };

  const handleBackToMenu = () => {
    setStage("menu");
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {stage === "menu" && (
          <motion.div
            key="menu"
            className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="font-serif text-3xl text-foreground">☕ Café Games</h2>
            <p className="text-muted-foreground text-sm">A little fun while you wait...</p>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectMode("two-player")}
                className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                👥 Two Player
              </button>
              <button
                onClick={() => handleSelectMode("vs-computer")}
                className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                🤖 Play vs Computer
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back to café
            </button>
          </motion.div>
        )}

        {stage === "mode-select" && (
          <motion.div
            key="mode-select"
            className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="font-serif text-2xl text-foreground">🃏 Card Flip Memory</h2>
            <p className="text-muted-foreground text-sm">Match the café items!</p>

            <div className="space-y-3">
              <button
                onClick={() => handleStartGame("small")}
                className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Small Grid — 10 Cards
              </button>
              <button
                onClick={() => handleStartGame("large")}
                className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Large Grid — 20 Cards
              </button>
            </div>

            <button
              onClick={handleBackToMenu}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </motion.div>
        )}

        {stage === "playing" && (
          <MemoryGame
            key="playing"
            gridSize={gridSize}
            playerMode={playerMode}
            onBack={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GamesScene;
