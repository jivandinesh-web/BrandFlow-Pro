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
  Dashboard: 'Production Queue',
  Customers: 'Client Accounts & CRM',
  Quotations: 'Print Quotations & Estimating',
  ClientQuote: 'Client Quotation Review',
  Approval: 'Client Proof Approvals',
  ArtworkUpload: 'Preflight Artwork Upload',
  Design: 'Design Department Workstation',
  PdfProofApproval: 'PDF Proof Approval Studio',
  Production: 'Press & Production Queue Control',
  QualityControl: 'Quality Control & Delta-E Check',
  Accounts: 'Accounts & ERP Ledger Sync',
  PaymentTracking: 'Payment Tracking & Ledger Aging',
  Dispatch: 'Dispatch & Shipping Logistics',
  Reports: 'Executive Business Reports',
  AssetLibrary: 'Digital Asset Repository',
  UserManagement: 'User Management & Permissions',
  Settings: 'System Configuration',
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
    <header className="h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/90 flex items-center justify-between px-6 flex-shrink-0 shadow-xs relative z-20">
      {/* Module Title, Breadcrumb & Batch Info */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">
            <span>BrandFlow</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">{MODULE_NAMES[activeModule]}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            {MODULE_NAMES[activeModule]}
          </h1>
        </div>
        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
        <div className="text-sm text-slate-500 font-medium hidden sm:flex flex-col justify-center">
          <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold font-mono">Active Batch</span>
          <span className="text-xs text-slate-700">
            <span className="font-bold text-indigo-600 font-mono">{selectedJob.jobNumber}</span> • {selectedJob.companyName}
          </span>
        </div>
      </div>

      {/* Job Selector & Role Control */}
      <div className="flex items-center gap-3">
        {/* Job Selector Dropdown */}
        <div className="hidden lg:flex items-center space-x-1.5 border border-slate-200 rounded-xl px-3 py-1.5 bg-white/90 text-xs shadow-2xs">
          <span className="text-slate-400 font-medium text-[11px]">Active Job:</span>
          <select
            aria-label="Select active print order job"
            value={selectedJob.id}
            onChange={(e) => {
              const found = allJobs.find((j) => j.id === e.target.value);
              if (found) setSelectedJob(found);
            }}
            className="bg-transparent font-bold text-indigo-600 outline-hidden cursor-pointer"
          >
            {allJobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-white text-slate-800">
                {j.jobNumber} - {j.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* User Role Switcher */}
        <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 hidden xl:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-bold text-indigo-600 outline-hidden cursor-pointer"
          >
            <option value="Admin" className="bg-white text-slate-800">Admin</option>
            <option value="Designer" className="bg-white text-slate-800">Designer</option>
            <option value="Sales" className="bg-white text-slate-800">Sales</option>
            <option value="Production" className="bg-white text-slate-800">Production</option>
            <option value="QC" className="bg-white text-slate-800">QC</option>
            <option value="Accounts" className="bg-white text-slate-800">Accounts</option>
          </select>
        </div>
      </div>
    </header>
  );
};

