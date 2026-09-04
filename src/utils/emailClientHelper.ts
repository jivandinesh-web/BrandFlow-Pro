import { collection, doc, setDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ClientEmailLog, PopularMailProgram } from '../types';

export interface MailProgramOption {
  id: PopularMailProgram;
  name: string;
  category: string;
  badgeColor: string;
  description: string;
  iconType: 'gmail' | 'outlook' | 'yahoo' | 'apple' | 'default';
  getUrl: (to: string, subject: string, body: string) => string;
}

export const POPULAR_MAIL_PROGRAMS: MailProgramOption[] = [
  {
    id: 'Gmail',
    name: 'Gmail (Google Workspace)',
    category: 'Web Client',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
    description: 'Open in Gmail Web / Google Workspace compose window',
    iconType: 'gmail',
    getUrl: (to, subject, body) => {
      const params = new URLSearchParams({
        view: 'cm',
        fs: '1',
        to: to,
        su: subject,
        body: body,
      });
      return `https://mail.google.com/mail/?${params.toString()}`;
    },
  },
  {
    id: 'Outlook (Office 365)',
    name: 'Microsoft Outlook (365 / Web)',
    category: 'Web Client',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Open in Microsoft 365 / Outlook Live web compose',
    iconType: 'outlook',
    getUrl: (to, subject, body) => {
      const params = new URLSearchParams({
        to: to,
        subject: subject,
        body: body,
      });
      return `https://outlook.office.com/mail/deeplink/compose?${params.toString()}`;
    },
  },
  {
    id: 'Yahoo Mail',
    name: 'Yahoo Mail',
    category: 'Web Client',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Open in Yahoo Mail web compose interface',
    iconType: 'yahoo',
    getUrl: (to, subject, body) => {
      const params = new URLSearchParams({
        to: to,
        subj: subject,
        body: body,
      });
      return `https://compose.mail.yahoo.com/?${params.toString()}`;
    },
  },
  {
    id: 'Apple / iCloud Mail',
    name: 'Apple Mail / iCloud Mail',
    category: 'Apple & Cloud',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    description: 'Launch Apple Mail protocol or iCloud Mail compose',
    iconType: 'apple',
    getUrl: (to, subject, body) => {
      // Standard macOS / iOS / iCloud friendly mailto trigger
      const params = new URLSearchParams({
        subject: subject,
        body: body,
      });
      return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
    },
  },
  {
    id: 'Default Mail Client',
    name: 'Default Mail App (Desktop Outlook, Thunderbird)',
    category: 'Native OS App',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Launch system default desktop email client (mailto: handler)',
    iconType: 'default',
    getUrl: (to, subject, body) => {
      const params = new URLSearchParams({
        subject: subject,
        body: body,
      });
      return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
    },
  },
];

const INITIAL_EMAIL_LOGS: ClientEmailLog[] = [
  {
    id: 'EML-LOG-101',
    clientId: 'CUST-001',
    clientName: 'Sarah Jenkins',
    company: 'Nexus Global Brands',
    clientEmail: 's.jenkins@nexusbrands.co.za',
    jobNumber: 'BF-2026-8941',
    quoteNumber: 'QT-2026-101',
    projectName: 'Deluxe Embossed Gold Foil Presentation Folders',
    subject: 'Client Quotation #QT-2026-101 - Nexus Global Brands',
    bodySnippet: 'Dear Sarah Jenkins,\n\nPlease find attached formal Quotation #QT-2026-101 for Deluxe Embossed Gold Foil Folders...',
    mailProgram: 'Outlook (Office 365)',
    status: 'Delivered',
    timestamp: '2026-08-28 07:45:12',
    isoTimestamp: '2026-08-28T07:45:12.000Z',
    sentBy: 'David Miller (Sales Specialist)',
  },
  {
    id: 'EML-LOG-102',
    clientId: 'CUST-002',
    clientName: 'Marcus Vance',
    company: 'Apex Luxury Apparel',
    clientEmail: 'm.vance@apexluxury.co.za',
    jobNumber: 'BF-2026-8942',
    quoteNumber: 'QT-2026-102',
    projectName: 'Executive Heavyweight Embroidered Softshell Jackets',
    subject: 'APPROVAL NEEDED: Artwork Proof #BF-2026-8942',
    bodySnippet: 'Dear Marcus Vance,\n\nYour high-resolution print proof for Executive Heavyweight Softshell Jackets is ready...',
    mailProgram: 'Gmail',
    status: 'Sent',
    timestamp: '2026-08-27 16:30:45',
    isoTimestamp: '2026-08-27T16:30:45.000Z',
    sentBy: 'Elena Rostova (Lead Designer)',
  },
  {
    id: 'EML-LOG-103',
    clientId: 'CUST-003',
    clientName: 'Elena Rostova',
    company: 'Vanguard Creative Agency',
    clientEmail: 'elena@vanguardagency.co.za',
    jobNumber: 'BF-2026-8943',
    quoteNumber: 'QT-2026-103',
    projectName: 'Custom Die-Cut Vinyl Window Decals & Storefront Graphics',
    subject: 'Quotation #QT-2026-103 - Vanguard Creative Agency',
    bodySnippet: 'Dear Elena,\n\nPlease review your revised quotation for the storefront window graphics...',
    mailProgram: 'Apple / iCloud Mail',
    status: 'Delivered',
    timestamp: '2026-08-26 11:15:00',
    isoTimestamp: '2026-08-26T11:15:00.000Z',
    sentBy: 'David Miller (Sales Specialist)',
  },
];

