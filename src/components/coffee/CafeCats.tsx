import { motion } from "framer-motion";

const ease = "easeInOut";

/** Single grey tabby cat sitting on the windowsill watching rain */
const CafeCats = () => {
  return (
    <motion.div
      className="absolute blur-[0.4px]"
      style={{ right: "6%", bottom: "38%", opacity: 0.12 }}
    >
      {/* Soft shadow */}
      <div
        className="absolute -bottom-1 left-0 w-[24px] h-[4px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.07), transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      <div className="relative">
        {/* Ears with subtle twitch */}
        <div className="flex gap-[3px] justify-center mb-[-2px]">
          <motion.div
            className="w-[7px] h-[9px] rounded-t-full rotate-[-10deg]"
            style={{ backgroundColor: "hsl(0 0% 48%)" }}
            animate={{ rotate: [-10, -6, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease }}
          />
          <motion.div
            className="w-[7px] h-[9px] rounded-t-full rotate-[10deg]"
            style={{ backgroundColor: "hsl(0 0% 48%)" }}
            animate={{ rotate: [10, 14, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease }}
          />
        </div>

        {/* Head — looking toward window */}
        <motion.div
          className="w-[18px] h-[15px] rounded-full mx-auto relative"
          style={{ backgroundColor: "hsl(0 0% 46%)" }}
          animate={{ rotate: [3, 6, 3, 1, 3] }}
          transition={{ duration: 9, repeat: Infinity, ease }}
        >
          {/* Eyes — slow blinking */}
          <motion.div
            className="absolute top-[5px] left-[4px] flex gap-[4px]"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 4, ease }}
          >
            <div className="w-[2px] h-[2px] rounded-full" style={{ backgroundColor: "hsl(45 60% 50% / 0.5)" }} />
            <div className="w-[2px] h-[2px] rounded-full" style={{ backgroundColor: "hsl(45 60% 50% / 0.5)" }} />
          </motion.div>
        </motion.div>

        {/* Body — sitting upright with breathing */}
        <motion.div
          className="w-[22px] h-[20px] rounded-b-xl rounded-t-lg -mt-[3px] mx-auto relative"
          style={{ backgroundColor: "hsl(0 0% 43%)" }}
          animate={{ scaleY: [1, 1.015, 1], scaleX: [1, 0.99, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease }}
        >
          {/* Tabby stripes */}
          <div className="absolute top-[3px] left-[4px] w-[14px] h-[1.5px] rounded bg-foreground/[0.05]" />
          <div className="absolute top-[7px] left-[5px] w-[12px] h-[1.5px] rounded bg-foreground/[0.04]" />
          <div className="absolute top-[11px] left-[4px] w-[13px] h-[1.5px] rounded bg-foreground/[0.04]" />
        </motion.div>

        {/* Front paws */}
        <div className="flex gap-[2px] justify-center -mt-[2px]">
          <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(0 0% 40%)" }} />
          <div className="w-[5px] h-[3px] rounded-b-full" style={{ backgroundColor: "hsl(0 0% 40%)" }} />
        </div>

        {/* Tail wrapped around body with gentle sway */}
        <motion.div
          className="absolute -left-[10px] bottom-[4px] w-[14px] h-[4px] rounded-full origin-right"
          style={{ backgroundColor: "hsl(0 0% 40%)" }}
          animate={{ rotate: [0, -5, 2, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease }}
        />
      </div>
    </motion.div>
  );
};

export default CafeCats;
