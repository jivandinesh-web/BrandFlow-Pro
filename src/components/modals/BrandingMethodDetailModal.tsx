import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Maximize2,
  Ruler,
  Layers,
  Palette,
  ShieldCheck,
  FileCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { BrandingMethodDetail, BRANDING_METHODS_DATA } from '../../data/brandingMethodsData';

interface BrandingMethodDetailModalProps {
  methodIdOrName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod?: (method: BrandingMethodDetail) => void;
}

export const BrandingMethodDetailModal: React.FC<BrandingMethodDetailModalProps> = ({
  methodIdOrName,
  isOpen,
  onClose,
  onSelectMethod,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tips' | 'specs' | 'gallery'>('overview');

  if (!isOpen) return null;

  // Find the branding method matching by ID or Name (case-insensitive substring)
  const currentMethod =
    BRANDING_METHODS_DATA.find(
      (m) =>
        m.id === methodIdOrName ||
        m.name.toLowerCase() === methodIdOrName.toLowerCase() ||
        methodIdOrName.toLowerCase().includes(m.id.toLowerCase()) ||
        m.name.toLowerCase().includes(methodIdOrName.toLowerCase()) ||
        methodIdOrName.toLowerCase().includes(m.name.toLowerCase())
    ) || BRANDING_METHODS_DATA[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col font-sans text-zinc-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Method Branding Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {currentMethod.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentMethod.visualBadge || currentMethod.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 font-bold">
                  {currentMethod.group}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-100 mt-1 flex items-center gap-2">
                <span>{currentMethod.name}</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700/60"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 px-5 pt-3 border-b border-zinc-800 bg-zinc-950/60 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview & Visual', icon: Sparkles },
            { id: 'tips', label: 'Application Tips & Best Practices', icon: Lightbulb },
            { id: 'specs', label: 'Machine Specs & File Prep', icon: Ruler },
            { id: 'gallery', label: 'All Branding Techniques', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 cursor-pointer transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW & VISUAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Showcase Card with Mockup & Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 relative rounded-xl overflow-hidden border border-zinc-700 shadow-xl bg-zinc-950 group aspect-4/3 flex items-center justify-center">
                  <img
                    src={currentMethod.imageUrl}
                    alt={currentMethod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-zinc-950/90 text-amber-300 font-mono font-black px-2.5 py-1 rounded-lg border border-amber-400/40 shadow-md">
                      Est. Unit: R{currentMethod.defaultUnitPrice.toFixed(2)}
                    </span>
                    <span className="bg-zinc-950/90 text-zinc-200 text-[10px] font-bold px-2 py-1 rounded-lg border border-zinc-700">
                      Standard Platen: {currentMethod.defaultWidthMm}×{currentMethod.defaultHeightMm}mm
                    </span>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-3.5">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-1">
                    <span className="font-extrabold text-amber-300 uppercase tracking-wide text-[10px] flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      <span>Technique Summary</span>
                    </span>
                    <p className="font-medium">{currentMethod.shortDescription}</p>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {currentMethod.fullDescription}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Best Suited Applications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentMethod.bestSuitedFor.map((app, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3 text-amber-400" />
                          <span>{app}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Durability & Wash Fastness</span>
                  </div>
                  <div className="font-bold text-zinc-100 text-xs">
                    {currentMethod.durabilityRating}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Color Profile & Inks</span>
                  </div>
                  <div className="font-bold text-amber-300 text-xs">
                    {currentMethod.defaultColor}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Max Machine Physical Limits</span>
                  </div>
                  <div className="font-mono font-bold text-cyan-300 text-xs">
                    Up to {currentMethod.maxPhysicalWidthMm}mm × {currentMethod.maxPhysicalHeightMm}mm
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATION TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Production Guidance & Operator Application Tips</span>
              </div>

              <div className="space-y-2.5">
                {currentMethod.applicationTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-start space-x-3 text-xs text-zinc-200 leading-relaxed shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{tip}</span>
                  </div>
                ))}
              </div>

              {/* Pre-Press File Prep */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 mt-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-zinc-100">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pre-Press File Preparation Requirement:</span>
                </div>
                <p className="text-xs text-zinc-300 font-mono bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                  {currentMethod.filePreparationGuide}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MACHINE SPECS & FILE PREP */}
          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-zinc-800 pb-1.5 flex items-center space-x-1.5">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Physical Dimensions & Limits</span>
                  </h4>
                  <div className="space-y-2 text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Default Width:</span>
                      <strong className="font-mono text-zinc-100">{currentMethod.defaultWidthMm} mm</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Default Height:</span>
                      <strong className="font-mono text-zinc-100">{currentMethod.defaultHeightMm} mm</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Max Machine Bed Width:</span>
                      <strong className="font-mono text-amber-300">{currentMethod.maxPhysicalWidthMm} mm</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Max Machine Bed Height:</span>
                      <strong className="font-mono text-amber-300">{currentMethod.maxPhysicalHeightMm} mm</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-zinc-800 pb-1.5 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Substrate & Chemistry Specs</span>
                  </h4>
                  <div className="space-y-2 text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Default Stock / Film:</span>
                      <strong className="text-zinc-100 text-right">{currentMethod.defaultStock}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Color System:</span>
                      <strong className="text-zinc-100 text-right">{currentMethod.defaultColor}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Standard Finishes:</span>
                      <strong className="text-zinc-100 text-right">{currentMethod.defaultFinishes.join(', ')}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Placements */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Standard Factory Placement Positions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentMethod.placements.map((loc, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALL BRANDING TECHNIQUES GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Click any technique below to inspect its detailed specifications, sample imagery, and application guidelines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {BRANDING_METHODS_DATA.map((method) => {
                  const isSelected = method.id === currentMethod.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        if (onSelectMethod) onSelectMethod(method);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-md'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight line-clamp-1">{method.name}</div>
                          <div className="text-[10px] text-zinc-500">{method.group}</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {method.shortDescription}
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-amber-400/90 pt-1 border-t border-zinc-800/80">
                        <span>R{method.defaultUnitPrice.toFixed(2)}/ea</span>
                        <span className="text-zinc-500">{method.defaultWidthMm}×{method.defaultHeightMm}mm</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs text-zinc-400">
            Selected: <strong className="text-amber-300">{currentMethod.name}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
            {onSelectMethod && (
              <button
                type="button"
                onClick={() => {
                  onSelectMethod(currentMethod);
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black rounded-lg shadow-md shadow-amber-500/20 cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4 text-zinc-950" />
                <span>Apply This Technique</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
