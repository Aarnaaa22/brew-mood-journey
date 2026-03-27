import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EntryScene from "@/components/coffee/EntryScene";
import MenuScene from "@/components/coffee/MenuScene";
import SelectionScene from "@/components/coffee/SelectionScene";
import MakingScene from "@/components/coffee/MakingScene";
import RecipeScene from "@/components/coffee/RecipeScene";
import FinalScene from "@/components/coffee/FinalScene";
import ProgressIndicator from "@/components/coffee/ProgressIndicator";
import SceneTransition from "@/components/coffee/SceneTransition";
import type { CoffeeType } from "@/components/coffee/MenuScene";

type Scene = "entry" | "menu" | "selection" | "making" | "recipe" | "final";

const sceneIndex: Record<Scene, number> = {
  entry: 0,
  menu: 1,
  selection: 2,
  making: 3,
  recipe: 4,
  final: 5,
};

const Index = () => {
  const [scene, setScene] = useState<Scene>("entry");
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleCoffeeSelect = (coffee: CoffeeType) => {
    setSelectedCoffee(coffee);
    setScene("selection");
  };

  const handleConfirmSelection = (qty: number) => {
    setQuantity(qty);
    setScene("making");
  };

  const handleRestart = () => {
    setSelectedCoffee(null);
    setQuantity(1);
    setScene("entry");
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {scene !== "entry" && <ProgressIndicator currentStep={sceneIndex[scene]} />}

      <AnimatePresence mode="wait">
        <SceneTransition sceneKey={scene}>
          {scene === "entry" && <EntryScene onEnter={() => setScene("menu")} />}
          {scene === "menu" && <MenuScene onSelect={handleCoffeeSelect} />}
          {scene === "selection" && selectedCoffee && (
            <SelectionScene
              coffee={selectedCoffee}
              onConfirm={handleConfirmSelection}
              onBack={() => setScene("menu")}
            />
          )}
          {scene === "making" && selectedCoffee && (
            <MakingScene coffee={selectedCoffee} onComplete={() => setScene("recipe")} />
          )}
          {scene === "recipe" && selectedCoffee && (
            <RecipeScene coffee={selectedCoffee} onContinue={() => setScene("final")} />
          )}
          {scene === "final" && selectedCoffee && (
            <FinalScene coffee={selectedCoffee} quantity={quantity} onRestart={handleRestart} />
          )}
        </SceneTransition>
      </AnimatePresence>
    </div>
  );
};

export default Index;
