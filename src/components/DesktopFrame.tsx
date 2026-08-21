import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileCheck,
  Upload,
  PenTool,
  ShieldCheck,
  Printer,
  Award,
  DollarSign,
  CreditCard,
  Truck,
  PieChart,
  Database,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  X,
  Menu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
  List,
} from 'lucide-react';
import { ModuleType, UserRole } from '../types';

interface DesktopFrameProps {
  children: React.ReactNode;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  currentRole: UserRole;
  notificationMsg: string | null;
}

interface NavGroup {
  category: string;
  items: { id: ModuleType; label: string; icon: React.FC<{ className?: string }>; badge?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: 'Operational',
    items: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Customers', label: 'Customers', icon: Users, badge: '5' },
      { id: 'Quotations', label: 'Quotations', icon: Calculator, badge: '4' },
      { id: 'Production', label: 'Production', icon: Printer, badge: '3 Runs' },
      { id: 'QualityControl', label: 'Quality Control', icon: Award },
      { id: 'Dispatch', label: 'Dispatch', icon: Truck, badge: 'Live' },
    ],
  },
  {
    category: 'Studio & Design',
    items: [
      { id: 'ArtworkUpload', label: 'Artwork Upload', icon: Upload },
      { id: 'Design', label: 'Design Dept', icon: PenTool },
      { id: 'Approval', label: 'Client Approval', icon: FileCheck, badge: 'Urgent' },
      { id: 'PdfProofApproval', label: 'PDF Proof Approval', icon: ShieldCheck, badge: 'Proof' },
      { id: 'AssetLibrary', label: 'Asset Library', icon: Database },
    ],
  },
  {
    category: 'Administration',
    items: [
      { id: 'ClientQuote', label: 'Client Quote', icon: FileText },
      { id: 'Accounts', label: 'Accounts (ERP)', icon: DollarSign },
      { id: 'PaymentTracking', label: 'Payment Tracking', icon: CreditCard },
      { id: 'Reports', label: 'Business Reports', icon: PieChart },
      { id: 'UserManagement', label: 'User Management', icon: Shield },
      { id: 'Settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const DesktopFrame: React.FC<DesktopFrameProps> = ({
  children,
  activeModule,
  setActiveModule,
  currentRole,
  notificationMsg,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarLayoutMode, setSidebarLayoutMode] = useState<'list' | 'grid'>('list');
  const [isMaximized, setIsMaximized] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleModuleSelect = (mod: ModuleType) => {
    setActiveModule(mod);
    setMobileMenuOpen(false);
  };

  const ONBOARDING_STEPS = [
    {
      title: '1. Create Job & Estimate Quote',
      desc: 'Start in Quotations or Client Quote module. Input job parameters, quantities, paper stock, and finish specs to calculate live costs.',
      module: 'Quotations' as ModuleType,
      icon: Calculator,
    },
    {
      title: '2. Preflight Artwork & PDF Proofing',
      desc: 'Upload vector artwork in Artwork Upload. Review CMYK color profiles, resolution, and bleed guides, then issue a client PDF proof in PDF Proof Approval.',
      module: 'PdfProofApproval' as ModuleType,
      icon: ShieldCheck,
    },
    {
      title: '3. Press Production & Quality Control',
      desc: 'Monitor active press runs, Roland wide-format plotters, and Heidelberg offset jobs in Production queue. Verify Delta-E color accuracy in Quality Control.',
      module: 'Production' as ModuleType,
      icon: Printer,
    },
    {
      title: '4. Invoice Sync & Dispatch Logistics',
      desc: 'Generate ERP invoices in Accounts module, record payments in Payment Tracking, and issue dispatch manifests with courier tracking numbers in Dispatch.',
      module: 'Dispatch' as ModuleType,
      icon: Truck,
    },
  ];

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 font-sans flex flex-col overflow-hidden select-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
      {/* Top Application Window Bar with Vibrant Gradient & Mirror Glass Finish */}
      <div className="bg-white/75 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0 shadow-xs relative z-30 specular-border">
        <div className="flex items-center space-x-3">
          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer menu"
            className="md:hidden p-1.5 bg-white/80 hover:bg-slate-100 text-indigo-600 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors shadow-2xs"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Brand Logo with Vibrant Gradient Jewel */}
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/25 border border-white/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/25 to-white/60 pointer-events-none" />
              <div className="w-3 h-3 bg-white rounded-xs transform rotate-45 shadow-2xs" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight text-sm">
                BrandFlow Pro
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-600 px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200/80 hidden sm:inline shadow-2xs">
                ERP v4.8
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 border-l border-slate-200 pl-3 hidden lg:inline font-sans">
            Print, Signage & Brand Operations Platform
          </span>
        </div>

        {/* Live Notification Bar Toast with Vibrant Gradient Mirror Finish */}
        {notificationMsg && (
          <div
            className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center space-x-2 animate-in fade-in transition-all shadow-md backdrop-blur-md ${
              notificationMsg.includes('QUOTATION')
                ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-amber-500/10'
                : notificationMsg.includes('ARTWORK')
                ? 'bg-purple-50 text-purple-900 border border-purple-300 shadow-purple-500/10'
                : notificationMsg.includes('Dispatch') || notificationMsg.includes('DISPATCH')
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-emerald-500/10'
                : 'bg-white/90 text-indigo-950 border border-indigo-200 shadow-indigo-500/10'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                notificationMsg.includes('QUOTATION')
                  ? 'bg-amber-500'
                  : notificationMsg.includes('ARTWORK')
                  ? 'bg-purple-500'
                  : notificationMsg.includes('Dispatch') || notificationMsg.includes('DISPATCH')
                  ? 'bg-emerald-500'
                  : 'bg-indigo-500'
              }`}
            />
            <span className="truncate max-w-[200px] sm:max-w-xs">{notificationMsg}</span>
          </div>
        )}

        {/* Window Control & Onboarding Tour Trigger */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer border border-white/40"
            title="Start Guided Workflow Tour"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>

          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
            <button
              className="hover:bg-slate-100 rounded px-2 py-1 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Minimize"
              aria-label="Minimize application"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hover:bg-slate-100 rounded px-2 py-1 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Maximize"
              aria-label="Maximize window"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              className="hover:bg-rose-500 rounded px-2 py-1 text-slate-400 hover:text-white transition-colors"
              title="Close App"
              aria-label="Close application"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Layout (Left Sidebar + Main Content Workspace) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}

        {/* Left Technical Navigation Bar with Glass Mirror Finish */}
        <nav
          className={`fixed md:relative inset-y-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-r border-slate-200/90 flex flex-col justify-between shrink-0 overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out shadow-xs ${
            mobileMenuOpen
              ? 'translate-x-0 w-80'
              : `-translate-x-full md:translate-x-0 ${
                  isSidebarCollapsed
                    ? 'md:w-16'
                    : sidebarLayoutMode === 'grid'
                    ? 'md:w-72'
                    : 'md:w-60'
                }`
          }`}
        >
          <div className="py-2 space-y-3">
            {/* Sidebar Toggle & Header Control with Responsive Grid Switcher */}
            <div className="px-3.5 py-2 flex items-center justify-between border-b border-slate-200/70">
              {!isSidebarCollapsed || mobileMenuOpen ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Modules Navigation</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {/* List vs Grid Layout Mode Switcher */}
                    <button
                      onClick={() =>
                        setSidebarLayoutMode(sidebarLayoutMode === 'list' ? 'grid' : 'list')
                      }
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title={
                        sidebarLayoutMode === 'list'
                          ? 'Switch to 2-Column Responsive Grid'
                          : 'Switch to Compact List'
                      }
                      aria-label="Toggle sidebar grid layout"
                    >
                      {sidebarLayoutMode === 'list' ? (
                        <LayoutGrid className="w-3.5 h-3.5" />
                      ) : (
                        <List className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Desktop Expand / Collapse Sidebar Toggle */}
                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="hidden md:flex p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icon Rail'}
                      aria-label="Toggle sidebar expansion"
                    >
                      <PanelLeftClose className="w-3.5 h-3.5" />
                    </button>
                    {/* Mobile Close Button */}
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md"
                      aria-label="Close mobile navigation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Expand Sidebar"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeftOpen className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              )}
            </div>

            {NAV_GROUPS.map((group) => {
              const isCollapsed = collapsedCategories[group.category];
              return (
                <div key={group.category} className="space-y-0.5">
                  {/* Category Header (Shown in Expanded Mode) */}
                  {(!isSidebarCollapsed || mobileMenuOpen) && (
                    <div
                      onClick={() => toggleCategory(group.category)}
                      className="flex items-center justify-between px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      <span>{group.category}</span>
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  )}

                  {/* Category Separator in Compact Rail Mode */}
                  {isSidebarCollapsed && !mobileMenuOpen && (
                    <div className="px-2 py-1">
                      <div className="w-full h-px bg-slate-200 my-1" />
                    </div>
                  )}

                  {(!isCollapsed || (isSidebarCollapsed && !mobileMenuOpen)) && (
                    <div
                      className={
                        isSidebarCollapsed && !mobileMenuOpen
                          ? 'space-y-1 px-1.5'
                          : sidebarLayoutMode === 'grid'
                          ? 'grid grid-cols-2 gap-1.5 px-2'
                          : 'space-y-1 px-1.5'
                      }
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeModule === item.id;
                        const isGridMode =
                          sidebarLayoutMode === 'grid' && (!isSidebarCollapsed || mobileMenuOpen);

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleModuleSelect(item.id)}
                            aria-label={`Open ${item.label} module`}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={`w-full flex transition-all cursor-pointer text-left relative group ${
                              isSidebarCollapsed && !mobileMenuOpen
                                ? 'justify-center px-2 py-2.5 rounded-xl min-h-[42px] items-center'
                                : isGridMode
                                ? 'flex-col items-start justify-between p-2.5 rounded-xl min-h-[58px] border'
                                : 'items-center justify-between px-3.5 py-2 rounded-xl min-h-[40px]'
                            } text-xs font-semibold ${
                              isActive
                                ? isGridMode
                                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-900 shadow-xs'
                                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/20 font-bold'
                                : isGridMode
                                ? 'bg-white/80 border-slate-200/80 text-slate-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200'
                                : 'text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600'
                            }`}
                          >
                            <div
                              className={
                                isGridMode
                                  ? 'w-full flex items-center justify-between gap-1'
                                  : 'flex items-center space-x-2.5 truncate'
                              }
                            >
                              <div className="flex items-center space-x-2 truncate">
                                <Icon
                                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                                    isGridMode ? 'w-4 h-4' : 'w-4 h-4'
                                  } ${
                                    isActive
                                      ? isGridMode
                                        ? 'text-indigo-600'
                                        : 'text-white'
                                      : 'text-slate-400 group-hover:text-indigo-600'
                                  }`}
                                />
                                {!isGridMode && (!isSidebarCollapsed || mobileMenuOpen) && (
                                  <span className="truncate">{item.label}</span>
                                )}
                              </div>

                              {(!isSidebarCollapsed || mobileMenuOpen) && item.badge && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono shrink-0 shadow-2xs ${
                                    isActive
                                      ? isGridMode
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white/25 text-white border border-white/40'
                                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {isGridMode && (!isSidebarCollapsed || mobileMenuOpen) && (
                              <span className={`text-[11px] leading-tight truncate w-full mt-1 font-medium ${isActive ? 'text-indigo-950 font-bold' : 'text-slate-600 group-hover:text-indigo-900'}`}>
                                {item.label}
                              </span>
                            )}

                            {/* Floating Tooltip in Compact Rail Mode */}
                            {isSidebarCollapsed && !mobileMenuOpen && (
                              <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span className="ml-1.5 px-1 py-0.2 bg-indigo-500 text-white rounded text-[9px]">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Profile Footer */}
          <div className="p-3 bg-white/90 border-t border-slate-200/80">
            {(!isSidebarCollapsed || mobileMenuOpen) ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xs border border-white/60 shadow-xs shrink-0">
                    {currentRole[0]}
                  </div>
                  <div className="text-xs text-slate-700 truncate">
                    <p className="font-bold text-slate-900 truncate">Arthur Pendelton</p>
                    <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{currentRole}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden md:flex p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xs border border-white/60 shadow-xs cursor-pointer"
                  title="Expand Sidebar"
                >
                  {currentRole[0]}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content Workspace Container with Radiant Vibrant Background & Glass Effect */}
        <div className="flex-1 bg-gradient-to-br from-slate-50/90 via-indigo-50/20 to-purple-50/20 flex flex-col overflow-hidden text-slate-900 w-full relative">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>

      {/* Footer Status Bar with Mirror Glass Light */}
      <footer className="h-8 bg-white/80 backdrop-blur-md border-t border-slate-200/80 text-slate-500 text-[10px] px-4 sm:px-6 flex items-center justify-between font-mono shrink-0 shadow-2xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium font-sans">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            System Live & Connected
          </span>
          <span className="hidden sm:inline">User: Admin (Arthur)</span>
          <span className="hidden md:inline text-slate-400">Host: BF-MIRROR-GLASS-01</span>
        </div>
        <div className="flex items-center gap-4 uppercase font-bold">
          <span className="hidden sm:inline text-slate-400 font-mono">ERP v4.8</span>
          <span className="text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Sync: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </footer>

      {/* Guided Quick-Start Tour Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white/95 rounded-2xl shadow-2xl border border-indigo-200/80 overflow-hidden text-slate-900 mirror-card">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>BrandFlow Pro — Modern ERP Workflow Tour</span>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                aria-label="Close guided onboarding tour"
                className="text-white/80 hover:text-white rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  <span>Step {onboardingStep + 1} of 4</span>
                </div>
                <div className="flex gap-1.5">
                  {ONBOARDING_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === onboardingStep ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {(() => {
                const step = ONBOARDING_STEPS[onboardingStep];
                const StepIcon = step.icon;
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl shadow-md font-bold">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      {step.desc}
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveModule(ONBOARDING_STEPS[onboardingStep].module);
                  setShowOnboarding(false);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 underline underline-offset-2"
              >
                <span>Jump to {ONBOARDING_STEPS[onboardingStep].module} Module</span>
              </button>

              <div className="flex gap-2">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep((s) => s - 1)}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Previous
                  </button>
                )}
                {onboardingStep < ONBOARDING_STEPS.length - 1 ? (
                  <button
                    onClick={() => setOnboardingStep((s) => s + 1)}
                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-500/20"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      setOnboardingStep(0);
                    }}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Tour</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


