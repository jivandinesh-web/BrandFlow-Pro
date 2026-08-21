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
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Search & Filter Bar */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by company name, contact, or customer code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950/80 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 cursor-pointer focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            >
              <option value="All">All Account Types</option>
              <option value="VIP">VIP Tier</option>
              <option value="Corporate">Corporate</option>
              <option value="Agency">Agency</option>
              <option value="Retail">Retail</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>Add Client Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Directory Table */}
        <div className="lg:col-span-7 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl overflow-hidden">
          <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
              Client Accounts Directory ({filtered.length})
            </span>
            <span className="text-[11px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Click row to select customer
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Code</th>
                  <th className="p-3">Company & Contact</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Credit Limit</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                {filtered.map((c) => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-l-4 border-l-amber-500 font-semibold shadow-xs'
                          : 'hover:bg-zinc-800/40'
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-amber-400 flex items-center space-x-1">
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />}
                        <span>{c.code}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-zinc-100">{c.company}</div>
                        <div className="text-[10px] text-zinc-400 flex items-center space-x-1.5 flex-wrap">
                          <span>{c.contactPerson || c.name}</span>
                          <span className="text-zinc-600">•</span>
                          <EmailLink email={c.email} subject={`BrandFlow Inquiry - ${c.company}`} className="text-[10px] text-zinc-400 hover:text-amber-300" />
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {c.accountType}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-zinc-200">R {c.creditLimit?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{c.discountRate}%</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                            openEditModal(c);
                          }}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 font-bold rounded text-[10px] border border-amber-500/30 transition-all inline-flex items-center space-x-1 cursor-pointer"
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
        <div className="lg:col-span-5 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <div className="border-b border-zinc-800 pb-3 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  {selectedCustomer.code}
                </span>
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded">
                  {selectedCustomer.accountType} Tier
                </span>
              </div>
              <h3 className="text-base font-extrabold text-zinc-100 mt-1">{selectedCustomer.company}</h3>
            </div>

            <button
              type="button"
              onClick={() => openEditModal()}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Account</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Credit Limit</div>
              <div className="text-sm font-black text-zinc-100 font-mono mt-0.5">
                R {selectedCustomer.creditLimit?.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Balance Due</div>
              <div className="text-sm font-black text-rose-400 font-mono mt-0.5">
                R {selectedCustomer.balanceDue?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-zinc-400">Contact:</span>
              <span className="text-zinc-100">{selectedCustomer.contactPerson || selectedCustomer.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-zinc-400">Email:</span>
              <EmailLink
                email={selectedCustomer.email}
                subject={`BrandFlow Pro - Customer Communications (${selectedCustomer.company})`}
                showQuickActions
                className="font-mono text-amber-300 text-xs font-semibold"
              />
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-zinc-400">Phone:</span>
              <span className="text-zinc-100">{selectedCustomer.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-zinc-400">Tax ID:</span>
              <span className="font-mono text-zinc-200">{selectedCustomer.taxNumber}</span>
            </div>
            {selectedCustomer.address && (
              <div className="flex items-center space-x-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-zinc-400">Address:</span>
                <span className="text-zinc-300">{selectedCustomer.address}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg text-xs space-y-1">
            <div className="font-bold text-amber-400 flex items-center space-x-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Contractual Print Pricing Tier</span>
            </div>
            <div className="text-zinc-400 text-[11px]">
              Agreed Discount Rate: <span className="font-bold text-emerald-400">{selectedCustomer.discountRate}% off standard price list</span>.
              Lifetime orders completed: <span className="font-bold text-zinc-200">{selectedCustomer.totalOrders} jobs</span>.
            </div>
          </div>
        </div>
      </div>

      {/* Add New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100">Create New Customer Profile</h3>
                  <p className="text-xs text-zinc-400 font-medium">Add client account details and set credit/discount rates</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact Person Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@acme.co.za"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+27 (0)11 234 5678"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Account Type Tier</label>
                  <select
                    value={newAccountType}
                    onChange={(e: any) => setNewAccountType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-semibold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  >
                    <option value="VIP">VIP Tier (Premium)</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Agency">Agency</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newDiscountRate}
                    onChange={(e) => setNewDiscountRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Credit Limit (R)</label>
                  <input
                    type="number"
                    step="10000"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Tax / VAT Number</label>
                  <input
                    type="text"
                    value={newTaxNumber}
                    onChange={(e) => setNewTaxNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Physical Address</span>
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Save Customer Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100">
                    Edit Client Account ({selectedCustomer?.code})
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">Update company profile, contact details, and credit terms</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact Person Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Account Type Tier</label>
                  <select
                    value={editAccountType}
                    onChange={(e: any) => setEditAccountType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-semibold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  >
                    <option value="VIP">VIP Tier (Premium)</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Agency">Agency</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-semibold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editDiscountRate}
                    onChange={(e) => setEditDiscountRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Credit Limit (R)</label>
                  <input
                    type="number"
                    step="10000"
                    value={editCreditLimit}
                    onChange={(e) => setEditCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono font-bold text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-zinc-300">Tax / VAT Number</label>
                  <input
                    type="text"
                    value={editTaxNumber}
                    onChange={(e) => setEditTaxNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-mono text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Physical Address</span>
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg font-medium text-zinc-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-zinc-950" />
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
