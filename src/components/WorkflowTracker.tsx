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
    <section className="bg-white/75 backdrop-blur-xl border-b border-slate-200/80 h-14 flex items-center px-6 space-x-2 flex-shrink-0 text-xs font-bold overflow-x-auto scrollbar-thin relative z-10 shadow-2xs">
      <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-200">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">Job Pipeline</span>
        <span className="text-xs font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">{selectedJob.jobNumber}</span>
      </div>

      <div className="flex items-center space-x-2 min-w-max py-0.5">
        {STAGES.map((s, index) => {
          const isCompleted = currentStageIndex > index || selectedJob.stage === 'Completed';
          const isCurrent = currentStageIndex === index;

          return (
            <React.Fragment key={s.stage}>
              <button
                onClick={() => onNavigateToModule(s.module)}
                className={`flex items-center text-xs font-bold transition-all duration-200 cursor-pointer px-3 py-1.5 rounded-xl active:scale-95 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25 text-white border border-white/20'
                    : isCompleted
                    ? 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/90'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 text-[10px] font-black shrink-0 transition-all ${
                    isCurrent
                      ? 'border-white/60 text-indigo-700 bg-white shadow-2xs'
                      : isCompleted
                      ? 'border-indigo-300 bg-indigo-200/60 text-indigo-700'
                      : 'border-slate-300 text-slate-400 bg-white'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className="tracking-wider">{s.label}</span>
              </button>
              {index < STAGES.length - 1 && (
                <div className="w-4 h-px bg-slate-200 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-500 shrink-0 pl-4 border-l border-slate-200">
        <span className="font-mono text-slate-400">Priority:</span>
        <span
          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            selectedJob.priority.includes('URGENT')
              ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
              : 'bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs'
          }`}
        >
          {selectedJob.priority}
        </span>
      </div>
    </section>
  );
};

