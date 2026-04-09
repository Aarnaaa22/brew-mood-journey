import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

type PlayerMode = "two-player" | "vs-computer";

interface MemoryGameProps {
  gridSize: "small" | "large";
  playerMode: PlayerMode;
  onBack: () => void;
}

const EMOJIS = ["☕", "🧁", "🥐", "🍪", "🫘", "🥛", "🍰", "🍩", "🧇", "🫖"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const MemoryGame = ({ gridSize, playerMode, onBack }: MemoryGameProps) => {
  const pairCount = gridSize === "small" ? 5 : 10;
  const emojis = EMOJIS.slice(0, pairCount);

  const [cards, setCards] = useState<Card[]>(() => {
    const pairs = emojis.flatMap((emoji, i) => [
      { id: i * 2, emoji, flipped: false, matched: false },
      { id: i * 2 + 1, emoji, flipped: false, matched: false },
    ]);
    return shuffle(pairs);
  });

  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const computerTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      setGameOver(true);
    }
  }, [allMatched, cards.length]);

  // Computer turn
  useEffect(() => {
    if (playerMode === "vs-computer" && currentPlayer === 2 && !gameOver && !isLocked) {
      setIsLocked(true);
      const unmatched = cards.filter((c) => !c.matched && !c.flipped);
      if (unmatched.length < 2) return;

      const pick = shuffle(unmatched);
      computerTimerRef.current = setTimeout(() => {
        handleFlip(pick[0].id);
        setTimeout(() => {
          handleFlip(pick[1].id);
        }, 600);
      }, 800);
    }
    return () => clearTimeout(computerTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, gameOver, isLocked]);

  const handleFlip = useCallback(
    (id: number) => {
      setCards((prev) => {
        const card = prev.find((c) => c.id === id);
        if (!card || card.flipped || card.matched) return prev;
        return prev.map((c) => (c.id === id ? { ...c, flipped: true } : c));
      });
      setFlippedIds((prev) => {
        const next = [...prev, id];
        if (next.length === 2) {
          // Check match after brief delay
          setTimeout(() => checkMatch(next), 700);
        }
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const checkMatch = (ids: number[]) => {
    setCards((prev) => {
      const [a, b] = ids.map((id) => prev.find((c) => c.id === id)!);
      if (a.emoji === b.emoji) {
        setScores((s) => ({ ...s, [currentPlayer]: s[currentPlayer] + 1 }));
        // Same player goes again
        setFlippedIds([]);
        setIsLocked(false);
        return prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c));
      } else {
        // Flip back, switch player
        setFlippedIds([]);
        setCurrentPlayer((p) => (p === 1 ? 2 : 1));
        setIsLocked(false);
        return prev.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
        );
      }
    });
  };

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    if (flippedIds.length >= 2) return;
    if (playerMode === "vs-computer" && currentPlayer === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.length === 1) setIsLocked(true);
    handleFlip(id);
    if (flippedIds.length === 1) {
      // Will be unlocked by checkMatch
    }
  };

  const cols = gridSize === "small" ? 5 : 5;
  const p1Label = playerMode === "vs-computer" ? "You" : "Player 1";
  const p2Label = playerMode === "vs-computer" ? "Computer" : "Player 2";

  const getWinnerText = () => {
    if (scores[1] > scores[2]) return `${p1Label} Win${playerMode === "two-player" ? "s" : ""}! 🎉`;
    if (scores[2] > scores[1]) return `${p2Label} Win${playerMode === "two-player" ? "s" : ""}! 🎉`;
    return "It's a Tie! 🤝";
  };

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6 max-w-lg w-full text-center space-y-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
          ← Back
        </button>
        <h3 className="font-serif text-lg text-foreground">🃏 Memory Game</h3>
        <div className="w-12" />
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-6 text-sm">
        <span
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            currentPlayer === 1
              ? "bg-[hsl(25,45%,30%)] text-[hsl(35,40%,95%)]"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {p1Label}: {scores[1]}
        </span>
        <span
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            currentPlayer === 2
              ? "bg-[hsl(35,50%,88%)] text-[hsl(25,40%,20%)]"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {p2Label}: {scores[2]}
        </span>
      </div>

      {!gameOver && (
        <p className="text-xs text-muted-foreground">
          {currentPlayer === 1 ? p1Label : p2Label}'s Turn
        </p>
      )}

      {/* Grid */}
      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          maxWidth: gridSize === "small" ? 300 : 340,
        }}
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl border text-2xl flex items-center justify-center cursor-pointer select-none transition-colors ${
              card.matched
                ? "bg-accent/20 border-accent/30"
                : card.flipped
                ? "bg-card border-border"
                : "bg-primary/80 border-primary/40 hover:bg-primary/70"
            }`}
            style={{ perspective: 600 }}
            whileTap={!card.flipped && !card.matched ? { scale: 0.92 } : {}}
          >
            <motion.span
              initial={false}
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180, opacity: card.flipped || card.matched ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              className="block"
            >
              {card.flipped || card.matched ? card.emoji : ""}
            </motion.span>
            {!card.flipped && !card.matched && (
              <span className="text-primary-foreground/60 text-lg">☕</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          className="space-y-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-serif text-xl text-foreground">{getWinnerText()}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setCards(shuffle(cards.map((c) => ({ ...c, flipped: false, matched: false }))));
                setScores({ 1: 0, 2: 0 });
                setCurrentPlayer(1);
                setGameOver(false);
                setFlippedIds([]);
                setIsLocked(false);
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemoryGame;
