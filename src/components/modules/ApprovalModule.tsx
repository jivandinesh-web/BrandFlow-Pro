import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileCheck, Send, Shield, User, ArrowRight, Mail } from 'lucide-react';
import { Job } from '../../types';
import { EmailLink } from '../EmailLink';

interface ApprovalModuleProps {
  job: Job;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const ApprovalModule: React.FC<ApprovalModuleProps> = ({
  job,
  onSaveNotification,
  onNavigate,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Top Banner */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Approval Center - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
          <div className="text-xs text-zinc-400 flex items-center space-x-1.5 flex-wrap mt-0.5">
            <span>Client: <strong className="text-amber-300">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-zinc-600">•</span>
            <EmailLink
              email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
              subject={`High-Res Artwork Proof Approval - ${job.projectName}`}
              showIcon
              className="text-amber-400 hover:text-amber-300 text-xs"
            />
          </div>
        </div>

        <button
          onClick={() => onNavigate('PdfProofApproval')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Open Interactive PDF Proof Studio</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Proof Sign-off Status Card */}
        <div className="lg:col-span-7 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-5">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Client Proof Sign-Off Status
          </h3>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-xs">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 text-sm">
                Proof Status: {job.proofApproval?.status || 'Pending Review'}
              </div>
              <div className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Proof document sent to <span className="font-bold text-zinc-200">{job.customerName}</span> ({job.companyName}). Awaiting digital signature verification.
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3 text-xs">
            <div className="font-bold text-zinc-300">Pre-Press Proof Verification Checkpoints:</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
                <span className="font-semibold text-zinc-200">1. CMYK / Pantone Color Match Confirmed</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
                <span className="font-semibold text-zinc-200">2. Typography & Spelling Layout Check</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
                <span className="font-semibold text-zinc-200">3. Die-Cut Crease & Foil Stamping Alignment</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
                <span className="font-semibold text-zinc-200">4. Digital Signature & Timestamp</span>
                <span className="text-amber-400 font-bold flex items-center space-x-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Sign-off</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Notification Actions */}
        <div className="lg:col-span-5 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Client Communication & Reminder
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-zinc-300">Send Automated Reminder SMS / Email</label>
                <EmailLink
                  email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
                  subject={`URGENT Proof Approval Required - ${job.projectName}`}
                  body={`Dear ${job.customerName},\n\nYour high-resolution print proof for ${job.projectName} is ready for digital review and approval on the BrandFlow Portal.\n\nPlease review the proof at your earliest convenience to maintain scheduled press time.\n\nWarm regards,\nBrandFlow Production Team`}
                  showQuickActions
                  className="text-amber-400 font-semibold text-[11px]"
                />
              </div>
              <textarea
                rows={3}
                defaultValue={`Dear ${job.customerName}, your high-res print proof for ${job.projectName} is ready for digital approval on the BrandFlow Portal.`}
                className="w-full p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              onClick={() => onSaveNotification('Reminder SMS & Email dispatched to client')}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-lg text-xs shadow-md shadow-amber-500/20 cursor-pointer flex justify-center items-center space-x-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Approval Reminder</span>
            </button>
          </div>

          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg text-xs text-zinc-300 space-y-1">
            <div className="font-bold flex items-center space-x-1 text-amber-400">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Legal Audit Trail</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Upon approval, digital signature hash and IP timestamp are locked permanently into the job card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
