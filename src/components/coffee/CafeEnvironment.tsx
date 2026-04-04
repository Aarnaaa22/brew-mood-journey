import { motion } from "framer-motion";
import CafeCats from "./CafeCats";

const CafeEnvironment = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Wooden floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30%] opacity-[0.06]"
        style={{
          background: "repeating-linear-gradient(90deg, hsl(25 40% 30%) 0px, hsl(25 40% 30%) 60px, hsl(25 35% 25%) 60px, hsl(25 35% 25%) 120px)",
        }}
      />

      {/* Back wall with warm tone */}
      <div
        className="absolute top-0 left-0 right-0 h-[70%] opacity-[0.03]"
        style={{
          background: "linear-gradient(to bottom, hsl(30 20% 40%), hsl(25 15% 30%))",
        }}
      />

      {/* === Wall Posters === */}
      {/* Coffee quote poster 1 */}
      <div className="absolute top-[12%] left-[8%] opacity-[0.07] rotate-[-2deg]">
        <div className="w-16 h-20 rounded-sm bg-foreground/80 flex items-center justify-center p-1.5">
          <div className="w-full h-full border border-foreground/20 rounded-sm flex flex-col items-center justify-center gap-1">
            <div className="w-6 h-0.5 bg-background/40 rounded" />
            <div className="w-8 h-0.5 bg-background/30 rounded" />
            <div className="w-5 h-0.5 bg-background/20 rounded" />
          </div>
        </div>
      </div>

      {/* Minimal art poster 2 */}
      <div className="absolute top-[10%] left-[30%] opacity-[0.06] rotate-[1deg]">
        <div className="w-14 h-18 rounded-sm bg-foreground/70 p-1">
          <div className="w-full h-full rounded-sm overflow-hidden">
            <div className="w-full h-1/2 bg-accent/20" />
            <div className="w-full h-1/2 bg-foreground/30" />
          </div>
        </div>
      </div>

      {/* Coffee quote poster 3 */}
      <div className="absolute top-[14%] right-[12%] opacity-[0.06] rotate-[2deg]">
        <div className="w-12 h-16 rounded-sm bg-foreground/60 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border border-background/30" />
        </div>
      </div>

      {/* === Warm pendant lights === */}
      {[15, 40, 65, 85].map((left, i) => (
        <div key={`light-${i}`} className="absolute" style={{ left: `${left}%`, top: 0 }}>
          <div className="w-0.5 h-8 bg-foreground/[0.04] mx-auto" />
          <motion.div
            className="w-3 h-2 rounded-b-full bg-accent/[0.08] mx-auto"
            animate={{ opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
          />
          <motion.div
            className="w-16 h-16 rounded-full -mt-2 mx-auto"
            style={{
              background: "radial-gradient(circle, hsl(35 60% 50% / 0.04), transparent 70%)",
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          />
        </div>
      ))}

      {/* === Tables === */}
      {/* Table 1 - left */}
      <div className="absolute bottom-[14%] left-[10%]">
        {/* Table surface */}
        <div className="w-20 h-3 rounded-lg bg-foreground/[0.07] shadow-sm" />
        {/* Table legs */}
        <div className="flex justify-between px-2">
          <div className="w-1 h-6 bg-foreground/[0.05]" />
          <div className="w-1 h-6 bg-foreground/[0.05]" />
        </div>
        {/* Chair left */}
        <div className="absolute -left-4 top-[-4px]">
          <div className="w-6 h-8 rounded-t-lg bg-foreground/[0.04] border-t border-l border-r border-foreground/[0.03]" />
        </div>
        {/* Chair right */}
        <div className="absolute -right-4 top-[-4px]">
          <div className="w-6 h-8 rounded-t-lg bg-foreground/[0.04] border-t border-l border-r border-foreground/[0.03]" />
        </div>
        {/* Cup on table */}
        <div className="absolute top-[-2px] left-6 w-3 h-2 rounded-t-sm bg-foreground/[0.06]" />
      </div>

      {/* Table 2 - center-right */}
      <div className="absolute bottom-[16%] right-[22%]">
        <div className="w-24 h-3 rounded-lg bg-foreground/[0.06] shadow-sm" />
        <div className="flex justify-between px-3">
          <div className="w-1 h-6 bg-foreground/[0.04]" />
          <div className="w-1 h-6 bg-foreground/[0.04]" />
        </div>
        <div className="absolute -left-4 top-[-4px]">
          <div className="w-6 h-8 rounded-t-lg bg-foreground/[0.035]" />
        </div>
        <div className="absolute -right-4 top-[-4px]">
          <div className="w-6 h-8 rounded-t-lg bg-foreground/[0.035]" />
        </div>
        <div className="absolute top-[-3px] right-4 w-2.5 h-2 rounded-t-sm bg-foreground/[0.05]" />
        <div className="absolute top-[-2px] left-4 w-4 h-1.5 rounded-sm bg-foreground/[0.04]" />
      </div>

      {/* Table 3 - far right */}
      <div className="absolute bottom-[12%] right-[5%]">
        <div className="w-16 h-2.5 rounded-lg bg-foreground/[0.05]" />
        <div className="flex justify-between px-1.5">
          <div className="w-1 h-5 bg-foreground/[0.04]" />
          <div className="w-1 h-5 bg-foreground/[0.04]" />
        </div>
        <div className="absolute -right-3 top-[-3px]">
          <div className="w-5 h-7 rounded-t-lg bg-foreground/[0.03]" />
        </div>
      </div>

      {/* === Seated NPC Customers (blurred, depth of field) === */}
      {[
        { left: "11%", bottom: "20%", delay: 0, scale: 1 },
        { left: "68%", bottom: "22%", delay: 1.2, scale: 0.95 },
        { left: "82%", bottom: "18%", delay: 0.6, scale: 0.85 },
      ].map((npc, i) => (
        <motion.div
          key={`npc-${i}`}
          className="absolute opacity-[0.06] blur-[1.5px]"
          style={{ left: npc.left, bottom: npc.bottom, transform: `scale(${npc.scale})` }}
          animate={{
            y: [0, -2, 0, -1, 0],
          }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, delay: npc.delay }}
        >
          <div className="flex flex-col items-center">
            {/* Head with subtle turn */}
            <motion.div
              className="w-5 h-5 rounded-full bg-foreground"
              animate={{ rotate: [0, 3, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: npc.delay + 1 }}
            />
            {/* Body/torso */}
            <div className="w-5 h-9 bg-foreground rounded-b-lg mt-0.5" />
            {/* Arm holding cup */}
            <motion.div
              className="absolute top-5 right-[-4px] w-3 h-1.5 bg-foreground rounded-full origin-left"
              animate={{ rotate: [0, -8, 0, -5, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: npc.delay + 2 }}
            />
            {/* Cup in hand */}
            <motion.div
              className="absolute top-4 right-[-8px] w-2 h-2.5 rounded-sm bg-foreground/60"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: npc.delay + 2 }}
            />
          </div>
        </motion.div>
      ))}

      {/* === 3 Café Cats === */}
      <CafeCats />

      {/* Subtle counter area */}
      <div
        className="absolute bottom-0 left-[30%] right-[30%] h-[7%] opacity-[0.05] rounded-t-lg"
        style={{
          background: "linear-gradient(to top, hsl(var(--foreground)), transparent)",
        }}
      />

      {/* Shelf behind counter */}
      <div className="absolute bottom-[7%] left-[32%] right-[32%] h-[2%] opacity-[0.03]">
        <div className="w-full h-full bg-foreground rounded-sm" />
        {/* Bottles on shelf */}
        <div className="flex gap-2 justify-center -mt-3">
          <div className="w-1.5 h-3 bg-foreground/[0.04] rounded-t-full" />
          <div className="w-1.5 h-4 bg-foreground/[0.03] rounded-t-full" />
          <div className="w-1.5 h-3.5 bg-foreground/[0.04] rounded-t-full" />
        </div>
      </div>
    </div>
  );
};

export default CafeEnvironment;
