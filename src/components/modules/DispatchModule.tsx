import React, { useState } from 'react';
import { Truck, Barcode, CheckCircle2, Box, Send, FileText, ArrowRight, Mail } from 'lucide-react';
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
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Header */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Courier Dispatch & Shipping Control - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
          <div className="text-xs text-zinc-400 flex items-center space-x-1.5 flex-wrap mt-0.5">
            <span>Recipient: <strong className="text-amber-300">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-zinc-600">•</span>
            <EmailLink
              email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
              subject={`Dispatch & Waybill Tracking for ${job.projectName} (${trackingNum})`}
              showIcon
              className="text-amber-400 hover:text-amber-300 text-xs"
            />
          </div>
        </div>

        <button
          onClick={() => onNavigate('Dashboard')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Return to Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shipping Waybill Generator */}
        <div className="lg:col-span-7 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Courier Logistics & Packaging Waybill
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1.5">Assigned Courier Partner</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg font-semibold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
              >
                <option value="Courier Guy Express">The Courier Guy Express</option>
                <option value="RAM Hand-to-Hand Couriers">RAM Hand-to-Hand Couriers</option>
                <option value="DHL South Africa">DHL South Africa Express</option>
                <option value="Fastway Couriers SA">Fastway Couriers SA</option>
                <option value="Local BrandFlow Courier">BrandFlow Local Fleet</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1.5">Box Count & Total Weight</label>
              <input
                type="number"
                value={boxCount}
                onChange={(e) => setBoxCount(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Destination Shipping Address</label>
            <textarea
              rows={2}
              defaultValue={job.dispatch?.shippingAddress || (job.companyName + ' - 45 Corporate Park Drive, Building 8, Sandton, Gauteng 2196')}
              className="w-full p-3 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Simulated Waybill Label Card with Barcode */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2">
              <span className="font-bold text-amber-400">{courier.toUpperCase()} WAYBILL</span>
              <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">EXPRESS SHIPPING</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-zinc-500">TRACKING BARCODE:</div>
                <div className="text-sm font-bold text-zinc-100">{trackingNum}</div>
              </div>
              <Barcode className="w-20 h-8 text-amber-400" />
            </div>
          </div>

          <button
            onClick={handleGenerateWaybill}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-lg text-xs shadow-md shadow-amber-500/20 cursor-pointer flex justify-center items-center space-x-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate Official Courier Waybill & Label</span>
          </button>
        </div>

        {/* Courier Status */}
        <div className="lg:col-span-5 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Dispatch Status & Delivery Receipt
          </h3>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-amber-400">Current Status: {job.dispatch?.status || 'In Transit'}</div>
            <div className="text-zinc-400">
              Estimated Delivery: <span className="font-bold text-zinc-200">Tomorrow by 14:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
