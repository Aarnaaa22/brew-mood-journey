import { motion } from "framer-motion";

const ease = "easeInOut";

const CafeCats = () => {
  return (
    <>
      {/* ═══ CAT 1 — Orange Cat (Lazy / Cozy) ═══ */}
      <motion.div
        className="absolute blur-[0.3px]"
        style={{ left: "7%", bottom: "20%", opacity: 0.12 }}
      >
        {/* Soft shadow underneath */}
        <div
          className="absolute -bottom-1 left-1 w-8 h-2 rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.08), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        {/* Floor reflection */}
        <div
          className="absolute -bottom-2 left-1.5 w-6 h-1.5 rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(25 50% 40% / 0.03), transparent 80%)",
            filter: "blur(3px)",
            transform: "scaleY(-0.3)",
          }}
        />

        <div className="relative">
          {/* Ears */}
          <div className="flex gap-[3px] justify-center mb-[-2px]">
            <div
              className="w-[7px] h-[9px] rounded-t-full rotate-[-14deg]"
              style={{ backgroundColor: "hsl(25 55% 45%)" }}
            />
            <div
              className="w-[7px] h-[9px] rounded-t-full rotate-[14deg]"
              style={{ backgroundColor: "hsl(25 55% 45%)" }}
            />
          </div>

          {/* Head with subtle hover turn */}
          <motion.div
            className="w-[18px] h-[15px] rounded-full mx-auto relative"
            style={{ backgroundColor: "hsl(25 55% 45%)" }}
            whileHover={{ rotate: 8, transition: { duration: 0.8, ease } }}
          >
            {/* Eyes — slow blink */}
            <motion.div
              className="absolute top-[5px] left-[4px] flex gap-[4px]"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 6, repeat: Infinity, repeatDelay: 4, ease }}
            >
              <div className="w-[2px] h-[2px] rounded-full bg-foreground/40" />
              <div className="w-[2px] h-[2px] rounded-full bg-foreground/40" />
            </motion.div>
          </motion.div>

          {/* Body (curled sitting) with breathing */}
          <motion.div
            className="w-[26px] h-[18px] rounded-full -mt-[3px] mx-auto"
            style={{ backgroundColor: "hsl(25 50% 42%)" }}
            animate={{ scaleY: [1, 1.02, 1], scaleX: [1, 0.99, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease }}
          />

          {/* Front paws tucked under */}
          <div className="flex gap-[2px] justify-center -mt-[3px]">
            <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(25 45% 40%)" }} />
            <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(25 45% 40%)" }} />
          </div>

          {/* Tail — slow gentle flick */}
          <motion.div
            className="absolute -right-[14px] bottom-[5px] w-[16px] h-[4px] rounded-full origin-left"
            style={{ backgroundColor: "hsl(25 48% 38%)" }}
            animate={{ rotate: [0, 8, -3, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease }}
          />

          {/* Occasional stretch — front legs extend */}
          <motion.div
            className="absolute top-[14px] -left-[6px] flex gap-[1px] origin-right"
          >
            <motion.div
              className="w-[8px] h-[3px] rounded-full"
              style={{ backgroundColor: "hsl(25 50% 42%)" }}
              animate={{ scaleX: [0, 0, 1, 1, 1, 0, 0], opacity: [0, 0, 0.9, 0.9, 0.9, 0, 0] }}
              transition={{ duration: 12, repeat: Infinity, repeatDelay: 18, ease }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ CAT 2 — Tuxedo Cat (Explorer) ═══ */}
      <motion.div
        className="absolute blur-[0.5px]"
        style={{ bottom: "7%", opacity: 0.10 }}
        animate={{
          left: ["12%", "28%", "45%", "55%", "45%", "30%", "12%"],
        }}
        transition={{ duration: 40, repeat: Infinity, ease }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-[3px] left-0 w-[22px] h-[4px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.07), transparent 70%)",
            filter: "blur(2px)",
          }}
        />

        {/* Direction flip synced to walk path */}
        <motion.div
          animate={{ scaleX: [1, 1, 1, -1, -1, -1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease }}
        >
          <div className="relative">
            {/* Ears */}
            <div className="flex gap-[2px] justify-center mb-[-2px]">
              <div className="w-[5px] h-[7px] bg-foreground rounded-t-full rotate-[-10deg]" />
              <div className="w-[5px] h-[7px] bg-foreground rounded-t-full rotate-[10deg]" />
            </div>

            {/* Head with look-around during pauses */}
            <motion.div
              className="w-[16px] h-[13px] rounded-full bg-foreground mx-auto relative"
              animate={{ rotate: [0, 0, 5, -4, 0, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease }}
            >
              {/* White muzzle */}
              <div className="absolute bottom-[1px] left-[4px] w-[8px] h-[5px] rounded-full bg-background/20" />
              {/* Eyes */}
              <motion.div
                className="absolute top-[4px] left-[3px] flex gap-[3px]"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 6, ease }}
              >
                <div className="w-[2px] h-[2px] rounded-full bg-background/30" />
                <div className="w-[2px] h-[2px] rounded-full bg-background/30" />
              </motion.div>
            </motion.div>

            {/* Body */}
            <div className="w-[22px] h-[12px] rounded-full bg-foreground -mt-[3px] mx-auto relative">
              {/* White chest */}
              <div className="absolute top-[1px] left-[6px] w-[10px] h-[7px] rounded-full bg-background/15" />
            </div>

            {/* Walking legs — alternating gait */}
            <div className="flex gap-[3px] -mt-[2px] ml-[3px]">
              <motion.div
                className="w-[3px] h-[8px] bg-foreground rounded-b-sm"
                animate={{ height: ["8px", "6px", "8px"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease }}
              />
              <motion.div
                className="w-[3px] h-[8px] bg-foreground rounded-b-sm"
                animate={{ height: ["6px", "8px", "6px"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease }}
              />
              <motion.div
                className="w-[3px] h-[8px] bg-foreground rounded-b-sm"
                animate={{ height: ["8px", "6px", "8px"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease, delay: 0.1 }}
              />
              <motion.div
                className="w-[3px] h-[8px] bg-foreground rounded-b-sm"
                animate={{ height: ["6px", "8px", "6px"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease, delay: 0.1 }}
              />
            </div>

            {/* Tail — gentle sway */}
            <motion.div
              className="absolute -right-[12px] top-[10px] w-[14px] h-[3px] bg-foreground rounded-full origin-left"
              animate={{ rotate: [-5, 12, -3, 8, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ CAT 3 — Grey Tabby (Window Watcher) ═══ */}
      <motion.div
        className="absolute blur-[0.6px]"
        style={{ left: "86%", bottom: "26%", opacity: 0.11 }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-1 left-0 w-[22px] h-[3px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.06), transparent 70%)",
            filter: "blur(2px)",
          }}
        />

        <div className="relative">
          {/* Ears — subtle twitch */}
          <div className="flex gap-[3px] justify-center mb-[-2px]">
            <motion.div
              className="w-[7px] h-[9px] rounded-t-full rotate-[-10deg]"
              style={{ backgroundColor: "hsl(0 0% 48%)" }}
              animate={{ rotate: [-10, -6, -10, -8, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease }}
            />
            <motion.div
              className="w-[7px] h-[9px] rounded-t-full rotate-[10deg]"
              style={{ backgroundColor: "hsl(0 0% 48%)" }}
              animate={{ rotate: [10, 14, 10, 12, 10] }}
              transition={{ duration: 7, repeat: Infinity, ease }}
            />
          </div>

          {/* Head — looking toward window with slow drift */}
          <motion.div
            className="w-[18px] h-[15px] rounded-full mx-auto relative"
            style={{ backgroundColor: "hsl(0 0% 46%)" }}
            animate={{ rotate: [4, 7, 4, 2, 4] }}
            transition={{ duration: 9, repeat: Infinity, ease }}
          >
            {/* Eyes — slow blinking, watching rain */}
            <motion.div
              className="absolute top-[5px] left-[4px] flex gap-[4px]"
              animate={{ scaleY: [1, 1, 1, 0.1, 1, 1, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease }}
            >
              <div className="w-[2px] h-[2px] rounded-full" style={{ backgroundColor: "hsl(45 60% 50% / 0.5)" }} />
              <div className="w-[2px] h-[2px] rounded-full" style={{ backgroundColor: "hsl(45 60% 50% / 0.5)" }} />
            </motion.div>
          </motion.div>

          {/* Tabby stripes on body */}
          <div className="relative">
            <motion.div
              className="w-[22px] h-[22px] rounded-b-xl rounded-t-lg -mt-[3px] mx-auto relative"
              style={{ backgroundColor: "hsl(0 0% 43%)" }}
              animate={{ scaleY: [1, 1.015, 1], scaleX: [1, 0.99, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease }}
            >
              {/* Tabby stripes */}
              <div className="absolute top-[3px] left-[4px] w-[14px] h-[2px] rounded bg-foreground/[0.06]" />
              <div className="absolute top-[7px] left-[5px] w-[12px] h-[2px] rounded bg-foreground/[0.05]" />
              <div className="absolute top-[11px] left-[4px] w-[13px] h-[2px] rounded bg-foreground/[0.04]" />
            </motion.div>

            {/* Front paws visible */}
            <div className="flex gap-[2px] justify-center -mt-[2px]">
              <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(0 0% 40%)" }} />
              <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(0 0% 40%)" }} />
            </div>
          </div>

          {/* Tail wrapped around body */}
          <motion.div
            className="absolute -left-[8px] bottom-[4px] w-[12px] h-[4px] rounded-full origin-right"
            style={{ backgroundColor: "hsl(0 0% 40%)" }}
            animate={{ rotate: [0, -6, 3, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease }}
          />

          {/* Rain/lightning reaction — subtle head flinch */}
          <motion.div
            className="absolute inset-0"
            animate={{ x: [0, 0, 0, -1, 0, 0, 0, 0, 0, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default CafeCats;
