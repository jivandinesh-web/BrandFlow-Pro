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
    ctx.strokeStyle = '#f59e0b'; // amber gold signature ink
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
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Header Bar */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Interactive PDF Proof Studio - Digital Sign-Off</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
          <p className="text-xs text-zinc-400">
            Client: <span className="font-bold text-amber-300">{job.companyName}</span> • Ref Job #{job.jobNumber}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 15))}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white cursor-pointer transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 text-amber-300">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 15))}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white cursor-pointer transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation((rotation + 90) % 360)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white cursor-pointer ml-1 border-l border-zinc-800 transition-all"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive PDF Proof Canvas Viewer */}
        <div className="lg:col-span-7 bg-zinc-950 rounded-xl border border-zinc-800/80 p-5 sm:p-6 shadow-2xl flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
          <div className="w-full flex justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2 mb-4 font-mono">
            <span className="text-zinc-300 font-bold">FILE: Nexus_Folder_GoldFoil_3D_Die.pdf</span>
            <span className="text-amber-400">SPEC: 300 DPI CMYK + Pantone 871C Gold</span>
          </div>

          {/* Interactive Artwork Page Canvas Container */}
          <div className="relative overflow-auto max-w-full my-auto flex items-center justify-center p-4">
            <div
              onClick={handleArtworkClick}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="relative w-[340px] sm:w-[420px] h-[280px] sm:h-[320px] bg-zinc-900 rounded-lg shadow-2xl border-4 border-zinc-700 cursor-crosshair flex flex-col justify-between p-4 group select-none"
            >
              {/* Crop & Registration Marks (Pre-press styling) */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* Bleed Guide Line */}
              <div className="absolute inset-2 border border-dashed border-rose-500/60 pointer-events-none text-[9px] text-rose-400 font-mono px-1">
                3mm Bleed Margin
              </div>

              {/* Simulated Artwork Visual Content */}
              <div className="space-y-3 z-10 my-auto text-center px-4">
                <div className="text-2xl font-black text-zinc-100 tracking-wider">NEXUS GLOBAL</div>
                <div className="text-xs font-extrabold text-amber-400 tracking-widest uppercase border-y-2 border-amber-500/60 py-1 inline-block bg-amber-500/10 px-3 rounded">
                  ★ EMBOSSED GOLD FOIL AREA ★
                </div>
                <p className="text-[11px] text-zinc-400 italic">350gsm Soft Touch Laminated Presentation Folder</p>
              </div>

              {/* Digital Seal Stamp overlay if approved */}
              {isSignedAndApproved && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/60 pointer-events-none">
                  <div className="border-4 border-emerald-500 text-emerald-300 bg-zinc-950/95 rounded-xl px-6 py-3 shadow-2xl rotate-[-12deg] text-center font-black uppercase tracking-wider space-y-1">
                    <div className="text-xs">✔ BRANDFLOW CERTIFIED PROOF</div>
                    <div className="text-base text-emerald-400">APPROVED FOR PRESS</div>
                    <div className="text-[9px] font-mono font-bold text-emerald-300">
                      DIGITAL SIG: {approverName} ({new Date().toLocaleDateString()})
                    </div>
                  </div>
                </div>
              )}

              {/* CMYK Color Bars at bottom */}
              <div className="flex h-2.5 w-full space-x-0.5 rounded overflow-hidden z-10 opacity-90">
                <div className="flex-1 bg-cyan-400" title="Cyan" />
                <div className="flex-1 bg-pink-500" title="Magenta" />
                <div className="flex-1 bg-yellow-400" title="Yellow" />
                <div className="flex-1 bg-zinc-950 border border-zinc-700" title="Key Black" />
                <div className="flex-1 bg-amber-500" title="Pantone Gold" />
              </div>

              {/* Render Annotation Pins on Canvas */}
              {annotations.map((pin) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
                >
                  <div className="p-1 bg-rose-500 text-white rounded-full shadow-lg ring-2 ring-zinc-900 animate-bounce">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden group-hover/pin:block absolute left-5 top-0 w-48 bg-zinc-900 border border-zinc-700 text-zinc-100 p-2.5 rounded-lg shadow-2xl text-[10px] space-y-1 z-30">
                    <div className="font-bold text-amber-300">{pin.author} ({pin.role}):</div>
                    <div>{pin.text}</div>
                    <div className="text-[9px] text-zinc-400">{pin.date}</div>
                  </div>
                </div>
              ))}

              {/* Temporary Pin Indicator when clicking */}
              {selectedPinPos && (
                <div
                  style={{ left: `${selectedPinPos.x}%`, top: `${selectedPinPos.y}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-1 bg-amber-400 text-zinc-950 rounded-full shadow-lg ring-2 ring-zinc-900 animate-ping"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono text-center mt-2">
            Click anywhere on the artwork preview to place an annotation pin comment.
          </div>
        </div>

        {/* Right Sidebar: Digital Signature Pad & Approval Controls */}
        <div className="lg:col-span-5 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5 flex justify-between items-center">
              <span>Digital Signature Sign-Off Pad</span>
              {isSignedAndApproved ? (
                <span className="text-emerald-400 font-bold text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved & Locked</span>
                </span>
              ) : (
                <span className="text-amber-400 font-bold text-[11px]">Signature Required</span>
              )}
            </h3>

            {/* Approver Name Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Approver Full Name & Title</label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                disabled={isSignedAndApproved}
                className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Signature Drawing Canvas Pad */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-zinc-300">Sign with Mouse / Touch Pad</span>
                {!isSignedAndApproved && (
                  <button
                    onClick={clearSignature}
                    className="text-[11px] text-zinc-400 hover:text-rose-400 font-semibold cursor-pointer transition-colors"
                  >
                    Clear Signature
                  </button>
                )}
              </div>

              <div className="border-2 border-zinc-700/80 bg-zinc-950 rounded-xl p-1 relative">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className={`w-full bg-zinc-950 rounded-lg cursor-crosshair ${
                    isSignedAndApproved ? 'pointer-events-none opacity-80' : ''
                  }`}
                />
                {!hasSignature && !isSignedAndApproved && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-zinc-500 italic">
                    Draw sign-off signature here...
                  </div>
                )}
              </div>
            </div>

            {/* Annotation Pin Form if position selected */}
            {selectedPinPos && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-300">
                  New Annotation Pin at ({selectedPinPos.x}%, {selectedPinPos.y}%)
                </div>
                <input
                  type="text"
                  placeholder="Enter revision comment for designer..."
                  value={newPinText}
                  onChange={(e) => setNewPinText(e.target.value)}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedPinPos(null)}
                    className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-[11px] cursor-pointer hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAnnotation}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-lg text-[11px] cursor-pointer shadow-xs"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Approve Button */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-800">
            {isSignedAndApproved ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Proof Signed & Approved for Press Production</span>
              </div>
            ) : (
              <button
                onClick={handleApproveProof}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black rounded-lg shadow-md shadow-amber-500/20 cursor-pointer flex justify-center items-center space-x-2 transition-all border border-amber-300/30"
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
              className="w-full py-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 text-xs font-semibold rounded-lg border border-zinc-700 cursor-pointer transition-all"
            >
              Request Design Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
