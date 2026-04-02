import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface ArtCornerProps {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const COLORS = [
  { name: "Red", value: "hsl(0, 70%, 50%)" },
  { name: "Blue", value: "hsl(220, 70%, 50%)" },
  { name: "Green", value: "hsl(140, 60%, 40%)" },
  { name: "Yellow", value: "hsl(45, 90%, 55%)" },
  { name: "Pink", value: "hsl(330, 70%, 60%)" },
  { name: "Purple", value: "hsl(270, 60%, 50%)" },
  { name: "Orange", value: "hsl(25, 85%, 55%)" },
  { name: "Black", value: "hsl(0, 0%, 12%)" },
  { name: "Brown", value: "hsl(25, 50%, 30%)" },
  { name: "White", value: "hsl(0, 0%, 95%)" },
];

const BRUSH_SIZES = [
  { label: "Thin", size: 2 },
  { label: "Medium", size: 6 },
  { label: "Thick", size: 14 },
];

const ArtCorner = ({ onClose, onSave }: ArtCornerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[7].value);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Paper-like background
    ctx.fillStyle = "hsl(35, 30%, 92%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Subtle texture
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `hsla(30, 20%, ${60 + Math.random() * 30}%, ${0.03 + Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPoint.current = getPos(e);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const pos = getPos(e);
    const last = lastPoint.current || pos;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.globalAlpha = 1;

    lastPoint.current = pos;
  }, [isDrawing, color, brushSize, getPos]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPoint.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "hsl(35, 30%, 92%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `hsla(30, 20%, ${60 + Math.random() * 30}%, ${0.03 + Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="font-display text-3xl md:text-4xl text-center text-foreground mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Art Corner 🎨
        </motion.h2>
        <motion.p
          className="font-handwritten text-xl text-center text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          relax and draw something beautiful
        </motion.p>

        <div className="glass-panel rounded-3xl p-5 md:p-8 shadow-warm">
          {/* Canvas */}
          <div className="relative rounded-2xl overflow-hidden mb-5 shadow-soft border border-border/40">
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              className="w-full cursor-crosshair touch-none"
              style={{ aspectRatio: "640/400" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>

          {/* Color picker */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {COLORS.map((c) => (
              <motion.button
                key={c.name}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                  color === c.value ? "border-foreground scale-110 shadow-soft" : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title={c.name}
              />
            ))}
          </div>

          {/* Brush size */}
          <div className="flex justify-center gap-3 mb-5">
            {BRUSH_SIZES.map((b) => (
              <motion.button
                key={b.label}
                onClick={() => setBrushSize(b.size)}
                className={`px-4 py-2 rounded-full font-handwritten text-sm cursor-pointer transition-all duration-200 ${
                  brushSize === b.size
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="rounded-full inline-block"
                    style={{
                      width: b.size + 4,
                      height: b.size + 4,
                      backgroundColor: color,
                    }}
                  />
                  {b.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <motion.button
              onClick={clearCanvas}
              className="px-6 py-2.5 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-lg border border-border cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear 🗑️
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl bg-accent text-accent-foreground font-handwritten text-lg cursor-pointer shadow-soft"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(var(--accent) / 0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              Done ✨
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-secondary/50 text-muted-foreground font-handwritten text-lg border border-border/50 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back ←
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArtCorner;
