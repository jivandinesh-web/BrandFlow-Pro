import React, { useState } from 'react';
import { Users, ShieldCheck, Lock, CheckCircle2, XCircle, Edit3, Printer, Save, AlertTriangle } from 'lucide-react';
import { SYSTEM_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { EmailLink } from '../EmailLink';
import { PrintModal } from '../PrintModal';

interface UserManagementModuleProps {
  currentRole: UserRole;
  onSaveNotification: (msg: string) => void;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  currentRole,
  onSaveNotification,
  isEditing = false,
  setIsEditing,
}) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const isAdmin = currentRole === 'Admin';

  const handleToggleEditMode = () => {
    if (!isAdmin) {
      onSaveNotification('Access Denied: Master Edit Mode is restricted to Administrator role.');
      return;
    }
    if (setIsEditing) {
      const nextState = !isEditing;
      setIsEditing(nextState);
      onSaveNotification(
        nextState
          ? 'Master Edit Mode ENABLED across all production records.'
          : 'Master Edit Mode DISABLED. Records set to Read-Only.'
      );
    }
  };

  const handleSavePolicies = () => {
    if (!isAdmin) {
      onSaveNotification('Access Denied: Saving system policies requires Administrator role.');
      return;
    }
    if (setIsEditing && isEditing) {
      setIsEditing(false);
    }
    onSaveNotification('Administrator save completed: All system security policies, permissions & batch states synchronized.');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Top Admin Operations & Master Action Bar */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Admin Control Panel & Security Access</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">Role-Based Rights & Master Controls</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            System-level editing rights, printable audit reports, and batch synchronization are managed here.
          </p>
        </div>

        {/* Restricted Admin Controls: Edit, Print, Save */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Master Edit Mode Toggle */}
          <button
            onClick={handleToggleEditMode}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isEditing
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-amber-500/20 border border-amber-300'
                : 'bg-zinc-800/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-500/50'
            }`}
            title="Toggle Master Edit Mode (Admin Only)"
          >
            <Edit3 className={`w-3.5 h-3.5 ${isEditing ? 'text-zinc-950' : 'text-amber-400'}`} />
            <span>{isEditing ? 'Master Edit: ACTIVE' : 'Enable Master Edit'}</span>
          </button>

          {/* Print Audit Report */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-zinc-800/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            title="Print System Audit & Permission Matrix Report"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print Audit Report</span>
          </button>

          {/* Master Save Button */}
          <button
            onClick={handleSavePolicies}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-all border border-amber-300/30"
          >
            <Save className="w-3.5 h-3.5 text-zinc-950" />
            <span>Master Save</span>
          </button>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center space-x-3 text-xs text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            You are currently viewing with <strong>{currentRole}</strong> role. Switch role to <strong>Admin</strong> in the top-right menu to exercise full administrative control privileges.
          </span>
        </div>
      )}

      {/* Permission Rights Matrix Card */}
      <div className="mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
        <div className="border-b border-zinc-800 pb-2.5 flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-xs font-bold uppercase text-zinc-300">Department Editing Rights Matrix</h3>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded">
            Strict Policy: Only Admin and Designer roles possess rights to edit files
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/60 border-b border-zinc-800 font-bold uppercase text-[10px] text-zinc-400">
                <th className="p-3">Department Role</th>
                <th className="p-3 text-center">Edit Files / Artwork</th>
                <th className="p-3 text-center">Print Proof Reports</th>
                <th className="p-3 text-center">Save Records</th>
                <th className="p-3">Access Level Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-medium text-zinc-300">
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-100 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin</span>
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded font-bold text-[10px]">
                    ✔ FULL RIGHTS
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Complete system control, pricing override & artwork master edit.</td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-100 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Designer</span>
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded font-bold text-[10px]">
                    ✔ FULL EDIT RIGHTS
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Pre-press versioning, proof generation & vector file editing.</td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-200">Sales</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded font-bold text-[10px]">
                    🔒 READ ONLY
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Quotation creation, client contact log, read-only file access.</td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-200">Production</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded font-bold text-[10px]">
                    🔒 READ ONLY
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Press machine progress logging, plate status, read-only file access.</td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-200">QC Inspector</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded font-bold text-[10px]">
                    🔒 READ ONLY
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Quality inspection logs, Delta-E verification, read-only file access.</td>
              </tr>
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-3 font-bold text-zinc-200">Accounts</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded font-bold text-[10px]">
                    🔒 READ ONLY
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-center text-emerald-400 font-bold">✔ Allowed</td>
                <td className="p-3 text-zinc-400">Invoicing, Sage/Xero/QB sync, ledger tracking, read-only file access.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Directory List */}
      <div className="mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
          Registered Enterprise Staff ({SYSTEM_USERS.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SYSTEM_USERS.map((usr) => (
            <div key={usr.id} className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center space-x-3 text-xs">
              <div className="w-8 h-8 bg-zinc-800 text-amber-400 border border-zinc-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                {usr.avatar}
              </div>
              <div>
                <div className="font-bold text-zinc-100">{usr.name}</div>
                <div className="text-[10px] text-amber-400 font-bold">{usr.role}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  <EmailLink
                    email={usr.email}
                    subject={`BrandFlow Pro - Direct Message for ${usr.name} (${usr.role})`}
                    showIcon
                    className="text-[10px] text-zinc-400 hover:text-amber-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Audit Modal */}
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentTitle="BrandFlow Security Matrix & Admin Audit Report"
        departmentName="Admin Security & Permissions"
      />
    </div>
  );
};
