import React, { useState, useEffect } from 'react';
import {
  Database,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Search,
  Filter,
  User,
  Building2,
} from 'lucide-react';
import { ClientEmailLog } from '../types';
import {
  getLocalStoredEmailLogs,
  filterEmailLogsForClient,
  POPULAR_MAIL_PROGRAMS,
} from '../utils/emailClientHelper';
import { ClientEmailSendButton } from './ClientEmailSendButton';

interface ClientEmailLogsCardProps {
  clientId?: string;
  companyName?: string;
  clientName?: string;
  clientEmail?: string;
  jobNumber?: string;
  quoteNumber?: string;
  onSaveNotification?: (msg: string) => void;
  title?: string;
}

export const ClientEmailLogsCard: React.FC<ClientEmailLogsCardProps> = ({
  clientId,
  companyName,
  clientName,
  clientEmail,
  jobNumber,
  quoteNumber,
  onSaveNotification,
  title,
}) => {
  const [logs, setLogs] = useState<ClientEmailLog[]>([]);
  const [filterSearch, setFilterSearch] = useState('');

  const loadLogs = () => {
    const all = getLocalStoredEmailLogs();
    const filtered = filterEmailLogsForClient(all, {
      clientId,
      company: companyName,
      clientEmail,
      jobNumber,
    });
    setLogs(filtered);
  };

  useEffect(() => {
    loadLogs();

    const handleUpdate = () => {
      loadLogs();
    };

    window.addEventListener('brandflow:email_logs_updated', handleUpdate);
    return () => {
      window.removeEventListener('brandflow:email_logs_updated', handleUpdate);
    };
  }, [clientId, companyName, clientEmail, jobNumber]);

  const displayLogs = logs.filter((l) => {
    if (!filterSearch.trim()) return true;
    const term = filterSearch.toLowerCase();
    return (
      l.subject.toLowerCase().includes(term) ||
      l.mailProgram.toLowerCase().includes(term) ||
      l.timestamp.includes(term) ||
      l.sentBy.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mirror-card bg-zinc-900/90 border border-zinc-800/90 rounded-xl p-5 space-y-4 shadow-xl text-zinc-100">
      {/* Header with Title and Quick Re-Send Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-100 flex items-center space-x-2">
              <span>{title || `Client Communication & Database Email Logs`}</span>
              <span className="text-[10px] font-mono font-bold bg-zinc-800 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {logs.length} Logged
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400 font-medium">
              Timestamped audit records of emails dispatched to{' '}
              <span className="text-amber-400 font-semibold">{companyName || clientName || 'Client'}</span>
            </p>
          </div>
        </div>

        {/* Action Button attached with 5 popular mailing programs */}
        {clientEmail && (
          <ClientEmailSendButton
            toEmail={clientEmail}
            clientName={clientName || companyName || 'Client'}
            companyName={companyName || 'Company'}
            clientId={clientId}
            jobNumber={jobNumber}
            quoteNumber={quoteNumber}
            label="Re-Send Email to Client"
            variant="emerald"
            onSaveNotification={onSaveNotification}
            onEmailSent={() => loadLogs()}
          />
        )}
      </div>

      {/* Search Filter if multiple logs */}
      {logs.length > 2 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email logs by subject, program, date..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* Log Records List */}
      {displayLogs.length === 0 ? (
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-6 text-center space-y-2">
          <Mail className="w-7 h-7 text-zinc-600 mx-auto" />
          <p className="text-xs font-semibold text-zinc-400">
            No emails logged yet for this client record.
          </p>
          <p className="text-[11px] text-zinc-500">
            Click "Re-Send Email to Client" above to dispatch via any of the 5 popular mailing programs and create the first timestamped database entry.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Mail Program</th>
                <th className="p-2.5">Subject & Preview</th>
                <th className="p-2.5">Dispatched By</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 font-medium">
              {displayLogs.map((log) => {
                const programMeta = POPULAR_MAIL_PROGRAMS.find((p) => p.id === log.mailProgram);
                const badgeColor = programMeta?.badgeColor || 'bg-zinc-800 text-zinc-300 border-zinc-700';

                return (
                  <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-2.5 font-mono text-[11px] text-amber-300 font-semibold whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {log.mailProgram}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-zinc-200 line-clamp-1">{log.subject}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {log.bodySnippet}
                      </div>
                    </td>
                    <td className="p-2.5 whitespace-nowrap text-zinc-300 text-[11px]">
                      {log.sentBy}
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
