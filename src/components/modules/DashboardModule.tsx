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
          <span className="inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded bg-red-600 text-white shadow-2xs border border-red-700 uppercase tracking-wider">
            <AlertTriangle className="w-2.5 h-2.5 animate-pulse" />
            <span>URGENT</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>HIGH PRIORITY</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>MED PRIORITY</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>LOW PRIORITY</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getActivityIcon = (category: SystemActivity['category']) => {
    switch (category) {
      case 'Proof Approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Job Update':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'Artwork Upload':
        return <Upload className="w-4 h-4 text-purple-600" />;
      case 'Invoicing':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      case 'QC Inspection':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'Dispatch':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'Quotation':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'Press Status':
        return <Printer className="w-4 h-4 text-slate-700" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActivityBg = (category: SystemActivity['category']) => {
    switch (category) {
      case 'Proof Approval':
        return 'bg-emerald-50 border-emerald-200 text-emerald-950';
      case 'Job Update':
        return 'bg-blue-50 border-blue-200 text-blue-950';
      case 'Artwork Upload':
        return 'bg-purple-50 border-purple-200 text-purple-950';
      case 'Invoicing':
        return 'bg-amber-50 border-amber-200 text-amber-950';
      case 'QC Inspection':
        return 'bg-teal-50 border-teal-200 text-teal-950';
      case 'Dispatch':
        return 'bg-indigo-50 border-indigo-200 text-indigo-950';
      case 'Quotation':
        return 'bg-sky-50 border-sky-200 text-sky-950';
      case 'Press Status':
        return 'bg-slate-100 border-slate-300 text-slate-900';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
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
    <div className="p-6 space-y-6 font-sans text-slate-800 bg-transparent min-h-full">
      {/* KPI Cards: Consistent 4-column grid on desktop, 2-column on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Jobs Queue */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          onClick={() => onNavigate('Production')}
          className="mirror-card rounded-2xl p-4.5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Active Press Queue</p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{activeJobsCount} Jobs</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +14.2% this wk
            </span>
            <span className="text-[10px] text-slate-400 font-medium font-mono">{urgentCount} Urgent</span>
          </div>
        </motion.div>

        {/* KPI 2: Pipeline Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          onClick={() => onNavigate('Accounts')}
          className="mirror-card rounded-2xl p-4.5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Monthly Revenue</p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">R {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +8.5% vs target
            </span>
            <span className="text-[10px] text-slate-400 font-medium font-mono">100% Invoiced</span>
          </div>
        </motion.div>

        {/* KPI 3: Proofs & Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          onClick={() => onNavigate('PdfProofApproval')}
          className="mirror-card rounded-2xl p-4.5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Client Proofs Queue</p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{pendingProofCount} Pending</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-300" />
              1.8 hr avg turnaround
            </span>
            <span className="text-[10px] text-slate-400 font-medium font-mono">Crypto Signed</span>
          </div>
        </motion.div>

        {/* KPI 4: Quality & Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          onClick={() => onNavigate('QualityControl')}
          className="mirror-card rounded-2xl p-4.5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">QC & Press Yield</p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">99.2% PASS</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Delta-E &lt; 1.5
            </span>
            <span className="text-[10px] text-slate-400 font-medium font-mono">ISO 12647-2</span>
          </div>
        </motion.div>
      </div>

      {/* 08:00 AM Client Reminders & Approvals Panel */}
      <ClientFollowUpPanel jobs={jobs} onSaveNotification={onSaveNotification} />

      {/* Machine Press Status & System Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Real-time Press Lines Monitor with Mirror Card Finish */}
        <div className="mirror-card rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-700 font-mono">
                  Machine Press Lines Live Status
                </span>
                <p className="text-[11px] text-slate-500">Automated press telemetry & cycle counters</p>
              </div>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              3/4 Units Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Heidelberg XL 106
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Offset • Batch #BF-2026-8941</div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-200 font-mono">
                8,500 SPH
              </span>
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  HP Indigo 7K Digital
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Digital • Ready / Idle</div>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg border border-indigo-200 font-mono">
                Running
              </span>
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Roland TrueVIS UV
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">UV Wide Format • Maint</div>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-200 font-mono">
                Cleaning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Activity Log Panel */}
      <div className="mirror-card rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-white/80 backdrop-blur-md px-5 py-3.5 border-b border-slate-200/80 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white font-black rounded-xl shadow-md shadow-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center space-x-2">
                <span>Real-Time Audit Trail</span>
                <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
                  Last 10 Records
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live audit logs of job revisions, cryptographic signatures, preflight telemetry & press operations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Live Feed Status Pill */}
            <span className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active Sentinel Feed</span>
            </span>

            {/* Priority Filter Pills */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200 p-0.5 rounded-xl text-xs font-bold text-slate-700">
              <span className="text-[10px] text-slate-400 uppercase px-2 font-black tracking-wider">Priority:</span>
              {['All', 'Urgent', 'High', 'Medium', 'Low'].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setActivePriorityFilter(prio)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    activePriorityFilter === prio
                      ? prio === 'Urgent'
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : prio === 'High'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : prio === 'Medium'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : prio === 'Low'
                        ? 'bg-slate-700 text-white shadow-2xs'
                        : 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200 p-0.5 rounded-xl text-xs font-bold text-slate-700">
              {['All', 'Auto Cron', 'Updates', 'Proofs', 'QC & Accounts', 'Dispatch'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/40">
          <div className="divide-y divide-slate-100">
            {last10Activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleActivityClick(act)}
                className="py-3 px-3 hover:bg-indigo-50/50 rounded-xl transition-colors flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Category Icon Badge */}
                  <div
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-white flex-shrink-0 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform"
                  >
                    {getActivityIcon(act.category)}
                  </div>

                  {/* Activity Description & User info */}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {act.category}
                      </span>
                      {renderPriorityBadge(act.priority)}
                      {act.jobNumber && (
                        <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/80 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center shadow-2xs">
                          #{act.jobNumber}
                          <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
                        </span>
                      )}
                      {act.statusBadge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            act.statusBadge.includes('PASS') || act.statusBadge.includes('Signed') || act.statusBadge.includes('Approved')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : act.statusBadge.includes('URGENT')
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {act.statusBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-800 leading-snug group-hover:text-indigo-900 transition-colors">
                      {act.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium pt-0.5">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{act.user}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center space-x-1 font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{act.timeAgo || act.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side timestamp & Quick action hint */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {getSafeTimestampDisplay(act.timestamp)}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center mt-1">
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
