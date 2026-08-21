import React, { useState } from 'react';
import { Mail, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';

interface EmailLinkProps {
  email: string;
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
 * Programmatically open the user's default email client (Outlook, Gmail, Apple Mail, etc.)
 */
export function openMailClient(
  email: string,
  options?: { subject?: string; body?: string; cc?: string; bcc?: string }
) {
  if (!email) return;
  const mailto = getMailtoUrl(email, options);
  window.location.href = mailto;
}

/**
 * Interactive Email Link component that launches the user's email client (Outlook, Gmail, etc.)
 */
export const EmailLink: React.FC<EmailLinkProps> = ({
  email,
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
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!email) return null;

  const mailtoUrl = getMailtoUrl(email, { subject, body, cc, bcc });
  const gmailUrl = getGmailWebComposeUrl(email, { subject, body, cc, bcc });
  const tooltipTitle =
    title || `Click to compose email to ${email} (Outlook, Gmail, or default mail client)`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const content = (
    <a
      href={mailtoUrl}
      onClick={(e) => {
        // Prevent event bubbling if placed inside table row click handlers
        e.stopPropagation();
      }}
      title={tooltipTitle}
      aria-label={tooltipTitle}
      className={`group/emaillink inline-flex items-center space-x-1 font-mono transition-all duration-150 cursor-pointer text-amber-300 hover:text-amber-200 hover:underline decoration-amber-400/60 underline-offset-2 ${className}`}
    >
      {showIcon && (
        <Mail
          className={`shrink-0 text-amber-400 group-hover/emaillink:text-amber-300 transition-colors ${iconClassName}`}
        />
      )}
      <span className="truncate">{children || email}</span>
    </a>
  );

  if (!showQuickActions) {
    return content;
  }

  return (
    <div
      className={`relative ${inline ? 'inline-flex items-center space-x-1.5' : 'flex items-center justify-between'}`}
      onMouseLeave={() => setShowMenu(false)}
    >
      {content}

      <div className="inline-flex items-center space-x-1 ml-1 opacity-80 hover:opacity-100">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy email address"
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>

        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Open in Gmail Web"
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-amber-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
