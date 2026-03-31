import { motion } from "framer-motion";

interface AmbientControlsProps {
  rainOn: boolean;
  onToggleRain: () => void;
  ambiance: "morning" | "evening" | "night";
  onCycleAmbiance: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

const ambianceIcons = { morning: "🌅", evening: "🌇", night: "🌙" };
const ambianceLabels = { morning: "Morning", evening: "Evening", night: "Night" };

const AmbientControls = ({
  rainOn, onToggleRain,
  ambiance, onCycleAmbiance,
  soundOn, onToggleSound,
}: AmbientControlsProps) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      {/* Rain toggle */}
      <motion.button
        onClick={onToggleRain}
        className="glass-panel w-12 h-12 rounded-2xl flex items-center justify-center text-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={rainOn ? "Turn off rain" : "Turn on rain"}
      >
        {rainOn ? "🌧️" : "☀️"}
      </motion.button>

      {/* Ambiance cycle */}
      <motion.button
        onClick={onCycleAmbiance}
        className="glass-panel w-12 h-12 rounded-2xl flex items-center justify-center text-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={ambianceLabels[ambiance]}
      >
        {ambianceIcons[ambiance]}
      </motion.button>

      {/* Sound indicator */}
      <motion.button
        onClick={onToggleSound}
        className="glass-panel w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundOn ? "Sound on" : "Sound off"}
      >
        {soundOn ? (
          <div className="flex items-end gap-0.5 h-5">
            {[0.4, 0.7, 1, 0.6].map((h, i) => (
              <motion.div
                key={i}
                className="w-1 bg-accent rounded-full"
                animate={{ height: [`${h * 12}px`, `${h * 20}px`, `${h * 12}px`] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">🔇</span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default AmbientControls;
