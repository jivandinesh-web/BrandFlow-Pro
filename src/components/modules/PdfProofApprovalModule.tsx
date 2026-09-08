import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  PenTool,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MapPin,
  ShieldCheck,
  Download,
  Printer,
  Trash2,
  Check,
  Lock,
} from 'lucide-react';
import { AnnotationPin, Job, UserRole } from '../../types';

interface PdfProofApprovalModuleProps {
  job: Job;
  currentRole: UserRole;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const PdfProofApprovalModule: React.FC<PdfProofApprovalModuleProps> = ({
  job,
  currentRole,
  onSaveNotification,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [annotations, setAnnotations] = useState<AnnotationPin[]>(
    job.proofApproval?.annotations || [
      {
        id: 'PIN-1',
        x: 35,
        y: 42,
        author: 'Alex Rivera',
        role: 'Designer',
        text: '3mm bleed margin verified.',
        date: '2026-07-20 15:10',
        resolved: true,
      },
    ]
  );
  const [newPinText, setNewPinText] = useState('');
  const [selectedPinPos, setSelectedPinPos] = useState<{ x: number; y: number } | null>(null);
  const [isSignedAndApproved, setIsSignedAndApproved] = useState(
    job.proofApproval?.status === 'Signed & Approved'
  );

  // Canvas digital signature drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [approverName, setApproverName] = useState(job.customerName);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0a84ff'; // Apple system blue signature ink
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleArtworkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setSelectedPinPos({ x, y });
  };

  const handleAddAnnotation = () => {
    if (!selectedPinPos || !newPinText.trim()) return;
    const pin: AnnotationPin = {
      id: `PIN-${Date.now()}`,
      x: selectedPinPos.x,
      y: selectedPinPos.y,
      author: approverName || 'User',
      role: currentRole,
      text: newPinText,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      resolved: false,
    };
    setAnnotations([...annotations, pin]);
    setNewPinText('');
    setSelectedPinPos(null);
    onSaveNotification('Proof comment pin added to artwork position.');
  };

  const handleApproveProof = () => {
    if (!hasSignature) {
      onSaveNotification('Please provide your digital signature on the pad before approving!');
      return;
    }
    setIsSignedAndApproved(true);
    onSaveNotification(
      `PDF Proof digitally signed and approved by ${approverName}! Moved to Production Queue.`
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Header Bar */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0a84ff]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Interactive PDF Proof Studio • Digital Sign-Off</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{job.projectName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Client: <span className="font-semibold text-slate-200">{job.companyName}</span> • Ref Job #{job.jobNumber}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1.5 bg-white/[0.04] p-1.5 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 15))}
            className="p-2 hover:bg-white/[0.08] rounded-lg text-slate-300 hover:text-white cursor-pointer transition-all active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold px-2.5 text-slate-200">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 15))}
            className="p-2 hover:bg-white/[0.08] rounded-lg text-slate-300 hover:text-white cursor-pointer transition-all active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation((rotation + 90) % 360)}
            className="p-2 hover:bg-white/[0.08] rounded-lg text-slate-300 hover:text-white cursor-pointer ml-1 border-l border-white/[0.08] transition-all active:scale-95"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Interactive PDF Proof Canvas Viewer */}
        <div className="lg:col-span-7 mirror-card rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden">
          <div className="w-full flex justify-between text-xs text-slate-400 border-b border-white/[0.08] pb-3 mb-6 font-mono">
            <span className="text-slate-200 font-medium">FILE: Nexus_Folder_GoldFoil_3D_Die.pdf</span>
            <span className="text-[#0a84ff]">SPEC: 300 DPI CMYK + Pantone 871C Gold</span>
          </div>

          {/* Interactive Artwork Page Canvas Container */}
          <div className="relative overflow-auto max-w-full my-auto flex items-center justify-center p-6">
            <div
              onClick={handleArtworkClick}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="relative w-[340px] sm:w-[420px] h-[280px] sm:h-[320px] bg-[#141416] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-white/[0.12] cursor-crosshair flex flex-col justify-between p-5 group select-none"
            >
              {/* Crop & Registration Marks (Pre-press styling) */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[#0a84ff] pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[#0a84ff] pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[#0a84ff] pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[#0a84ff] pointer-events-none" />

              {/* Bleed Guide Line */}
              <div className="absolute inset-2.5 border border-dashed border-rose-500/50 rounded-lg pointer-events-none text-[9px] text-rose-400 font-mono px-1">
                3mm Bleed Margin
              </div>

              {/* Simulated Artwork Visual Content */}
              <div className="space-y-3.5 z-10 my-auto text-center px-4">
                <div className="text-2xl font-black text-white tracking-wider">NEXUS GLOBAL</div>
                <div className="text-xs font-bold text-amber-300 tracking-wider uppercase border-y border-amber-400/40 py-1.5 inline-block bg-amber-400/10 px-3.5 rounded-full">
                  ★ EMBOSSED GOLD FOIL AREA ★
                </div>
                <p className="text-[11px] text-slate-400">350gsm Soft Touch Laminated Presentation Folder</p>
              </div>

              {/* Digital Seal Stamp overlay if approved */}
              {isSignedAndApproved && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs rounded-2xl pointer-events-none">
                  <div className="border-2 border-emerald-400 text-emerald-300 bg-zinc-950/90 rounded-2xl px-6 py-4 shadow-2xl rotate-[-8deg] text-center font-bold uppercase tracking-wider space-y-1">
                    <div className="text-xs">✔ BRANDFLOW CERTIFIED PROOF</div>
                    <div className="text-base text-emerald-400">APPROVED FOR PRESS</div>
                    <div className="text-[9px] font-mono font-medium text-emerald-300">
                      DIGITAL SIG: {approverName} ({new Date().toLocaleDateString()})
                    </div>
                  </div>
                </div>
              )}

              {/* CMYK Color Bars at bottom */}
              <div className="flex h-2.5 w-full space-x-1 rounded-full overflow-hidden z-10 opacity-90">
                <div className="flex-1 bg-cyan-400 rounded-xs" title="Cyan" />
                <div className="flex-1 bg-pink-500 rounded-xs" title="Magenta" />
                <div className="flex-1 bg-yellow-400 rounded-xs" title="Yellow" />
                <div className="flex-1 bg-zinc-950 border border-white/20 rounded-xs" title="Key Black" />
                <div className="flex-1 bg-amber-500 rounded-xs" title="Pantone Gold" />
              </div>

              {/* Render Annotation Pins on Canvas */}
              {annotations.map((pin) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
                >
                  <div className="p-1.5 bg-[#0a84ff] text-white rounded-full shadow-lg ring-2 ring-black">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden group-hover/pin:block absolute left-6 top-0 w-52 mirror-card border border-white/[0.1] text-slate-100 p-3 rounded-xl shadow-2xl text-[10px] space-y-1 z-30">
                    <div className="font-semibold text-[#0a84ff]">{pin.author} ({pin.role}):</div>
                    <div>{pin.text}</div>
                    <div className="text-[9px] text-slate-400">{pin.date}</div>
                  </div>
                </div>
              ))}

              {/* Temporary Pin Indicator when clicking */}
              {selectedPinPos && (
                <div
                  style={{ left: `${selectedPinPos.x}%`, top: `${selectedPinPos.y}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-[#0a84ff] text-white rounded-full shadow-lg ring-2 ring-white animate-ping"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center mt-4">
            Click anywhere on the artwork preview to place an annotation pin comment.
          </div>
        </div>

        {/* Right Sidebar: Digital Signature Pad & Approval Controls */}
        <div className="lg:col-span-5 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3 flex justify-between items-center">
              <span>Digital Signature Sign-Off Pad</span>
              {isSignedAndApproved ? (
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved & Locked</span>
                </span>
              ) : (
                <span className="text-[#0a84ff] font-semibold text-[11px]">Signature Required</span>
              )}
            </h3>

            {/* Approver Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Approver Full Name & Title</label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                disabled={isSignedAndApproved}
                className="w-full text-xs p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/30 outline-none transition-all"
              />
            </div>

            {/* Signature Drawing Canvas Pad */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-300">Sign with Mouse / Touch Pad</span>
                {!isSignedAndApproved && (
                  <button
                    onClick={clearSignature}
                    className="text-[11px] text-slate-400 hover:text-rose-400 font-medium cursor-pointer transition-colors"
                  >
                    Clear Signature
                  </button>
                )}
              </div>

              <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-1.5 relative shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className={`w-full bg-[#121214] rounded-xl cursor-crosshair ${
                    isSignedAndApproved ? 'pointer-events-none opacity-80' : ''
                  }`}
                />
                {!hasSignature && !isSignedAndApproved && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-500 italic">
                    Draw sign-off signature here...
                  </div>
                )}
              </div>
            </div>

            {/* Annotation Pin Form if position selected */}
            {selectedPinPos && (
              <div className="p-4 bg-[#0a84ff]/10 border border-[#0a84ff]/30 rounded-2xl space-y-2.5 text-xs">
                <div className="font-semibold text-[#0a84ff]">
                  New Annotation Pin at ({selectedPinPos.x}%, {selectedPinPos.y}%)
                </div>
                <input
                  type="text"
                  placeholder="Enter revision comment for designer..."
                  value={newPinText}
                  onChange={(e) => setNewPinText(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#0a84ff]"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedPinPos(null)}
                    className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-slate-300 text-[11px] cursor-pointer hover:bg-white/[0.1] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAnnotation}
                    className="px-3.5 py-1.5 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-xl text-[11px] cursor-pointer shadow-sm transition-all active:scale-95"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Approve Button */}
          <div className="space-y-2.5 pt-4 border-t border-white/[0.08]">
            {isSignedAndApproved ? (
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Proof Signed & Approved for Press Production</span>
              </div>
            ) : (
              <button
                onClick={handleApproveProof}
                className="w-full py-3 bg-[#0a84ff] hover:bg-[#0071e3] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#0a84ff]/25 cursor-pointer flex justify-center items-center space-x-2 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Sign & Approve Proof for Print</span>
              </button>
            )}

            <button
              onClick={() => {
                onSaveNotification('Job returned to Design department for requested changes.');
                onNavigate('Design');
              }}
              className="w-full py-2.5 bg-white/[0.04] hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-xl border border-white/[0.08] cursor-pointer transition-all active:scale-[0.98]"
            >
              Request Design Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
