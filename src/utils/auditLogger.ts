import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ClientEmailLog, Job, SystemActivity } from '../types';
import { ClientReminder } from './notificationHelper';
import { getLocalStoredEmailLogs, formatCurrentTimestamp } from './emailClientHelper';

const ADMIN_ACTIVITIES_STORAGE_KEY = 'brandflow_admin_system_activities';
const CLIENT_EMAIL_LOGS_STORAGE_KEY = 'brandflow_client_email_logs';

/**
 * Returns currently stored admin system activities from localStorage
 */
export function getStoredAdminSystemActivities(): SystemActivity[] {
  try {
    const saved = localStorage.getItem(ADMIN_ACTIVITIES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading admin system activities from localStorage:', e);
  }
  return [];
}

/**
 * Saves admin system activities to localStorage and emits an update event
 */
export function saveStoredAdminSystemActivities(activities: SystemActivity[]) {
  try {
    localStorage.setItem(ADMIN_ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
    window.dispatchEvent(new CustomEvent('brandflow:system_activities_updated', { detail: activities }));
  } catch (e) {
    console.error('Failed saving admin system activities:', e);
  }
}

/**
 * Logs a new timestamped event into the Admin Database (Firestore & LocalStorage)
 */
export async function logAdminSystemActivity(activityData: {
  category: SystemActivity['category'];
  description: string;
  user: string;
  jobNumber?: string;
  statusBadge?: string;
  priority?: SystemActivity['priority'];
  timestamp?: string;
}): Promise<SystemActivity> {
  const timestamp = activityData.timestamp || formatCurrentTimestamp();
  const id = `act-admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newActivity: SystemActivity = {
    id,
    timestamp,
    timeAgo: 'Just now',
    category: activityData.category,
    description: activityData.description,
    user: activityData.user || 'System Admin',
    jobNumber: activityData.jobNumber,
    statusBadge: activityData.statusBadge || 'Logged',
    priority: activityData.priority || 'Medium',
  };

  // 1. Save to localStorage
  const current = getStoredAdminSystemActivities();
  const updated = [newActivity, ...current].slice(0, 50); // Keep last 50
  saveStoredAdminSystemActivities(updated);

  // 2. Persist to Firestore
  try {
    const actRef = doc(db, 'system_activities', id);
    await setDoc(actRef, newActivity);
  } catch (e) {
    console.warn('Firestore write warning for system activity (cached locally):', e);
  }

  return newActivity;
}

/**
 * Executes and logs the 08:00 AM Auto Cron batch:
 * 1. Creates timestamped Client Communication Database entries for each client in the batch.
 * 2. Creates a timestamped Admin Database Audit record for the batch execution.
 * 3. Persists all entries to Firestore and local storage.
 * 4. Dispatches live update events.
 */
export async function logAutoCronBatchExecution({
  reminders,
  jobs,
  onNotify,
}: {
  reminders: ClientReminder[];
  jobs: Job[];
  onNotify?: (msg: string) => void;
}): Promise<{
  timestamp: string;
  dispatchedCount: number;
  emailLogs: ClientEmailLog[];
  adminActivity: SystemActivity;
}> {
  const formattedTimestamp = formatCurrentTimestamp();
  const isoTimestamp = new Date().toISOString();
  const jobsMap = new Map<string, Job>();
  jobs.forEach((j) => jobsMap.set(j.jobNumber, j));

  const newEmailLogs: ClientEmailLog[] = [];

  // 1. Generate individual timestamped client communication records for each client reminder in batch
  reminders.forEach((rem, idx) => {
    const job = jobsMap.get(rem.jobNumber);
    const company = job?.companyName || rem.clientName || 'Client Account';
    const projectName = job?.projectName || (rem.type === 'QUOTATION' ? 'Quotation Follow-up' : 'Artwork Proof Approval');
    const quoteNumber = job?.quote?.quoteNumber || (rem.type === 'QUOTATION' ? `QT-${rem.jobNumber}` : '');

    const emailLogEntry: ClientEmailLog = {
      id: `EML-CRON-${Date.now()}-${idx}`,
      clientId: job?.customerName || '',
      clientName: rem.clientName,
      company: company,
      clientEmail: rem.clientEmail,
      jobNumber: rem.jobNumber,
      quoteNumber: quoteNumber,
      projectName: projectName,
      subject: rem.emailSubject,
      bodySnippet: `[08:00 AM AUTO CRON BATCH] ${rem.whatsappMessage.slice(0, 160)}...`,
      mailProgram: 'Outlook (Office 365)',
      status: 'Dispatched',
      timestamp: formattedTimestamp,
      isoTimestamp: isoTimestamp,
      sentBy: '08:00 AM Auto Cron Engine (Admin Database)',
    };

    newEmailLogs.push(emailLogEntry);

    // Also persist to Firestore
    try {
      const logRef = doc(db, 'email_logs', emailLogEntry.id);
      setDoc(logRef, emailLogEntry).catch((err) =>
        console.warn('Firestore write warning for individual email log:', err)
      );
    } catch (e) {
      console.warn('Firestore err:', e);
    }
  });

  // Save new email logs to localStorage
  const existingEmailLogs = getLocalStoredEmailLogs();
  const updatedEmailLogs = [...newEmailLogs, ...existingEmailLogs];
  try {
    localStorage.setItem(CLIENT_EMAIL_LOGS_STORAGE_KEY, JSON.stringify(updatedEmailLogs));
    window.dispatchEvent(new CustomEvent('brandflow:email_logs_updated', { detail: updatedEmailLogs }));
  } catch (e) {
    console.error('Failed to update email logs in storage:', e);
  }

  // 2. Create the Admin Database Audit Log Entry
  const batchCount = reminders.length;
  const adminActivity = await logAdminSystemActivity({
    category: reminders.some((r) => r.type === 'QUOTATION') ? 'Quotation' : 'Proof Approval',
    description: `🚀 [08:00 AM AUTO CRON BATCH LOGGED] Dispatched ${batchCount} automated "APPROVAL NEEDED" follow-ups (${reminders
      .map((r) => `#${r.jobNumber}`)
      .join(', ')}) to client database records.`,
    user: 'System Admin (08:00 AM Auto Cron Daemon)',
    jobNumber: reminders[0]?.jobNumber || 'BATCH-ALL',
    statusBadge: 'Cron Batch Logged',
    priority: 'Urgent',
    timestamp: formattedTimestamp,
  });

  // 3. Trigger toast notification
  if (onNotify) {
    onNotify(
      `🚀 [08:00 AM AUTO CRON BATCH EXECUTED & LOGGED AT ${formattedTimestamp}] ${batchCount} "APPROVAL NEEDED" reminders timestamped in Admin Database!`
    );
  }

  return {
    timestamp: formattedTimestamp,
    dispatchedCount: batchCount,
    emailLogs: newEmailLogs,
    adminActivity,
  };
}

/**
 * Logs a single reminder action into both the email database and admin database
 */
export async function logSingleReminderExecution({
  reminder,
  channel,
  job,
  onNotify,
}: {
  reminder: ClientReminder;
  channel: 'email' | 'whatsapp' | 'both';
  job?: Job;
  onNotify?: (msg: string) => void;
}) {
  const formattedTimestamp = formatCurrentTimestamp();
  const isoTimestamp = new Date().toISOString();

  const company = job?.companyName || reminder.clientName || 'Client Account';
  const projectName = job?.projectName || (reminder.type === 'QUOTATION' ? 'Quotation Follow-up' : 'Artwork Proof Approval');
  const quoteNumber = job?.quote?.quoteNumber || (reminder.type === 'QUOTATION' ? `QT-${reminder.jobNumber}` : '');

  // 1. Email / Comm Log
  const emailLogEntry: ClientEmailLog = {
    id: `EML-SINGLE-${Date.now()}`,
    clientId: job?.customerName || '',
    clientName: reminder.clientName,
    company: company,
    clientEmail: reminder.clientEmail,
    jobNumber: reminder.jobNumber,
    quoteNumber: quoteNumber,
    projectName: projectName,
    subject: reminder.emailSubject,
    bodySnippet: `[${channel.toUpperCase()} DISPATCH] ${reminder.whatsappMessage.slice(0, 160)}...`,
    mailProgram: channel === 'whatsapp' ? 'Default Mail Client' : 'Gmail',
    status: 'Dispatched',
    timestamp: formattedTimestamp,
    isoTimestamp: isoTimestamp,
    sentBy: 'Admin Follow-Up Dispatcher',
  };

  const existingEmailLogs = getLocalStoredEmailLogs();
  const updatedEmailLogs = [emailLogEntry, ...existingEmailLogs];
  try {
    localStorage.setItem(CLIENT_EMAIL_LOGS_STORAGE_KEY, JSON.stringify(updatedEmailLogs));
    window.dispatchEvent(new CustomEvent('brandflow:email_logs_updated', { detail: updatedEmailLogs }));
  } catch (e) {
    console.error('Failed to update email logs in storage:', e);
  }

  try {
    const logRef = doc(db, 'email_logs', emailLogEntry.id);
    await setDoc(logRef, emailLogEntry);
  } catch (e) {
    console.warn('Firestore err single log:', e);
  }

  // 2. Admin System Activity Log
  await logAdminSystemActivity({
    category: reminder.type === 'QUOTATION' ? 'Quotation' : 'Proof Approval',
    description: `✉️ [CLIENT REMINDER SENT & LOGGED] "${reminder.approvalStatus}" follow-up dispatched to ${reminder.clientName} (${company}) for #${reminder.jobNumber}.`,
    user: 'System Admin Dispatcher',
    jobNumber: reminder.jobNumber,
    statusBadge: 'Reminder Sent',
    priority: 'High',
    timestamp: formattedTimestamp,
  });

  if (onNotify) {
    onNotify(
      `✉️ [REMINDER LOGGED AT ${formattedTimestamp}] "APPROVAL NEEDED" follow-up for #${reminder.jobNumber} timestamped in Admin Database!`
    );
  }
}
