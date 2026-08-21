import React, { useState, useEffect } from 'react';
import { Printer, Check, X, FileText, Settings, Copy } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  departmentName: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  departmentName,
}) => {
  const [copies, setCopies] = useState(1);
  const [selectedPrinter, setSelectedPrinter] = useState('HP LaserJet Enterprise Pressroom #1 (192.168.1.102)');
  const [colorMode, setColorMode] = useState<'CMYK Print Proof' | 'Grayscale Draft'>('CMYK Print Proof');
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => {
      setPrinted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden font-sans text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-5 py-3 flex items-center justify-between text-zinc-100 border-b border-zinc-800">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Windows Print Spooler - BrandFlow Pro Spool Service</span>
          </div>
          <button onClick={onClose} className="hover:bg-rose-500/20 rounded-lg p-1 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Print settings controls */}
          <div className="md:col-span-5 space-y-4 border-r border-zinc-800 pr-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1.5">Select Destination Printer</label>
              <select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg text-zinc-200 font-medium focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
              >
                <option>HP LaserJet Enterprise Pressroom #1 (192.168.1.102)</option>
                <option>Epson Stylus Pro Proofing Colorimeter #2</option>
                <option>Roland Wide Format Rip Plotter #4</option>
                <option>Microsoft Print to PDF (Digital File Output)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-300 mb-1.5">Copies</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-300 mb-1.5">Paper Size</label>
                <select className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg text-zinc-200 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none">
                  <option>A4 Standard (210 x 297 mm)</option>
                  <option>A3 Oversized Proof (297 x 420 mm)</option>
                  <option>US Letter (8.5 x 11 in)</option>
                  <option>SRA3 Press Sheet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1.5">Output Mode</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={colorMode === 'CMYK Print Proof'}
                    onChange={() => setColorMode('CMYK Print Proof')}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  <span>300 DPI CMYK High-Fidelity Proof</span>
                </label>
                <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={colorMode === 'Grayscale Draft'}
                    onChange={() => setColorMode('Grayscale Draft')}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  <span>Monochrome Fast Job Card Draft</span>
                </label>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-amber-400">
                <Settings className="w-3.5 h-3.5" />
                <span>Department Spool Tag</span>
              </div>
              <div>Source Module: <span className="font-bold text-zinc-100">{departmentName}</span></div>
              <div>Job Title: <span className="font-bold text-zinc-100">{documentTitle}</span></div>
            </div>
          </div>

          {/* Document Preview Pane */}
          <div className="md:col-span-7 flex flex-col text-xs">
            <span className="font-bold text-zinc-300 mb-2">Print Preview Document</span>
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-inner min-h-[220px]">
              <div className="bg-zinc-900 border border-zinc-800 p-4 shadow-md rounded-lg space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-black text-amber-400 tracking-wider text-sm">BRANDFLOW PRO ERP</span>
                  <span className="text-[10px] text-zinc-500 font-mono">STAMP: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-zinc-100 text-sm">{documentTitle}</div>
                  <div className="text-[11px] text-zinc-400">Generated from {departmentName} Module</div>
                </div>
                <div className="bg-zinc-950 p-2.5 border border-dashed border-zinc-700/80 rounded-lg text-[11px] text-zinc-400 font-mono space-y-1">
                  <div className="text-amber-400">[+] CMYK Color Profile Tag: FOGRA51 ISO Coated</div>
                  <div>[+] Bleed Margins: 3.0 mm Vector Guides Included</div>
                  <div>[+] Barcode Metadata: BF-PRNT-SPOOL-9012</div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 text-center mt-2 flex items-center justify-center space-x-1">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>Page 1 of 1 • Ready to spool to {selectedPrinter.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950/60 px-6 py-3.5 flex items-center justify-between border-t border-zinc-800 text-xs">
          <div>
            {printed ? (
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Document sent to Print Spooler successfully!</span>
              </span>
            ) : (
              <span className="text-zinc-400">Ready to print {copies} copy/copies</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              disabled={printed}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black rounded-lg shadow-md shadow-amber-500/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all border border-amber-300/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{printed ? 'Spooling...' : 'Print Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
