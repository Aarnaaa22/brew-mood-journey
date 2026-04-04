import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtCornerProps {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const COLORS = [
  { name: "Red", value: "hsl(0, 70%, 50%)" },
  { name: "Crimson", value: "hsl(348, 80%, 45%)" },
  { name: "Blue", value: "hsl(220, 70%, 50%)" },
  { name: "Sky Blue", value: "hsl(195, 75%, 55%)" },
  { name: "Green", value: "hsl(140, 60%, 40%)" },
  { name: "Mint", value: "hsl(160, 50%, 55%)" },
  { name: "Yellow", value: "hsl(45, 90%, 55%)" },
  { name: "Gold", value: "hsl(38, 80%, 48%)" },
  { name: "Pink", value: "hsl(330, 70%, 60%)" },
  { name: "Rose", value: "hsl(350, 60%, 70%)" },
  { name: "Purple", value: "hsl(270, 60%, 50%)" },
  { name: "Lavender", value: "hsl(280, 45%, 65%)" },
  { name: "Orange", value: "hsl(25, 85%, 55%)" },
  { name: "Peach", value: "hsl(15, 70%, 70%)" },
  { name: "Black", value: "hsl(0, 0%, 12%)" },
  { name: "Charcoal", value: "hsl(0, 0%, 30%)" },
  { name: "Brown", value: "hsl(25, 50%, 30%)" },
  { name: "Teal", value: "hsl(180, 55%, 40%)" },
  { name: "Coral", value: "hsl(10, 75%, 60%)" },
  { name: "White", value: "hsl(0, 0%, 95%)" },
];

const BRUSH_SIZES = [
  { label: "Small", size: 2 },
  { label: "Medium", size: 6 },
  { label: "Large", size: 14 },
];

const ERASER_SIZES = [
  { label: "S", size: 8 },
  { label: "M", size: 18 },
  { label: "L", size: 32 },
];

const PAPER_COLOR = "hsl(35, 30%, 92%)";
const CANVAS_W = 640;
const CANVAS_H = 400;

// ── Coloring Templates (SVG path-based regions) ──
interface TemplateRegion {
  path: string;
  defaultFill: string;
  label?: string;
}

interface Template {
  name: string;
  emoji: string;
  regions: TemplateRegion[];
}

const OUTLINE_COLOR = "hsl(0, 0%, 25%)";

const TEMPLATES: Template[] = [
  {
    name: "Mountain Sunset",
    emoji: "🏔️",
    regions: [
      // sky
      { path: "M0,0 L640,0 L640,180 L0,180 Z", defaultFill: "hsl(210,60%,85%)" },
      // sun
      { path: "M320,100 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0", defaultFill: "hsl(45,90%,70%)" },
      // mountain left
      { path: "M0,180 L160,60 L320,180 Z", defaultFill: "hsl(0,0%,55%)" },
      // mountain right
      { path: "M200,180 L420,40 L640,180 Z", defaultFill: "hsl(0,0%,45%)" },
      // snow cap left
      { path: "M160,60 L130,100 L190,100 Z", defaultFill: "hsl(0,0%,92%)" },
      // snow cap right
      { path: "M420,40 L385,85 L455,85 Z", defaultFill: "hsl(0,0%,95%)" },
      // ground
      { path: "M0,180 L640,180 L640,400 L0,400 Z", defaultFill: "hsl(120,30%,70%)" },
      // lake
      { path: "M100,260 Q320,220 540,260 Q320,310 100,260 Z", defaultFill: "hsl(210,50%,70%)" },
    ],
  },
  {
    name: "Cozy House",
    emoji: "🏡",
    regions: [
      // sky
      { path: "M0,0 L640,0 L640,200 L0,200 Z", defaultFill: "hsl(200,50%,80%)" },
      // ground
      { path: "M0,200 L640,200 L640,400 L0,400 Z", defaultFill: "hsl(90,35%,65%)" },
      // house body
      { path: "M180,200 L460,200 L460,340 L180,340 Z", defaultFill: "hsl(25,50%,70%)" },
      // roof
      { path: "M150,200 L320,100 L490,200 Z", defaultFill: "hsl(0,55%,45%)" },
      // door
      { path: "M290,260 L350,260 L350,340 L290,340 Z", defaultFill: "hsl(25,40%,35%)" },
      // window left
      { path: "M210,230 L260,230 L260,280 L210,280 Z", defaultFill: "hsl(195,60%,75%)" },
      // window right
      { path: "M380,230 L430,230 L430,280 L380,280 Z", defaultFill: "hsl(195,60%,75%)" },
      // chimney
      { path: "M400,90 L430,90 L430,155 L400,155 Z", defaultFill: "hsl(0,30%,40%)" },
      // path
      { path: "M290,340 Q310,380 280,400 L360,400 Q330,380 350,340 Z", defaultFill: "hsl(35,30%,60%)" },
      // tree
      { path: "M560,120 L530,200 L590,200 Z", defaultFill: "hsl(120,40%,40%)" },
      { path: "M555,200 L565,200 L565,240 L555,240 Z", defaultFill: "hsl(25,40%,30%)" },
    ],
  },
  {
    name: "Ocean Waves",
    emoji: "🌊",
    regions: [
      // sky top
      { path: "M0,0 L640,0 L640,120 L0,120 Z", defaultFill: "hsl(200,60%,80%)" },
      // sky bottom
      { path: "M0,120 L640,120 L640,180 L0,180 Z", defaultFill: "hsl(30,60%,75%)" },
      // sun
      { path: "M500,60 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0", defaultFill: "hsl(40,90%,65%)" },
      // wave 1
      { path: "M0,180 Q80,150 160,180 Q240,210 320,180 Q400,150 480,180 Q560,210 640,180 L640,240 Q560,270 480,240 Q400,210 320,240 Q240,270 160,240 Q80,210 0,240 Z", defaultFill: "hsl(200,55%,55%)" },
      // wave 2
      { path: "M0,240 Q80,210 160,240 Q240,270 320,240 Q400,210 480,240 Q560,270 640,240 L640,300 Q560,330 480,300 Q400,270 320,300 Q240,330 160,300 Q80,270 0,300 Z", defaultFill: "hsl(210,55%,45%)" },
      // deep water
      { path: "M0,300 Q80,270 160,300 Q240,330 320,300 Q400,270 480,300 Q560,330 640,300 L640,400 L0,400 Z", defaultFill: "hsl(220,50%,35%)" },
      // sailboat body
      { path: "M260,195 L380,195 L370,215 L270,215 Z", defaultFill: "hsl(25,50%,45%)" },
      // sail
      { path: "M320,120 L320,195 L280,195 Z", defaultFill: "hsl(0,0%,93%)" },
    ],
  },
  {
    name: "Flower Garden",
    emoji: "🌸",
    regions: [
      // sky
      { path: "M0,0 L640,0 L640,180 L0,180 Z", defaultFill: "hsl(200,55%,82%)" },
      // grass
      { path: "M0,180 L640,180 L640,400 L0,400 Z", defaultFill: "hsl(110,40%,55%)" },
      // flower 1 center
      { path: "M120,220 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0", defaultFill: "hsl(45,80%,55%)" },
      // flower 1 petals
      { path: "M120,195 m-14,0 a14,10 0 1,0 28,0 a14,10 0 1,0 -28,0", defaultFill: "hsl(340,65%,60%)" },
      { path: "M120,245 m-14,0 a14,10 0 1,0 28,0 a14,10 0 1,0 -28,0", defaultFill: "hsl(340,65%,60%)" },
      // flower 1 stem
      { path: "M117,235 L123,235 L123,310 L117,310 Z", defaultFill: "hsl(120,45%,35%)" },
      // flower 2 center
      { path: "M320,200 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0", defaultFill: "hsl(50,85%,60%)" },
      // flower 2 petals
      { path: "M320,170 m-16,0 a16,12 0 1,0 32,0 a16,12 0 1,0 -32,0", defaultFill: "hsl(270,55%,60%)" },
      { path: "M320,230 m-16,0 a16,12 0 1,0 32,0 a16,12 0 1,0 -32,0", defaultFill: "hsl(270,55%,60%)" },
      // flower 2 stem
      { path: "M317,220 L323,220 L323,320 L317,320 Z", defaultFill: "hsl(120,45%,35%)" },
      // flower 3 center
      { path: "M500,230 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0", defaultFill: "hsl(40,80%,55%)" },
      // flower 3 petals
      { path: "M500,205 m-13,0 a13,10 0 1,0 26,0 a13,10 0 1,0 -26,0", defaultFill: "hsl(15,70%,55%)" },
      { path: "M500,255 m-13,0 a13,10 0 1,0 26,0 a13,10 0 1,0 -26,0", defaultFill: "hsl(15,70%,55%)" },
      // flower 3 stem
      { path: "M497,245 L503,245 L503,330 L497,330 Z", defaultFill: "hsl(120,45%,35%)" },
      // butterfly
      { path: "M400,140 Q420,110 440,140 Q420,145 400,140 Z", defaultFill: "hsl(45,80%,65%)" },
      { path: "M400,140 Q420,170 440,140 Q420,135 400,140 Z", defaultFill: "hsl(200,60%,60%)" },
    ],
  },
  {
    name: "Night Sky",
    emoji: "🌙",
    regions: [
      // dark sky
      { path: "M0,0 L640,0 L640,300 L0,300 Z", defaultFill: "hsl(230,40%,18%)" },
      // moon
      { path: "M480,70 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0", defaultFill: "hsl(45,60%,85%)" },
      // moon shadow
      { path: "M495,70 m-25,0 a25,30 0 1,0 50,0 a25,30 0 1,0 -50,0", defaultFill: "hsl(230,40%,18%)" },
      // star 1
      { path: "M100,50 L106,65 L120,65 L108,75 L113,90 L100,80 L87,90 L92,75 L80,65 L94,65 Z", defaultFill: "hsl(45,80%,75%)" },
      // star 2
      { path: "M250,30 L254,40 L265,40 L257,47 L260,58 L250,52 L240,58 L243,47 L235,40 L246,40 Z", defaultFill: "hsl(45,80%,75%)" },
      // star 3
      { path: "M380,80 L384,90 L395,90 L387,97 L390,108 L380,102 L370,108 L373,97 L365,90 L376,90 Z", defaultFill: "hsl(45,80%,75%)" },
      // hill
      { path: "M0,300 Q160,230 320,280 Q480,230 640,300 L640,400 L0,400 Z", defaultFill: "hsl(150,25%,25%)" },
      // tree silhouette
      { path: "M150,220 L120,300 L180,300 Z", defaultFill: "hsl(150,20%,15%)" },
      { path: "M145,300 L155,300 L155,340 L145,340 Z", defaultFill: "hsl(25,30%,18%)" },
    ],
  },
  {
    name: "Coffee Cup",
    emoji: "☕",
    regions: [
      // table
      { path: "M0,250 L640,250 L640,400 L0,400 Z", defaultFill: "hsl(25,40%,55%)" },
      // wall
      { path: "M0,0 L640,0 L640,250 L0,250 Z", defaultFill: "hsl(30,25%,80%)" },
      // saucer
      { path: "M230,310 Q320,280 410,310 Q320,330 230,310 Z", defaultFill: "hsl(0,0%,90%)" },
      // cup body
      { path: "M260,200 L380,200 L370,300 L270,300 Z", defaultFill: "hsl(0,0%,95%)" },
      // cup rim
      { path: "M255,195 L385,195 L380,205 L260,205 Z", defaultFill: "hsl(0,0%,88%)" },
      // coffee inside
      { path: "M265,210 L375,210 L372,295 L268,295 Z", defaultFill: "hsl(25,60%,25%)" },
      // handle
      { path: "M380,220 Q430,230 430,260 Q430,290 380,280 Q405,280 405,260 Q405,240 380,230 Z", defaultFill: "hsl(0,0%,90%)" },
      // steam left
      { path: "M290,120 Q280,155 300,180 Q285,155 295,130 Z", defaultFill: "hsl(0,0%,80%)" },
      // steam right
      { path: "M340,130 Q350,160 330,185 Q345,155 335,135 Z", defaultFill: "hsl(0,0%,80%)" },
    ],
  },
  {
    name: "Butterfly",
    emoji: "🦋",
    regions: [
      // background
      { path: "M0,0 L640,0 L640,400 L0,400 Z", defaultFill: "hsl(140,30%,85%)" },
      // left wing top
      { path: "M320,180 Q220,80 180,180 Q220,160 320,180 Z", defaultFill: "hsl(270,50%,55%)" },
      // left wing bottom
      { path: "M320,200 Q240,280 200,220 Q240,240 320,200 Z", defaultFill: "hsl(290,50%,60%)" },
      // right wing top
      { path: "M320,180 Q420,80 460,180 Q420,160 320,180 Z", defaultFill: "hsl(200,55%,55%)" },
      // right wing bottom
      { path: "M320,200 Q400,280 440,220 Q400,240 320,200 Z", defaultFill: "hsl(180,50%,55%)" },
      // left wing dot
      { path: "M250,155 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0", defaultFill: "hsl(45,70%,60%)" },
      // right wing dot
      { path: "M390,155 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0", defaultFill: "hsl(45,70%,60%)" },
      // body
      { path: "M315,140 L325,140 L323,260 L317,260 Z", defaultFill: "hsl(0,0%,20%)" },
      // antennae
      { path: "M320,140 Q300,100 290,90", defaultFill: "hsl(0,0%,30%)" },
      { path: "M320,140 Q340,100 350,90", defaultFill: "hsl(0,0%,30%)" },
    ],
  },
  {
    name: "Rainbow Hills",
    emoji: "🌈",
    regions: [
      // sky
      { path: "M0,0 L640,0 L640,200 L0,200 Z", defaultFill: "hsl(200,55%,80%)" },
      // rainbow band 1
      { path: "M120,200 Q320,60 520,200 Q320,80 120,200 Z", defaultFill: "hsl(0,65%,55%)" },
      // rainbow band 2
      { path: "M140,200 Q320,80 500,200 Q320,95 140,200 Z", defaultFill: "hsl(35,75%,55%)" },
      // rainbow band 3
      { path: "M160,200 Q320,95 480,200 Q320,110 160,200 Z", defaultFill: "hsl(50,80%,55%)" },
      // rainbow band 4
      { path: "M180,200 Q320,110 460,200 Q320,130 180,200 Z", defaultFill: "hsl(120,45%,50%)" },
      // rainbow band 5
      { path: "M200,200 Q320,130 440,200 Q320,150 200,200 Z", defaultFill: "hsl(220,55%,55%)" },
      // hill left
      { path: "M0,200 Q120,160 240,200 L240,400 L0,400 Z", defaultFill: "hsl(110,40%,50%)" },
      // hill center
      { path: "M200,200 Q380,140 520,200 L520,400 L200,400 Z", defaultFill: "hsl(120,35%,45%)" },
      // hill right
      { path: "M480,200 Q560,170 640,200 L640,400 L480,400 Z", defaultFill: "hsl(130,40%,55%)" },
      // cloud
      { path: "M80,60 m-25,0 a25,20 0 1,0 50,0 a25,20 0 1,0 -50,0", defaultFill: "hsl(0,0%,95%)" },
      { path: "M105,55 m-20,0 a20,18 0 1,0 40,0 a20,18 0 1,0 -40,0", defaultFill: "hsl(0,0%,95%)" },
    ],
  },
];

type ToolMode = "brush" | "eraser" | "fill";

const ArtCorner = ({ onClose, onSave }: ArtCornerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[14].value); // black default
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
  const [toolMode, setToolMode] = useState<ToolMode>("brush");
  const [eraserSize, setEraserSize] = useState(ERASER_SIZES[1].size);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [regionFills, setRegionFills] = useState<Record<number, string>>({});
  const [showTemplates, setShowTemplates] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const points = useRef<{ x: number; y: number }[]>([]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // paper grain
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `hsla(30, 20%, ${60 + Math.random() * 30}%, ${0.03 + Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  }, []);

  useEffect(() => {
    if (!activeTemplate) initCanvas();
  }, [initCanvas, activeTemplate]);

  // ── Template rendering ──
  const renderTemplate = useCallback(
    (fills: Record<number, string>) => {
      if (!activeTemplate) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = PAPER_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      activeTemplate.regions.forEach((region, i) => {
        const p = new Path2D(region.path);
        ctx.fillStyle = fills[i] || region.defaultFill;
        ctx.fill(p);
        ctx.strokeStyle = OUTLINE_COLOR;
        ctx.lineWidth = 1.5;
        ctx.stroke(p);
      });
    },
    [activeTemplate]
  );

  useEffect(() => {
    if (activeTemplate) renderTemplate(regionFills);
  }, [activeTemplate, regionFills, renderTemplate]);

  const loadTemplate = (t: Template) => {
    setActiveTemplate(t);
    setRegionFills({});
    setToolMode("fill");
    setShowTemplates(false);
  };

  const exitTemplate = () => {
    setActiveTemplate(null);
    setRegionFills({});
    setToolMode("brush");
    initCanvas();
  };

  // ── Canvas position helper ──
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

  // ── Smooth quadratic curve drawing ──
  const drawSmooth = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const pts = points.current;
      if (pts.length < 2) return;

      const isEraserMode = toolMode === "eraser";

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      if (pts.length === 2) {
        ctx.lineTo(pts[1].x, pts[1].y);
      } else {
        for (let i = 1; i < pts.length - 1; i++) {
          const cx = (pts[i].x + pts[i + 1].x) / 2;
          const cy = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cx, cy);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
      }

      if (isEraserMode) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = eraserSize;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = 0.85;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
    [color, brushSize, toolMode, eraserSize]
  );

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (activeTemplate && toolMode === "fill") {
        // Fill mode — find clicked region
        const pos = getPos(e);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        for (let i = activeTemplate.regions.length - 1; i >= 0; i--) {
          const p = new Path2D(activeTemplate.regions[i].path);
          if (ctx.isPointInPath(p, pos.x, pos.y)) {
            setRegionFills((prev) => ({ ...prev, [i]: color }));
            return;
          }
        }
        return;
      }

      setIsDrawing(true);
      const pos = getPos(e);
      lastPoint.current = pos;
      points.current = [pos];
    },
    [getPos, activeTemplate, toolMode, color]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || activeTemplate) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      const pos = getPos(e);

      // Interpolate for smoothness when moving fast
      const last = lastPoint.current || pos;
      const dist = Math.hypot(pos.x - last.x, pos.y - last.y);
      if (dist > 2) {
        const steps = Math.max(1, Math.floor(dist / 2));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          points.current.push({
            x: last.x + (pos.x - last.x) * t,
            y: last.y + (pos.y - last.y) * t,
          });
        }
      } else {
        points.current.push(pos);
      }

      // Keep buffer manageable
      if (points.current.length > 12) {
        points.current = points.current.slice(-8);
      }

      drawSmooth(ctx);
      lastPoint.current = pos;
    },
    [isDrawing, getPos, drawSmooth, activeTemplate]
  );

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPoint.current = null;
    points.current = [];

    if (toolMode === "eraser") {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = PAPER_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }, [toolMode]);

  const clearCanvas = () => {
    if (activeTemplate) {
      setRegionFills({});
    } else {
      initCanvas();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  };

  const cursorStyle = activeTemplate && toolMode === "fill" ? "pointer" : toolMode === "eraser" ? "cell" : "crosshair";

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
          Art Corner
        </motion.h2>
        <motion.p
          className="font-handwritten text-xl text-center text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {activeTemplate ? `coloring: ${activeTemplate.name}` : "relax and draw something beautiful"}
        </motion.p>

        <div className="glass-panel rounded-3xl p-4 md:p-6 shadow-warm">
          {/* Canvas */}
          <div className="relative rounded-2xl overflow-hidden mb-4 shadow-soft border border-border/40">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full touch-none"
              style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}`, cursor: cursorStyle }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>

          {/* Template picker toggle */}
          <div className="flex justify-center mb-3">
            <motion.button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-1.5 rounded-full font-handwritten text-sm cursor-pointer bg-secondary/60 text-secondary-foreground border border-border/40 hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showTemplates ? "Hide Templates" : "🎨 Coloring Templates"}
            </motion.button>
            {activeTemplate && (
              <motion.button
                onClick={exitTemplate}
                className="ml-2 px-4 py-1.5 rounded-full font-handwritten text-sm cursor-pointer bg-secondary/40 text-muted-foreground border border-border/30 hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                ← Free Draw
              </motion.button>
            )}
          </div>

          {/* Template gallery */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {TEMPLATES.map((t) => (
                  <motion.button
                    key={t.name}
                    onClick={() => loadTemplate(t)}
                    className={`px-3 py-2 rounded-xl font-handwritten text-sm cursor-pointer border transition-all ${
                      activeTemplate?.name === t.name
                        ? "bg-accent text-accent-foreground border-accent shadow-soft"
                        : "bg-secondary/50 text-secondary-foreground border-border/40 hover:bg-secondary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.emoji} {t.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tool mode toggle */}
          <div className="flex justify-center gap-2 mb-3">
            {(!activeTemplate ? (["brush", "eraser"] as ToolMode[]) : (["fill", "brush", "eraser"] as ToolMode[])).map(
              (mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setToolMode(mode)}
                  className={`px-4 py-1.5 rounded-full font-handwritten text-sm cursor-pointer transition-all ${
                    toolMode === mode ? "bg-accent text-accent-foreground shadow-soft" : "bg-secondary/50 text-secondary-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mode === "brush" && "🖌️ Brush"}
                  {mode === "eraser" && "🧽 Eraser"}
                  {mode === "fill" && "🪣 Fill"}
                </motion.button>
              )
            )}
          </div>

          {/* Color picker — always visible for brush & fill */}
          {toolMode !== "eraser" && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {COLORS.map((c) => (
                <motion.button
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                    color === c.value ? "border-foreground scale-110 shadow-soft" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Brush sizes */}
          {toolMode === "brush" && (
            <div className="flex justify-center gap-2 mb-4">
              {BRUSH_SIZES.map((b) => (
                <motion.button
                  key={b.label}
                  onClick={() => setBrushSize(b.size)}
                  className={`px-3 py-1.5 rounded-full font-handwritten text-sm cursor-pointer transition-all duration-200 ${
                    brushSize === b.size
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="rounded-full inline-block"
                      style={{ width: b.size + 4, height: b.size + 4, backgroundColor: color }}
                    />
                    {b.label}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Eraser sizes */}
          {toolMode === "eraser" && (
            <div className="flex justify-center gap-2 mb-4">
              {ERASER_SIZES.map((es) => (
                <motion.button
                  key={es.label}
                  onClick={() => setEraserSize(es.size)}
                  className={`px-3 py-1.5 rounded-full font-handwritten text-sm cursor-pointer transition-all duration-200 ${
                    eraserSize === es.size
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="rounded-full inline-block border border-border"
                      style={{ width: es.size / 2 + 4, height: es.size / 2 + 4, backgroundColor: PAPER_COLOR }}
                    />
                    {es.label}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <motion.button
              onClick={clearCanvas}
              className="px-5 py-2 rounded-2xl bg-secondary text-secondary-foreground font-handwritten text-base border border-border cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-5 py-2 rounded-2xl bg-accent text-accent-foreground font-handwritten text-base cursor-pointer shadow-soft"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(var(--accent) / 0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              Done
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-secondary/50 text-muted-foreground font-handwritten text-base border border-border/50 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArtCorner;
