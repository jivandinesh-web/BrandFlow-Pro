import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle2,
  User,
  FileText,
  ArrowRight,
  Layers,
  MessageSquare,
  Eye,
  Sparkles,
  Palette,
  Info,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { Job, UserRole } from '../../types';
import { BrandingPreviewCanvas } from '../BrandingPreviewCanvas';
import { BrandingMethodDetailModal } from '../modals/BrandingMethodDetailModal';
import { BRANDING_METHODS_DATA, BrandingMethodDetail } from '../../data/brandingMethodsData';

interface DesignModuleProps {
  job: Job;
  currentRole: UserRole;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const DesignModule: React.FC<DesignModuleProps> = ({
  job,
  currentRole,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [designerNotes, setDesignerNotes] = useState(
    'Applied 3D foil layer on top of soft touch lamination. Verified die line cut tolerance.'
  );

  const quoteItem = job.quote?.items?.[0];
  const defaultPlacement = quoteItem?.brandingPlacement || 'Left Chest (Pocket Area)';
  const defaultW = quoteItem?.brandingWidthMm || 100;
  const defaultH = quoteItem?.brandingHeightMm || 100;
  const defaultMethod = quoteItem?.brandingMethod || '3-Color Screen Printing';
  const defaultImg = quoteItem?.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80';

  // Branding Method Active State in Design Module
  const [selectedMethodName, setSelectedMethodName] = useState<string>(defaultMethod);
  const [activePlacement, setActivePlacement] = useState<string>(defaultPlacement);
  const [activeWidthMm, setActiveWidthMm] = useState<number>(defaultW);
  const [activeHeightMm, setActiveHeightMm] = useState<number>(defaultH);
  const [activeMockupImg, setActiveMockupImg] = useState<string>(defaultImg);

  // Modal State for Visual Technique Guide & Application Tips
  const [isMethodModalOpen, setIsMethodModalOpen] = useState<boolean>(false);
  const [methodForModal, setMethodForModal] = useState<string>(defaultMethod);

  // Find active detail object
  const activeMethodObj =
    BRANDING_METHODS_DATA.find(
      (m) =>
        m.name.toLowerCase() === selectedMethodName.toLowerCase() ||
        selectedMethodName.toLowerCase().includes(m.id.toLowerCase()) ||
        m.name.toLowerCase().includes(selectedMethodName.toLowerCase()) ||
        selectedMethodName.toLowerCase().includes(m.name.toLowerCase())
    ) || BRANDING_METHODS_DATA[0];

  const handleSelectMethodFromDropdown = (methodNameOrId: string) => {
    if (!methodNameOrId) return;
    const matched = BRANDING_METHODS_DATA.find(
      (m) => m.id === methodNameOrId || m.name === methodNameOrId
    );

    if (matched) {
      setSelectedMethodName(matched.name);
      setActiveWidthMm(matched.defaultWidthMm);
      setActiveHeightMm(matched.defaultHeightMm);
      setActivePlacement(matched.defaultPlacement);
      if (matched.imageUrl) setActiveMockupImg(matched.imageUrl);

      // Open detail modal to visually showcase the selected method, its short description & application tips
      setMethodForModal(matched.id);
      setIsOpenModal(true);

      onSaveNotification(`Selected Branding Method: "${matched.name}". Visual specs & application guide loaded.`);
    } else {
      setSelectedMethodName(methodNameOrId);
      setMethodForModal(methodNameOrId);
      setIsOpenModal(true);
    }
  };

  const setIsOpenModal = (open: boolean) => {
    setIsMethodModalOpen(open);
  };

  const handleApplyMethodFromModal = (method: BrandingMethodDetail) => {
    setSelectedMethodName(method.name);
    setActiveWidthMm(method.defaultWidthMm);
    setActiveHeightMm(method.defaultHeightMm);
    setActivePlacement(method.defaultPlacement);
    if (method.imageUrl) setActiveMockupImg(method.imageUrl);
    onSaveNotification(`Applied "${method.name}" technique to design stage!`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Banner */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>Design Workstation - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
        </div>

        <button
          onClick={() => onNavigate('PdfProofApproval')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Generate & Open PDF Proof Studio</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      {/* Interactive Branding Method Quick Selection Bar */}
      <div className="mirror-card bg-zinc-900/90 rounded-2xl border border-zinc-800/90 p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-black text-zinc-100">
                  Production Branding Method
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Visual Guide Active
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Select a technique below to view visual samples, short descriptions, and operator application tips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMethodForModal(selectedMethodName);
              setIsOpenModal(true);
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-amber-500/30 cursor-pointer transition-all shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Technique Visual Guide & Tips</span>
          </button>
        </div>

        {/* Dropdown Control with Categorized Branding Methods */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Select Branding Method (Triggers Visual Modal & Guidelines):</span>
              <span className="text-[10px] text-amber-400 font-mono">Current: {selectedMethodName}</span>
            </label>
            <select
              value={selectedMethodName}
              onChange={(e) => handleSelectMethodFromDropdown(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-xl font-bold text-zinc-100 text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none cursor-pointer"
            >
              <optgroup label="🔥 Apparel & Fabric Transfers" className="bg-zinc-900 text-zinc-200">
                <option value="dtf_printing">🎨 DTF (Direct To Film Transfers) — Full Color Hi-Stretch</option>
                <option value="silk_screen_printing">🖨️ Silk Screening / Screen Printing — Industrial Bulk</option>
                <option value="heat_press_vinyl">🔥 Heat Press Vinyl & Thermal Transfer (PU / Flock / Reflective)</option>
                <option value="sublimation_textile">🎽 Dye Sublimation & Roll-to-Roll Textile Printing</option>
              </optgroup>
              <optgroup label="🪡 Threadwork & Needlework" className="bg-zinc-900 text-zinc-200">
                <option value="embroidery_flat">🪡 Embroidery (Flat Stitch & Badges) — Multi-Needle Thread</option>
                <option value="embroidery_3d_puff">🧵 3D Puff Embroidery (Raised High-Density Foam Core)</option>
              </optgroup>
              <optgroup label="✨ Specialty Dies & Luxury Finishes" className="bg-zinc-900 text-zinc-200">
                <option value="hot_foil_stamping">✨ Hot Stamped Foiling (Gold, Silver, Metallic)</option>
                <option value="embossing">🏷️ Embossing (Raised 3D Blind / Foil Relief)</option>
                <option value="debossing">🔲 Debossing (Recessed Stamped Imprint)</option>
              </optgroup>
              <optgroup label="💎 Direct Industrial & Signage" className="bg-zinc-900 text-zinc-200">
                <option value="uv_flatbed_printing">💎 LED UV Full Colour Printing (Direct Flatbed + 3D Gloss)</option>
                <option value="laser_engraving">⚡ Laser Cutting & Engraving (Wood, Acrylic, Metal)</option>
                <option value="signage_acrylic_plaque">🪧 Signage & Standoff Wall Plaques (ACM / Cast Acrylic)</option>
                <option value="vinyl_plotter_decals">✂️ Vinyl Cut-Out Decals & Vehicle Graphics</option>
              </optgroup>
              <optgroup label="🖊️ Promotional & Commercial Print" className="bg-zinc-900 text-zinc-200">
                <option value="pad_printing">🖊️ Pad Printing (Tampo Print for Drinkware & Pens)</option>
                <option value="commercial_offset_print">📄 Commercial Digital & Offset Litho Printing</option>
              </optgroup>
            </select>
          </div>

          <div className="md:col-span-4">
            <button
              type="button"
              onClick={() => {
                setMethodForModal(selectedMethodName);
                setIsOpenModal(true);
              }}
              className="w-full p-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 rounded-xl border border-amber-500/40 text-xs font-black flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-md group"
            >
              <Eye className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Inspect {activeMethodObj.name.split(' ')[0]} Visual & Tips</span>
            </button>
          </div>
        </div>

        {/* Quick Technique Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/80">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase mr-1">Quick Select & Learn:</span>
          {[
            { id: 'dtf_printing', label: '🎨 DTF' },
            { id: 'embossing', label: '🏷️ Embossing' },
            { id: 'embroidery_3d_puff', label: '🧵 3D Puff' },
            { id: 'embroidery_flat', label: '🪡 Embroidery' },
            { id: 'hot_foil_stamping', label: '✨ Foiling' },
            { id: 'debossing', label: '🔲 Debossing' },
            { id: 'silk_screen_printing', label: '🖨️ Silk Screen' },
            { id: 'uv_flatbed_printing', label: '💎 UV Flatbed' },
            { id: 'laser_engraving', label: '⚡ Laser' },
            { id: 'signage_acrylic_plaque', label: '🪧 Signage' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleSelectMethodFromDropdown(pill.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                selectedMethodName.toLowerCase().includes(pill.id.toLowerCase()) ||
                activeMethodObj.id === pill.id
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-sm'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-amber-500/50 hover:text-amber-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Physical Branding Mockup Studio */}
      <BrandingPreviewCanvas
        productName={job.projectName}
        imageUrl={activeMockupImg}
        brandingPlacement={activePlacement}
        brandingWidthMm={activeWidthMm}
        brandingHeightMm={activeHeightMm}
        maxPhysicalWidthMm={activeMethodObj.maxPhysicalWidthMm || 300}
        maxPhysicalHeightMm={activeMethodObj.maxPhysicalHeightMm || 400}
        brandingMethod={selectedMethodName}
        interactive={true}
        onUpdatePlacement={(newPlacement, newW, newH, newMethod) => {
          setActivePlacement(newPlacement);
          setActiveWidthMm(newW);
          setActiveHeightMm(newH);
          if (newMethod) setSelectedMethodName(newMethod);
          onSaveNotification(
            `Branding placement updated to "${newPlacement}" (${newW}×${newH}mm - ${newMethod || selectedMethodName})`
          );
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Designer Control Panel */}
        <div className="lg:col-span-7 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
            <span>Design Department Assignment & File Specs</span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">
              Technique: {activeMethodObj.name}
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Assigned Lead Designer</span>
              <span className="font-bold text-amber-400 mt-1 block">{job.assignedDesigner}</span>
            </div>
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Active Technique</span>
              <button
                type="button"
                onClick={() => {
                  setMethodForModal(selectedMethodName);
                  setIsOpenModal(true);
                }}
                className="font-bold text-amber-300 hover:text-amber-200 mt-1 flex items-center space-x-1 cursor-pointer"
              >
                <span>{activeMethodObj.icon} {activeMethodObj.name}</span>
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Pre-Press Designer Work Notes</label>
            <textarea
              rows={4}
              value={designerNotes}
              onChange={(e) => setDesignerNotes(e.target.value)}
              disabled={!isEditing && currentRole !== 'Admin' && currentRole !== 'Designer'}
              className="w-full p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSaveNotification('Designer notes and prepress changes saved.')}
              className="px-4 py-2 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all"
            >
              Save Design Specs
            </button>
            <button
              onClick={() => {
                setMethodForModal(selectedMethodName);
                setIsOpenModal(true);
              }}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>View Operator Application Tips</span>
            </button>
          </div>
        </div>

        {/* Artwork Version Stack */}
        <div className="lg:col-span-5 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Artwork Version History
          </h3>

          <div className="space-y-3">
            {job.artworkVersions.map((art, idx) => (
              <div key={idx} className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-100">{art.version}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{art.uploadedAt}</span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono">{art.fileName}</div>
                <div className="text-[11px] text-zinc-400">Uploaded by: {art.uploadedBy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Branding Method Showcase & Application Tips Modal */}
      <BrandingMethodDetailModal
        methodIdOrName={methodForModal}
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        onSelectMethod={handleApplyMethodFromModal}
      />
    </div>
  );
};

