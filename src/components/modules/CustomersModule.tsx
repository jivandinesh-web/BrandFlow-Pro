import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Building2,
  User,
  Phone,
  Mail,
  CreditCard,
  Award,
  Filter,
  X,
  Check,
  DollarSign,
  MapPin,
  Pencil,
  CheckCircle2,
} from 'lucide-react';
import { Customer } from '../../types';
import { EmailLink } from '../EmailLink';
import { formatRands } from '../../utils/formatters';
import { ClientEmailSendButton } from '../ClientEmailSendButton';
import { ClientEmailLogsCard } from '../ClientEmailLogsCard';

interface CustomersModuleProps {
  customers: Customer[];
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onAddCustomer?: (newCustomer: Customer) => void;
  onUpdateCustomer?: (updatedCustomer: Customer) => void;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  customers,
  isEditing,
  onSaveNotification,
  onAddCustomer,
  onUpdateCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    customers[0] || ({} as Customer)
  );

  // Keep selectedCustomer synced when customers prop updates
  useEffect(() => {
    if (selectedCustomer?.id) {
      const match = customers.find((c) => c.id === selectedCustomer.id);
      if (match) setSelectedCustomer(match);
    } else if (customers.length > 0) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers]);

  // New Customer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAccountType, setNewAccountType] = useState<'VIP' | 'Corporate' | 'Agency' | 'Retail'>('Corporate');
  const [newCreditLimit, setNewCreditLimit] = useState(100000);
  const [newDiscountRate, setNewDiscountRate] = useState(10);
  const [newTaxNumber, setNewTaxNumber] = useState('ZA-498210499');
  const [newAddress, setNewAddress] = useState('100 Main Street, Sandton, Johannesburg');

  // Edit Customer Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAccountType, setEditAccountType] = useState<'VIP' | 'Corporate' | 'Agency' | 'Retail'>('Corporate');
  const [editCreditLimit, setEditCreditLimit] = useState(100000);
  const [editDiscountRate, setEditDiscountRate] = useState(10);
  const [editTaxNumber, setEditTaxNumber] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'On Hold' | 'Suspended'>('Active');

  const openEditModal = (customerToEdit?: Customer) => {
    const cust = customerToEdit || selectedCustomer;
    if (!cust || !cust.id) return;

    setEditCompany(cust.company || '');
    setEditContact(cust.name || cust.contactPerson || '');
    setEditEmail(cust.email || '');
    setEditPhone(cust.phone || '');
    setEditAccountType((cust.accountType as any) || 'Corporate');
    setEditCreditLimit(cust.creditLimit || 50000);
    setEditDiscountRate(cust.discountRate || 5);
    setEditTaxNumber(cust.taxNumber || 'ZA-498210499');
    setEditAddress(cust.address || 'Sandton, Johannesburg');
    setEditStatus((cust.status as any) || 'Active');

    setIsEditModalOpen(true);
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || c.accountType === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newContact.trim()) {
      onSaveNotification('⚠️ Please enter Company Name and Contact Person Name.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = newCompany.substring(0, 3).toUpperCase();
    const code = `${prefix}-${randomNum}`;

    const created: Customer = {
      id: `CUST-${Date.now()}`,
      code: code,
      name: newContact,
      company: newCompany,
      email: newEmail || `${newContact.toLowerCase().replace(/\s+/g, '.')}@${newCompany.toLowerCase().replace(/\s+/g, '')}.co.za`,
      phone: newPhone || '+27 (0)11 555 0199',
      accountType: newAccountType,
      creditLimit: Number(newCreditLimit) || 50000,
      balanceDue: 0,
      discountRate: Number(newDiscountRate) || 5,
      contactPerson: `${newContact} (Manager)`,
      address: newAddress,
      taxNumber: newTaxNumber,
      totalOrders: 0,
      status: 'Active',
    };

    if (onAddCustomer) {
      onAddCustomer(created);
    } else {
      onSaveNotification(`New Customer Profile #${created.code} (${created.company}) Created!`);
    }

    setSelectedCustomer(created);
    setIsModalOpen(false);

    // Reset Form
    setNewCompany('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleEditCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedCustomer.id) return;

    const updated: Customer = {
      ...selectedCustomer,
      company: editCompany,
      name: editContact,
      contactPerson: editContact.includes('(') ? editContact : `${editContact} (Contact)`,
      email: editEmail,
      phone: editPhone,
      accountType: editAccountType,
      creditLimit: Number(editCreditLimit),
      discountRate: Number(editDiscountRate),
      taxNumber: editTaxNumber,
      address: editAddress,
      status: editStatus,
    };

    setSelectedCustomer(updated);

    if (onUpdateCustomer) {
      onUpdateCustomer(updated);
    } else {
      onSaveNotification(`Customer Profile #${updated.code} (${updated.company}) updated!`);
    }

    setIsEditModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-zinc-100 bg-transparent min-h-full">
      {/* Search & Filter Bar */}
      <div className="mirror-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by company name, contact, or customer code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none transition-all"
            >
              <option value="All" className="bg-[#18181b] text-white">All Account Types</option>
              <option value="VIP" className="bg-[#18181b] text-white">VIP Tier</option>
              <option value="Corporate" className="bg-[#18181b] text-white">Corporate</option>
              <option value="Agency" className="bg-[#18181b] text-white">Agency</option>
              <option value="Retail" className="bg-[#18181b] text-white">Retail</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4.5 py-2.5 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all border border-white/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Client Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Directory Table */}
        <div className="lg:col-span-7 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="bg-white/[0.04] backdrop-blur-xl px-6 py-4.5 border-b border-white/[0.08] flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-white tracking-wider">
              Client Accounts Directory ({filtered.length})
            </span>
            <span className="text-[11px] text-[#0a84ff] font-semibold bg-[#0a84ff]/15 px-3 py-1 rounded-full border border-[#0a84ff]/30">
              Click row to select customer
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-slate-400 border-b border-white/[0.06] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5 pl-6">Code</th>
                  <th className="p-3.5">Company & Contact</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Credit Limit</th>
                  <th className="p-3.5">Discount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-medium text-slate-300">
                {filtered.map((c) => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#0a84ff]/15 font-semibold shadow-xs'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="p-3.5 pl-6 font-mono font-semibold text-[#0a84ff] flex items-center space-x-1.5">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0a84ff] inline shrink-0" />}
                        <span>{c.code}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{c.company}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2 flex-wrap mt-0.5">
                          <span>{c.contactPerson || c.name}</span>
                          <span className="text-slate-600">•</span>
                          <EmailLink email={c.email} subject={`BrandFlow Inquiry - ${c.company}`} className="text-[11px] text-slate-400 hover:text-white" />
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                          {c.accountType}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-200">{formatRands(c.creditLimit)}</td>
                      <td className="p-3.5 font-mono text-[#30d158] font-semibold">{c.discountRate}%</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            c.status === 'Active'
                              ? 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                            openEditModal(c);
                          }}
                          className="px-3 py-1 bg-white/[0.06] hover:bg-[#0a84ff] hover:text-white text-slate-300 font-semibold rounded-lg text-[11px] border border-white/[0.08] transition-all inline-flex items-center space-x-1.5 cursor-pointer active:scale-95"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Detailed Profile Card */}
        <div className="lg:col-span-5 mirror-card rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 space-y-5">
          <div className="border-b border-white/[0.08] pb-4 flex flex-wrap justify-between items-start gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-semibold bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 px-2.5 py-0.5 rounded-full">
                  {selectedCustomer.code}
                </span>
                <span className="text-[10px] font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                  {selectedCustomer.accountType} Tier
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{selectedCustomer.company}</h3>
            </div>

            <div className="flex items-center space-x-2.5">
              <ClientEmailSendButton
                toEmail={selectedCustomer.email}
                clientName={selectedCustomer.contactPerson || selectedCustomer.name}
                companyName={selectedCustomer.company}
                clientId={selectedCustomer.id}
                label="Re-Send Email to Client"
                variant="emerald"
                onSaveNotification={onSaveNotification}
              />

              <button
                type="button"
                onClick={() => openEditModal()}
                className="px-3 py-1.5 bg-white/[0.06] hover:bg-[#0a84ff] hover:text-white text-slate-300 border border-white/[0.08] rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Credit Limit</div>
              <div className="text-base font-bold text-white font-mono mt-1">
                {formatRands(selectedCustomer.creditLimit)}
              </div>
            </div>
            <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Balance Due</div>
              <div className="text-base font-bold text-rose-400 font-mono mt-1">
                {formatRands(selectedCustomer.balanceDue)}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center space-x-2.5 text-slate-300">
              <User className="w-4 h-4 text-[#0a84ff] shrink-0" />
              <span className="font-semibold text-slate-400">Contact:</span>
              <span className="text-white">{selectedCustomer.contactPerson || selectedCustomer.name}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-[#0a84ff] shrink-0" />
              <span className="font-semibold text-slate-400">Email:</span>
              <EmailLink
                email={selectedCustomer.email}
                subject={`BrandFlow Pro - Customer Communications (${selectedCustomer.company})`}
                showQuickActions
                className="font-mono text-[#0a84ff] text-xs font-semibold"
              />
            </div>
            <div className="flex items-center space-x-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-[#0a84ff] shrink-0" />
              <span className="font-semibold text-slate-400">Phone:</span>
              <span className="text-white">{selectedCustomer.phone}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-300">
              <CreditCard className="w-4 h-4 text-[#0a84ff] shrink-0" />
              <span className="font-semibold text-slate-400">Tax ID:</span>
              <span className="font-mono text-slate-200">{selectedCustomer.taxNumber}</span>
            </div>
            {selectedCustomer.address && (
              <div className="flex items-center space-x-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#0a84ff] shrink-0" />
                <span className="font-semibold text-slate-400">Address:</span>
                <span className="text-slate-300">{selectedCustomer.address}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-xs space-y-1.5">
            <div className="font-semibold text-[#ff9f0a] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#ff9f0a]" />
              <span>Contractual Print Pricing Tier</span>
            </div>
            <div className="text-slate-400 text-xs">
              Agreed Discount Rate: <span className="font-semibold text-[#30d158]">{selectedCustomer.discountRate}% off standard price list</span>.
              Lifetime orders completed: <span className="font-semibold text-white">{selectedCustomer.totalOrders} jobs</span>.
            </div>
          </div>
        </div>
      </div>

      {/* Selected Customer Database Email Logs & Communication History */}
      {selectedCustomer && (
        <ClientEmailLogsCard
          clientId={selectedCustomer.id}
          clientName={selectedCustomer.contactPerson || selectedCustomer.name}
          companyName={selectedCustomer.company}
          clientEmail={selectedCustomer.email}
          title={`Database Communication & Email Logs — ${selectedCustomer.company} (${selectedCustomer.code})`}
          onSaveNotification={onSaveNotification}
        />
      )}

      {/* Add New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18181b]/95 backdrop-blur-2xl rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-white/[0.12] max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Customer Profile</h3>
                  <p className="text-xs text-slate-400 font-medium">Add client account details and set credit/discount rates</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Contact Person Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@acme.co.za"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+27 (0)11 234 5678"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Account Type Tier</label>
                  <select
                    value={newAccountType}
                    onChange={(e: any) => setNewAccountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181b] border border-white/[0.08] rounded-xl font-semibold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  >
                    <option value="VIP">VIP Tier (Premium)</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Agency">Agency</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newDiscountRate}
                    onChange={(e) => setNewDiscountRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono font-bold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Credit Limit (R)</label>
                  <input
                    type="number"
                    step="10000"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono font-bold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Tax / VAT Number</label>
                  <input
                    type="text"
                    value={newTaxNumber}
                    onChange={(e) => setNewTaxNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0a84ff]" />
                  <span>Physical Address</span>
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/[0.12] hover:bg-white/[0.08] text-slate-300 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Save Customer Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18181b]/95 backdrop-blur-2xl rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-white/[0.12] max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Edit Client Account ({selectedCustomer?.code})
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Update company profile, contact details, and credit terms</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Contact Person Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Account Type Tier</label>
                  <select
                    value={editAccountType}
                    onChange={(e: any) => setEditAccountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181b] border border-white/[0.08] rounded-xl font-semibold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  >
                    <option value="VIP">VIP Tier (Premium)</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Agency">Agency</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181b] border border-white/[0.08] rounded-xl font-semibold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editDiscountRate}
                    onChange={(e) => setEditDiscountRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono font-bold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Credit Limit (R)</label>
                  <input
                    type="number"
                    step="10000"
                    value={editCreditLimit}
                    onChange={(e) => setEditCreditLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono font-bold text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-300">Tax / VAT Number</label>
                  <input
                    type="text"
                    value={editTaxNumber}
                    onChange={(e) => setEditTaxNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0a84ff]" />
                  <span>Physical Address</span>
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl font-medium text-white focus:ring-2 focus:ring-[#0a84ff]/40 focus:border-[#0a84ff] outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-white/[0.12] hover:bg-white/[0.08] text-slate-300 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a84ff] hover:bg-[#0071e3] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
