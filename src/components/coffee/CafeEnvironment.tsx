import { motion } from "framer-motion";

const CafeEnvironment = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Seated NPCs at tables (blurred background) */}
      {[
        { left: "8%", bottom: "18%", delay: 0 },
        { left: "22%", bottom: "15%", delay: 1.5 },
        { left: "72%", bottom: "20%", delay: 0.8 },
        { left: "88%", bottom: "16%", delay: 2 },
      ].map((npc, i) => (
        <motion.div
          key={`npc-${i}`}
          className="absolute opacity-[0.06] blur-[2px]"
          style={{ left: npc.left, bottom: npc.bottom }}
          animate={{
            y: [0, -3, 0, -2, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: npc.delay }}
        >
          <div className="flex flex-col items-center">
            {/* Head */}
            <div className="w-5 h-5 rounded-full bg-foreground" />
            {/* Body */}
            <div className="w-4 h-8 bg-foreground rounded-b-lg mt-0.5" />
            {/* Table */}
            <div className="w-12 h-1 bg-foreground/60 mt-1 rounded" />
            {/* Cup on table */}
            <div className="w-2 h-2 rounded-sm bg-foreground/40 -mt-2 ml-3" />
          </div>
        </motion.div>
      ))}

      {/* Cats in café */}
      {[
        { left: "15%", bottom: "8%", direction: 1 },
        { left: "65%", bottom: "10%", direction: -1 },
      ].map((cat, i) => (
        <motion.div
          key={`cat-${i}`}
          className="absolute opacity-[0.08]"
          style={{ left: cat.left, bottom: cat.bottom }}
          animate={{
            x: [0, cat.direction * 40, cat.direction * 80, cat.direction * 60, cat.direction * 30, 0],
          }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-end gap-0">
            {/* Cat body */}
            <div className="relative">
              {/* Ears */}
              <div className="flex gap-1 justify-center mb-[-2px]">
                <div className="w-1.5 h-2 bg-foreground rounded-t-full rotate-[-10deg]" />
                <div className="w-1.5 h-2 bg-foreground rounded-t-full rotate-[10deg]" />
              </div>
              {/* Head */}
              <div className="w-4 h-3 rounded-full bg-foreground" />
              {/* Body */}
              <div className="w-6 h-3 rounded-full bg-foreground -mt-0.5 ml-1" />
              {/* Tail */}
              <motion.div
                className="absolute -right-3 top-2 w-4 h-1 bg-foreground rounded-full origin-left"
                animate={{ rotate: [0, 20, -10, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Subtle counter area */}
      <div
        className="absolute bottom-0 left-[30%] right-[30%] h-[6%] opacity-[0.04] rounded-t-lg"
        style={{
          background: "linear-gradient(to top, hsl(var(--foreground)), transparent)",
        }}
      />
    </div>
  );
};

export default CafeEnvironment;
