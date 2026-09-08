import React, { useState } from 'react';
import { Send, FileText, CheckCircle2, Clock, ShieldCheck, Printer, Mail } from 'lucide-react';
import { Job } from '../../types';
import { EmailLink } from '../EmailLink';
import { ClientEmailSendButton } from '../ClientEmailSendButton';
import { ClientEmailLogsCard } from '../ClientEmailLogsCard';
import { formatRands } from '../../utils/formatters';

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
  const quoteEmailBody = `Dear ${job.customerName},\n\nPlease find attached the formal quotation #${job.quote.quoteNumber} for your project "${job.projectName}".\n\nTotal Amount: ${formatRands(job.quote.totalAmount)}\nValid Until: ${job.quote.validUntil}\nSales Rep: ${job.quote.salesRep}\n\nYou can review, approve, or request revisions directly through our client portal.\n\nThank you for choosing BrandFlow Pro!\n\nBest regards,\nBrandFlow Pro Client Services\nwww.brandflowpro.co.za`;

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Top Banner Actions */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 px-2.5 py-0.5 rounded-full">
            Formal Client Document
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Client Quotation • #{job.quote.quoteNumber}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>Approval Center</span>
          </button>
        </div>
      </div>

      {/* Formal Paper Printable Quote Card */}
      <div className="max-w-4xl mx-auto mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 sm:p-8 space-y-6 text-zinc-200">
        {/* Letterhead */}
        <div className="flex flex-wrap justify-between items-start border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="text-xl font-bold text-[#0a84ff] tracking-tight">BRANDFLOW PRO</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Enterprise Printing & Branding Solutions
            </div>
            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
              <div>45 Corporate Park Drive, Building 8, Sandton</div>
              <div>Johannesburg, Gauteng 2196 • Tel: +27 (0)11 555-PRINT</div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span>Web: www.brandflowpro.co.za • Email:</span>
                <EmailLink
                  email="quotes@brandflowpro.co.za"
                  subject={`Client Quotation Inquiry #${job.quote.quoteNumber}`}
                  className="text-[#0a84ff] font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Quotation</h1>
            <div className="text-xs font-mono font-bold text-[#0a84ff] mt-1">#{job.quote.quoteNumber}</div>
            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
              <div>Date: <span className="font-semibold text-slate-200">{job.quote.dateCreated}</span></div>
              <div>Valid Until: <span className="font-semibold text-slate-200">{job.quote.validUntil}</span></div>
            </div>
          </div>
        </div>

        {/* Client & Sales Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.03] p-4 border border-white/[0.08] rounded-2xl text-xs">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prepared For Client</div>
            <div className="font-bold text-white text-sm mt-0.5">{job.companyName}</div>
            <div className="text-slate-300 font-medium">{job.customerName}</div>
            <div className="text-[11px] mt-1 flex items-center space-x-1 text-slate-400">
              <span>Email:</span>
              <EmailLink
                email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
                subject={`Quotation #${job.quote.quoteNumber} for ${job.companyName}`}
                className="text-[#0a84ff] font-semibold"
                showIcon
              />
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">Ref Project: {job.projectName}</div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">BrandFlow Sales Specialist</div>
            <div className="font-bold text-white text-sm mt-0.5">{job.quote.salesRep}</div>
            <div className="text-[11px] mt-1 flex items-center space-x-1 text-slate-400">
              <span>Email:</span>
              <EmailLink
                email="d.miller@brandflowpro.co.za"
                subject={`Inquiry about Quote #${job.quote.quoteNumber}`}
                className="text-[#0a84ff] font-semibold"
                showIcon
              />
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">Direct Line: +27 (0)11 555-2040</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] font-semibold uppercase text-[10px] tracking-wider text-slate-400 bg-white/[0.02]">
                <th className="py-3 px-3">Item Description & Finishing Specifications</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-medium">
              {job.quote.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-start space-x-3.5">
                      {item.imageUrl && (
                        <div className="w-14 h-14 rounded-xl border border-white/[0.1] overflow-hidden bg-white/[0.02] shrink-0 mt-0.5">
                          <img
                            src={item.imageUrl}
                            alt={item.description}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">{item.description}</div>
                        <div className="text-[11px] text-slate-400">
                          Paper/Material: <span className="font-semibold text-slate-200">{item.paperStock}</span> • Color: <span className="font-semibold text-slate-200">{item.colorProfile}</span>
                        </div>
                        
                        {/* Branding Placement & Physical Dimensions Spec */}
                        {(item.brandingPlacement || item.brandingWidthMm) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-0.5">
                            {item.brandingPlacement && (
                              <span className="bg-[#0a84ff]/15 text-[#0a84ff] font-semibold px-2 py-0.5 rounded-full border border-[#0a84ff]/30">
                                📍 {item.brandingPlacement}
                              </span>
                            )}
                            {item.brandingWidthMm && item.brandingHeightMm && (
                              <span className="bg-white/[0.06] text-slate-300 font-semibold font-mono px-2 py-0.5 rounded-full border border-white/[0.08]">
                                📏 {item.brandingWidthMm}mm × {item.brandingHeightMm}mm
                                {item.maxPhysicalWidthMm ? ` (Max: ${item.maxPhysicalWidthMm}×${item.maxPhysicalHeightMm}mm)` : ''}
                              </span>
                            )}
                            {item.brandingMethod && (
                              <span className="bg-white/[0.04] text-slate-300 font-medium px-2 py-0.5 rounded-full border border-white/[0.08]">
                                ✨ {item.brandingMethod}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Custom Branding Requirements Directive */}
                        {item.customBrandingNotes && (
                          <div className="mt-1.5 p-2 bg-amber-500/10 border border-amber-400/30 rounded-xl text-[11px] text-amber-200">
                            <span className="font-bold text-amber-300">Custom Branding Directive:</span> {item.customBrandingNotes}
                          </div>
                        )}

                        <div className="text-[11px] text-slate-400 font-medium">
                          Finishes: <span className="font-semibold text-slate-300">{item.finishes.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-200">{item.quantity}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">{formatRands(item.unitCost, { decimals: true })}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-[#0a84ff]">
                    {formatRands(item.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Box */}
        <div className="flex justify-end pt-4 border-t border-white/[0.08]">
          <div className="w-72 space-y-2.5 text-xs font-medium bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-white">{formatRands(job.quote.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Discount Allowed:</span>
              <span className="font-mono font-semibold text-rose-400">-{formatRands(job.quote.discountAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>VAT / Sales Tax (15% ZAR):</span>
              <span className="font-mono font-semibold text-white">{formatRands(job.quote.vatTax, { decimals: true })}</span>
            </div>
            <div className="border-t border-white/[0.08] pt-2.5 flex justify-between text-sm font-bold text-white">
              <span>Total Payable:</span>
              <span className="font-mono text-[#0a84ff] text-base font-bold">{formatRands(job.quote.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Digital Signature Box */}
        <div className="border-t border-white/[0.08] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-slate-400">
          <div>
            <div className="font-semibold text-white uppercase tracking-wider mb-1.5">Standard Print Terms & Conditions</div>
            <ul className="list-disc list-inside space-y-1">
              <li>50% deposit required upon proof approval prior to press run.</li>
              <li>Color matching subject to Delta-E ISO 12647-2 proofing standard.</li>
              <li>Turnaround time commences upon final signed PDF artwork proof.</li>
            </ul>
          </div>

          <div className="border border-white/[0.08] p-4 rounded-2xl bg-white/[0.03] flex flex-col justify-between">
            <div>
              <div className="font-semibold text-white">Client Approval Acceptance</div>
              <div className="text-[10px] text-slate-400">Sign electronically via BrandFlow Approval Portal</div>
            </div>
            <div className="border-b border-dashed border-white/[0.16] pt-6"></div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
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
