import React from 'react';
import { Settings as SettingsIcon, Save, Printer, Database, ShieldCheck, Info } from 'lucide-react';

interface SettingsModuleProps {
  onSaveNotification: (msg: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onSaveNotification }) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
            <SettingsIcon className="w-4 h-4 text-amber-400" />
            <span>BrandFlow Pro System Configuration & Specs</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100">ERP Configuration & Printing Specifications</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your company's core print settings, taxation rules, and connect your favorite accounting tools.
          </p>
        </div>

        <button
          onClick={() => onSaveNotification('System settings saved to enterprise database.')}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center space-x-2 transition-all border border-amber-300/30"
        >
          <Save className="w-4 h-4 text-zinc-950" />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company & Printing Press Setup */}
        <div className="mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 sm:p-6 space-y-4 text-xs">
          <h3 className="font-bold text-zinc-200 border-b border-zinc-800 pb-2.5 flex items-center space-x-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Company Branding & Press Specifications</span>
          </h3>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">Company Legal Entity Name</label>
            <input
              type="text"
              defaultValue="BrandFlow Pro Printing & Branding Ltd"
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg outline-none transition-all text-zinc-100 text-xs"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              This name will appear on all your official quotations and tax invoices.
            </p>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">Default Standard Bleed Margin</label>
            <input
              type="text"
              defaultValue="3.0 mm (Vector Trim Marks Enabled)"
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg outline-none transition-all text-zinc-100 text-xs"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5">
              The standard safe margin applied to artwork before production to ensure no white edges.
            </p>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">Standard Sales Tax / VAT Rate (%)</label>
            <input
              type="number"
              defaultValue={15}
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg outline-none transition-all text-zinc-100 text-xs"
            />
          </div>
        </div>

        {/* Integration API Keys */}
        <div className="mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 sm:p-6 space-y-4 text-xs">
          <div className="border-b border-zinc-800 pb-2.5">
            <h3 className="font-bold text-zinc-200 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Accounting ERP Integrations</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Securely connect your accounting software to automatically sync invoices and payments.
            </p>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">Sage Pastel Partner API Key</label>
            <input
              type="password"
              defaultValue="SAGE-PASTEL-SECRET-KEY-9982"
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg font-mono outline-none transition-all text-zinc-100 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">Xero Cloud Client ID</label>
            <input
              type="password"
              defaultValue="XERO-CLIENT-ID-8839210"
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg font-mono outline-none transition-all text-zinc-100 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5">QuickBooks Online Realm ID</label>
            <input
              type="password"
              defaultValue="QB-REALM-9918230192"
              className="w-full p-2.5 bg-zinc-950 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 border border-zinc-700/80 rounded-lg font-mono outline-none transition-all text-zinc-100 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
