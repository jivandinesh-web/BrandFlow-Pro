import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Ruler,
  MapPin,
  Eye,
  Move,
  Maximize2,
  RotateCw,
  Sparkles,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  Grid,
  Lock,
  Unlock,
  RefreshCw,
  Sliders,
  Compass,
  Square,
  Circle,
  HelpCircle,
  Minimize2,
  ZoomIn,
  Info,
} from 'lucide-react';
import { BrandingMethodDetailModal } from './modals/BrandingMethodDetailModal';
import { BrandingMethodDetail } from '../data/brandingMethodsData';

export interface BrandingInteractiveState {
  posX: number; // percentage (0-100)
  posY: number; // percentage (0-100)
  widthMm: number;
  heightMm: number;
  rotation: number; // degrees (0-360)
  placementName: string;
  technique: string;
  graphicType: 'logo' | 'text' | 'crest' | 'sign' | 'custom_image' | 'patch';
  customText: string;
  customImageUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  showGrid: boolean;
  showPressLimit: boolean;
}

export interface BrandingPreviewCanvasProps {
  productName: string;
  imageUrl?: string;
  brandingPlacement?: string;
  brandingWidthMm: number;
  brandingHeightMm: number;
  maxPhysicalWidthMm: number;
  maxPhysicalHeightMm: number;
  brandingMethod?: string;
  compact?: boolean;
  interactive?: boolean;
  onUpdatePlacement?: (
    placement: string,
    widthMm: number,
    heightMm: number,
    method?: string,
    posX?: number,
    posY?: number
  ) => void;
  onChange?: (state: BrandingInteractiveState) => void;
}

// Preset product mockup templates with high quality textures
export const MOCKUP_PRODUCT_PRESETS = [
  {
    id: 'apparel_flatlay',
    name: 'Apparel Flat Lay (Sweater / Beanie)',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
    defaultMethod: 'Screen Printing / Heat Transfer',
    defaultPlacement: 'Left Chest (Pocket Area)',
    defaultX: 38,
    defaultY: 48,
    maxWidthMm: 300,
    maxHeightMm: 400,
  },
  {
    id: 'hoodie_tshirt',
    name: 'Urban Hoodie / T-Shirt Front',
    category: 'Apparel & Embroidery',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
    defaultMethod: '3D Puff Embroidery / Threadwork',
    defaultPlacement: 'Center Chest (Full Front)',
    defaultX: 50,
    defaultY: 42,
    maxWidthMm: 280,
    maxHeightMm: 350,
  },
  {
    id: 'signboard_acm',
    name: 'Architectural Signboard & Wall Plaque',
    category: 'Signage & Display',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80',
    defaultMethod: 'Signage & Standoff Plaque',
    defaultPlacement: 'Center Signboard Face',
    defaultX: 50,
    defaultY: 50,
    maxWidthMm: 1200,
    maxHeightMm: 800,
  },
  {
    id: 'hardcover_folder',
    name: 'Executive Notebook & Deluxe Folder',
    category: 'Stationery & Packaging',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80',
    defaultMethod: 'Hot Stamped Gold Foil / Deboss',
    defaultPlacement: 'Front Cover Center',
    defaultX: 52,
    defaultY: 45,
    maxWidthMm: 150,
    maxHeightMm: 200,
  },
  {
    id: 'tote_bag',
    name: 'Canvas Carrier Tote Bag',
    category: 'Promotional',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=80',
    defaultMethod: 'DTF Printing / Screenprint',
    defaultPlacement: 'Center Face',
    defaultX: 50,
    defaultY: 52,
    maxWidthMm: 250,
    maxHeightMm: 300,
  },
  {
    id: 'beanie_cap',
    name: 'Heavyweight Cap / Beanie Brim',
    category: 'Headwear',
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=900&q=80',
    defaultMethod: 'Embroidered Patch / Badge',
    defaultPlacement: 'Cap Front Panel',
    defaultX: 50,
    defaultY: 58,
    maxWidthMm: 120,
    maxHeightMm: 60,
  },
];

