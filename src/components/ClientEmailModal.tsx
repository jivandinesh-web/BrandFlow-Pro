import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
  User,
  Building2,
  Database,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  POPULAR_MAIL_PROGRAMS,
  MailProgramOption,
  sendAndLogEmail,
  formatCurrentTimestamp,
} from '../utils/emailClientHelper';
import { PopularMailProgram } from '../types';

interface ClientEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  toEmail: string;
  clientName: string;
  companyName: string;
  clientId?: string;
  jobNumber?: string;
  quoteNumber?: string;
  projectName?: string;
  defaultSubject?: string;
  defaultBody?: string;
  senderName?: string;
  onEmailSent?: (logId: string) => void;
  onSaveNotification?: (msg: string) => void;
}

export const ClientEmailModal: React.FC<ClientEmailModalProps> = ({
  isOpen,
  onClose,
  toEmail,
  clientName,
  companyName,
  clientId,
  jobNumber,
  quoteNumber,
  projectName,
  defaultSubject = '',
  defaultBody = '',
  senderName = 'BrandFlow Pro Sales Specialist',
  onEmailSent,
  onSaveNotification,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<PopularMailProgram>('Gmail');
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSubject) setSubject(defaultSubject);
    if (defaultBody) setBody(defaultBody);
  }, [defaultSubject, defaultBody, isOpen]);

  if (!isOpen) return null;

  const handleCopyBody = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchEmail = async (programId: PopularMailProgram) => {
    setIsSending(true);
    const time = formatCurrentTimestamp();
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
        subject: subject,
        body: body,
        sender: senderName,
        onNotify: onSaveNotification,
      });

      setLastLoggedTime(time);
      if (onEmailSent) {
        onEmailSent(log.id);
      }
      setTimeout(() => {
        setIsSending(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error('Error logging and sending email:', err);
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 max-w-2xl w-full p-5 sm:p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-xl shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-zinc-100">
                  Send Email to Client
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Auto Database Log
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Choose any of the 5 popular mailing programs. The dispatched email is automatically timestamped in the database log for{' '}
                <span className="text-amber-400 font-semibold">{companyName || clientName}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client & Metadata Context */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase">Recipient Client</span>
            <div className="font-bold text-zinc-200 mt-0.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{clientName}</span>
              <span className="text-zinc-500 font-normal">({companyName})</span>
            </div>
            <div className="text-amber-300 font-mono text-[11px] mt-0.5 break-all">
              {toEmail}
            </div>
          </div>

          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase">Job / Document Reference</span>
            <div className="font-bold text-zinc-200 mt-0.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{quoteNumber ? `Quote #${quoteNumber}` : `Job #${jobNumber || 'N/A'}`}</span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5 truncate">
              {projectName || 'Printing & Branding Order'}
            </div>
          </div>
        </div>

        {/* 5 Popular Mailing Programs Selection Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Mailing Program (5 Popular Services Supported)</span>
            </span>
            <span className="text-[10px] text-zinc-400">Click any program to dispatch</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_MAIL_PROGRAMS.map((prog) => {
              const isSelected = selectedProgram === prog.id;
              return (
                <button
                  key={prog.id}
                  type="button"
                  onClick={() => {
                    setSelectedProgram(prog.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${prog.badgeColor}`}>
                        {prog.id.split(' ')[0]}
                      </span>
                      <span className="font-bold text-xs text-zinc-100">{prog.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{prog.description}</p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Subject & Body Customization */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-zinc-300">Message Content</label>
              <button
                type="button"
                onClick={handleCopyBody}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Database Logging Audit Notice */}
        <div className="p-3 bg-zinc-950 border border-zinc-800/90 rounded-xl flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Timestamp audit: <strong className="text-zinc-200">{formatCurrentTimestamp()}</strong> • Logged to client history
            </span>
          </div>
          <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
            Ready to Dispatch
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleDispatchEmail(selectedProgram)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 cursor-pointer border border-emerald-300/30"
            >
              <Send className="w-4 h-4 text-zinc-950" />
              <span>
                {isSending
                  ? 'Dispatching & Logging...'
                  : `Open in ${selectedProgram} & Log to Database`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
