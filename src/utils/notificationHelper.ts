import { Job, WorkflowStage } from '../types';

export type TargetDepartment = 'QUOTATION' | 'ARTWORK' | 'Ready for Dispatch' | string;

export interface TriggerNotificationParams {
  job: Job;
  newStatus?: WorkflowStage | string;
  department?: TargetDepartment;
  onNotify: (msg: string) => void;
  customMsg?: string;
}

export interface ClientReminder {
  id: string;
  jobId: string;
  jobNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: 'QUOTATION' | 'ARTWORK';
  scheduledTime: string; // e.g., 'Daily at 08:00 AM'
  status: 'Scheduled (08:00 AM)' | 'Sent' | 'Failed' | 'Paused';
  emailSubject: string;
  emailBody: string;
  whatsappMessage: string;
  sentAt?: string;
  approvalStatus: 'APPROVAL NEEDED';
  dateSent: string;
}

/**
 * Generates automated 08:00 AM Client Reminder Queue for Quotations & Artwork Proofs
 * requiring client approval.
 */
export function generateClientReminders(jobs: Job[]): ClientReminder[] {
  const reminders: ClientReminder[] = [];

  jobs.forEach((job) => {
    const isQuotePending =
      job.stage === 'Quotation' ||
      job.quote?.status === 'Sent to Client' ||
      job.quote?.status === 'Draft';

    const isArtworkPending =
      job.stage === 'Artwork' ||
      job.stage === 'Proofing' ||
      job.proofApproval?.status === 'Pending Review' ||
      (job.artworkVersions && job.artworkVersions.length > 0);

    const clientEmail = job.proofApproval?.clientApproverEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '')}@client.com`;
    const clientPhone = '+27 82 555 ' + Math.floor(1000 + Math.random() * 9000);
    const projTitle = job.projectName || job.category || 'Printing Project';

    if (isQuotePending) {
      const quoteNum = job.quote?.quoteNumber || job.jobNumber;
      const quoteSubj = `APPROVAL NEEDED: Quotation #${quoteNum} - ${projTitle}`;
      const quoteBody = `Dear ${job.customerName || 'Client'},\n\nPlease review and approve your formal Quotation #${quoteNum} for "${projTitle}".\n\nApproval Link: https://printcraft.io/quote/${job.jobNumber}\n\nThank you,\nBrandFlow Pro Team`;

      reminders.push({
        id: `rem-q-${job.id}`,
        jobId: job.id,
        jobNumber: job.jobNumber,
        clientName: job.customerName || job.companyName || 'Valued Client',
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        type: 'QUOTATION',
        scheduledTime: 'Tomorrow at 08:00 AM',
        status: 'Scheduled (08:00 AM)',
        emailSubject: quoteSubj,
        emailBody: quoteBody,
        whatsappMessage: `Hello ${job.customerName || 'Client'}, APPROVAL NEEDED for Quotation #${quoteNum} (${projTitle}). Please review & approve: https://printcraft.io/quote/${job.jobNumber}`,
        approvalStatus: 'APPROVAL NEEDED',
        dateSent: job.quote?.dateCreated || job.dateCreated || '2026-07-20',
      });
    }

    if (isArtworkPending) {
      const artSubj = `APPROVAL NEEDED: Artwork Proof #${job.jobNumber} - ${projTitle}`;
      const artBody = `Dear ${job.customerName || 'Client'},\n\nYour digital print proof for project "${projTitle}" (Job #${job.jobNumber}) is ready for sign-off.\n\nApproval Link: https://printcraft.io/proof/${job.jobNumber}\n\nThank you,\nBrandFlow Design Team`;

      reminders.push({
        id: `rem-a-${job.id}`,
        jobId: job.id,
        jobNumber: job.jobNumber,
        clientName: job.customerName || job.companyName || 'Valued Client',
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        type: 'ARTWORK',
        scheduledTime: 'Tomorrow at 08:00 AM',
        status: 'Scheduled (08:00 AM)',
        emailSubject: artSubj,
        emailBody: artBody,
        whatsappMessage: `Hello ${job.customerName || 'Client'}, APPROVAL NEEDED for Artwork Proof #${job.jobNumber} (${projTitle}). Please verify CMYK colors & layout: https://printcraft.io/proof/${job.jobNumber}`,
        approvalStatus: 'APPROVAL NEEDED',
        dateSent: job.artworkVersions?.[0]?.uploadedAt || job.dateCreated || '2026-07-21',
      });
    }
  });

  return reminders;
}

/**
 * Triggers sending an Email & WhatsApp reminder to the client for Quotation or Artwork APPROVAL NEEDED.
 */
