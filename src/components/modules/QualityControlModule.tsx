import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon, ArrowRight, Award, Eye } from 'lucide-react';
import { Job, QualityControlCheck } from '../../types';

interface QualityControlModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const QualityControlModule: React.FC<QualityControlModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [qcResult, setQcResult] = useState<QualityControlCheck>(
    job.qcCheck || {
      id: 'QC-7711',
      jobId: job.id,
      inspectorName: 'Linda Zhang (Senior QA Lead)',
      inspectionDate: '2026-07-21',
      deltaEColorMatch: 1.15,
      trimAccuracyMm: 0.2,
      registrationStatus: 'Perfect',
      finishingCheck: 'Passed',
      packagingCheck: 'Passed',
      overallResult: 'PASS - Sealed',
      notes: 'Foil adhesion and color Delta E 1.15 within ISO 12647 spec.',
      samplePhotoTag: 'QC-SEAL-8941-OK',
    }
  );

  const handleApplySeal = (result: 'PASS - Sealed' | 'REJECT - Recalibrate') => {
    setQcResult({ ...qcResult, overallResult: result });
    onSaveNotification(`QC Seal updated to ${result} for Job #${job.jobNumber}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Header */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Quality Assurance Inspector - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-lg font-black text-zinc-100 mt-1">{job.projectName}</h2>
        </div>

        <button
          onClick={() => onNavigate('Accounts')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer border border-amber-300/30 transition-all"
        >
          <span>Send Passed Job to Accounts ERP</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Criteria Card */}
        <div className="lg:col-span-8 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2">
            Print Quality Measurement Checkpoints
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/70 border border-emerald-500/40 rounded-lg">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Delta-E Color Variance</span>
              <span className="text-lg font-black text-emerald-300 font-mono">
                ΔE {qcResult.deltaEColorMatch}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Target &lt; 2.5 ISO Standard</span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Trim Cut Precision</span>
              <span className="text-lg font-black text-zinc-100 font-mono">
                ±{qcResult.trimAccuracyMm} mm
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Zünd CNC Verified</span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Registration Alignment</span>
              <span className="text-lg font-black text-amber-300">
                {qcResult.registrationStatus}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">4-Color Crosshairs Aligned</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Inspector Log Notes</label>
            <textarea
              rows={3}
              value={qcResult.notes}
              onChange={(e) => setQcResult({ ...qcResult, notes: e.target.value })}
              className="w-full p-3 bg-zinc-950/80 border border-zinc-700/80 rounded-lg text-xs font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Quality Seal Control */}
        <div className="lg:col-span-4 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2 mb-4">
              QC Assurance Result Seal
            </h3>

            <div
              className={`p-6 rounded-xl border text-center space-y-2 ${
                qcResult.overallResult.includes('PASS')
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <Award className={`w-10 h-10 mx-auto ${qcResult.overallResult.includes('PASS') ? 'text-emerald-400' : 'text-rose-400'}`} />
              <div className="text-lg font-black uppercase tracking-wider">{qcResult.overallResult}</div>
              <div className="text-xs font-medium text-zinc-400">
                Inspector: <span className="font-bold text-zinc-200">{qcResult.inspectorName}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleApplySeal('PASS - Sealed')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-xs font-black rounded-lg shadow-sm cursor-pointer flex justify-center items-center space-x-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-zinc-950" />
              <span>Grant QC PASS Seal</span>
            </button>
            <button
              onClick={() => handleApplySeal('REJECT - Recalibrate')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex justify-center items-center space-x-1.5 transition-colors"
            >
              <AlertOctagon className="w-4 h-4 text-white" />
              <span>Flag Quality Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
