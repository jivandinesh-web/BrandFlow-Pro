import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  BellRing,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { Job } from '../types';
import {
  ClientReminder,
  generateClientReminders,
  sendClientReminder,
} from '../utils/notificationHelper';
import { EmailLink } from './EmailLink';
import { ClientEmailSendButton } from './ClientEmailSendButton';
import {
  logAutoCronBatchExecution,
  logSingleReminderExecution,
} from '../utils/auditLogger';

interface ClientFollowUpPanelProps {
  jobs: Job[];
  onSaveNotification?: (msg: string) => void;
}

export const ClientFollowUpPanel: React.FC<ClientFollowUpPanelProps> = ({
  jobs,
  onSaveNotification,
}) => {
  const [autoReminderEnabled, setAutoReminderEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'QUOTATION' | 'ARTWORK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderList, setReminderList] = useState<ClientReminder[]>(() =>
    generateClientReminders(jobs)
  );
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [lastBatchLogTimestamp, setLastBatchLogTimestamp] = useState<string | null>(null);

  const filteredReminders = reminderList.filter((rem) => {
    const matchesTab = activeTab === 'ALL' || rem.type === activeTab;
    const matchesSearch =
      rem.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rem.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rem.emailSubject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendIndividual = async (reminder: ClientReminder, channel: 'email' | 'whatsapp' | 'both') => {
    sendClientReminder(reminder, channel, onSaveNotification);

    const targetJob = jobs.find((j) => j.jobNumber === reminder.jobNumber);
    await logSingleReminderExecution({
      reminder,
      channel,
      job: targetJob,
      onNotify: onSaveNotification,
    });

    setReminderList((prev) =>
      prev.map((r) =>
        r.id === reminder.id
          ? {
              ...r,
              status: 'Sent',
              sentAt: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            }
          : r
      )
    );
    setSentCount((prev) => prev + 1);
  };

  const handleRun0800AMBatch = async () => {
    setIsProcessingBatch(true);
    const pendingItems = reminderList.filter((rem) => rem.status === 'Scheduled (08:00 AM)');

    // If all are already marked sent, run with the full active queue so users can trigger re-test
    const batchTarget = pendingItems.length > 0 ? pendingItems : reminderList.slice(0, 4);

    try {
      const result = await logAutoCronBatchExecution({
        reminders: batchTarget,
        jobs,
        onNotify: onSaveNotification,
      });

      const updatedList = reminderList.map((rem) => {
        if (batchTarget.some((b) => b.id === rem.id)) {
          return {
            ...rem,
            status: 'Sent' as const,
            sentAt: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (08:00 AM Batch)`,
          };
        }
        return rem;
      });

      setReminderList(updatedList);
      setSentCount((prev) => prev + batchTarget.length);
      setLastBatchLogTimestamp(result.timestamp);
    } catch (e) {
      console.error('Batch logging error:', e);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  return (
    <div className="mirror-card rounded-2xl p-6 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] text-zinc-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white rounded-2xl shadow-lg shadow-blue-500/20 border border-white/20">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>08:00 AM Client Reminders & Approvals Engine</span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase font-mono">
                  APPROVAL NEEDED
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Automated Daily Email & WhatsApp follow-ups triggered at 08:00 AM after Quote or Artwork is sent
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Controller Toggle & Batch Trigger */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="flex items-center space-x-2.5 bg-white/[0.05] p-2 px-3.5 rounded-xl border border-white/[0.08] shadow-xs">
            <Clock className="w-4 h-4 text-[#0a84ff]" />
            <span className="text-xs font-medium text-slate-300">Auto 08:00 AM Cron</span>
            <button
              onClick={() => setAutoReminderEnabled(!autoReminderEnabled)}
              aria-label="Toggle auto 08:00 AM cron"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                autoReminderEnabled ? 'bg-[#30d158]' : 'bg-white/[0.2]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoReminderEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleRun0800AMBatch}
            disabled={isProcessingBatch}
            className="px-4 py-2 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingBatch ? 'animate-spin' : ''}`} />
            <span>Run 08:00 AM Batch Now</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.04] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] flex items-center justify-between shadow-xs hover:border-amber-500/30 transition-all">
          <div>
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
              Pending Quotation Approvals
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {reminderList.filter((r) => r.type === 'QUOTATION' && r.status.includes('Scheduled')).length} Clients
            </div>
          </div>
          <div className="p-3 bg-amber-500/15 text-amber-300 rounded-2xl border border-amber-500/30 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] flex items-center justify-between shadow-xs hover:border-purple-500/30 transition-all">
          <div>
            <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider font-mono">
              Pending Artwork Approvals
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {reminderList.filter((r) => r.type === 'ARTWORK' && r.status.includes('Scheduled')).length} Proofs
            </div>
          </div>
          <div className="p-3 bg-purple-500/15 text-purple-300 rounded-2xl border border-purple-500/30 shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] flex items-center justify-between shadow-xs hover:border-emerald-500/30 transition-all">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              08:00 AM Reminders Sent
            </div>
            <div className="text-2xl font-bold text-white mt-1">{sentCount} Dispatched</div>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-2xl border border-emerald-500/30 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Admin Database Sync & Timestamp Status Banner */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-3 px-4.5 flex flex-wrap items-center justify-between gap-3 text-xs border border-white/[0.08] shadow-inner">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/30">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Admin Database Audit Sync:</span>{' '}
            <span className="text-slate-400">
              Automated cron batch executions & dispatches are automatically timestamped and permanently logged to the Admin Database.
            </span>
          </div>
        </div>
        {lastBatchLogTimestamp ? (
          <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Last Batch Logged: <strong>{lastBatchLogTimestamp}</strong></span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-white/[0.06] text-slate-300 px-3 py-1 rounded-full border border-white/[0.08]">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Target Batch: <strong>Daily at 08:00:00 AM</strong></span>
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-1 bg-white/[0.05] border border-white/[0.08] p-1 rounded-xl text-xs font-medium text-slate-300 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ALL' ? 'bg-[#0a84ff] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Reminders ({reminderList.length})
          </button>
          <button
            onClick={() => setActiveTab('QUOTATION')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'QUOTATION' ? 'bg-[#0a84ff] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quotation Approvals
          </button>
          <button
            onClick={() => setActiveTab('ARTWORK')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ARTWORK' ? 'bg-[#0a84ff] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Artwork Approvals
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client or job #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#0a84ff] shadow-xs"
          />
        </div>
      </div>

      {/* Reminder Cards Grid */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium border border-dashed border-white/[0.1] rounded-2xl">
            No pending client reminders matching your filter criteria.
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className="p-4.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3.5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border font-mono ${
                      rem.type === 'QUOTATION'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {rem.type}
                  </span>

                  <span className="text-xs font-mono font-bold text-[#0a84ff]">
                    #{rem.jobNumber}
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {rem.clientName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>APPROVAL NEEDED</span>
                  </span>

                  <span
                    className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border font-mono ${
                      rem.status === 'Sent'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {rem.status}
                  </span>
                </div>
              </div>

              {/* Message Details Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium flex-wrap gap-1">
                    <span className="flex items-center space-x-1.5 text-slate-200">
                      <Mail className="w-3.5 h-3.5 text-[#0a84ff] shrink-0" />
                      <span>Email Template:</span>
                      <EmailLink
                        email={rem.clientEmail}
                        subject={rem.emailSubject}
                        body={rem.emailBody}
                        showQuickActions
                        className="text-[#0a84ff] font-semibold text-[11px]"
                      />
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">08:00 AM Cron</span>
                  </div>
                  <div className="text-slate-300 font-medium text-xs truncate">
                    {rem.emailSubject}
                  </div>
                </div>

                <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center space-x-1 text-slate-200">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Template ({rem.clientPhone})</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">08:00 AM Cron</span>
                  </div>
                  <div className="text-slate-400 text-[11px] line-clamp-2">
                    {rem.whatsappMessage}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Item Date: <strong className="text-slate-300">{rem.dateSent}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>Next auto-trigger: <strong className="text-[#0a84ff] font-mono">08:00 AM</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <ClientEmailSendButton
                    toEmail={rem.clientEmail}
                    clientName={rem.clientName}
                    companyName={rem.clientName}
                    jobNumber={rem.jobNumber}
                    defaultSubject={rem.emailSubject}
                    defaultBody={rem.whatsappMessage}
                    label="Re-Send Email to Client"
                    variant="emerald"
                    onSaveNotification={onSaveNotification}
                    onEmailSent={() => {
                      setReminderList((prev) =>
                        prev.map((r) =>
                          r.id === rem.id
                            ? {
                                ...r,
                                status: 'Sent',
                                sentAt: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                              }
                            : r
                        )
                      );
                      setSentCount((prev) => prev + 1);
                    }}
                  />

                  <button
                    onClick={() => handleSendIndividual(rem, 'whatsapp')}
                    className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 hover:text-white font-medium rounded-xl text-[11px] shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>Send WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleSendIndividual(rem, 'both')}
                    className="px-3.5 py-1.5 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-xl text-[11px] shadow-md shadow-blue-500/25 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Both Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
