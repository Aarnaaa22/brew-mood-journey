import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SceneTransitionProps {
  sceneKey: string;
  children: ReactNode;
}

const SceneTransition = ({ sceneKey, children }: SceneTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SceneTransition;
