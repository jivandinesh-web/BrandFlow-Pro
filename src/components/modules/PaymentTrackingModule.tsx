import React, { useState } from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { Job } from '../../types';

interface PaymentTrackingModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const PaymentTrackingModule: React.FC<PaymentTrackingModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [payments, setPayments] = useState([
    {
      id: 'PAY-1001',
      date: '2026-07-18',
      amount: job.totalValue / 2,
      method: 'Bank Wire Transfer',
      reference: 'WIRE-NEXUS-8821',
      status: 'Cleared',
    },
  ]);

  const handleAddPayment = () => {
    const newPay = {
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: job.totalValue / 2,
      method: 'Credit Card (Stripe)',
      reference: `CC-CONF-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Cleared',
    };
    setPayments([...payments, newPay]);
    onSaveNotification('Payment transaction logged & account cleared!');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Payment Tracking & Ledger - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
        </div>

        <button
          onClick={() => onNavigate('Dispatch')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Move to Dispatch & Delivery</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment History List */}
        <div className="lg:col-span-8 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
            <h3 className="text-xs font-bold uppercase text-zinc-300">Payment Transactions History</h3>
            <button
              onClick={handleAddPayment}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Payment Receipt</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-100">{p.method} ({p.reference})</div>
                  <div className="text-[11px] text-zinc-400">Date Cleared: {p.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    +R {p.amount.toLocaleString()}
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Aging Metric */}
        <div className="lg:col-span-4 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Accounts Ledger Aging
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg flex justify-between items-center">
              <span className="text-zinc-300">Current (0-30 Days)</span>
              <span className="font-mono font-bold text-emerald-400">R 68,500</span>
            </div>
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg flex justify-between items-center">
              <span className="text-zinc-400">31-60 Days</span>
              <span className="font-mono font-bold text-zinc-400">R 0</span>
            </div>
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg flex justify-between items-center">
              <span className="text-zinc-400">61-90 Days</span>
              <span className="font-mono font-bold text-zinc-400">R 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