// Preset techniques with distinctive visual styling
export const BRANDING_TECHNIQUES = [
  {
    id: 'screen_print',
    name: 'Screen Printing',
    category: 'Printing',
    badge: '3-COLOR SCREEN PRINTING',
    icon: '🖨️',
    description: 'High-pigment screen ink with sharp edge definition',
    styleClass: 'screenprint-finish',
  },
  {
    id: 'dtf_print',
    name: 'DTF / Digital Print',
    category: 'Printing',
    badge: 'DTF HI-STRETCH PRINT',
    icon: '🎨',
    description: 'Full color CMYK + White underbase stretch film',
    styleClass: 'dtf-finish',
  },
  {
    id: 'embroidery_3d',
    name: '3D Puff Embroidery',
    category: 'Embroidery',
    badge: '3D PUFF EMBROIDERY',
    icon: '🪡',
    description: 'Raised high-density satin thread with textured stitching',
    styleClass: 'embroidery-finish',
  },
  {
    id: 'acrylic_sign',
    name: 'Signage & Standoff Plaque',
    category: 'Signage',
    badge: 'DIMENSIONAL ACRYLIC SIGN',
    icon: '🪧',
    description: 'Cast acrylic with polished beveled edge and chrome standoffs',
    styleClass: 'signage-finish',
  },
  {
    id: 'vinyl_decal',
    name: 'Vinyl Cut-Out / Decal',
    category: 'Signage',
    badge: 'PLOTTER CUT VINYL',
    icon: '✂️',
    description: 'Precision contour-cut polymeric vinyl transfer decal',
    styleClass: 'vinyl-finish',
  },
  {
    id: 'gold_foil',
    name: 'Hot Stamped Foil',
    category: 'Specialty',
    badge: 'METALLIC GOLD FOIL',
    icon: '✨',
    description: 'Reflective mirror gold leaf with luxury metallic gleam',
    styleClass: 'foil-finish',
  },
  {
    id: 'laser_engrave',
    name: 'Laser Cutting & Engraving',
    category: 'Fabrication',
    badge: 'PRECISION LASER ENGRAVED',
    icon: '⚡',
    description: 'Recessed burnt-edge relief with tactile wood/metal depth',
    styleClass: 'laser-finish',
  },
  {
    id: 'uv_spot',
    name: 'LED UV / Spot Gloss',
    category: 'Specialty',
    badge: 'RAISED SPOT UV VARNISH',
    icon: '💎',
    description: 'Direct UV flatbed with glossy tactile high-build texture',
    styleClass: 'uv-finish',
  },
];

// Preset placement positions for fast 1-click positioning
export const PLACEMENT_PRESETS = [
  { name: 'Left Chest (Pocket Area)', x: 34, y: 46, desc: 'Apparel Pocket' },
  { name: 'Center Chest (Full Front)', x: 50, y: 44, desc: 'Front Center' },
  { name: 'Upper Back (Yoke / Neck)', x: 50, y: 24, desc: 'Rear Top' },
  { name: 'Right Sleeve (Bicep)', x: 74, y: 45, desc: 'Sleeve Accent' },
  { name: 'Center Signboard Face', x: 50, y: 50, desc: 'Sign Face' },
  { name: 'Front Cover Center', x: 50, y: 46, desc: 'Cover Center' },
  { name: 'Bottom Right Corner', x: 70, y: 72, desc: 'Corner Stamp' },
  { name: 'Cap Front Panel', x: 50, y: 55, desc: 'Headwear Brim' },
];

// Color Swatches
export const COLOR_SWATCHES = [
  { name: 'Gold Foil / Amber', value: '#fbbf24', text: '#000000' },
  { name: 'Crisp White', value: '#ffffff', text: '#000000' },
  { name: 'Carbon Black', value: '#18181b', text: '#ffffff' },
  { name: 'Vibrant Orange', value: '#f97316', text: '#000000' },
  { name: 'Crimson Red', value: '#ef4444', text: '#ffffff' },
  { name: 'Royal Blue', value: '#3b82f6', text: '#ffffff' },
  { name: 'Neon Emerald', value: '#10b981', text: '#000000' },
  { name: 'Silver Chrome', value: '#e2e8f0', text: '#000000' },
  { name: 'Luxury Purple', value: '#a855f7', text: '#ffffff' },
];

