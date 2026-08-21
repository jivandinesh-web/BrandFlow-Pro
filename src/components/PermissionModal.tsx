import React, { useEffect } from 'react';
import { ShieldAlert, Lock, X } from 'lucide-react';
import { UserRole } from '../types';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRoles: UserRole[];
  currentRole: UserRole;
  actionAttempted: string;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  requiredRoles,
  currentRole,
  actionAttempted,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden font-sans text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Windows Dialog Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-5 py-3 flex items-center justify-between text-zinc-100 border-b border-zinc-800">
          <div className="flex items-center space-x-2 text-xs font-bold tracking-wide">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>BrandFlow System Security - Permission Restricted</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close permission dialog"
            className="hover:bg-rose-500/20 rounded-lg p-1 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex space-x-4 items-start">
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-zinc-100">Access Restricted</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You do not have administrative privileges to execute{' '}
              <span className="font-bold text-amber-300">"{actionAttempted}"</span>.
            </p>
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Your Active Role:</span>
                <span className="font-bold text-rose-400">{currentRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Required Role Rights:</span>
                <span className="font-bold text-emerald-400">{requiredRoles.join(' or ')}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 italic">
              * Note: Only Admin and Design Department staff possess rights to modify master files and artwork specifications.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950/60 px-5 py-3.5 flex justify-end space-x-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            aria-label="Acknowledge security restriction"
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black rounded-lg shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
