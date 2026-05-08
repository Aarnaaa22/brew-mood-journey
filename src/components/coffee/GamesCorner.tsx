import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, ArrowLeft } from "lucide-react";

interface GamesCornerProps {
  onClose: () => void;
}

type GameId = "menu" | "cardflip" | "connect4";

const GamesCorner = ({ onClose }: GamesCornerProps) => {
  const [game, setGame] = useState<GameId>("menu");

  return (
    <motion.div
      className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {game !== "menu" && (
              <button
                onClick={() => setGame("menu")}
                className="glass-panel w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent/10"
                title="Back to games"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-3xl text-primary">
              {game === "menu" ? "Café Games" : game === "cardflip" ? "Card Flip" : "Connect Four"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="glass-panel w-10 h-10 rounded-lg flex items-center justify-center hover:bg-destructive/10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {game === "menu" && <GamesMenu onPick={setGame} />}
        {game === "cardflip" && <CardFlipGame />}
        {game === "connect4" && <ConnectFourGame />}
      </div>
    </motion.div>
  );
};

/* ---------------- MENU ---------------- */

const GamesMenu = ({ onPick }: { onPick: (g: GameId) => void }) => {
  const games: { id: GameId; title: string; desc: string; emoji: string }[] = [
    { id: "cardflip", title: "Card Flip", desc: "Two-player memory match over coffee.", emoji: "🃏" },
    { id: "connect4", title: "Connect Four", desc: "Two-player. Connect four tokens to win.", emoji: "🟤" },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-5 mt-4">
      {games.map((g) => (
        <motion.button
          key={g.id}
          onClick={() => onPick(g.id)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="text-left rounded-2xl border border-border/40 bg-card/80 p-6 shadow-soft hover:shadow-warm transition-shadow"
        >
          <div className="text-4xl mb-3">{g.emoji}</div>
          <div className="font-display text-xl text-primary mb-1">{g.title}</div>
          <div className="text-sm text-muted-foreground mb-3">{g.desc}</div>
          <div className="inline-block text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            Two Player
          </div>
        </motion.button>
      ))}
    </div>
  );
};

/* ---------------- CARD FLIP (2 PLAYER) ---------------- */

const CARD_EMOJIS = ["☕", "🥐", "🍰", "🍪", "🧁", "🥯", "🍩", "🍫"];

const CardFlipGame = () => {
  const buildDeck = () =>
    [...CARD_EMOJIS, ...CARD_EMOJIS]
      .map((v, i) => ({ id: i, value: v, matched: false }))
      .sort(() => Math.random() - 0.5);

  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [turn, setTurn] = useState<0 | 1>(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [busy, setBusy] = useState(false);

  const handleFlip = (idx: number) => {
    if (busy || flipped.includes(idx) || deck[idx].matched) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      if (deck[a].value === deck[b].value) {
        setTimeout(() => {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setScores((s) => {
            const ns: [number, number] = [...s] as [number, number];
            ns[turn] += 1;
            return ns;
          });
          setFlipped([]);
          setBusy(false);
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setTurn((t) => (t === 0 ? 1 : 0));
          setBusy(false);
        }, 900);
      }
    }
  };

  const allMatched = deck.every((c) => c.matched);
  const winner =
    allMatched && scores[0] !== scores[1] ? (scores[0] > scores[1] ? "Player 1 Wins" : "Player 2 Wins") : allMatched ? "It's a Draw" : null;

  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setTurn(0);
    setScores([0, 0]);
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <PlayerBadge label="Player 1" active={turn === 0 && !winner} score={scores[0]} tone="brown" />
          <PlayerBadge label="Player 2" active={turn === 1 && !winner} score={scores[1]} tone="cream" />
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-accent/15 border border-accent/30 px-4 py-3 font-display text-lg text-accent"
          >
            {winner}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
        {deck.map((card, i) => {
          const isShown = flipped.includes(i) || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(i)}
              className="aspect-square rounded-xl relative perspective"
              style={{ perspective: 800 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{ rotateY: isShown ? 180 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center text-2xl shadow-soft"
                  style={{
                    backfaceVisibility: "hidden",
                    background:
                      "linear-gradient(135deg, hsl(var(--coffee-medium)), hsl(var(--coffee-dark)))",
                    color: "hsl(var(--coffee-cream))",
                  }}
                >
                  ☕
                </div>
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center text-3xl shadow-soft"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: card.matched
                      ? "linear-gradient(135deg, hsl(var(--coffee-cream)), hsl(var(--coffee-foam)))"
                      : "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    opacity: card.matched ? 0.85 : 1,
                  }}
                >
                  {card.value}
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- CONNECT FOUR (2 PLAYER) ---------------- */

const ROWS = 6;
const COLS = 7;
type Cell = 0 | 1 | 2;

const emptyBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));

const checkWinner = (b: Cell[][]): { player: Cell; cells: [number, number][] } | null => {
  const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = b[r][c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells: [number, number][] = [[r, c]];
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
          if (b[nr][nc] !== p) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return { player: p, cells };
      }
    }
  }
  return null;
};

const ConnectFourGame = () => {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [hover, setHover] = useState<number | null>(null);

  const win = useMemo(() => checkWinner(board), [board]);
  const isFull = board.every((row) => row.every((c) => c !== 0));
  const status: "playing" | "won" | "draw" = win ? "won" : isFull ? "draw" : "playing";

  const drop = (col: number) => {
    if (status !== "playing") return;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        const next = board.map((row) => [...row]) as Cell[][];
        next[r][col] = turn;
        setBoard(next);
        setTurn(turn === 1 ? 2 : 1);
        return;
      }
    }
  };

  const reset = () => {
    setBoard(emptyBoard());
    setTurn(1);
  };

  const winSet = new Set(win?.cells.map(([r, c]) => `${r}-${c}`));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <PlayerBadge label="Player 1" active={turn === 1 && status === "playing"} tone="brown" />
          <PlayerBadge label="Player 2" active={turn === 2 && status === "playing"} tone="cream" />
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <RotateCcw className="w-4 h-4" /> Restart Game
        </button>
      </div>

      <AnimatePresence>
        {status !== "playing" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-accent/15 border border-accent/30 px-4 py-3 font-display text-lg text-accent"
          >
            {status === "won" ? `Player ${win!.player} Wins` : "It's a Draw"}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="mx-auto rounded-3xl p-3 sm:p-4 shadow-warm"
        style={{
          maxWidth: 560,
          background:
            "linear-gradient(160deg, hsl(25 40% 28%), hsl(20 45% 18%))",
          boxShadow: "inset 0 2px 8px hsl(20 30% 10% / 0.4), 0 12px 32px hsl(25 50% 20% / 0.3)",
        }}
      >
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: COLS }).map((_, c) => {
            const colFull = board[0][c] !== 0;
            return (
              <button
                key={c}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                onClick={() => drop(c)}
                disabled={colFull || status !== "playing"}
                className="flex flex-col gap-2 group disabled:opacity-90 disabled:cursor-not-allowed"
              >
                {board.map((row, r) => {
                  const v = row[c];
                  const isWin = winSet.has(`${r}-${c}`);
                  const isHover = hover === c && !colFull && status === "playing" && v === 0 && r === topEmptyRow(board, c);
                  return (
                    <div
                      key={r}
                      className="aspect-square rounded-full relative overflow-hidden"
                      style={{
                        background: "radial-gradient(circle at 50% 55%, hsl(20 30% 12%), hsl(20 35% 18%))",
                        boxShadow: "inset 0 2px 6px hsl(20 30% 8% / 0.6)",
                      }}
                    >
                      <AnimatePresence>
                        {v !== 0 && (
                          <motion.div
                            key={`${v}-${r}-${c}`}
                            initial={{ y: -((r + 1) * 100) + "%" }}
                            animate={{ y: "0%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6 }}
                            className="absolute inset-1 rounded-full"
                            style={{
                              background:
                                v === 1
                                  ? "radial-gradient(circle at 35% 30%, hsl(28 55% 55%), hsl(25 60% 28%))"
                                  : "radial-gradient(circle at 35% 30%, hsl(38 60% 92%), hsl(33 45% 78%))",
                              boxShadow: isWin
                                ? "0 0 0 2px hsl(var(--accent)), 0 0 18px hsl(var(--accent) / 0.6)"
                                : "inset 0 -3px 6px hsl(20 30% 10% / 0.35), 0 2px 4px hsl(20 30% 8% / 0.3)",
                            }}
                          />
                        )}
                        {isHover && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.35 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-1 rounded-full"
                            style={{
                              background:
                                turn === 1
                                  ? "radial-gradient(circle at 35% 30%, hsl(28 55% 55%), hsl(25 60% 28%))"
                                  : "radial-gradient(circle at 35% 30%, hsl(38 60% 92%), hsl(33 45% 78%))",
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const topEmptyRow = (b: Cell[][], col: number) => {
  for (let r = ROWS - 1; r >= 0; r--) if (b[r][col] === 0) return r;
  return -1;
};

/* ---------------- SHARED ---------------- */

const PlayerBadge = ({
  label,
  active,
  score,
  tone,
}: {
  label: string;
  active: boolean;
  score?: number;
  tone: "brown" | "cream";
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
      active ? "border-accent shadow-glow" : "border-border/40 opacity-70"
    }`}
    style={{ background: "hsl(var(--card))" }}
  >
    <span
      className="w-5 h-5 rounded-full"
      style={{
        background:
          tone === "brown"
            ? "radial-gradient(circle at 35% 30%, hsl(28 55% 55%), hsl(25 60% 28%))"
            : "radial-gradient(circle at 35% 30%, hsl(38 60% 92%), hsl(33 45% 78%))",
        boxShadow: "inset 0 -2px 3px hsl(20 30% 10% / 0.3)",
      }}
    />
    <span className="font-medium text-sm">{label}</span>
    {score !== undefined && <span className="text-xs text-muted-foreground">· {score}</span>}
    {active && <span className="text-xs text-accent ml-1">· Turn</span>}
  </div>
);

export default GamesCorner;