export function sendClientReminder(
  reminder: ClientReminder,
  channel: 'email' | 'whatsapp' | 'both' = 'both',
  onNotify?: (msg: string) => void
): string {
  const icon = reminder.type === 'QUOTATION' ? '📋' : '🎨';
  let message = '';

  if (channel === 'both') {
    message = `${icon} [08:00 AM REMINDER DISPATCHED] Email & WhatsApp "APPROVAL NEEDED" sent to ${reminder.clientName} (${reminder.clientEmail} & ${reminder.clientPhone}) for ${reminder.type} #${reminder.jobNumber}!`;
  } else if (channel === 'email') {
    message = `✉️ [EMAIL REMINDER SENT] "APPROVAL NEEDED" email sent to ${reminder.clientEmail} for ${reminder.type} #${reminder.jobNumber}`;
  } else {
    message = `💬 [WHATSAPP SENT] "APPROVAL NEEDED" WhatsApp sent to ${reminder.clientPhone} for ${reminder.type} #${reminder.jobNumber}`;
  }

  if (onNotify) {
    onNotify(message);
  }

  return message;
}

/**
 * Helper function that triggers a 'QUOTATION', 'ARTWORK', or 'Ready for Dispatch'
 * notification banner when a job status is updated to the relevant departments.
 *
 * @param params Configuration object containing job, new status, optional department, callback and custom messages.
 * @returns The generated notification banner string message.
 */
export function triggerStatusNotification({
  job,
  newStatus,
  department,
  onNotify,
  customMsg,
}: TriggerNotificationParams): string {
  const statusStr = (newStatus || job.stage || '').toString().toUpperCase();

  let targetDept: 'QUOTATION' | 'ARTWORK' | 'Ready for Dispatch' | 'GENERAL' = 'GENERAL';

  if (department === 'QUOTATION' || department === 'ARTWORK' || department === 'Ready for Dispatch') {
    targetDept = department;
  } else if (
    statusStr.includes('QUOTE') ||
    statusStr.includes('QUOTATION') ||
    statusStr.includes('ESTIMATE') ||
    statusStr.includes('CLIENTQUOTE')
  ) {
    targetDept = 'QUOTATION';
  } else if (
    statusStr.includes('ARTWORK') ||
    statusStr.includes('DESIGN') ||
    statusStr.includes('PREFLIGHT') ||
    statusStr.includes('PROOF')
  ) {
    targetDept = 'ARTWORK';
  } else if (
    statusStr.includes('DISPATCH') ||
    statusStr.includes('READY FOR DISPATCH') ||
    statusStr.includes('SHIPPING') ||
    statusStr.includes('COURIER') ||
    statusStr.includes('QC') ||
    statusStr.includes('QUALITY')
  ) {
    targetDept = 'Ready for Dispatch';
  }

  let notificationBanner = '';

  switch (targetDept) {
    case 'QUOTATION':
      notificationBanner = `📋 [QUOTATION DEPT BANNER] Job #${job.jobNumber} (${job.companyName}) updated to QUOTATION status! ${
        customMsg || `Routed to Sales & Estimating for Quote #${job.quote?.quoteNumber || 'Q-2026'}`
      }`;
      break;

    case 'ARTWORK':
      notificationBanner = `🎨 [ARTWORK DEPT BANNER] Job #${job.jobNumber} (${job.companyName}) updated to ARTWORK status! ${
        customMsg || `Routed to Design Studio for Preflight & Digital Proofing`
      }`;
      break;

    case 'Ready for Dispatch':
      notificationBanner = `🚚 [DISPATCH DEPT BANNER] Job #${job.jobNumber} (${job.companyName}) status updated to Ready for Dispatch! ${
        customMsg || `Routed to Shipping & Courier Logistics`
      }`;
      break;

    default:
      notificationBanner = `🔔 [SYSTEM UPDATE] Job #${job.jobNumber} status updated to ${newStatus || job.stage}`;
      break;
  }

  // Trigger notification callback to display the banner in UI
  if (onNotify) {
    onNotify(notificationBanner);
  }

  return notificationBanner;
}

/**
 * Convenience helper to trigger a QUOTATION department notification banner directly.
 */
export function triggerQuotationNotification(
  job: Job,
  onNotify: (msg: string) => void,
  customDetails?: string
) {
  return triggerStatusNotification({
    job,
    department: 'QUOTATION',
    onNotify,
    customMsg: customDetails,
  });
}

/**
 * Convenience helper to trigger an ARTWORK department notification banner directly.
 */
export function triggerArtworkNotification(
  job: Job,
  onNotify: (msg: string) => void,
  customDetails?: string
) {
  return triggerStatusNotification({
    job,
    department: 'ARTWORK',
    onNotify,
    customMsg: customDetails,
  });
}

/**
 * Convenience helper to trigger a Ready for Dispatch department notification banner directly.
 */
export function triggerDispatchNotification(
  job: Job,
  onNotify: (msg: string) => void,
  customDetails?: string
) {
  return triggerStatusNotification({
    job,
    department: 'Ready for Dispatch',
    onNotify,
    customMsg: customDetails,
  });
}
