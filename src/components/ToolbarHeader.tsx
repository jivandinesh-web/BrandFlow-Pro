import React, { useState } from 'react';
import { Edit3, Printer, Save, User, Shield, Search, Layers, ChevronDown, Plus, BookOpen, FileText } from 'lucide-react';
import { Job, ModuleType, UserRole } from '../types';
import { PermissionModal } from './PermissionModal';
import { PrintModal } from './PrintModal';
import { SopDownloadModal } from './SopDownloadModal';
import { generateAndDownloadGuide } from '../utils/pdfGuideGenerator';

interface ToolbarHeaderProps {
  activeModule: ModuleType;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedJob: Job;
  allJobs: Job[];
  setSelectedJob: (job: Job) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSaveNotification: (msg: string) => void;
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
  isEditing,
  setIsEditing,
  onSaveNotification,
}) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSopModal, setShowSopModal] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const canEdit = currentRole === 'Admin' || currentRole === 'Designer';

  const handleEditClick = () => {
    if (!canEdit) {
      setLastAction(`Edit ${MODULE_NAMES[activeModule]} Master File`);
      setShowPermissionModal(true);
    } else {
      setIsEditing(!isEditing);
      onSaveNotification(
        !isEditing
          ? `Editing Mode Enabled for ${activeModule} (${currentRole} Rights)`
          : `Editing Mode Disabled`
      );
    }
  };

  const handlePrintClick = () => {
    setShowPrintModal(true);
  };

  const handleSaveClick = () => {
    if (isEditing) {
      setIsEditing(false);
    }
    onSaveNotification(`Record #${selectedJob.jobNumber} saved successfully in ${activeModule}.`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/90 flex items-center justify-between px-6 flex-shrink-0 shadow-xs relative z-20">
        {/* Module Title & Batch Info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-600 font-bold mb-0.5 tracking-wider uppercase">{getGreeting()}, Arthur</span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
              {MODULE_NAMES[activeModule]}
            </h1>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-sm text-slate-500 font-medium flex flex-col justify-center">
            <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold font-mono">Active Batch</span>
            <span className="text-xs text-slate-700">
              <span className="font-bold text-indigo-600 font-mono">{selectedJob.jobNumber}</span> • {selectedJob.companyName}
            </span>
          </div>
        </div>

        {/* Search, Action Buttons & Role Control */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              aria-label="Search orders and batch numbers"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs w-44 lg:w-56 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white/90 focus:bg-white text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

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

          {/* Department Toolbar Action Buttons (Edit, Print, Save, Share Portal, Guide) */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs backdrop-blur-md">
            <button
              onClick={handleEditClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEditing
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs'
              }`}
              title={canEdit ? 'Toggle Edit Rights' : 'Restricted: Requires Admin or Designer role'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing...' : 'Edit'}</span>
              {!canEdit && <Shield className="w-3 h-3 text-rose-500 ml-0.5" />}
            </button>

            <button
              onClick={handlePrintClick}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Print module view"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={handleSaveClick}
              aria-label="Save current module changes"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all cursor-pointer min-h-[38px] border border-white/40"
              title="Save current module changes"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>Save</span>
            </button>

            <button
              onClick={() => {
                const clientUrl = `${window.location.origin}?job=${selectedJob.jobNumber}&view=approval`;
                navigator.clipboard.writeText(clientUrl);
                onSaveNotification(`Client Portal Link for #${selectedJob.jobNumber} copied to clipboard!`);
              }}
              aria-label="Copy shareable client approval link"
              className="px-3 py-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer min-h-[38px]"
              title="Copy interactive client proof & quote portal link"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Share Portal</span>
            </button>

            <button
              onClick={() => generateAndDownloadGuide()}
              aria-label="Download ERP User Guide PDF"
              className="px-3 py-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer min-h-[38px]"
              title="Download User Guide (PDF)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Guide</span>
            </button>

            <button
              onClick={() => setShowSopModal(true)}
              aria-label="View and Download SOP Document"
              className="px-3 py-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer min-h-[38px]"
              title="Download Standard Operating Procedure (DOCX / Google Drive)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">SOP / Drive</span>
            </button>
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

      {/* Permission Modal */}
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        requiredRoles={['Admin', 'Designer']}
        currentRole={currentRole}
        actionAttempted={lastAction}
      />

      {/* Print Modal */}
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentTitle={`${selectedJob.jobNumber} - ${selectedJob.projectName}`}
        departmentName={activeModule}
      />

      {/* SOP Download & Google Drive Modal */}
      <SopDownloadModal
        isOpen={showSopModal}
        onClose={() => setShowSopModal(false)}
      />
    </>
  );
};

