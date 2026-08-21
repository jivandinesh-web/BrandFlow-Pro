import React, { useState } from 'react';
import { Printer, Play, CheckCircle2, AlertTriangle, Layers, Clock, ArrowRight, Settings } from 'lucide-react';
import { Job, ProductionJobCard } from '../../types';

interface ProductionModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [progress, setProgress] = useState(
    job.productionCard?.progressPercent || 40
  );
  const [status, setStatus] = useState(
    job.productionCard?.status || 'Running Press'
  );

  const handleUpdateProgress = (newVal: number) => {
    setProgress(newVal);
    if (newVal === 100) {
      setStatus('Completed');
      onSaveNotification('Production press run completed! Job sent to Quality Control.');
    } else {
      onSaveNotification(`Press progress updated to ${newVal}%`);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Header */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Press Control - Job Card #{job.jobNumber}</span>
          </div>
          <h2 className="text-lg font-black text-zinc-100 mt-1">{job.projectName}</h2>
        </div>

        <button
          onClick={() => onNavigate('QualityControl')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer border border-amber-300/30 transition-all"
        >
          <span>Send Job to Quality Control</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Job Card Details */}
        <div className="lg:col-span-8 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-zinc-300">
              Press Line & Material Job Specs
            </h3>
            <span className="px-2.5 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-xs">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Press Machine</span>
              <span className="font-bold text-amber-300">
                {job.productionCard?.printProcess || 'Heidelberg Speedmaster XL 106'}
              </span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Paper Stock / Material</span>
              <span className="font-bold text-zinc-200">
                {job.productionCard?.paperStockDetails || '350gsm Silk Coated Premium'}
              </span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Run Quantity</span>
              <span className="font-bold text-zinc-100 font-mono">
                {job.quantity.toLocaleString()} sheets/units
              </span>
            </div>
          </div>

          {/* Interactive Progress Slider */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-200">
              <span>Press Run Completion</span>
              <span className="font-mono text-sm text-amber-400 font-black">{progress}%</span>
            </div>

            <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden border border-zinc-700/60">
              <div
                style={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300 shadow-sm shadow-amber-500/50"
              />
            </div>

            <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
              <span>Plate Preparation</span>
              <span>Running Press</span>
              <span>Binding & Trimming</span>
              <span>Ready for QC</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => handleUpdateProgress(Math.min(100, progress + 20))}
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                + Advance Press Progress
              </button>
              <button
                onClick={() => handleUpdateProgress(100)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg text-xs font-black cursor-pointer transition-colors"
              >
                Mark 100% Press Complete
              </button>
            </div>
          </div>

          {/* Finishing Operations List */}
          <div>
            <div className="text-xs font-bold text-zinc-300 mb-2">Post-Press Finishing Operations:</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(job.productionCard?.finishingOps || ['Matt Lamination', 'Foil Stamping', 'Die-Cutting']).map((op, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-semibold rounded-lg flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{op}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Press Operator Tag & Scrap Meter */}
        <div className="lg:col-span-4 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2">
            Operator & Waste Metrics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Master Pressman</span>
              <span className="font-bold text-zinc-100">{job.productionCard?.operator || 'Garry Thorne'}</span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Paper Scrap / Waste Rate</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {job.productionCard?.scrapPercentage || 1.8}% (Target &lt; 3.0%)
              </span>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase">Plate ID Tag</div>
              <div className="font-mono text-xs font-bold text-amber-300">PLT-992-HEIDELBERG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
