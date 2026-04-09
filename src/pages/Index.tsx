import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import EntryScene from "@/components/coffee/EntryScene";
import MenuScene from "@/components/coffee/MenuScene";
import SelectionScene from "@/components/coffee/SelectionScene";
import BeanSelectionScene from "@/components/coffee/BeanSelectionScene";
import GrindingScene from "@/components/coffee/GrindingScene";
import MakingScene from "@/components/coffee/MakingScene";
import RecipeScene from "@/components/coffee/RecipeScene";
import ArtCorner from "@/components/coffee/ArtCorner";
import ServingScene from "@/components/coffee/ServingScene";
import ProgressIndicator from "@/components/coffee/ProgressIndicator";
import SceneTransition from "@/components/coffee/SceneTransition";
import RainEffect from "@/components/coffee/RainEffect";
import WindowScene from "@/components/coffee/WindowScene";
import CafeEnvironment from "@/components/coffee/CafeEnvironment";
import AmbientControls from "@/components/coffee/AmbientControls";
import ArtButton from "@/components/coffee/ArtButton";
import GamesButton from "@/components/coffee/GamesButton";
import GamesScene from "@/components/coffee/GamesScene";
import PaintingPrompt from "@/components/coffee/PaintingPrompt";
import type { CoffeeType } from "@/components/coffee/MenuScene";
import type { RoastType } from "@/components/coffee/BeanSelectionScene";

type Gender = "female" | "male";
type Scene = "entry" | "menu" | "selection" | "beans" | "grinding" | "making" | "recipe" | "art" | "games" | "final";

const sceneIndex: Record<Scene, number> = {
  entry: 0, menu: 1, selection: 2, beans: 3, grinding: 4, making: 5, recipe: 6, art: 7, games: 7, final: 8,
};

const Index = () => {
  const [scene, setScene] = useState<Scene>("entry");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [selectedSnack, setSelectedSnack] = useState<CoffeeType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cupSize, setCupSize] = useState("medium");
  const [roastType, setRoastType] = useState<RoastType>("medium");
  const [paintingDataUrl, setPaintingDataUrl] = useState<string | null>(null);
  const [rainOn, setRainOn] = useState(true);
  const [ambiance, setAmbiance] = useState<"morning" | "evening" | "night">("evening");
  const [soundOn, setSoundOn] = useState(false);


  // Painting decision state — once set, NEVER re-ask
  const [paintingDecisionMade, setPaintingDecisionMade] = useState(false);
  const [showPaintPrompt, setShowPaintPrompt] = useState(false);

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

  const handleEnter = (name: string, g: Gender) => {
    setUserName(name);
    setGender(g);
    setScene("menu");
  };
  const handleCoffeeSelect = (coffee: CoffeeType) => { setSelectedCoffee(coffee); setScene("selection"); };
  const handleSnackSelect = (snack: CoffeeType) => { setSelectedSnack(snack); };
  const handleConfirmSelection = (qty: number, size: string) => {
    setQuantity(qty); setCupSize(size);
    setScene(selectedCoffee?.category === "coffee" ? "beans" : "recipe");
  };
  const handleBeanSelect = (roast: RoastType) => { setRoastType(roast); setScene("grinding"); };

  // Track where art was opened from: prompt vs manual button
  const [artReturnScene, setArtReturnScene] = useState<Scene>("menu");

  const handleOpenArt = () => {
    setArtReturnScene(scene);
    setScene("art");
  };
  const handleCloseArt = () => {
    setScene(artReturnScene);
  };
  const handleSaveArt = (dataUrl: string) => {
    setPaintingDataUrl(dataUrl);
    setScene(artReturnScene);
  };

  // After making is done, ask about painting ONLY if not already decided
  const handleMakingComplete = () => {
    if (!paintingDecisionMade) {
      setShowPaintPrompt(true);
    } else {
      setScene("recipe");
    }
  };

  const handleStartPaintingFromPrompt = () => {
    setPaintingDecisionMade(true);
    setShowPaintPrompt(false);
    // When coming from painting prompt, art should return to recipe flow → final
    setArtReturnScene("recipe");
    setScene("art");
  };

  const handleSkipPainting = () => {
    setPaintingDecisionMade(true);
    setShowPaintPrompt(false);
    setScene("recipe");
  };

  // After recipe, go directly to final
  const handleRecipeContinue = () => {
    setScene("final");
  };

  const handleRestart = () => {
    setSelectedCoffee(null); setSelectedSnack(null);
    setQuantity(1); setCupSize("medium"); setRoastType("medium");
    setPaintingDataUrl(null);
    // Keep paintingDecisionMade — don't re-ask on reorder
    setScene("menu");
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <WindowScene ambiance={ambiance} />
      {scene !== "entry" && <CafeEnvironment />}
      {rainOn && <RainEffect intensity={55} />}

      <AmbientControls
        rainOn={rainOn}
        onToggleRain={() => setRainOn(!rainOn)}
        ambiance={ambiance}
        onCycleAmbiance={cycleAmbiance}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(!soundOn)}
      />

      {/* Art button - visible on most scenes except entry and art */}
      {scene !== "entry" && scene !== "art" && (
        <ArtButton onClick={handleOpenArt} />
      )}

      {scene !== "entry" && scene !== "art" && <ProgressIndicator currentStep={sceneIndex[scene]} />}

      {/* Painting prompt overlay — shown only once, after making */}
      <AnimatePresence>
        {showPaintPrompt && (
          <PaintingPrompt
            onStartPainting={handleStartPaintingFromPrompt}
            onSkip={handleSkipPainting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <SceneTransition sceneKey={scene}>
          {scene === "entry" && <EntryScene onEnter={handleEnter} />}
          {scene === "menu" && (
            <MenuScene userName={userName} onSelectCoffee={handleCoffeeSelect} onSelectSnack={handleSnackSelect} selectedSnack={selectedSnack} />
          )}
          {scene === "selection" && selectedCoffee && (
            <SelectionScene coffee={selectedCoffee} onConfirm={handleConfirmSelection} onBack={() => setScene("menu")} />
          )}
          {scene === "beans" && selectedCoffee && (
            <BeanSelectionScene coffee={selectedCoffee} onSelect={handleBeanSelect} onBack={() => setScene("selection")} />
          )}
          {scene === "grinding" && selectedCoffee && (
            <GrindingScene coffee={selectedCoffee} roastType={roastType} onComplete={() => setScene("making")} />
          )}
          {scene === "making" && selectedCoffee && (
            <MakingScene coffee={selectedCoffee} onComplete={handleMakingComplete} />
          )}
          {scene === "recipe" && selectedCoffee && (
            <RecipeScene coffee={selectedCoffee} onContinue={handleRecipeContinue} />
          )}
          {scene === "art" && (
            <ArtCorner onClose={handleCloseArt} onSave={handleSaveArt} />
          )}
          {scene === "final" && selectedCoffee && (
            <ServingScene
              coffee={selectedCoffee}
              quantity={quantity}
              userName={userName}
              gender={gender}
              selectedSnack={selectedSnack}
              paintingDataUrl={paintingDataUrl}
              onRestart={handleRestart}
            />
          )}
        </SceneTransition>
      </AnimatePresence>
    </div>
  );
};

export default Index;
