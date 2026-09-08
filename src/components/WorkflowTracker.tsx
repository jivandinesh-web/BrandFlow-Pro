import React from 'react';
import { Job, ModuleType, WorkflowStage } from '../types';

interface WorkflowTrackerProps {
  selectedJob: Job;
  onNavigateToModule: (module: ModuleType) => void;
}

const STAGES: { stage: WorkflowStage; label: string; module: ModuleType }[] = [
  { stage: 'Quotation', label: 'QUOTATION', module: 'Quotations' },
  { stage: 'Approval', label: 'APPROVAL', module: 'Approval' },
  { stage: 'Artwork', label: 'ARTWORK', module: 'ArtworkUpload' },
  { stage: 'Design', label: 'DESIGN', module: 'Design' },
  { stage: 'Proofing', label: 'PROOFING', module: 'PdfProofApproval' },
  { stage: 'Production', label: 'PRODUCTION', module: 'Production' },
  { stage: 'QualityControl', label: 'QC', module: 'QualityControl' },
  { stage: 'Invoicing', label: 'ACCOUNTS', module: 'Accounts' },
  { stage: 'Dispatch', label: 'DISPATCH', module: 'Dispatch' },
];

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  selectedJob,
  onNavigateToModule,
}) => {
  const currentStageIndex = STAGES.findIndex((s) => s.module === selectedJob.stage || s.stage === selectedJob.stage);

  return (
    <section className="bg-[#141416]/75 backdrop-blur-2xl border-b border-white/[0.08] h-14 flex items-center px-6 space-x-3 flex-shrink-0 text-xs font-semibold overflow-x-auto scrollbar-thin relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      <div className="flex items-center space-x-2.5 shrink-0 pr-4 border-r border-white/[0.08]">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider font-mono">Job Pipeline</span>
        <span className="text-xs font-mono font-bold text-white bg-white/[0.08] px-2.5 py-0.5 rounded-lg border border-white/[0.08]">{selectedJob.jobNumber}</span>
      </div>

      <div className="flex items-center space-x-2 min-w-max py-0.5">
        {STAGES.map((s, index) => {
          const isCompleted = currentStageIndex > index || selectedJob.stage === 'Completed';
          const isCurrent = currentStageIndex === index;

          return (
            <React.Fragment key={s.stage}>
              <button
                onClick={() => onNavigateToModule(s.module)}
                className={`flex items-center text-xs font-medium transition-all duration-200 cursor-pointer px-3 py-1.5 rounded-xl active:scale-95 ${
                  isCurrent
                    ? 'bg-[#0a84ff] shadow-[0_2px_12px_rgba(10,132,255,0.35)] text-white border border-white/20'
                    : isCompleted
                    ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mr-2 text-[10px] font-bold shrink-0 transition-all ${
                    isCurrent
                      ? 'border-white/80 text-[#0a84ff] bg-white shadow-2xs'
                      : isCompleted
                      ? 'border-blue-400/40 bg-blue-500/20 text-blue-400'
                      : 'border-white/10 text-slate-500 bg-white/[0.04]'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className="tracking-wide text-[11px]">{s.label}</span>
              </button>
              {index < STAGES.length - 1 && (
                <div className="w-3 h-px bg-white/[0.08] shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400 shrink-0 pl-4 border-l border-white/[0.08]">
        <span className="font-mono text-slate-500">Priority:</span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            selectedJob.priority.includes('URGENT')
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`}
        >
          {selectedJob.priority}
        </span>
      </div>
    </section>
  );
};

