import { motion } from "framer-motion";

const steps = ["Menu", "Select", "Beans", "Grind", "Brew", "Recipe", "Enjoy"];

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  // Adjust: sceneIndex starts at 1 for menu, so step 0 = menu = index 0
  const stepIdx = Math.max(0, currentStep - 1);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1.5">
          <motion.div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-handwritten transition-colors duration-500 ${
              i <= stepIdx
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            initial={false}
            animate={{ scale: i === stepIdx ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <div
              className={`w-3 h-0.5 rounded transition-colors duration-500 ${
                i < stepIdx ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