const LOCAL_STORAGE_KEY = 'brandflow_client_email_logs';

/**
 * Retrieves local stored logs
 */
export function getLocalStoredEmailLogs(): ClientEmailLog[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading email logs from localStorage:', e);
  }
  return INITIAL_EMAIL_LOGS;
}

/**
 * Saves logs to localStorage and emits an update event
 */
function saveLocalEmailLogs(logs: ClientEmailLog[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('brandflow:email_logs_updated', { detail: logs }));
  } catch (e) {
    console.error('Failed writing email logs to localStorage:', e);
  }
}

export interface SendAndLogEmailParams {
  mailProgram: PopularMailProgram | string;
  to: string;
  clientName: string;
  company: string;
  clientId?: string;
  jobNumber?: string;
  quoteNumber?: string;
  projectName?: string;
  subject: string;
  body: string;
  sender?: string;
  onNotify?: (msg: string) => void;
}

/**
 * Formats current date and time into a clean timestamp string: "YYYY-MM-DD HH:mm:ss"
 */
export function formatCurrentTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Sends the email via one of the 5 popular mailing programs and adds a timestamped record
 * to the client's database log in Firestore and local state.
 */
export async function sendAndLogEmail(params: SendAndLogEmailParams): Promise<ClientEmailLog> {
  const {
    mailProgram,
    to,
    clientName,
    company,
    clientId,
    jobNumber,
    quoteNumber,
    projectName,
    subject,
    body,
    sender = 'BrandFlow Pro System',
    onNotify,
  } = params;

  const now = new Date();
  const formattedTimestamp = formatCurrentTimestamp();
  const isoTimestamp = now.toISOString();

  const programOption = POPULAR_MAIL_PROGRAMS.find((p) => p.id === mailProgram) || POPULAR_MAIL_PROGRAMS[4];
  const composeUrl = programOption.getUrl(to, subject, body);

  const logEntry: ClientEmailLog = {
    id: `EML-LOG-${Date.now()}`,
    clientId: clientId || '',
    clientName: clientName || company || 'Client',
    company: company || clientName || 'Client Account',
    clientEmail: to,
    jobNumber: jobNumber || '',
    quoteNumber: quoteNumber || '',
    projectName: projectName || '',
    subject: subject,
    bodySnippet: body.slice(0, 180) + (body.length > 180 ? '...' : ''),
    mailProgram: programOption.id,
    status: 'Sent',
    timestamp: formattedTimestamp,
    isoTimestamp: isoTimestamp,
    sentBy: sender,
  };

  // 1. Update local storage cache & dispatch custom event
  const currentLogs = getLocalStoredEmailLogs();
  const updatedLogs = [logEntry, ...currentLogs];
  saveLocalEmailLogs(updatedLogs);

  // 2. Persist to Firestore database
  try {
    const logRef = doc(db, 'email_logs', logEntry.id);
    await setDoc(logRef, logEntry);
  } catch (error) {
    console.warn('Firestore write warning for email log (saved in local memory):', error);
  }

  // 3. Launch the chosen email program in a new window or trigger mailto
  if (programOption.id === 'Default Mail Client' || programOption.id === 'Apple / iCloud Mail') {
    // For mailto protocols
    window.location.href = composeUrl;
  } else {
    // For webmail compose URLs (Gmail, Outlook 365, Yahoo Mail)
    window.open(composeUrl, '_blank', 'noopener,noreferrer');
  }

  // 4. Notify UI
  if (onNotify) {
    onNotify(
      `✉️ Email dispatched to ${clientName} (${company}) via ${programOption.name} and timestamped in Database Log at ${formattedTimestamp}`
    );
  }

  return logEntry;
}

/**
 * Filter email logs for a specific client (by ID, company name, or job number)
 */
export function filterEmailLogsForClient(
  allLogs: ClientEmailLog[],
  query: { clientId?: string; company?: string; clientEmail?: string; jobNumber?: string }
): ClientEmailLog[] {
  return allLogs.filter((log) => {
    if (query.clientId && log.clientId && log.clientId === query.clientId) return true;
    if (query.clientEmail && log.clientEmail && log.clientEmail.toLowerCase() === query.clientEmail.toLowerCase()) return true;
    if (query.company && log.company && log.company.toLowerCase().includes(query.company.toLowerCase())) return true;
    if (query.jobNumber && log.jobNumber && log.jobNumber === query.jobNumber) return true;
    return false;
  });
}
