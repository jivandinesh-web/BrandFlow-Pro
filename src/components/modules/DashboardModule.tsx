import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Upload, Truck, RotateCcw, ExternalLink, Filter, Sparkles, TrendingUp, TrendingDown, FileText, Clock, CheckCircle2, AlertTriangle, Printer, DollarSign, Package, Plus, ArrowRight, ShieldCheck, Users, Database } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Job, ModuleType, SystemActivity } from '../../types';
import {
  triggerStatusNotification,
  triggerQuotationNotification,
  triggerArtworkNotification,
  triggerDispatchNotification,
} from '../../utils/notificationHelper';
import { ClientFollowUpPanel } from '../ClientFollowUpPanel';
import { getStoredAdminSystemActivities } from '../../utils/auditLogger';
import { formatRands } from '../../utils/formatters';

interface DashboardModuleProps {
  jobs: Job[];
  onNavigate: (module: ModuleType) => void;
  onSelectJob: (job: Job) => void;
  onSaveJob?: (updatedJob: Job) => void;
  onSaveNotification?: (msg: string) => void;
  isEditing: boolean;
}

const INITIAL_SYSTEM_ACTIVITIES: SystemActivity[] = [
  {
    id: 'act-1',
    timestamp: '2026-07-22 13:48',
    timeAgo: '4 mins ago',
    category: 'Proof Approval',
    description: 'Digital proof #PRF-8941 signed & approved with cryptographic client signature',
    user: 'Sarah Jenkins (Nexus Global Brands)',
    jobNumber: 'BF-2026-8941',
    statusBadge: 'Signed & Approved',
    priority: 'High',
  },
  {
    id: 'act-2',
    timestamp: '2026-07-22 13:25',
    timeAgo: '27 mins ago',
    category: 'Job Update',
    description: 'Workflow stage advanced to PDF Proof Approval for Deluxe Embossed Folders',
    user: 'System Production Controller',
    jobNumber: 'BF-2026-8941',
    statusBadge: 'Proofing',
    priority: 'Medium',
  },
  {
    id: 'act-3',
    timestamp: '2026-07-22 12:50',
    timeAgo: '1 hour ago',
    category: 'Artwork Upload',
    description: 'Vector PDF/X-4 artwork file v2.1 uploaded and preflight check passed (300 DPI, CMYK)',
    user: 'Marcus Vance (Apex Luxury)',
    jobNumber: 'BF-2026-8942',
    statusBadge: 'Preflight Passed',
    priority: 'High',
  },
  {
    id: 'act-4',
    timestamp: '2026-07-22 12:15',
    timeAgo: '1.5 hours ago',
    category: 'QC Inspection',
    description: 'Spectrophotometer color check passed (1.2 ΔE) on Heidelberg XL 106 press sheet',
    user: 'Johan Swart (QC Manager)',
    jobNumber: 'BF-2026-8941',
    statusBadge: 'PASS - Sealed',
    priority: 'Low',
  },
  {
    id: 'act-5',
    timestamp: '2026-07-22 11:30',
    timeAgo: '2 hours ago',
    category: 'Invoicing',
    description: 'Tax Invoice #INV-2026-089 generated for R 68,500 and synchronized to Sage ERP',
    user: 'Financial Controller',
    jobNumber: 'BF-2026-8941',
    statusBadge: 'Synced Sage',
    priority: 'Medium',
  },
  {
    id: 'act-6',
    timestamp: '2026-07-22 10:45',
    timeAgo: '3 hours ago',
    category: 'Dispatch',
    description: 'Express courier consignment note #DSP-9921 issued to Courier Guy (Waybill #CG-88201)',
    user: 'Dispatch Logistics Lead',
    jobNumber: 'BF-2026-8944',
    statusBadge: 'Dispatched',
    priority: 'Medium',
  },
  {
    id: 'act-7',
    timestamp: '2026-07-22 09:50',
    timeAgo: '4 hours ago',
    category: 'Press Status',
    description: 'Roland TrueVIS wide format UV printer completed high-density vinyl cut run',
    user: 'Press Operator Unit 2',
    jobNumber: 'BF-2026-8943',
    statusBadge: 'Completed',
    priority: 'Low',
  },
  {
    id: 'act-8',
    timestamp: '2026-07-22 09:10',
    timeAgo: '5 hours ago',
    category: 'Quotation',
    description: 'Quotation #QT-2026-104 formally approved by Starlight Hotels Group (R 42,000)',
    user: 'David Miller (Sales Rep)',
    jobNumber: 'BF-2026-8945',
    statusBadge: 'Approved',
    priority: 'High',
  },
  {
    id: 'act-9',
    timestamp: '2026-07-22 08:30',
    timeAgo: '5.5 hours ago',
    category: 'Job Update',
    description: 'Priority flag escalated to URGENT - Express for immediate Tajima embroidery slot',
    user: 'Production Manager',
    jobNumber: 'BF-2026-8942',
    statusBadge: 'URGENT',
    priority: 'Urgent',
  },
  {
    id: 'act-10',
    timestamp: '2026-07-22 07:15',
    timeAgo: '6.5 hours ago',
    category: 'Artwork Upload',
    description: 'Hi-res CMYK digital proof generated for Vanguard Creative Agency',
    user: 'Elena Rostova (Designer)',
    jobNumber: 'BF-2026-8943',
    statusBadge: 'Proof Generated',
    priority: 'Low',
  },
];

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  jobs,
  onNavigate,
  onSelectJob,
  onSaveJob,
  onSaveNotification,
  isEditing,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('All');
  const [storedAdminActivities, setStoredAdminActivities] = useState<SystemActivity[]>(() =>
    getStoredAdminSystemActivities()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setStoredAdminActivities(getStoredAdminSystemActivities());
    };
    window.addEventListener('brandflow:system_activities_updated', handleUpdate);
    return () => {
      window.removeEventListener('brandflow:system_activities_updated', handleUpdate);
    };
  }, []);

  const totalRevenue = jobs.reduce((sum, j) => sum + j.totalValue, 0);
  const activeJobsCount = jobs.filter((j) => j.stage !== 'Completed').length;
  const urgentCount = jobs.filter((j) => j.priority.includes('URGENT')).length;
  const pendingProofCount = jobs.filter((j) => j.stage === 'PDF Proof Approval' || j.stage === 'Proofing').length;

  // Build top 10 activities combining live job updates with initial activity records
  const dynamicJobActivities: SystemActivity[] = jobs.map((job, idx) => ({
    id: `job-act-${job.id}`,
    timestamp: `2026-07-22 ${14 - (idx % 8)}:${10 + (idx * 5) % 50}`,
    timeAgo: idx === 0 ? 'Just now' : `${(idx + 1) * 12} mins ago`,
    category:
      job.stage === 'Proofing' || job.stage === 'Approval'
        ? 'Proof Approval'
        : job.stage === 'QualityControl'
        ? 'QC Inspection'
        : job.stage === 'Invoicing'
        ? 'Invoicing'
        : job.stage === 'Dispatch'
        ? 'Dispatch'
        : 'Job Update',
    description: `Order ${job.jobNumber} (${job.projectName}) updated stage to '${job.stage}'`,
    user: job.customerName || 'Account Manager',
    jobNumber: job.jobNumber,
    statusBadge: job.stage,
    priority: job.priority?.toLowerCase().includes('urgent')
      ? 'Urgent'
      : job.priority?.toLowerCase().includes('high')
      ? 'High'
      : job.priority?.toLowerCase().includes('low')
      ? 'Low'
      : 'Medium',
  }));

  // Combine stored admin database logs (highest priority first), live job updates, and baseline mock activities
  const combinedActivities = [...storedAdminActivities, ...dynamicJobActivities, ...INITIAL_SYSTEM_ACTIVITIES];
  const uniqueActivitiesMap = new Map<string, SystemActivity>();
  combinedActivities.forEach((act) => {
    if (!uniqueActivitiesMap.has(act.id)) {
      uniqueActivitiesMap.set(act.id, act);
    }
  });

  const allActivitiesList = Array.from(uniqueActivitiesMap.values());

  const filteredActivities = allActivitiesList.filter((act) => {
    let categoryMatch = true;
    if (activeCategoryFilter === 'Auto Cron') {
      categoryMatch =
        act.description.includes('CRON') ||
        act.description.includes('Cron') ||
        act.user.includes('Cron') ||
        act.statusBadge?.includes('Cron') === true;
    } else if (activeCategoryFilter === 'Updates') {
      categoryMatch = act.category === 'Job Update' || act.category === 'Press Status';
    } else if (activeCategoryFilter === 'Proofs') {
      categoryMatch = act.category === 'Proof Approval' || act.category === 'Artwork Upload';
    } else if (activeCategoryFilter === 'QC & Accounts') {
      categoryMatch = act.category === 'QC Inspection' || act.category === 'Invoicing';
    } else if (activeCategoryFilter === 'Dispatch') {
      categoryMatch = act.category === 'Dispatch' || act.category === 'Quotation';
    }

    let priorityMatch = true;
    if (activePriorityFilter !== 'All') {
      priorityMatch = act.priority === activePriorityFilter;
    }

    return categoryMatch && priorityMatch;
  });

  // Limit strictly to last 15 actions performed across the system
  const last10Activities = filteredActivities.slice(0, 15);

  const getSafeTimestampDisplay = (timeStr: string) => {
    try {
      const parsed = new Date(timeStr.includes('T') ? timeStr : timeStr.replace(' ', 'T'));
      if (!isNaN(parsed.getTime())) {
        return formatDistanceToNow(parsed, { addSuffix: true });
      }
    } catch (e) {
      // ignore
    }
    return timeStr;
  };

  const renderPriorityBadge = (priority?: SystemActivity['priority']) => {
    if (!priority) return null;
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            <AlertTriangle className="w-2.5 h-2.5 animate-pulse" />
            <span>URGENT</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>HIGH</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a84ff]"></span>
            <span>MEDIUM</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/[0.08] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>LOW</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getActivityIcon = (category: SystemActivity['category']) => {
    switch (category) {
      case 'Proof Approval':
        return <CheckCircle2 className="w-4 h-4 text-[#30d158]" />;
      case 'Job Update':
        return <RotateCcw className="w-4 h-4 text-[#0a84ff]" />;
      case 'Artwork Upload':
        return <Upload className="w-4 h-4 text-[#bf5af2]" />;
      case 'Invoicing':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'QC Inspection':
        return <ShieldCheck className="w-4 h-4 text-teal-400" />;
      case 'Dispatch':
        return <Truck className="w-4 h-4 text-indigo-400" />;
      case 'Quotation':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'Press Status':
        return <Printer className="w-4 h-4 text-slate-300" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityBg = (category: SystemActivity['category']) => {
    switch (category) {
      case 'Proof Approval':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200';
      case 'Job Update':
        return 'bg-blue-500/15 border-blue-500/30 text-blue-200';
      case 'Artwork Upload':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-200';
      case 'Invoicing':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-200';
      case 'QC Inspection':
        return 'bg-teal-500/15 border-teal-500/30 text-teal-200';
      case 'Dispatch':
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200';
      case 'Quotation':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-200';
      case 'Press Status':
        return 'bg-white/[0.06] border-white/[0.08] text-slate-200';
      default:
        return 'bg-white/[0.05] border-white/[0.08] text-slate-300';
    }
  };

  const handleActivityClick = (act: SystemActivity) => {
    if (!act.jobNumber) return;
    const targetJob = jobs.find((j) => j.jobNumber === act.jobNumber || j.id === act.jobNumber);
    if (targetJob) {
      onSelectJob(targetJob);
      if (act.category === 'Proof Approval' || act.category === 'Artwork Upload') {
        onNavigate('PdfProofApproval');
      } else if (act.category === 'QC Inspection') {
        onNavigate('QualityControl');
      } else if (act.category === 'Invoicing') {
        onNavigate('Accounts');
      } else if (act.category === 'Dispatch') {
        onNavigate('Dispatch');
      } else if (act.category === 'Quotation') {
        onNavigate('Quotations');
      } else {
        onNavigate('Production');
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* KPI Cards: Apple frosted glass aesthetic with soft diffuse shadows and generous padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Active Jobs Queue */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          onClick={() => onNavigate('Production')}
          className="mirror-card rounded-2xl p-5 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Press Queue</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">{activeJobsCount} Jobs</h3>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/30 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 text-[#30d158]" />
              +14.2% this wk
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">{urgentCount} Urgent</span>
          </div>
        </motion.div>

        {/* KPI 2: Pipeline Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          onClick={() => onNavigate('Accounts')}
          className="mirror-card rounded-2xl p-5 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Monthly Revenue</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">{formatRands(totalRevenue)}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#30d158] to-teal-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/30 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 text-[#30d158]" />
              +8.5% vs target
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">100% Invoiced</span>
          </div>
        </motion.div>

        {/* KPI 3: Proofs & Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          onClick={() => onNavigate('PdfProofApproval')}
          className="mirror-card rounded-2xl p-5 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Client Proofs Queue</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">{pendingProofCount} Pending</h3>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ff9f0a] to-orange-500 text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-300" />
              1.8 hr avg turnaround
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">Crypto Signed</span>
          </div>
        </motion.div>

        {/* KPI 4: Quality & Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          onClick={() => onNavigate('QualityControl')}
          className="mirror-card rounded-2xl p-5 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">QC & Press Yield</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">99.2% PASS</h3>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#bf5af2] to-pink-500 text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-[#30d158]" />
              Delta-E &lt; 1.5
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">ISO 12647-2</span>
          </div>
        </motion.div>
      </div>

      {/* 08:00 AM Client Reminders & Approvals Panel */}
      <ClientFollowUpPanel jobs={jobs} onSaveNotification={onSaveNotification} />

      {/* Machine Press Status & System Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Real-time Press Lines Monitor with Mirror Card Finish */}
        <div className="mirror-card rounded-2xl p-6 space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white shadow-lg shadow-blue-500/20 border border-white/20">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0a84ff] font-mono">
                  Machine Press Lines Live Status
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Automated press telemetry & cycle counters</p>
              </div>
            </div>
            <span className="text-[11px] bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 px-3.5 py-1 rounded-full font-mono font-semibold flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
              3/4 Units Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/[0.03] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex justify-between items-center shadow-xs">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                  Heidelberg XL 106
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Offset • Batch #BF-2026-8941</div>
              </div>
              <span className="px-3 py-1 bg-[#30d158]/15 text-[#30d158] text-[10px] font-semibold rounded-full border border-[#30d158]/30 font-mono">
                8,500 SPH
              </span>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex justify-between items-center shadow-xs">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                  HP Indigo 7K Digital
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Digital • Ready / Idle</div>
              </div>
              <span className="px-3 py-1 bg-[#0a84ff]/15 text-[#0a84ff] text-[10px] font-semibold rounded-full border border-[#0a84ff]/30 font-mono">
                Running
              </span>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex justify-between items-center shadow-xs">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9f0a] animate-pulse" />
                  Roland TrueVIS UV
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">UV Wide Format • Maint</div>
              </div>
              <span className="px-3 py-1 bg-[#ff9f0a]/15 text-amber-300 text-[10px] font-semibold rounded-full border border-[#ff9f0a]/30 font-mono">
                Cleaning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Activity Log Panel */}
      <div className="mirror-card rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="bg-white/[0.04] backdrop-blur-xl px-6 py-4.5 border-b border-white/[0.08] flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white rounded-2xl shadow-lg shadow-blue-500/20 border border-white/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center space-x-2.5">
                <span>Real-Time Audit Trail</span>
                <span className="text-[10px] font-semibold bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 px-2.5 py-0.5 rounded-full font-mono">
                  Last 10 Records
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Live audit logs of job revisions, cryptographic signatures, preflight telemetry & press operations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Live Feed Status Pill */}
            <span className="flex items-center space-x-2 text-[11px] font-medium text-[#30d158] bg-[#30d158]/15 px-3 py-1 rounded-full border border-[#30d158]/30">
              <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse"></span>
              <span>Active Sentinel Feed</span>
            </span>

            {/* Priority Filter Pills */}
            <div className="flex items-center bg-white/[0.05] border border-white/[0.08] p-1 rounded-xl text-xs font-medium text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase px-2 font-semibold tracking-wider">Priority:</span>
              {['All', 'Urgent', 'High', 'Medium', 'Low'].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setActivePriorityFilter(prio)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    activePriorityFilter === prio
                      ? prio === 'Urgent'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : prio === 'High'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : prio === 'Medium'
                        ? 'bg-[#0a84ff] text-white shadow-xs'
                        : prio === 'Low'
                        ? 'bg-white/[0.2] text-white shadow-xs'
                        : 'bg-[#0a84ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center bg-white/[0.05] border border-white/[0.08] p-1 rounded-xl text-xs font-medium text-slate-300">
              {['All', 'Auto Cron', 'Updates', 'Proofs', 'QC & Accounts', 'Dispatch'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#0a84ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-transparent">
          <div className="divide-y divide-white/[0.06]">
            {last10Activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleActivityClick(act)}
                className="py-3.5 px-4 hover:bg-white/[0.04] rounded-2xl transition-all duration-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  {/* Category Icon Badge */}
                  <div
                    className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.05] flex-shrink-0 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
                  >
                    {getActivityIcon(act.category)}
                  </div>

                  {/* Activity Description & User info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full font-mono border border-white/[0.08]">
                        {act.category}
                      </span>
                      {renderPriorityBadge(act.priority)}
                      {act.jobNumber && (
                        <span className="text-[11px] font-mono font-semibold text-[#0a84ff] bg-[#0a84ff]/15 px-2 py-0.5 rounded-full border border-[#0a84ff]/30 group-hover:bg-[#0a84ff] group-hover:text-white transition-colors flex items-center shadow-xs">
                          #{act.jobNumber}
                          <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
                        </span>
                      )}
                      {act.statusBadge && (
                        <span
                          className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full font-mono ${
                            act.statusBadge.includes('PASS') || act.statusBadge.includes('Signed') || act.statusBadge.includes('Approved')
                              ? 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                              : act.statusBadge.includes('URGENT')
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-white/[0.06] text-slate-300 border border-white/[0.08]'
                          }`}
                        >
                          {act.statusBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-200 leading-snug group-hover:text-white transition-colors">
                      {act.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium pt-0.5">
                      <span className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{act.user}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center space-x-1.5 font-mono text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{act.timeAgo || act.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side timestamp & Quick action hint */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {getSafeTimestampDisplay(act.timestamp)}
                  </span>
                  <span className="text-[11px] font-semibold text-[#0a84ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center mt-1">
                    Inspect <ArrowRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
