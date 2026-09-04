import React, { useState } from 'react';
import { Send, FileText, CheckCircle2, Clock, ShieldCheck, Printer, Mail } from 'lucide-react';
import { Job } from '../../types';
import { EmailLink } from '../EmailLink';
import { ClientEmailSendButton } from '../ClientEmailSendButton';
import { ClientEmailLogsCard } from '../ClientEmailLogsCard';

interface ClientQuoteModuleProps {
  job: Job;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

export const ClientQuoteModule: React.FC<ClientQuoteModuleProps> = ({
  job,
  onSaveNotification,
  onNavigate,
}) => {
  const [sent, setSent] = useState(job.quote.status === 'Sent to Client' || job.quote.status === 'Approved');

  const customerEmail =
    job.customerEmail ||
    `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`;

  const quoteEmailSubject = `Formal Client Quotation #${job.quote.quoteNumber} - ${job.companyName} (${job.projectName})`;
  const quoteEmailBody = `Dear ${job.customerName},\n\nPlease find attached the formal quotation #${job.quote.quoteNumber} for your project "${job.projectName}".\n\nTotal Amount: R ${job.quote.totalAmount.toLocaleString()}\nValid Until: ${job.quote.validUntil}\nSales Rep: ${job.quote.salesRep}\n\nYou can review, approve, or request revisions directly through our client portal.\n\nThank you for choosing BrandFlow Pro!\n\nBest regards,\nBrandFlow Pro Client Services\nwww.brandflowpro.co.za`;

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Top Banner Actions */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            Formal Client Document
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-1">
            Client Quotation - #{job.quote.quoteNumber}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Linked to all 5 popular mailing programs & auto-logged to database with timestamp */}
          <ClientEmailSendButton
            toEmail={customerEmail}
            clientName={job.customerName}
            companyName={job.companyName}
            clientId={job.quote.customerId}
            jobNumber={job.jobNumber}
            quoteNumber={job.quote.quoteNumber}
            projectName={job.projectName}
            defaultSubject={quoteEmailSubject}
            defaultBody={quoteEmailBody}
            label={sent ? 'Re-Send Email to Client' : 'Send Quote to Client Email'}
            variant="emerald"
            onEmailSent={() => setSent(true)}
            onSaveNotification={onSaveNotification}
          />

          <button
            onClick={() => onNavigate('Approval')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all"
          >
            <span>Go to Approval Center</span>
          </button>
        </div>
      </div>

      {/* Formal Paper Printable Quote Card */}
      <div className="max-w-4xl mx-auto mirror-card bg-zinc-900/95 border border-zinc-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-200">
        {/* Letterhead */}
        <div className="flex flex-wrap justify-between items-start border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="text-xl font-black text-amber-400 tracking-wider">BRANDFLOW PRO</div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
              Enterprise Printing & Branding Solutions
            </div>
            <div className="text-[11px] text-zinc-400 mt-2 space-y-0.5">
              <div>45 Corporate Park Drive, Building 8, Sandton</div>
              <div>Johannesburg, Gauteng 2196 • Tel: +27 (0)11 555-PRINT</div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span>Web: www.brandflowpro.co.za • Email:</span>
                <EmailLink
                  email="quotes@brandflowpro.co.za"
                  subject={`Client Quotation Inquiry #${job.quote.quoteNumber}`}
                  className="text-amber-400 font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">Quotation</h1>
            <div className="text-xs font-mono font-bold text-amber-400 mt-1">{job.quote.quoteNumber}</div>
            <div className="text-[11px] text-zinc-400 mt-2 space-y-0.5">
              <div>Date: <span className="font-semibold text-zinc-200">{job.quote.dateCreated}</span></div>
              <div>Valid Until: <span className="font-semibold text-zinc-200">{job.quote.validUntil}</span></div>
            </div>
          </div>
        </div>

        {/* Client & Sales Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/80 p-4 border border-zinc-800 rounded-xl text-xs">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase">Prepared For Client</div>
            <div className="font-bold text-zinc-100 text-sm mt-0.5">{job.companyName}</div>
            <div className="text-zinc-300">{job.customerName}</div>
            <div className="text-[11px] mt-1 flex items-center space-x-1 text-zinc-400">
              <span>Email:</span>
              <EmailLink
                email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
                subject={`Quotation #${job.quote.quoteNumber} for ${job.companyName}`}
                className="text-amber-400 font-semibold"
                showIcon
              />
            </div>
            <div className="text-zinc-500 text-[11px] mt-0.5">Ref Project: {job.projectName}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase">BrandFlow Sales Specialist</div>
            <div className="font-bold text-zinc-100 text-sm mt-0.5">{job.quote.salesRep}</div>
            <div className="text-[11px] mt-1 flex items-center space-x-1 text-zinc-400">
              <span>Email:</span>
              <EmailLink
                email="d.miller@brandflowpro.co.za"
                subject={`Inquiry about Quote #${job.quote.quoteNumber}`}
                className="text-amber-400 font-semibold"
                showIcon
              />
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">Direct Line: +27 (0)11 555-2040</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-bold uppercase text-[10px] tracking-wider text-zinc-400 bg-zinc-950/40">
                <th className="py-2.5 px-3">Item Description & Finishing Specifications</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-medium">
              {job.quote.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-start space-x-3">
                      {item.imageUrl && (
                        <div className="w-14 h-14 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950 shrink-0 mt-0.5">
                          <img
                            src={item.imageUrl}
                            alt={item.description}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="font-extrabold text-zinc-100 text-xs">{item.description}</div>
                        <div className="text-[11px] text-zinc-400">
                          Paper/Material: <span className="font-semibold text-zinc-300">{item.paperStock}</span> • Color: <span className="font-semibold text-zinc-300">{item.colorProfile}</span>
                        </div>
                        
                        {/* Branding Placement & Physical Dimensions Spec */}
                        {(item.brandingPlacement || item.brandingWidthMm) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-0.5">
                            {item.brandingPlacement && (
                              <span className="bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                                📍 Placement: {item.brandingPlacement}
                              </span>
                            )}
                            {item.brandingWidthMm && item.brandingHeightMm && (
                              <span className="bg-zinc-800 text-amber-300 font-bold font-mono px-2 py-0.5 rounded border border-zinc-700">
                                📏 Size: {item.brandingWidthMm}mm × {item.brandingHeightMm}mm
                                {item.maxPhysicalWidthMm ? ` (Max: ${item.maxPhysicalWidthMm}×${item.maxPhysicalHeightMm}mm)` : ''}
                              </span>
                            )}
                            {item.brandingMethod && (
                              <span className="bg-zinc-800 text-zinc-300 font-semibold px-2 py-0.5 rounded border border-zinc-700">
                                ✨ Method: {item.brandingMethod}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-[11px] text-zinc-400 font-medium">
                          Finishes: <span className="font-semibold text-zinc-300">{item.finishes.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-zinc-200">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">R {item.unitCost.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                    R {item.totalCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Box */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <div className="w-72 space-y-2 text-xs font-medium bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-zinc-200">R {job.quote.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Discount Allowed:</span>
              <span className="font-mono font-bold text-emerald-400">-R {job.quote.discountAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>VAT / Sales Tax (15% ZAR):</span>
              <span className="font-mono font-bold text-zinc-200">R {job.quote.vatTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-black text-zinc-100">
              <span>Total Payable:</span>
              <span className="font-mono text-amber-400 text-base">R {job.quote.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Terms & Digital Signature Box */}
        <div className="border-t border-zinc-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-zinc-400">
          <div>
            <div className="font-bold text-zinc-200 uppercase mb-1">Standard Print Terms & Conditions</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>50% deposit required upon proof approval prior to press run.</li>
              <li>Color matching subject to Delta-E ISO 12647-2 proofing standard.</li>
              <li>Turnaround time commences upon final signed PDF artwork proof.</li>
            </ul>
          </div>

          <div className="border border-zinc-800 p-3.5 rounded-xl bg-zinc-950/80 flex flex-col justify-between">
            <div>
              <div className="font-bold text-zinc-200">Client Approval Acceptance</div>
              <div className="text-[10px] text-zinc-500">Sign electronically via BrandFlow Approval Portal</div>
            </div>
            <div className="border-b border-dashed border-zinc-700 pt-6"></div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>Authorized Signature</span>
              <span>Date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Database Email Log History Section */}
      <div className="max-w-4xl mx-auto">
        <ClientEmailLogsCard
          clientId={job.quote.customerId}
          clientName={job.customerName}
          companyName={job.companyName}
          clientEmail={customerEmail}
          jobNumber={job.jobNumber}
          quoteNumber={job.quote.quoteNumber}
          title={`Database Email Log — ${job.companyName} (#${job.quote.quoteNumber})`}
          onSaveNotification={onSaveNotification}
        />
      </div>
    </div>
  );
};
