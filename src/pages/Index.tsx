import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import EntryScene from "@/components/coffee/EntryScene";
import MenuScene from "@/components/coffee/MenuScene";
import SelectionScene from "@/components/coffee/SelectionScene";
import BeanSelectionScene from "@/components/coffee/BeanSelectionScene";
import GrindingScene from "@/components/coffee/GrindingScene";
import MakingScene from "@/components/coffee/MakingScene";
import RecipeScene from "@/components/coffee/RecipeScene";
import FinalScene from "@/components/coffee/FinalScene";
import ProgressIndicator from "@/components/coffee/ProgressIndicator";
import SceneTransition from "@/components/coffee/SceneTransition";
import RainEffect from "@/components/coffee/RainEffect";
import WindowScene from "@/components/coffee/WindowScene";
import AmbientControls from "@/components/coffee/AmbientControls";
import type { CoffeeType } from "@/components/coffee/MenuScene";
import type { RoastType } from "@/components/coffee/BeanSelectionScene";

type Scene = "entry" | "menu" | "selection" | "beans" | "grinding" | "making" | "recipe" | "final";

const sceneIndex: Record<Scene, number> = {
  entry: 0,
  menu: 1,
  selection: 2,
  beans: 3,
  grinding: 4,
  making: 5,
  recipe: 6,
  final: 7,
};

const Index = () => {
  const [scene, setScene] = useState<Scene>("entry");
  const [userName, setUserName] = useState("");
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [selectedSnack, setSelectedSnack] = useState<CoffeeType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cupSize, setCupSize] = useState("medium");
  const [roastType, setRoastType] = useState<RoastType>("medium");
  const [rainOn, setRainOn] = useState(true);
  const [ambiance, setAmbiance] = useState<"morning" | "evening" | "night">("evening");
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    if (ambiance === "night") {
      document.documentElement.classList.add("night-mode");
    } else {
      document.documentElement.classList.remove("night-mode");
    }
    return () => document.documentElement.classList.remove("night-mode");
  }, [ambiance]);

  const cycleAmbiance = () => {
    setAmbiance((prev) =>
      prev === "morning" ? "evening" : prev === "evening" ? "night" : "morning"
    );
  };

  const handleEnter = (name: string) => {
    setUserName(name);
    setScene("menu");
  };

  const handleCoffeeSelect = (coffee: CoffeeType) => {
    setSelectedCoffee(coffee);
    setScene("selection");
  };

  const handleSnackSelect = (snack: CoffeeType) => {
    setSelectedSnack(snack);
  };

  const handleConfirmSelection = (qty: number, size: string) => {
    setQuantity(qty);
    setCupSize(size);
    if (selectedCoffee?.category === "coffee") {
      setScene("beans");
    } else {
      setScene("recipe");
    }
  };

  const handleBeanSelect = (roast: RoastType) => {
    setRoastType(roast);
    setScene("grinding");
  };

  const handleRestart = () => {
    setSelectedCoffee(null);
    setSelectedSnack(null);
    setQuantity(1);
    setCupSize("medium");
    setRoastType("medium");
    setScene("menu");
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <WindowScene ambiance={ambiance} />
      {rainOn && <RainEffect intensity={50} />}

      <AmbientControls
        rainOn={rainOn}
        onToggleRain={() => setRainOn(!rainOn)}
        ambiance={ambiance}
        onCycleAmbiance={cycleAmbiance}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(!soundOn)}
      />

      {scene !== "entry" && <ProgressIndicator currentStep={sceneIndex[scene]} />}

      <AnimatePresence mode="wait">
        <SceneTransition sceneKey={scene}>
          {scene === "entry" && <EntryScene onEnter={handleEnter} />}
          {scene === "menu" && (
            <MenuScene
              userName={userName}
              onSelectCoffee={handleCoffeeSelect}
              onSelectSnack={handleSnackSelect}
              selectedSnack={selectedSnack}
            />
          )}
          {scene === "selection" && selectedCoffee && (
            <SelectionScene
              coffee={selectedCoffee}
              onConfirm={handleConfirmSelection}
              onBack={() => setScene("menu")}
            />
          )}
          {scene === "beans" && selectedCoffee && (
            <BeanSelectionScene
              coffee={selectedCoffee}
              onSelect={handleBeanSelect}
              onBack={() => setScene("selection")}
            />
          )}
          {scene === "grinding" && selectedCoffee && (
            <GrindingScene
              coffee={selectedCoffee}
              roastType={roastType}
              onComplete={() => setScene("making")}
            />
          )}
          {scene === "making" && selectedCoffee && (
            <MakingScene coffee={selectedCoffee} onComplete={() => setScene("recipe")} />
          )}
          {scene === "recipe" && selectedCoffee && (
            <RecipeScene coffee={selectedCoffee} onContinue={() => setScene("final")} />
          )}
          {scene === "final" && selectedCoffee && (
            <FinalScene
              coffee={selectedCoffee}
              quantity={quantity}
              userName={userName}
              selectedSnack={selectedSnack}
              onRestart={handleRestart}
            />
          )}
        </SceneTransition>
      </AnimatePresence>
    </div>
  );
};

export default Index;
