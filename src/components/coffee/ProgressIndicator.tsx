import { motion } from "framer-motion";

const steps = ["Enter", "Menu", "Select", "Brew", "Recipe", "Enjoy"];

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-handwritten transition-colors duration-500 ${
              i <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            initial={false}
            animate={{ scale: i === currentStep ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <div
              className={`w-4 h-0.5 rounded transition-colors duration-500 ${
                i < currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
