import { motion } from "framer-motion";
import CafeCats from "./CafeCats";

const ease = "easeInOut";

const CafeEnvironment = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Warm back wall */}
      <div
        className="absolute top-0 left-0 right-0 h-[65%] opacity-[0.04]"
        style={{
          background: "linear-gradient(to bottom, hsl(30 20% 45%), hsl(25 15% 30%))",
        }}
      />

      {/* Wooden floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35%] opacity-[0.06]"
        style={{
          background: "repeating-linear-gradient(90deg, hsl(25 40% 30%) 0px, hsl(25 40% 30%) 60px, hsl(25 35% 25%) 60px, hsl(25 35% 25%) 120px)",
        }}
      />

      {/* === Wall Posters (warm minimal art) === */}
      {/* Poster 1 — coffee quote */}
      <div className="absolute top-[10%] left-[8%] opacity-[0.08] rotate-[-1deg]">
        <div className="w-14 h-18 rounded-sm bg-foreground/70 p-1.5">
          <div className="w-full h-full border border-foreground/15 rounded-sm flex flex-col items-center justify-center gap-1">
            <div className="w-5 h-0.5 bg-background/30 rounded" />
            <div className="w-7 h-0.5 bg-background/25 rounded" />
            <div className="w-4 h-0.5 bg-background/20 rounded" />
          </div>
        </div>
      </div>

      {/* Poster 2 — minimal art */}
      <div className="absolute top-[8%] left-[28%] opacity-[0.06] rotate-[1deg]">
        <div className="w-12 h-16 rounded-sm bg-foreground/60 p-1">
          <div className="w-full h-full rounded-sm overflow-hidden">
            <div className="w-full h-1/2 bg-accent/15" />
            <div className="w-full h-1/2 bg-foreground/20" />
          </div>
        </div>
      </div>

      {/* Poster 3 — circle art */}
      <div className="absolute top-[12%] right-[15%] opacity-[0.06] rotate-[2deg]">
        <div className="w-11 h-14 rounded-sm bg-foreground/50 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border border-background/25" />
        </div>
      </div>

      {/* === Warm pendant lights === */}
      {[20, 50, 80].map((left, i) => (
        <div key={`light-${i}`} className="absolute" style={{ left: `${left}%`, top: 0 }}>
          <div className="w-0.5 h-8 bg-foreground/[0.04] mx-auto" />
          <motion.div
            className="w-3 h-2 rounded-b-full bg-accent/[0.07] mx-auto"
            animate={{ opacity: [0.05, 0.09, 0.05] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease }}
          />
          <motion.div
            className="w-20 h-20 rounded-full -mt-3 mx-auto"
            style={{
              background: "radial-gradient(circle, hsl(35 60% 50% / 0.04), transparent 70%)",
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease }}
          />
        </div>
      ))}

      {/* === Serving Counter (center) === */}
      <div className="absolute bottom-[22%] left-[35%] right-[35%]">
        {/* Counter surface */}
        <div className="w-full h-4 rounded-lg bg-foreground/[0.08] shadow-sm" />
        {/* Counter front */}
        <div className="w-full h-10 bg-foreground/[0.05] rounded-b-lg" />
        {/* Items on counter */}
        <div className="absolute top-[-3px] left-[20%] w-3 h-2.5 rounded-t-sm bg-foreground/[0.06]" />
        <div className="absolute top-[-2px] right-[25%] w-2.5 h-2 rounded-t-sm bg-foreground/[0.05]" />
        {/* Cash register hint */}
        <div className="absolute top-[-4px] right-[10%] w-4 h-3 rounded-sm bg-foreground/[0.04]" />
      </div>

      {/* === Table 1 — left side === */}
      <div className="absolute bottom-[12%] left-[8%]">
        {/* Table surface */}
        <div className="w-20 h-3 rounded-lg bg-foreground/[0.07]" />
        {/* Table legs */}
        <div className="flex justify-between px-2">
          <div className="w-1 h-6 bg-foreground/[0.05]" />
          <div className="w-1 h-6 bg-foreground/[0.05]" />
        </div>
        {/* Cup on table */}
        <div className="absolute top-[-2px] left-7 w-3 h-2 rounded-t-sm bg-foreground/[0.06]" />

        {/* Customer 1 — seated left of table */}
        <motion.div
          className="absolute -left-5 top-[-28px] opacity-[0.07] blur-[1px]"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-5 h-5 rounded-full bg-foreground"
              animate={{ rotate: [0, 3, -2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease }}
            />
            <div className="w-5 h-8 bg-foreground rounded-b-lg mt-0.5" />
          </div>
        </motion.div>

        {/* Customer 2 — seated right of table */}
        <motion.div
          className="absolute -right-5 top-[-26px] opacity-[0.06] blur-[1px]"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1, ease }}
        >
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-foreground" />
            <div className="w-5 h-7 bg-foreground rounded-b-lg mt-0.5" />
            {/* Arm holding cup */}
            <motion.div
              className="absolute top-5 right-[-4px] w-3 h-1.5 bg-foreground rounded-full origin-left"
              animate={{ rotate: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2, ease }}
            />
          </div>
        </motion.div>
      </div>

      {/* === Table 2 — right side === */}
      <div className="absolute bottom-[14%] right-[8%]">
        <div className="w-22 h-3 rounded-lg bg-foreground/[0.06]" />
        <div className="flex justify-between px-3">
          <div className="w-1 h-6 bg-foreground/[0.04]" />
          <div className="w-1 h-6 bg-foreground/[0.04]" />
        </div>
        <div className="absolute top-[-2px] right-5 w-2.5 h-2 rounded-t-sm bg-foreground/[0.05]" />
        <div className="absolute top-[-2px] left-4 w-4 h-1.5 rounded-sm bg-foreground/[0.04]" />

        {/* Customer 3 — solo, chilling */}
        <motion.div
          className="absolute -right-4 top-[-26px] opacity-[0.06] blur-[1.5px]"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 0.5, ease }}
        >
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-foreground" />
            <div className="w-5 h-8 bg-foreground rounded-b-lg mt-0.5" />
            <motion.div
              className="absolute top-4 right-[-5px] w-2 h-2.5 rounded-sm bg-foreground/60"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1.5, ease }}
            />
          </div>
        </motion.div>
      </div>

      {/* === Table 3 — center-left (smaller, 1 customer) === */}
      <div className="absolute bottom-[10%] left-[55%]">
        <div className="w-16 h-2.5 rounded-lg bg-foreground/[0.05]" />
        <div className="flex justify-between px-1.5">
          <div className="w-1 h-5 bg-foreground/[0.04]" />
          <div className="w-1 h-5 bg-foreground/[0.04]" />
        </div>

        {/* Customer 4 — reading */}
        <motion.div
          className="absolute -left-4 top-[-24px] opacity-[0.05] blur-[1.5px]"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-4 h-4 rounded-full bg-foreground"
              animate={{ rotate: [0, -3, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease }}
            />
            <div className="w-4 h-7 bg-foreground rounded-b-lg mt-0.5" />
          </div>
        </motion.div>
      </div>

      {/* Grey tabby cat on windowsill */}
      <CafeCats />

      {/* Shelf behind counter */}
      <div className="absolute bottom-[32%] left-[36%] right-[36%] opacity-[0.03]">
        <div className="w-full h-1 bg-foreground rounded-sm" />
        <div className="flex gap-2 justify-center -mt-3">
          <div className="w-1.5 h-3 bg-foreground/[0.05] rounded-t-full" />
          <div className="w-1.5 h-4 bg-foreground/[0.04] rounded-t-full" />
          <div className="w-1.5 h-3.5 bg-foreground/[0.05] rounded-t-full" />
          <div className="w-1.5 h-3 bg-foreground/[0.04] rounded-t-full" />
        </div>
      </div>
    </div>
  );
};

export default CafeEnvironment;
