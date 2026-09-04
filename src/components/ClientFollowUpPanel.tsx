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
    <div className="mirror-card rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>08:00 AM Client Reminders & Approvals Engine</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs uppercase font-mono">
                  APPROVAL NEEDED
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Automated Daily Email & WhatsApp follow-ups triggered at 08:00 AM after Quote or Artwork is sent
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Controller Toggle & Batch Trigger */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="flex items-center space-x-2.5 bg-white/90 p-1.5 px-3 rounded-xl border border-slate-200 shadow-2xs">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Auto 08:00 AM Cron</span>
            <button
              onClick={() => setAutoReminderEnabled(!autoReminderEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                autoReminderEnabled ? 'bg-indigo-600' : 'bg-slate-300'
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
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingBatch ? 'animate-spin' : ''}`} />
            <span>Run 08:00 AM Batch Now</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-xl border border-amber-200/80 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono">
              Pending Quotation Approvals
            </div>
            <div className="text-2xl font-black text-amber-900 mt-0.5">
              {reminderList.filter((r) => r.type === 'QUOTATION' && r.status.includes('Scheduled')).length} Clients
            </div>
          </div>
          <div className="p-2.5 bg-amber-500/15 text-amber-700 rounded-xl border border-amber-300/60">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-4 rounded-xl border border-purple-200/80 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider font-mono">
              Pending Artwork Approvals
            </div>
            <div className="text-2xl font-black text-purple-900 mt-0.5">
              {reminderList.filter((r) => r.type === 'ARTWORK' && r.status.includes('Scheduled')).length} Proofs
            </div>
          </div>
          <div className="p-2.5 bg-purple-500/15 text-purple-700 rounded-xl border border-purple-300/60">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-xl border border-emerald-200/80 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
              08:00 AM Reminders Sent
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-0.5">{sentCount} Dispatched</div>
          </div>
          <div className="p-2.5 bg-emerald-500/15 text-emerald-700 rounded-xl border border-emerald-300/60">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Admin Database Sync & Timestamp Status Banner */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs border border-slate-800 shadow-inner">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Admin Database Audit Sync:</span>{' '}
            <span className="text-slate-400">
              Automated cron batch executions & dispatches are automatically timestamped and permanently logged to the Admin Database.
            </span>
          </div>
        </div>
        {lastBatchLogTimestamp ? (
          <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Last Batch Logged: <strong>{lastBatchLogTimestamp}</strong></span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Target Batch: <strong>Daily at 08:00:00 AM</strong></span>
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-slate-100/90 border border-slate-200 p-1 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Reminders ({reminderList.length})
          </button>
          <button
            onClick={() => setActiveTab('QUOTATION')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'QUOTATION' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quotation Approvals
          </button>
          <button
            onClick={() => setActiveTab('ARTWORK')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ARTWORK' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Artwork Approvals
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search client or job #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Reminder Cards Grid */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
            No pending client reminders matching your filter criteria.
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all space-y-3 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border font-mono ${
                      rem.type === 'QUOTATION'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {rem.type}
                  </span>

                  <span className="text-xs font-mono font-black text-indigo-600">
                    #{rem.jobNumber}
                  </span>

                  <span className="text-xs font-bold text-slate-800">
                    {rem.clientName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>APPROVAL NEEDED</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border font-mono ${
                      rem.status === 'Sent'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {rem.status}
                  </span>
                </div>
              </div>

              {/* Message Details Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold flex-wrap gap-1">
                    <span className="flex items-center space-x-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Email Template:</span>
                      <EmailLink
                        email={rem.clientEmail}
                        subject={rem.emailSubject}
                        body={rem.emailBody}
                        showQuickActions
                        className="text-indigo-600 font-bold text-[11px]"
                      />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">08:00 AM Cron</span>
                  </div>
                  <div className="text-slate-800 font-semibold text-xs truncate">
                    {rem.emailSubject}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center space-x-1 text-slate-700">
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp Template ({rem.clientPhone})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">08:00 AM Cron</span>
                  </div>
                  <div className="text-slate-600 text-[11px] line-clamp-2">
                    {rem.whatsappMessage}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>
                    Item Date: <strong className="text-slate-700">{rem.dateSent}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Next auto-trigger: <strong className="text-indigo-600 font-mono">08:00 AM</strong></span>
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
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold rounded-lg text-[11px] shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Send WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleSendIndividual(rem, 'both')}
                    className="px-3.5 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold rounded-lg text-[11px] shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
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
