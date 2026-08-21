import React from 'react';
import { PieChart, TrendingUp, BarChart3, Download, Printer, Layers } from 'lucide-react';
import { Job } from '../../types';

interface ReportsModuleProps {
  jobs: Job[];
  onSaveNotification: (msg: string) => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ jobs, onSaveNotification }) => {
  const totalRev = jobs.reduce((s, j) => s + j.totalValue, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span>Executive Business Analytics & Print Yield Reports</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">2026 Production & Financial Analytics</h2>
        </div>

        <button
          onClick={() => onSaveNotification('Executive Analytics PDF Report exported.')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <Download className="w-4 h-4 text-zinc-950" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="mirror-card p-5 bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl">
          <div className="text-zinc-400 font-bold uppercase text-[10px]">Total Active Revenue</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">R {totalRev.toLocaleString()}</div>
          <div className="text-emerald-400 text-[11px] font-bold mt-1">42.8% Average Margin</div>
        </div>

        <div className="mirror-card p-5 bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl">
          <div className="text-zinc-400 font-bold uppercase text-[10px]">Paper Scrap & Wastage</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">1.6%</div>
          <div className="text-zinc-400 text-[11px] mt-1">Well below 3.0% threshold</div>
        </div>

        <div className="mirror-card p-5 bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl">
          <div className="text-zinc-400 font-bold uppercase text-[10px]">Avg Turnaround Time</div>
          <div className="text-2xl font-black text-zinc-100 font-mono mt-1">4.2 Days</div>
          <div className="text-zinc-400 text-[11px] mt-1">From quote sign-off to dispatch</div>
        </div>
      </div>
    </div>
  );
};
