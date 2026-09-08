import React, { useState } from 'react';
import { Truck, Barcode, CheckCircle2, Box, Send, FileText, ArrowRight, Mail, Edit3 } from 'lucide-react';
import { Job } from '../../types';
import { triggerDispatchNotification } from '../../utils/notificationHelper';
import { EmailLink } from '../EmailLink';

interface DispatchModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const DispatchModule: React.FC<DispatchModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
}) => {
  const [courier, setCourier] = useState<string>(
    job.dispatch?.courierName || 'Courier Guy Express'
  );
  const [trackingNum, setTrackingNum] = useState(
    job.dispatch?.trackingNumber || 'TCG-ZA-88392019'
  );
  const [boxCount, setBoxCount] = useState(job.dispatch?.boxCount || 5);

  const handleGenerateWaybill = () => {
    triggerDispatchNotification(
      job,
      onSaveNotification,
      `Waybill generated with barcode #${trackingNum} for ${courier}`
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Header */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0a84ff]">
            <Truck className="w-4 h-4 text-[#0a84ff]" />
            <span>Courier Dispatch & Shipping Control • Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{job.projectName}</h2>
          <div className="text-xs text-slate-400 flex items-center space-x-2 flex-wrap mt-0.5">
            <span>Recipient: <strong className="text-white">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-slate-600">•</span>
            <EmailLink
              email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
              subject={`Dispatch & Waybill Tracking for ${job.projectName} (${trackingNum})`}
              showIcon
              className="text-[#0a84ff] hover:underline text-xs font-medium"
            />
          </div>
        </div>

        <button
          onClick={() => onNavigate('Dashboard')}
          className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
        >
          <span>Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Shipping Waybill Generator */}
        <div className="lg:col-span-7 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3">
            Courier Logistics & Packaging Waybill
          </h3>

          {/* Custom Branding Package Directive */}
          {(job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes) && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-[11px] uppercase tracking-wide">
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Branding Packaging & Packing Slip Directive</span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed">
                {job.customBrandingNotes || job.quote?.items?.find((i) => i.customBrandingNotes)?.customBrandingNotes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Assigned Courier Partner</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/30 outline-none transition-all text-xs"
              >
                <option value="Courier Guy Express" className="bg-[#1c1c1e] text-white">The Courier Guy Express</option>
                <option value="RAM Hand-to-Hand Couriers" className="bg-[#1c1c1e] text-white">RAM Hand-to-Hand Couriers</option>
                <option value="DHL South Africa" className="bg-[#1c1c1e] text-white">DHL South Africa Express</option>
                <option value="Fastway Couriers SA" className="bg-[#1c1c1e] text-white">Fastway Couriers SA</option>
                <option value="Local BrandFlow Courier" className="bg-[#1c1c1e] text-white">BrandFlow Local Fleet</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Box Count & Total Weight</label>
              <input
                type="number"
                value={boxCount}
                onChange={(e) => setBoxCount(parseInt(e.target.value) || 1)}
                className="w-full p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl font-semibold text-white focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/30 outline-none transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destination Shipping Address</label>
            <textarea
              rows={2}
              defaultValue={job.dispatch?.shippingAddress || (job.companyName + ' - 45 Corporate Park Drive, Building 8, Sandton, Gauteng 2196')}
              className="w-full p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/30 outline-none transition-all"
            />
          </div>

          {/* Simulated Waybill Label Card with Barcode */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs border-b border-white/[0.08] pb-2">
              <span className="font-semibold text-white">{courier.toUpperCase()} WAYBILL</span>
              <span className="text-[10px] text-[#0a84ff] bg-[#0a84ff]/15 px-2.5 py-0.5 rounded-full border border-[#0a84ff]/30">EXPRESS SHIPPING</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-slate-400">TRACKING BARCODE:</div>
                <div className="text-sm font-bold text-white">{trackingNum}</div>
              </div>
              <Barcode className="w-20 h-8 text-slate-300" />
            </div>
          </div>

          <button
            onClick={handleGenerateWaybill}
            className="w-full py-3 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-xl text-xs shadow-lg shadow-[#0a84ff]/25 cursor-pointer flex justify-center items-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Generate Official Courier Waybill & Label</span>
          </button>
        </div>

        {/* Courier Status */}
        <div className="lg:col-span-5 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/[0.08] pb-3">
            Dispatch Status & Delivery Receipt
          </h3>

          <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-2 text-xs">
            <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Current Status: {job.dispatch?.status || 'In Transit'}</span>
            </div>
            <div className="text-slate-400">
              Estimated Delivery: <span className="font-semibold text-white">Tomorrow by 14:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
