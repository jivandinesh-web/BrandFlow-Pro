import React, { useState } from 'react';
import { Edit3, Printer, Save, User, Shield, Layers, ChevronDown, Plus } from 'lucide-react';
import { Job, ModuleType, UserRole } from '../types';
import { PermissionModal } from './PermissionModal';
import { PrintModal } from './PrintModal';

interface ToolbarHeaderProps {
  activeModule: ModuleType;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedJob: Job;
  allJobs: Job[];
  setSelectedJob: (job: Job) => void;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  onSaveNotification?: (msg: string) => void;
}

const MODULE_NAMES: Record<ModuleType, string> = {
  Dashboard: 'QUEUE',
  Customers: 'CUSTOMER',
  Quotations: 'QUOTATION',
  ClientQuote: 'CLIENT QUOTATION REVIEW',
  Approval: 'CLIENT APPROVAL',
  ArtworkUpload: 'ARTWORK UPLOAD',
  Design: 'DESIGN DEPT WORK',
  PdfProofApproval: 'PDF PROOF STUDIO',
  Production: 'PRODUCTION QUEUE',
  QualityControl: 'QUALITY CONTROL & E-CHECK',
  Accounts: 'ACCOUNTS AND ERP LEDGER SYNC',
  PaymentTracking: 'PAYMENT TRACKING AND LEDGER AGING',
  Dispatch: 'DISPATCH AND LOGISTICS HANDLING',
  Reports: 'EXECUTIVE BUSINESS REPORTING',
  AssetLibrary: 'DIGITAL ASSET REPOSITORY',
  UserManagement: 'USER MANAGEMENT & PERMISSIONS',
  Settings: 'SYSTEM CONFIGURATION',
};

export const ToolbarHeader: React.FC<ToolbarHeaderProps> = ({
  activeModule,
  currentRole,
  setCurrentRole,
  selectedJob,
  allJobs,
  setSelectedJob,
}) => {
  return (
    <header className="h-16 bg-[#18181b]/75 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between px-6 flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.25)] relative z-20 transition-all">
      {/* Module Title, Breadcrumb & Batch Info */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">
            <span className="text-slate-500">BrandFlow</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#0a84ff] font-semibold">{MODULE_NAMES[activeModule]}</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-none">
            {MODULE_NAMES[activeModule]}
          </h1>
        </div>
        <div className="h-7 w-px bg-white/[0.08] hidden sm:block" />
        <div className="text-sm font-medium hidden sm:flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Active Batch</span>
          <span className="text-xs text-slate-200">
            <span className="font-semibold text-[#0a84ff] font-mono">{selectedJob.jobNumber}</span> • {selectedJob.companyName}
          </span>
        </div>
      </div>

      {/* Job Selector & Role Control */}
      <div className="flex items-center gap-3">
        {/* Job Selector Dropdown */}
        <div className="hidden lg:flex items-center space-x-2 border border-white/[0.08] rounded-xl px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] text-xs transition-colors shadow-2xs">
          <span className="text-slate-400 font-medium text-[11px]">Active Job:</span>
          <select
            aria-label="Select active print order job"
            value={selectedJob.id}
            onChange={(e) => {
              const found = allJobs.find((j) => j.id === e.target.value);
              if (found) setSelectedJob(found);
            }}
            className="bg-transparent font-semibold text-[#0a84ff] outline-hidden cursor-pointer"
          >
            {allJobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-[#1c1c1e] text-white">
                {j.jobNumber} - {j.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* User Role Switcher */}
        <div className="flex items-center space-x-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-3 py-1.5 transition-colors shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 hidden xl:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-[#0a84ff] outline-hidden cursor-pointer"
          >
            <option value="Admin" className="bg-[#1c1c1e] text-white">Admin</option>
            <option value="Designer" className="bg-[#1c1c1e] text-white">Designer</option>
            <option value="Sales" className="bg-[#1c1c1e] text-white">Sales</option>
            <option value="Production" className="bg-[#1c1c1e] text-white">Production</option>
            <option value="QC" className="bg-[#1c1c1e] text-white">QC</option>
            <option value="Accounts" className="bg-[#1c1c1e] text-white">Accounts</option>
          </select>
        </div>
      </div>
    </header>
  );
};