export const BrandingPreviewCanvas: React.FC<BrandingPreviewCanvasProps> = ({
  productName,
  imageUrl,
  brandingPlacement = 'Left Chest (Pocket Area)',
  brandingWidthMm,
  brandingHeightMm,
  maxPhysicalWidthMm = 300,
  maxPhysicalHeightMm = 400,
  brandingMethod = '3-Color Screen Printing',
  compact = false,
  interactive = true,
  onUpdatePlacement,
  onChange,
}) => {
  // Parse initial coordinates based on placement name
  const computeInitialCoordinates = (placementStr: string): { x: number; y: number } => {
    const p = placementStr.toLowerCase();
    if (p.includes('left chest') || p.includes('pocket area')) return { x: 36, y: 48 };
    if (p.includes('center chest') || p.includes('full front')) return { x: 50, y: 45 };
    if (p.includes('upper back') || p.includes('yoke') || p.includes('neck')) return { x: 50, y: 22 };
    if (p.includes('sleeve') || p.includes('bicep')) return { x: 74, y: 45 };
    if (p.includes('bottom right') || p.includes('corner')) return { x: 70, y: 72 };
    if (p.includes('spine') || p.includes('edge')) return { x: 20, y: 50 };
    if (p.includes('top header') || p.includes('brim') || p.includes('hood') || p.includes('cap')) return { x: 50, y: 52 };
    if (p.includes('sign') || p.includes('correx') || p.includes('plaque')) return { x: 50, y: 50 };
    return { x: 50, y: 50 };
  };

  const initialCoords = computeInitialCoordinates(brandingPlacement);

  // Core Interactive States
  const [posX, setPosX] = useState<number>(initialCoords.x);
  const [posY, setPosY] = useState<number>(initialCoords.y);
  const [widthMm, setWidthMm] = useState<number>(brandingWidthMm || 100);
  const [heightMm, setHeightMm] = useState<number>(brandingHeightMm || 100);
  const [rotation, setRotation] = useState<number>(0);
  const [aspectLocked, setAspectLocked] = useState<boolean>(true);
  const [activePlacementName, setActivePlacementName] = useState<string>(brandingPlacement);
  const [activeTechnique, setActiveTechnique] = useState<string>(brandingMethod);
  const [graphicType, setGraphicType] = useState<'logo' | 'text' | 'crest' | 'sign' | 'patch'>('logo');
  const [customText, setCustomText] = useState<string>('BRANDFLOW');
  const [customSubtext, setCustomSubtext] = useState<string>('STUDIO DESIGN');
  const [primaryColor, setPrimaryColor] = useState<string>('#fbbf24');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showPressLimit, setShowPressLimit] = useState<boolean>(true);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [currentMockupUrl, setCurrentMockupUrl] = useState<string>(
    imageUrl || MOCKUP_PRODUCT_PRESETS[0].imageUrl
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState<boolean>(false);
  const [canvasModalMethod, setCanvasModalMethod] = useState<string>(activeTechnique);

  // Dragging & Resizing Refs
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Sync props when changed externally
  useEffect(() => {
    if (brandingWidthMm && brandingWidthMm !== widthMm) setWidthMm(brandingWidthMm);
    if (brandingHeightMm && brandingHeightMm !== heightMm) setHeightMm(brandingHeightMm);
    if (brandingPlacement && brandingPlacement !== activePlacementName) {
      setActivePlacementName(brandingPlacement);
      const c = computeInitialCoordinates(brandingPlacement);
      setPosX(c.x);
      setPosY(c.y);
    }
    if (brandingMethod && brandingMethod !== activeTechnique) {
      setActiveTechnique(brandingMethod);
    }
    if (imageUrl && imageUrl !== currentMockupUrl) {
      setCurrentMockupUrl(imageUrl);
    }
  }, [brandingWidthMm, brandingHeightMm, brandingPlacement, brandingMethod, imageUrl]);

  // Machine physical limit validation
  const effectiveMaxWidth = maxPhysicalWidthMm || 300;
  const effectiveMaxHeight = maxPhysicalHeightMm || 400;
  const isWidthExceeded = widthMm > effectiveMaxWidth;
  const isHeightExceeded = heightMm > effectiveMaxHeight;
  const isExceeded = isWidthExceeded || isHeightExceeded;

  // Inform parent of updates
  const notifyParent = useCallback(
    (newPlacement: string, newW: number, newH: number, newMethod: string, newX: number, newY: number) => {
      if (onUpdatePlacement) {
        onUpdatePlacement(newPlacement, newW, newH, newMethod, newX, newY);
      }
      if (onChange) {
        onChange({
          posX: newX,
          posY: newY,
          widthMm: newW,
          heightMm: newH,
          rotation,
          placementName: newPlacement,
          technique: newMethod,
          graphicType,
          customText,
          primaryColor,
          secondaryColor: '#ffffff',
          showGrid,
          showPressLimit,
        });
      }
    },
    [onUpdatePlacement, onChange, rotation, graphicType, customText, primaryColor, showGrid, showPressLimit]
  );

  // Direct Drag Handler on Physical Stage
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!stageRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const stageRect = stageRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: posX,
      startY: posY,
    });
  };

  // Stage click to place anywhere
  const handleStageClick = (e: React.MouseEvent) => {
    if (isDragging || isResizing || !stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const clickXPercent = Math.round(((e.clientX - stageRect.left) / stageRect.width) * 100);
    const clickYPercent = Math.round(((e.clientY - stageRect.top) / stageRect.height) * 100);

    const clampedX = Math.max(10, Math.min(90, clickXPercent));
    const clampedY = Math.max(10, Math.min(90, clickYPercent));

    setPosX(clampedX);
    setPosY(clampedY);
    setActivePlacementName(`Custom Placement (${clampedX}%, ${clampedY}%)`);
    notifyParent(`Custom Placement (${clampedX}%, ${clampedY}%)`, widthMm, heightMm, activeTechnique, clampedX, clampedY);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !stageRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();

      const deltaXPercent = ((e.clientX - dragStartPos.mouseX) / stageRect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartPos.mouseY) / stageRect.height) * 100;

      const newX = Math.round(Math.max(10, Math.min(90, dragStartPos.startX + deltaXPercent)));
      const newY = Math.round(Math.max(10, Math.min(90, dragStartPos.startY + deltaYPercent)));

      setPosX(newX);
      setPosY(newY);
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setActivePlacementName(`Custom Placement (${posX}%, ${posY}%)`);
        notifyParent(`Custom Placement (${posX}%, ${posY}%)`, widthMm, heightMm, activeTechnique, posX, posY);
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragStartPos, posX, posY, widthMm, heightMm, activeTechnique, notifyParent]);

  // One-click Preset Zone Selection
  const applyPresetPlacement = (preset: (typeof PLACEMENT_PRESETS)[0]) => {
    setPosX(preset.x);
    setPosY(preset.y);
    setActivePlacementName(preset.name);
    notifyParent(preset.name, widthMm, heightMm, activeTechnique, preset.x, preset.y);
  };

  // Switch technique
  const applyTechnique = (tech: (typeof BRANDING_TECHNIQUES)[0]) => {
    setActiveTechnique(tech.badge);
    notifyParent(activePlacementName, widthMm, heightMm, tech.badge, posX, posY);
  };

  // Dimensions change
  const handleWidthChange = (val: number) => {
    const newW = Math.max(10, val);
    setWidthMm(newW);
    if (aspectLocked) {
      const ratio = heightMm / (widthMm || 1);
      const newH = Math.round(newW * (ratio || 1));
      setHeightMm(newH);
      notifyParent(activePlacementName, newW, newH, activeTechnique, posX, posY);
    } else {
      notifyParent(activePlacementName, newW, heightMm, activeTechnique, posX, posY);
    }
  };

  const handleHeightChange = (val: number) => {
    const newH = Math.max(10, val);
    setHeightMm(newH);
    if (aspectLocked) {
      const ratio = widthMm / (heightMm || 1);
      const newW = Math.round(newH * (ratio || 1));
      setWidthMm(newW);
      notifyParent(activePlacementName, newW, newH, activeTechnique, posX, posY);
    } else {
      notifyParent(activePlacementName, widthMm, newH, activeTechnique, posX, posY);
    }
  };

  // Alignment Helpers
  const alignCenterHorizontal = () => {
    setPosX(50);
    notifyParent(activePlacementName, widthMm, heightMm, activeTechnique, 50, posY);
  };

  const alignCenterVertical = () => {
    setPosY(50);
    notifyParent(activePlacementName, widthMm, heightMm, activeTechnique, posX, 50);
  };

  const rotate90 = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Switch Mockup Product Surface
  const switchProductPreset = (preset: (typeof MOCKUP_PRODUCT_PRESETS)[0], index: number) => {
    setActivePresetIndex(index);
    setCurrentMockupUrl(preset.imageUrl);
    setPosX(preset.defaultX);
    setPosY(preset.defaultY);
    setActivePlacementName(preset.defaultPlacement);
    if (preset.defaultMethod) setActiveTechnique(preset.defaultMethod);
    notifyParent(preset.defaultPlacement, widthMm, heightMm, preset.defaultMethod || activeTechnique, preset.defaultX, preset.defaultY);
  };

  // Calculate visual scale of the branding element on screen relative to mm
  // 100mm -> ~24% container size
  const visualScaleWidth = Math.max(14, Math.min(65, (widthMm / 350) * 32));
  const visualScaleHeight = Math.max(12, Math.min(65, (heightMm / 350) * 32));

  // Render the specific Branding Graphic Artwork on the Mockup Box
  const renderBrandingGraphic = () => {
    const isEmbroidery = activeTechnique.toLowerCase().includes('embroidery') || activeTechnique.toLowerCase().includes('thread');
    const isSignage = activeTechnique.toLowerCase().includes('sign') || activeTechnique.toLowerCase().includes('plaque') || activeTechnique.toLowerCase().includes('acrylic') || activeTechnique.toLowerCase().includes('correx');
    const isFoil = activeTechnique.toLowerCase().includes('foil') || activeTechnique.toLowerCase().includes('gold') || activeTechnique.toLowerCase().includes('metallic');
    const isLaser = activeTechnique.toLowerCase().includes('laser') || activeTechnique.toLowerCase().includes('engrav');
    const isVinyl = activeTechnique.toLowerCase().includes('vinyl') || activeTechnique.toLowerCase().includes('decal');

    if (graphicType === 'sign' || isSignage) {
      return (
        <div className="w-full h-full p-1.5 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-900/90 text-white rounded-sm border-2 border-slate-400 shadow-2xl backdrop-blur-sm">
          {/* 4 Standoff Chrome Bolts on Corners */}
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 to-white border border-slate-600 shadow-xs" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 to-white border border-slate-600 shadow-xs" />
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 to-white border border-slate-600 shadow-xs" />
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 to-white border border-slate-600 shadow-xs" />

          {/* Acrylic Bevel Highlights */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30 pointer-events-none" />

          <div
            className="font-black uppercase tracking-wider text-[11px] sm:text-xs leading-none drop-shadow-md"
            style={{ color: primaryColor }}
          >
            {customText || 'BRANDFLOW SIGN'}
          </div>
          <div className="text-[8px] font-mono text-slate-300 font-bold uppercase tracking-widest mt-0.5">
            {customSubtext || 'ARCHITECTURAL WAYFINDING'}
          </div>
        </div>
      );
    }

    if (graphicType === 'patch' || isEmbroidery) {
      return (
        <div
          className="w-full h-full p-1.5 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-full border-2 border-dashed shadow-xl"
          style={{
            borderColor: primaryColor,
            backgroundColor: '#18181b',
            backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        >
          {/* Embroidered Thread Texture simulation */}
          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-[9px] mb-0.5 border border-amber-400/50 shadow-inner">
            🪡
          </div>
          <div
            className="font-extrabold uppercase tracking-tight text-[10px] sm:text-[11px] leading-tight drop-shadow-sm font-sans"
            style={{ color: primaryColor, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            {customText || 'EMBROIDERED'}
          </div>
          <div className="text-[7px] font-bold text-amber-200 uppercase tracking-wider">
            3D PUFF STITCH
          </div>
        </div>
      );
    }

    if (graphicType === 'crest' || isFoil) {
      return (
        <div
          className="w-full h-full p-1.5 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-lg shadow-2xl border"
          style={{
            borderColor: primaryColor,
            background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(40,30,10,0.9))',
          }}
        >
          {/* Foil gleam shine */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none" />
          <div className="text-sm leading-none mb-0.5" style={{ color: primaryColor }}>
            ★ ★ ★
          </div>
          <div
            className="font-black uppercase tracking-widest text-[11px] sm:text-xs leading-none"
            style={{
              color: primaryColor,
              textShadow: '0 0 8px rgba(251,191,36,0.5)',
            }}
          >
            {customText || 'BRANDFLOW'}
          </div>
          <div className="text-[7px] font-serif italic text-amber-200/80 mt-0.5">
            EST. 2026 • PREMIUM PRINT
          </div>
        </div>
      );
    }

    if (graphicType === 'text') {
      return (
        <div className="w-full h-full p-1 flex flex-col items-center justify-center text-center">
          <span
            className="font-black uppercase tracking-wide text-xs sm:text-sm drop-shadow-lg leading-tight"
            style={{ color: primaryColor }}
          >
            {customText || 'CUSTOM TEXT'}
          </span>
          <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">
            {customSubtext || 'PRINT DIVISION'}
          </span>
        </div>
      );
    }

    // Default Logo Graphic (Screen Print / DTF / General)
    return (
      <div className="w-full h-full p-1 flex flex-col items-center justify-center text-center select-none">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shadow-md mb-0.5 border"
          style={{
            backgroundColor: '#09090b',
            color: primaryColor,
            borderColor: primaryColor,
          }}
        >
          LOGO
        </div>
        <div
          className="font-black uppercase tracking-wider text-[10px] sm:text-[11px] leading-tight drop-shadow-md"
          style={{ color: primaryColor }}
        >
          {customText || 'BRANDFLOW'}
        </div>
        <div className="text-[8px] font-mono font-bold text-zinc-950 bg-white/90 px-1 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
          {widthMm}mm × {heightMm}mm
        </div>
      </div>
    );
  };

  // Compact Mode for Line Items
  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-zinc-950/90 p-3 rounded-xl border border-zinc-800 shadow-md">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
          <img
            src={currentMockupUrl}
            alt={productName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div
            className={`absolute border-2 ${
              isExceeded ? 'border-rose-500 bg-rose-500/30' : 'border-amber-400 bg-amber-400/40'
            } rounded flex items-center justify-center shadow-md`}
            style={{
              top: `${posY}%`,
              left: `${posX}%`,
              width: `${visualScaleWidth}%`,
              height: `${visualScaleHeight}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="text-[7px] font-black text-zinc-950 bg-amber-300 px-0.5 rounded shadow-xs">
              {widthMm}×{heightMm}
            </span>
          </div>
        </div>

        <div className="text-xs space-y-1 flex-1 min-w-0">
          <div className="flex items-center space-x-1 text-zinc-100 font-extrabold truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{activePlacementName}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400">
            <Ruler className="w-3 h-3 text-zinc-500 shrink-0" />
            <span>
              Size: <strong className="font-mono text-amber-300">{widthMm}mm × {heightMm}mm</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] text-amber-400 font-bold uppercase">{activeTechnique}</span>
          </div>
          <div className="text-[10px]">
            {isExceeded ? (
              <span className="inline-flex items-center text-rose-300 font-bold bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">
                <ShieldAlert className="w-3 h-3 mr-1 text-rose-400" />
                Exceeds Max ({effectiveMaxWidth}×{effectiveMaxHeight}mm)
              </span>
            ) : (
              <span className="inline-flex items-center text-emerald-300 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                Fits Safe Machine Spec (Max {effectiveMaxWidth}×{effectiveMaxHeight}mm)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full Interactive Mockup Studio
  return (
    <div
      className={`mirror-card bg-zinc-900/95 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 font-sans ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto bg-zinc-950 border-amber-500/40' : ''
      }`}
    >
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap justify-between items-center pb-3 border-b border-zinc-800/90 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 rounded-xl border border-amber-500/30 shadow-inner">
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs sm:text-sm font-black text-zinc-100 tracking-tight">
                Physical Branding Mockup Studio
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Interactive Placement
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Drag branding element directly onto product • Live machine press bed validator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowGrid((g) => !g)}
            title="Toggle Alignment Grid & Press Centerlines"
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center space-x-1 cursor-pointer transition-all ${
              showGrid
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                : 'bg-zinc-800/90 text-zinc-300 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPressLimit((p) => !p)}
            title="Toggle Machine Max Press Bed Overlay"
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center space-x-1 cursor-pointer transition-all ${
              showPressLimit
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-800/90 text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Machine Bed</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Mockup Studio'}
            className="p-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg border border-zinc-700 cursor-pointer transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Product Backdrop Switcher Strip */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Physical Product Substrate</span>
          </span>
          <span className="text-zinc-500">6 Real Print/Embroidery/Sign Products</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {MOCKUP_PRODUCT_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => switchProductPreset(preset, idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-400 text-amber-200 ring-1 ring-amber-400/40'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <img
                src={preset.imageUrl}
                alt={preset.name}
                className="w-6 h-6 rounded-md object-cover border border-zinc-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-[11px] font-extrabold line-clamp-1">{preset.name}</div>
                <div className="text-[9px] text-zinc-500">{preset.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Physical Stage & Canvas */}
      <div className="relative group">
        <div
          ref={stageRef}
          onClick={handleStageClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-full h-72 sm:h-80 md:h-96 rounded-2xl bg-zinc-950 overflow-hidden select-none border-2 transition-colors ${
            isDragging ? 'cursor-grabbing border-amber-400' : 'cursor-crosshair border-zinc-800 hover:border-zinc-700'
          } shadow-2xl flex items-center justify-center`}
        >
          {/* Main Product Photography */}
          <img
            src={currentMockupUrl}
            alt={productName}
            className="w-full h-full object-cover pointer-events-none opacity-90 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Alignment Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-35"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(251, 191, 36, 0.25) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
            >
              {/* Press Centerlines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-400/60 -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-amber-400/60 -translate-y-1/2" />
            </div>
          )}

          {/* Machine Press Safe Bed Limit Overlay Box */}
          {showPressLimit && (
            <div
              className="absolute border-2 border-dashed border-cyan-400/40 bg-cyan-500/5 rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-inner"
              style={{
                top: '12%',
                left: '15%',
                width: '70%',
                height: '76%',
              }}
            >
              <div className="flex justify-between items-center text-[9px] font-mono font-bold text-cyan-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-cyan-500/30 self-start">
                <span>Machine Platen Area: {effectiveMaxWidth}mm × {effectiveMaxHeight}mm</span>
              </div>
              <div className="text-[8px] font-mono text-cyan-400/70 text-right">
                Standard Press Bed Safe Margin (3mm Bleed)
              </div>
            </div>
          )}

          {/* DRAGGABLE BRANDING ELEMENT OVERLAY */}
          <div
            onPointerDown={handlePointerDown}
            className={`absolute transition-shadow duration-150 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-2xl backdrop-blur-xs select-none ${
              isExceeded
                ? 'border-2 border-rose-500 bg-rose-500/25 ring-2 ring-rose-400/60'
                : 'border-2 border-amber-400 bg-amber-400/20 ring-2 ring-amber-300/60'
            } ${isDragging ? 'scale-105 shadow-amber-500/30' : 'hover:scale-[1.02]'}`}
            style={{
              top: `${posY}%`,
              left: `${posX}%`,
              width: `${visualScaleWidth}%`,
              height: `${visualScaleHeight}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 30,
            }}
          >
            {/* Real Technique Graphic Rendering */}
            {renderBrandingGraphic()}

            {/* Position Pin Floating Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950/95 text-amber-300 font-mono font-black text-[9px] px-2 py-0.5 rounded-full border border-amber-500/50 shadow-lg whitespace-nowrap pointer-events-none flex items-center space-x-1">
              <Move className="w-2.5 h-2.5 text-amber-400" />
              <span>
                X: {posX}% • Y: {posY}%
              </span>
            </div>

            {/* Rotation Indicator if rotated */}
            {rotation !== 0 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-zinc-200 font-mono text-[8px] px-1.5 py-0.5 rounded border border-zinc-700 shadow-md pointer-events-none">
                {rotation}°
              </div>
            )}

            {/* Corner Resize Guide Hints */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-amber-400 border border-zinc-950 shadow-xs pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-zinc-950 shadow-xs pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-amber-400 border border-zinc-950 shadow-xs pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-zinc-950 shadow-xs pointer-events-none" />
          </div>

          {/* Top-Right Badge: Machine & Placement Specs */}
          <div className="absolute top-3 right-3 bg-zinc-950/90 backdrop-blur-md text-zinc-100 text-[10px] font-mono px-3 py-1.5 rounded-xl border border-zinc-700/90 flex items-center space-x-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Bed Spec: <strong className="text-amber-300">{effectiveMaxWidth}×{effectiveMaxHeight}mm</strong>
            </span>
          </div>

          {/* Bottom-Left Badge: Interactive Hint */}
          <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur-md text-zinc-300 text-[10px] px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center space-x-1.5 shadow-xl pointer-events-none">
            <Move className="w-3 h-3 text-amber-400" />
            <span>Drag item or click anywhere to position</span>
          </div>
        </div>
      </div>

      {/* 4. Placement Presets & Quick Alignment Toolbar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset Placement Locations & Auto-Alignment</span>
          </span>
          <span className="text-amber-300 font-mono font-bold">
            Current: {activePlacementName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLACEMENT_PRESETS.map((preset, pIdx) => {
            const isSelected = activePlacementName === preset.name;
            return (
              <button
                key={pIdx}
                type="button"
                onClick={() => applyPresetPlacement(preset)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-md'
                    : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="font-extrabold truncate">{preset.name}</div>
                <div className="text-[9px] text-zinc-400 flex justify-between items-center mt-1">
                  <span>{preset.desc}</span>
                  <span className="font-mono text-[9px] text-amber-400/80">
                    {preset.x}%, {preset.y}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Alignment & Rotation Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            <button
              type="button"
              onClick={alignCenterHorizontal}
              className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
            >
              <span>Center Horizontally</span>
            </button>
            <button
              type="button"
              onClick={alignCenterVertical}
              className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
            >
              <span>Center Vertically</span>
            </button>
            <button
              type="button"
              onClick={rotate90}
              className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
            >
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>Rotate 90°</span>
            </button>
            {rotation !== 0 && (
              <button
                type="button"
                onClick={() => setRotation(0)}
                className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-[10px] cursor-pointer"
              >
                Reset Angle (0°)
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono text-zinc-400">
            Coordinates: <strong className="text-amber-300 font-bold">X: {posX}% • Y: {posY}%</strong>
          </div>
        </div>
      </div>

      {/* 5. Technique & Physical Branding Method Chooser */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Branding Production Technique</span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-mono font-extrabold">{activeTechnique}</span>
            <button
              type="button"
              onClick={() => {
                setCanvasModalMethod(activeTechnique);
                setIsCanvasModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
            >
              <Info className="w-3 h-3" />
              <span>Inspect Method Tips & Specs</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BRANDING_TECHNIQUES.map((tech) => {
            const isSelected =
              activeTechnique.toLowerCase().includes(tech.name.toLowerCase()) ||
              activeTechnique.toLowerCase().includes(tech.badge.toLowerCase());
            return (
              <div key={tech.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    applyTechnique(tech);
                    setCanvasModalMethod(tech.badge || tech.name);
                    setIsCanvasModalOpen(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-md'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-black">
                        <span>{tech.icon}</span>
                        <span className="truncate">{tech.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-400 line-clamp-1 mt-0.5">{tech.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono uppercase text-amber-400/80 font-bold mt-1.5">
                    <span>{tech.category}</span>
                    <span className="text-zinc-500 group-hover:text-amber-300">View Tips →</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Physical Dimensions & Artwork Content Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-zinc-800">
        {/* Dimensions & Scale Slider */}
        <div className="md:col-span-6 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-zinc-300 flex items-center space-x-1">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>Branding Dimensions (Millimeters)</span>
            </span>
            <button
              type="button"
              onClick={() => setAspectLocked((l) => !l)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center space-x-1 cursor-pointer ${
                aspectLocked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{aspectLocked ? 'Aspect 1:1 Locked' : 'Free Scale'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>Width:</span>
                <span className="font-mono font-bold text-amber-300">{widthMm} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max={effectiveMaxWidth * 1.2}
                value={widthMm}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 20)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>Height:</span>
                <span className="font-mono font-bold text-amber-300">{heightMm} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max={effectiveMaxHeight * 1.2}
                value={heightMm}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 20)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Exact MM Inputs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-bold">W (mm):</span>
              <input
                type="number"
                min="10"
                max="2500"
                value={widthMm}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
                className="w-full bg-transparent font-mono font-bold text-zinc-100 text-xs focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-bold">H (mm):</span>
              <input
                type="number"
                min="10"
                max="2500"
                value={heightMm}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
                className="w-full bg-transparent font-mono font-bold text-zinc-100 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Custom Artwork & Typography Content */}
        <div className="md:col-span-6 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center text-[11px] font-bold text-zinc-300">
            <span className="flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Artwork Content & Ink/Thread Color</span>
            </span>

            {/* Graphic Type Tabs */}
            <div className="flex space-x-1">
              {[
                { id: 'logo', label: 'Logo' },
                { id: 'sign', label: 'Sign' },
                { id: 'patch', label: 'Patch' },
                { id: 'crest', label: 'Crest' },
                { id: 'text', label: 'Text' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setGraphicType(t.id as any)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                    graphicType === t.id
                      ? 'bg-amber-500 text-zinc-950 font-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <input
              type="text"
              placeholder="Brand / Sign Text..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 text-xs font-bold focus:border-amber-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Subtext / Tagline..."
              value={customSubtext}
              onChange={(e) => setCustomSubtext(e.target.value)}
              className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Color Swatches */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-1">
            <span className="text-[10px] text-zinc-400 font-bold shrink-0">Color:</span>
            {COLOR_SWATCHES.map((sw, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrimaryColor(sw.value)}
                title={sw.name}
                className={`w-5 h-5 rounded-full border cursor-pointer shrink-0 transition-transform ${
                  primaryColor === sw.value
                    ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-950 scale-110 border-white'
                    : 'border-zinc-700 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: sw.value }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 7. Machine Spec Compliance Verification Status */}
      <div className="pt-1">
        {isExceeded ? (
          <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start space-x-2.5 shadow-md">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-rose-200">Physical Size Limit Exceeded!</div>
              <p className="text-[11px] text-rose-300 mt-0.5">
                Requested size ({widthMm}×{heightMm}mm) exceeds the machine press bed limit of ({effectiveMaxWidth}×{effectiveMaxHeight}mm). Please downscale dimensions or allocate oversized format machine tooling.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-200">Machine Press Area Verified Safe</span>
                <span className="text-[11px] text-emerald-300/90 ml-1.5">
                  ({widthMm}×{heightMm}mm fits safely within the {effectiveMaxWidth}×{effectiveMaxHeight}mm machine bed).
                </span>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-mono text-emerald-400/90 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              100% Press Ready
            </div>
          </div>
        )}
      </div>

      {/* Technique Inspection & Tips Modal */}
      <BrandingMethodDetailModal
        methodIdOrName={canvasModalMethod}
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
        onSelectMethod={(selectedMethod) => {
          setActiveTechnique(selectedMethod.name);
          setWidthMm(selectedMethod.defaultWidthMm);
          setHeightMm(selectedMethod.defaultHeightMm);
          setActivePlacementName(selectedMethod.defaultPlacement);
          notifyParent(
            selectedMethod.defaultPlacement,
            selectedMethod.defaultWidthMm,
            selectedMethod.defaultHeightMm,
            selectedMethod.name,
            posX,
            posY
          );
        }}
      />
    </div>
  );
};
