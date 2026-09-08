import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileCheck, Send, Shield, User, ArrowRight, Mail, Edit3 } from 'lucide-react';
import { Job } from '../../types';
import { EmailLink } from '../EmailLink';
import { ClientEmailSendButton } from '../ClientEmailSendButton';
import { ClientEmailLogsCard } from '../ClientEmailLogsCard';

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
  const customerEmail =
    job.customerEmail ||
    `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`;

  const proofSubject = `URGENT: High-Res Artwork Proof Approval Required - ${job.projectName} (#${job.jobNumber})`;
  const proofBody = `Dear ${job.customerName},\n\nYour high-resolution print proof for project "${job.projectName}" (Job #${job.jobNumber}) is ready for your digital review and sign-off on the BrandFlow Approval Portal.\n\nPlease review and approve at your earliest convenience so we can proceed with scheduled press production.\n\nThank you,\nBrandFlow Pro Production Team\nwww.brandflowpro.co.za`;

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Top Banner */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0a84ff]">
            <FileCheck className="w-4 h-4 text-[#0a84ff]" />
            <span>Approval Center • Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{job.projectName}</h2>
          <div className="text-xs text-slate-400 flex items-center space-x-2 flex-wrap mt-0.5">
            <span>Client: <strong className="text-white">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-slate-600">•</span>
            <EmailLink
              email={customerEmail}
              clientName={job.customerName}
              companyName={job.companyName}
              jobNumber={job.jobNumber}
              projectName={job.projectName}
              subject={proofSubject}
              body={proofBody}
              showIcon
              className="text-[#0a84ff] hover:underline text-xs font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button linked to 5 popular mailing programs & database log */}
          <ClientEmailSendButton
            toEmail={customerEmail}
            clientName={job.customerName}
            companyName={job.companyName}
            clientId={job.quote?.customerId}
            jobNumber={job.jobNumber}
            quoteNumber={job.quote?.quoteNumber}
            projectName={job.projectName}
            defaultSubject={proofSubject}
            defaultBody={proofBody}
            label="Re-Send Email to Client"
            variant="emerald"
            onSaveNotification={onSaveNotification}
          />

          <button
            onClick={() => onNavigate('PdfProofApproval')}
            className="px-4 py-2 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-[#0a84ff]/25 cursor-pointer transition-all active:scale-95"
          >
            <span>Interactive Proof Studio</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Proof Sign-off Status Card */}
        <div className="lg:col-span-7 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3">
            Client Proof Sign-Off Status
          </h3>

          {/* Custom Branding Requirements Directive */}
          {(job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes) && (
            <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl flex items-start space-x-3 text-xs">
              <Edit3 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300 text-sm">
                  Special Custom Branding Directive
                </div>
                <div className="text-slate-200 text-xs mt-1 leading-relaxed">
                  {job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes}
                </div>
                <div className="text-[10px] text-amber-400/80 mt-1">
                  Client custom requirement must be strictly verified against pre-press proof mockups.
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-start space-x-3.5 text-xs">
            <Clock className="w-5 h-5 text-[#0a84ff] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">
                Proof Status: {job.proofApproval?.status || 'Pending Review'}
              </div>
              <div className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Proof document sent to <span className="font-semibold text-slate-200">{job.customerName}</span> ({job.companyName}). Awaiting digital signature verification.
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3 text-xs">
            <div className="font-semibold text-slate-300">Pre-Press Proof Verification Checkpoints:</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <span className="font-medium text-slate-200">1. CMYK / Pantone Color Match Confirmed</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <span className="font-medium text-slate-200">2. Typography & Spelling Layout Check</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <span className="font-medium text-slate-200">3. Die-Cut Crease & Foil Stamping Alignment</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <span className="font-medium text-slate-200">4. Digital Signature & Timestamp</span>
                <span className="text-[#0a84ff] font-semibold flex items-center space-x-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Sign-off</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Notification Actions */}
        <div className="lg:col-span-5 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3">
            Client Communication & Reminder
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-300">Direct Client Email Dispatch</label>
                <EmailLink
                  email={customerEmail}
                  clientName={job.customerName}
                  companyName={job.companyName}
                  jobNumber={job.jobNumber}
                  projectName={job.projectName}
                  subject={proofSubject}
                  body={proofBody}
                  showQuickActions
                  className="text-[#0a84ff] font-medium text-[11px]"
                />
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-slate-300 font-mono">
                {proofBody.slice(0, 140)}...
              </div>
            </div>

            <ClientEmailSendButton
              toEmail={customerEmail}
              clientName={job.customerName}
              companyName={job.companyName}
              clientId={job.quote?.customerId}
              jobNumber={job.jobNumber}
              projectName={job.projectName}
              defaultSubject={proofSubject}
              defaultBody={proofBody}
              label="Re-Send Email to Client"
              variant="emerald"
              className="w-full justify-center"
              onSaveNotification={onSaveNotification}
            />
          </div>

          <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold flex items-center space-x-1.5 text-[#0a84ff]">
              <Shield className="w-4 h-4 text-[#0a84ff]" />
              <span>Legal Audit Trail</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon approval, digital signature hash and IP timestamp are locked permanently into the job card and database log.
            </p>
          </div>
        </div>
      </div>

      {/* Database Email Log for this client */}
      <ClientEmailLogsCard
        clientId={job.quote?.customerId}
        clientName={job.customerName}
        companyName={job.companyName}
        clientEmail={customerEmail}
        jobNumber={job.jobNumber}
        title={`Database Communication & Proof Audit Logs — ${job.companyName} (#${job.jobNumber})`}
        onSaveNotification={onSaveNotification}
      />
    </div>
  );
};
