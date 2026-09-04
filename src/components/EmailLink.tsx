import React, { useState } from 'react';
import { Mail, ExternalLink, Copy, Check, Sparkles, Send, Database } from 'lucide-react';
import {
  POPULAR_MAIL_PROGRAMS,
  sendAndLogEmail,
  formatCurrentTimestamp,
} from '../utils/emailClientHelper';
import { PopularMailProgram } from '../types';
import { ClientEmailModal } from './ClientEmailModal';

interface EmailLinkProps {
  email: string;
  clientName?: string;
  companyName?: string;
  clientId?: string;
  jobNumber?: string;
  quoteNumber?: string;
  projectName?: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  children?: React.ReactNode;
  title?: string;
  showQuickActions?: boolean;
  inline?: boolean;
  onLogAction?: (logId: string) => void;
  onSaveNotification?: (msg: string) => void;
}

/**
 * Utility to generate a standard mailto: URL for Outlook, Apple Mail, Thunderbird, etc.
 */
export function getMailtoUrl(
  email: string,
  options?: { subject?: string; body?: string; cc?: string; bcc?: string }
): string {
  if (!email) return '#';
  const params = new URLSearchParams();
  if (options?.subject) params.append('subject', options.subject);
  if (options?.body) params.append('body', options.body);
  if (options?.cc) params.append('cc', options.cc);
  if (options?.bcc) params.append('bcc', options.bcc);

  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
}

/**
 * Utility to generate a direct web Gmail compose URL
 */
export function getGmailWebComposeUrl(
  email: string,
  options?: { subject?: string; body?: string; cc?: string; bcc?: string }
): string {
  if (!email) return '#';
  const params = new URLSearchParams();
  params.append('view', 'cm');
  params.append('fs', '1');
  params.append('to', email);
  if (options?.subject) params.append('su', options.subject);
  if (options?.body) params.append('body', options.body);
  if (options?.cc) params.append('cc', options.cc);
  if (options?.bcc) params.append('bcc', options.bcc);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Interactive Email Link component that connects to 5 popular mailing programs and logs to database
 */
export const EmailLink: React.FC<EmailLinkProps> = ({
  email,
  clientName,
  companyName,
  clientId,
  jobNumber,
  quoteNumber,
  projectName,
  subject,
  body,
  cc,
  bcc,
  className = '',
  showIcon = false,
  iconClassName = 'w-3.5 h-3.5',
  children,
  title,
  showQuickActions = false,
  inline = true,
  onLogAction,
  onSaveNotification,
}) => {
  const [copied, setCopied] = useState(false);
  const [showProgramMenu, setShowProgramMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!email) return null;

  const effectiveSubject = subject || `BrandFlow Pro Communication - ${companyName || clientName || 'Client'}`;
  const effectiveBody = body || `Hello ${clientName || 'Valued Client'},\n\nRegarding your print project with BrandFlow Pro.\n\nBest regards,\nBrandFlow Pro Team`;

  const tooltipTitle =
    title || `Click to send email to ${email} via 5 Popular Mailers (auto-logs to database)`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProgramClick = async (e: React.MouseEvent, progId: PopularMailProgram) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProgramMenu(false);

    try {
      const log = await sendAndLogEmail({
        mailProgram: progId,
        to: email,
        clientName: clientName || companyName || 'Client',
        company: companyName || clientName || 'Client Account',
        clientId: clientId,
        jobNumber: jobNumber,
        quoteNumber: quoteNumber,
        projectName: projectName,
        subject: effectiveSubject,
        body: effectiveBody,
        sender: 'BrandFlow Pro Sales Specialist',
        onNotify: onSaveNotification,
      });

      if (onLogAction) {
        onLogAction(log.id);
      }
    } catch (err) {
      console.error('Error in EmailLink send:', err);
    }
  };

  const content = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      title={tooltipTitle}
      aria-label={tooltipTitle}
      className={`group/emaillink inline-flex items-center space-x-1 font-mono transition-all duration-150 cursor-pointer text-amber-300 hover:text-amber-200 hover:underline decoration-amber-400/60 underline-offset-2 text-left ${className}`}
    >
      {showIcon && (
        <Mail
          className={`shrink-0 text-amber-400 group-hover/emaillink:text-amber-300 transition-colors ${iconClassName}`}
        />
      )}
      <span className="truncate">{children || email}</span>
    </button>
  );

  return (
    <div
      className={`relative ${inline ? 'inline-flex items-center space-x-1' : 'flex items-center justify-between'}`}
    >
      {content}

      {showQuickActions && (
        <div className="inline-flex items-center space-x-1 ml-1 opacity-80 hover:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy email address"
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowProgramMenu(!showProgramMenu);
            }}
            title="Choose from 5 Popular Mailing Programs"
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 5 Popular Programs Quick Menu */}
      {showProgramMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setShowProgramMenu(false);
            }}
          />
          <div
            className="absolute right-0 top-full mt-1.5 z-50 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 space-y-1 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 flex justify-between">
              <span>5 Popular Mailing Programs</span>
              <span className="text-emerald-400 font-mono">Auto Log</span>
            </div>

            {POPULAR_MAIL_PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={(e) => handleProgramClick(e, prog.id)}
                className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-extrabold uppercase px-1 py-0.5 rounded border ${prog.badgeColor}`}>
                    {prog.id.split(' ')[0]}
                  </span>
                  <span className="text-zinc-200 group-hover:text-amber-300 font-medium truncate">
                    {prog.name}
                  </span>
                </div>
                <Send className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
              </button>
            ))}

            <div className="pt-1 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setShowProgramMenu(false);
                  setIsModalOpen(true);
                }}
                className="w-full text-center py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Open Full Mailer Modal & Logs →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Full Modal */}
      <ClientEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toEmail={email}
        clientName={clientName || companyName || 'Client'}
        companyName={companyName || 'Company'}
        clientId={clientId}
        jobNumber={jobNumber}
        quoteNumber={quoteNumber}
        projectName={projectName}
        defaultSubject={effectiveSubject}
        defaultBody={effectiveBody}
        onEmailSent={onLogAction}
        onSaveNotification={onSaveNotification}
      />
    </div>
  );
};
