import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, CheckCircle2, DollarSign, ArrowRight, Download, Upload, ExternalLink, ShieldCheck, Database, Layers } from 'lucide-react';
import { Invoice, Job } from '../../types';
import { EmailLink } from '../EmailLink';

interface AccountsModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [invoice, setInvoice] = useState<Invoice>(
    job.invoice || {
      id: 'INV-2026-4401',
      invoiceNumber: `INV-2026-${job.jobNumber.split('-').pop()}`,
      jobId: job.id,
      customerName: job.companyName,
      issueDate: '2026-07-21',
      dueDate: '2026-08-20',
      amount: job.totalValue,
      paidAmount: job.totalValue / 2,
      status: 'Partially Paid',
      syncedToSage: true,
      syncedToXero: false,
      syncedToQuickbooks: true,
      syncTimestamp: '2026-07-21 17:00',
    }
  );

  const [showExcelModal, setShowExcelModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // The 3 Accounting Sync Handlers as requested
  const handleSyncToSagePastel = () => {
    setIsSyncing('Sage Pastel');
    setTimeout(() => {
      setInvoice({ ...invoice, syncedToSage: true, syncTimestamp: new Date().toLocaleString() });
      setIsSyncing(null);
      onSaveNotification(`Invoice #${invoice.invoiceNumber} synced to Sage Pastel Accounting ERP!`);
    }, 1200);
  };

  const handleSyncToXero = () => {
    setIsSyncing('Xero');
    setTimeout(() => {
      setInvoice({ ...invoice, syncedToXero: true, syncTimestamp: new Date().toLocaleString() });
      setIsSyncing(null);
      onSaveNotification(`Invoice #${invoice.invoiceNumber} synced to Xero Cloud API!`);
    }, 1200);
  };

  const handleSyncToQuickBooks = () => {
    setIsSyncing('QuickBooks');
    setTimeout(() => {
      setInvoice({ ...invoice, syncedToQuickbooks: true, syncTimestamp: new Date().toLocaleString() });
      setIsSyncing(null);
      onSaveNotification(`Invoice #${invoice.invoiceNumber} synced to QuickBooks Online!`);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Top Banner */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Accounts & Financial ERP Hub - Invoice #{invoice.invoiceNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
          <div className="text-xs text-zinc-400 flex items-center space-x-1.5 flex-wrap mt-0.5">
            <span>Client: <strong className="text-amber-300">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-zinc-600">•</span>
            <EmailLink
              email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
              subject={`Accounts & Invoicing - ${job.projectName} (Inv #${invoice.invoiceNumber})`}
              showIcon
              className="text-amber-400 hover:text-amber-300 text-xs"
            />
          </div>
        </div>

        <button
          onClick={() => onNavigate('PaymentTracking')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Track Client Payments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MANDATORY EXCEL & ACCOUNTING INTEGRATION SYNC PANEL (3 BUTTONS) */}
      <div className="mirror-card p-5 sm:p-6 rounded-xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-zinc-100 shadow-xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Excel Spreadsheet Invoicing Integration & Multi-ERP Sync
              </h3>
              <p className="text-[11px] text-zinc-400">
                Sync live line items, print materials, and VAT tax totals from Excel spreadsheet to external software.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowExcelModal(true)}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer border border-emerald-500/30 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Excel Invoicing File (.XLSX)</span>
          </button>
        </div>

        {/* THE 3 REQUESTED BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. SAGE PASTEL BUTTON */}
          <button
            onClick={handleSyncToSagePastel}
            disabled={isSyncing !== null}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              invoice.syncedToSage
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-xs'
                : 'bg-zinc-950/70 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800/60 text-zinc-200'
            }`}
          >
            <div>
              <div className="text-xs font-extrabold flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Sync to Sage Pastel</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {invoice.syncedToSage ? '✔ Synced to Sage Partner' : 'Click to push Excel ledger'}
              </div>
            </div>
            {isSyncing === 'Sage Pastel' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : invoice.syncedToSage ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* 2. XERO BUTTON */}
          <button
            onClick={handleSyncToXero}
            disabled={isSyncing !== null}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              invoice.syncedToXero
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-xs'
                : 'bg-zinc-950/70 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800/60 text-zinc-200'
            }`}
          >
            <div>
              <div className="text-xs font-extrabold flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Sync to Xero</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {invoice.syncedToXero ? '✔ Synced to Xero Cloud' : 'Click to push Excel ledger'}
              </div>
            </div>
            {isSyncing === 'Xero' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : invoice.syncedToXero ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* 3. QUICKBOOKS BUTTON */}
          <button
            onClick={handleSyncToQuickBooks}
            disabled={isSyncing !== null}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              invoice.syncedToQuickbooks
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-xs'
                : 'bg-zinc-950/70 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800/60 text-zinc-200'
            }`}
          >
            <div>
              <div className="text-xs font-extrabold flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Sync to QuickBooks</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {invoice.syncedToQuickbooks ? '✔ Synced to QB Online' : 'Click to push Excel ledger'}
              </div>
            </div>
            {isSyncing === 'QuickBooks' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            ) : invoice.syncedToQuickbooks ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {/* Invoice Breakdown Table */}
      <div className="mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
          Generated Commercial Invoice Record
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Total Amount</span>
            <span className="text-base font-black text-zinc-100 font-mono mt-1 block">
              R {invoice.amount.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Deposit Received</span>
            <span className="text-base font-black text-emerald-400 font-mono mt-1 block">
              R {invoice.paidAmount.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Balance Remaining</span>
            <span className="text-base font-black text-rose-400 font-mono mt-1 block">
              R {(invoice.amount - invoice.paidAmount).toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Payment Status</span>
            <span className="text-xs font-bold text-amber-300 block mt-1">{invoice.status}</span>
          </div>
        </div>
      </div>

      {/* Excel Import Simulation Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden font-sans text-zinc-100">
            <div className="bg-zinc-950 px-4 py-3 flex justify-between items-center border-b border-zinc-800">
              <span className="text-xs font-bold flex items-center space-x-1.5 text-zinc-200">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Excel Spreadsheet Invoicing Mapper</span>
              </span>
              <button
                onClick={() => setShowExcelModal(false)}
                className="text-zinc-400 hover:text-zinc-100 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-zinc-300">
                Select your billing spreadsheet (.XLSX or .CSV) to map columns to BrandFlow Pro ledger.
              </p>

              <div className="p-4 border-2 border-dashed border-zinc-700/80 rounded-lg text-center bg-zinc-950/50">
                <FileSpreadsheet className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="font-bold text-zinc-200">Invoicing_Ledger_2026_Q3.xlsx</div>
                <div className="text-[11px] text-zinc-400">12 line items ready to map</div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-zinc-300">Map Excel Columns:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-300">Col A: Job Code → JobNumber</div>
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-300">Col B: Material → PaperStock</div>
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-300">Col C: Total → LineTotal</div>
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-300">Col D: Tax Rate → VAT15%</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 px-4 py-3 flex justify-end space-x-2 border-t border-zinc-800">
              <button
                onClick={() => setShowExcelModal(false)}
                className="px-3.5 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg text-xs font-bold hover:bg-zinc-700 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExcelModal(false);
                  onSaveNotification('Excel Invoicing file mapped and imported successfully!');
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black cursor-pointer transition-all shadow-md shadow-amber-500/20"
              >
                Import & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
