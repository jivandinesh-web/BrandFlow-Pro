import React, { useState } from 'react';
import { Mail, ChevronDown, Sparkles, Send } from 'lucide-react';
import { ClientEmailModal } from './ClientEmailModal';
import { PopularMailProgram } from '../types';
import {
  POPULAR_MAIL_PROGRAMS,
  sendAndLogEmail,
  formatCurrentTimestamp,
} from '../utils/emailClientHelper';

interface ClientEmailSendButtonProps {
  toEmail: string;
  clientName: string;
  companyName: string;
  clientId?: string;
  jobNumber?: string;
  quoteNumber?: string;
  projectName?: string;
  defaultSubject?: string;
  defaultBody?: string;
  label?: string;
  variant?: 'emerald' | 'amber' | 'compact';
  onEmailSent?: (logId: string) => void;
  onSaveNotification?: (msg: string) => void;
  className?: string;
}

export const ClientEmailSendButton: React.FC<ClientEmailSendButtonProps> = ({
  toEmail,
  clientName,
  companyName,
  clientId,
  jobNumber,
  quoteNumber,
  projectName,
  defaultSubject = '',
  defaultBody = '',
  label = 'Re-Send Email to Client',
  variant = 'emerald',
  onEmailSent,
  onSaveNotification,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fallbackSubject =
    defaultSubject ||
    (quoteNumber
      ? `Formal Client Quotation #${quoteNumber} - ${companyName || clientName}`
      : `BrandFlow Pro Project Update - ${projectName || jobNumber || 'Printing Order'}`);

  const fallbackBody =
    defaultBody ||
    `Dear ${clientName || 'Valued Client'},\n\nPlease find attached the official documentation regarding your project "${projectName || 'Print Order'}" (Ref: ${quoteNumber || jobNumber || 'BF-2026'}).\n\nIf you have any questions, feel free to reply directly to this message.\n\nBest regards,\nBrandFlow Pro Client Services\nwww.brandflowpro.co.za`;

  const handleQuickSend = async (programId: PopularMailProgram) => {
    setIsMenuOpen(false);
    try {
      const log = await sendAndLogEmail({
        mailProgram: programId,
        to: toEmail,
        clientName: clientName,
        company: companyName,
        clientId: clientId,
        jobNumber: jobNumber,
        quoteNumber: quoteNumber,
        projectName: projectName,
        subject: fallbackSubject,
        body: fallbackBody,
        sender: 'BrandFlow Pro Sales Specialist',
        onNotify: onSaveNotification,
      });

      if (onEmailSent) {
        onEmailSent(log.id);
      }
    } catch (e) {
      console.error('Quick send error:', e);
    }
  };

  const buttonStyle =
    variant === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
      : variant === 'amber'
      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black shadow-amber-500/20 border border-amber-300/30'
      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px]';

  return (
    <div className={`relative inline-flex items-stretch rounded-xl shadow-md ${className}`}>
      {/* Primary Click to Open 5-Program Modal */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`px-4 py-2 text-xs font-bold rounded-l-xl flex items-center space-x-1.5 cursor-pointer transition-all ${buttonStyle}`}
        title="Open Multi-Mailer Client Selection & Database Audit Log"
      >
        <Mail className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>

      {/* Dropdown Chevron for 1-Click Quick Direct Launch */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`px-2 py-2 text-xs font-bold rounded-r-xl border-l border-emerald-500/40 flex items-center justify-center cursor-pointer transition-all ${buttonStyle}`}
        title="Quick Send via 5 Popular Mailing Programs"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Quick Launch Dropdown Popover */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100 text-zinc-100 text-xs">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 flex justify-between items-center">
              <span>Send via 5 Popular Mailers</span>
              <span className="text-emerald-400 font-mono">Auto Log</span>
            </div>

            {POPULAR_MAIL_PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => handleQuickSend(prog.id)}
                className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-extrabold uppercase px-1 py-0.5 rounded border ${prog.badgeColor}`}>
                    {prog.id.split(' ')[0]}
                  </span>
                  <span className="text-zinc-200 group-hover:text-amber-300 font-medium">
                    {prog.name}
                  </span>
                </div>
                <Send className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400" />
              </button>
            ))}

            <div className="pt-1 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full text-center py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Customize Message & Audit Details →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Full Modal */}
      <ClientEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toEmail={toEmail}
        clientName={clientName}
        companyName={companyName}
        clientId={clientId}
        jobNumber={jobNumber}
        quoteNumber={quoteNumber}
        projectName={projectName}
        defaultSubject={fallbackSubject}
        defaultBody={fallbackBody}
        onEmailSent={onEmailSent}
        onSaveNotification={onSaveNotification}
      />
    </div>
  );
};
