import React, { useState } from 'react';
import { Printer, Play, CheckCircle2, AlertTriangle, Layers, Clock, ArrowRight, Settings, Edit3 } from 'lucide-react';
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
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Header */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0a84ff]">
            <Printer className="w-4 h-4 text-[#0a84ff]" />
            <span>Press Control • Job Card #{job.jobNumber}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">{job.projectName}</h2>
        </div>

        <button
          onClick={() => onNavigate('QualityControl')}
          className="px-4.5 py-2.5 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer border border-white/20 transition-all active:scale-[0.98]"
        >
          <span>Send Job to Quality Control</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Job Card Details */}
        <div className="lg:col-span-8 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-6">
          <div className="border-b border-white/[0.08] pb-4 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Press Line & Material Job Specs
            </h3>
            <span className="px-3 py-1 bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 font-semibold rounded-full text-xs">
              {status}
            </span>
          </div>

          {/* Custom Branding Requirements Directive */}
          {(job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes) && (
            <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Custom Branding Floor Directives</span>
              </div>
              <p className="text-xs text-slate-200 font-sans font-medium">
                {job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Press Machine</span>
              <span className="font-semibold text-white mt-1 block">
                {job.productionCard?.printProcess || 'Heidelberg Speedmaster XL 106'}
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Paper Stock / Material</span>
              <span className="font-semibold text-slate-200 mt-1 block">
                {job.productionCard?.paperStockDetails || '350gsm Silk Coated Premium'}
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Run Quantity</span>
              <span className="font-bold text-white font-mono mt-1 block">
                {job.quantity.toLocaleString()} sheets/units
              </span>
            </div>
          </div>

          {/* Interactive Progress Slider */}
          <div className="p-5 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
              <span>Press Run Completion</span>
              <span className="font-mono text-base text-[#0a84ff] font-bold">{progress}%</span>
            </div>

            <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden border border-white/[0.08]">
              <div
                style={{ width: `${progress}%` }}
                className="bg-[#0a84ff] h-full transition-all duration-300 shadow-sm shadow-blue-500/50 rounded-full"
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Plate Preparation</span>
              <span>Running Press</span>
              <span>Binding & Trimming</span>
              <span>Ready for QC</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => handleUpdateProgress(Math.min(100, progress + 20))}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-xl text-xs font-semibold cursor-pointer transition-colors active:scale-95"
              >
                + Advance Press Progress
              </button>
              <button
                onClick={() => handleUpdateProgress(100)}
                className="px-4 py-2 bg-[#30d158] hover:bg-[#28b84d] text-zinc-950 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Mark 100% Press Complete
              </button>
            </div>
          </div>

          {/* Finishing Operations List */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2.5">Post-Press Finishing Operations:</div>
            <div className="flex flex-wrap gap-2.5 text-xs">
              {(job.productionCard?.finishingOps || ['Matt Lamination', 'Foil Stamping', 'Die-Cutting']).map((op, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-slate-300 font-medium rounded-xl flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#30d158]" />
                  <span>{op}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Press Operator Tag & Scrap Meter */}
        <div className="lg:col-span-4 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3">
            Operator & Waste Metrics
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Master Pressman</span>
              <span className="font-semibold text-white mt-1 block">{job.productionCard?.operator || 'Garry Thorne'}</span>
            </div>

            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Paper Scrap / Waste Rate</span>
              <span className="font-bold text-[#30d158] font-mono text-base mt-1 block">
                {job.productionCard?.scrapPercentage || 1.8}% (Target &lt; 3.0%)
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-1">
              <div className="text-[10px] text-[#ff9f0a] font-semibold uppercase tracking-wider">Plate ID Tag</div>
              <div className="font-mono text-xs font-bold text-slate-200">PLT-992-HEIDELBERG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
