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
import { CookieConsent } from './CookieConsent';
import { LegalFooter } from './LegalFooter';

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
      { id: 'Dashboard', label: 'QUEUE', icon: LayoutDashboard },
      { id: 'Customers', label: 'CUSTOMER', icon: Users, badge: '5' },
      { id: 'Quotations', label: 'QUOTATION', icon: Calculator, badge: '4' },
      { id: 'Production', label: 'PRODUCTION', icon: Printer, badge: '3' },
      { id: 'QualityControl', label: 'QUALITY CONTROL', icon: Award },
      { id: 'Dispatch', label: 'DISPATCH', icon: Truck, badge: 'Live' },
    ],
  },
  {
    category: 'Studio & Design',
    items: [
      { id: 'ArtworkUpload', label: 'ARTWORK UPLOAD', icon: Upload },
      { id: 'Design', label: 'DESIGN DEPT', icon: PenTool },
      { id: 'Approval', label: 'CLIENT APPROVAL', icon: FileCheck, badge: 'Urgent' },
      { id: 'PdfProofApproval', label: 'PDF PROOF', icon: ShieldCheck, badge: 'Proof' },
      { id: 'AssetLibrary', label: 'ASSET LIBRARY', icon: Database },
    ],
  },
  {
    category: 'Administration',
    items: [
      { id: 'ClientQuote', label: 'CLIENT QUOTE', icon: FileText },
      { id: 'Accounts', label: 'ACCOUNTS', icon: DollarSign },
      { id: 'PaymentTracking', label: 'PAYMENT TRACKING', icon: CreditCard },
      { id: 'Reports', label: 'BUSINESS REPORTS', icon: PieChart },
      { id: 'UserManagement', label: 'USER MANAGEMENT', icon: Shield },
      { id: 'Settings', label: 'SETTINGS', icon: Settings },
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
    <div className="h-screen w-screen bg-[#FFFFFF] glossy-bg-white text-zinc-100 font-sans flex flex-col overflow-hidden select-none">
      {/* Top Application Window Bar with Apple macOS Frosted Glass & Traffic Lights */}
      <div className="bg-[#18181b]/75 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.25)] relative z-30">
        <div className="flex items-center space-x-3.5">
          {/* Authentic macOS Window Traffic Light Controls */}
          <div className="hidden sm:flex items-center space-x-2 mr-2">
            <button
              aria-label="Close window"
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/70 shadow-2xs hover:opacity-85 transition-opacity cursor-pointer"
            />
            <button
              aria-label="Minimize window"
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/70 shadow-2xs hover:opacity-85 transition-opacity cursor-pointer"
            />
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              aria-label="Maximize window"
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/70 shadow-2xs hover:opacity-85 transition-opacity cursor-pointer"
            />
          </div>

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer menu"
            className="md:hidden p-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] rounded-xl focus:outline-hidden transition-colors shadow-2xs"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Brand Logo with Apple Minimalist Refinement */}
          <div className="flex items-center space-x-2.5">
            <div className="w-6.5 h-6.5 bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 border border-white/20 relative overflow-hidden">
              <div className="w-2.5 h-2.5 bg-white rounded-xs transform rotate-45" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-white tracking-tight text-sm">
                BrandFlow Pro
              </span>
              <span className="text-[10px] uppercase font-mono font-medium tracking-wider text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] hidden sm:inline">
                ERP v4.8
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 border-l border-white/[0.08] pl-3.5 hidden lg:inline font-sans">
            Print, Signage & Brand Operations Platform
          </span>
        </div>

        {/* Live Notification Bar Toast with Apple Frosted Capsule */}
        {notificationMsg && (
          <div
            className={`px-3.5 py-1 rounded-full text-xs font-medium flex items-center space-x-2 animate-in fade-in transition-all shadow-md backdrop-blur-xl border ${
              notificationMsg.includes('QUOTATION')
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : notificationMsg.includes('ARTWORK')
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : notificationMsg.includes('Dispatch') || notificationMsg.includes('DISPATCH')
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-white/[0.08] text-white border-white/[0.12]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                notificationMsg.includes('QUOTATION')
                  ? 'bg-amber-400'
                  : notificationMsg.includes('ARTWORK')
                  ? 'bg-purple-400'
                  : notificationMsg.includes('Dispatch') || notificationMsg.includes('DISPATCH')
                  ? 'bg-emerald-400'
                  : 'bg-[#0a84ff]'
              }`}
            />
            <span className="truncate max-w-[200px] sm:max-w-xs">{notificationMsg}</span>
          </div>
        )}

        {/* Window Control & Onboarding Tour Trigger */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl text-xs font-medium shadow-xs transition-all cursor-pointer border border-white/[0.12]"
            title="Start Guided Workflow Tour"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
        </div>
      </div>

      {/* Main Body Layout (Left Sidebar + Main Content Workspace) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* Left Navigation Bar with Apple Frosted Translucent Material */}
        <nav
          className={`fixed md:relative inset-y-0 left-0 z-50 bg-[#161618]/70 backdrop-blur-3xl border-r border-white/[0.08] flex flex-col justify-between shrink-0 overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${
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
          <div className="py-2.5 space-y-3">
            {/* Sidebar Toggle & Header Control */}
            <div className="px-3.5 py-2 flex items-center justify-between border-b border-white/[0.08]">
              {!isSidebarCollapsed || mobileMenuOpen ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-xs tracking-wider text-slate-400 uppercase flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#0a84ff]" />
                    <span>Modules Navigation</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {/* List vs Grid Layout Mode Switcher */}
                    <button
                      onClick={() =>
                        setSidebarLayoutMode(sidebarLayoutMode === 'list' ? 'grid' : 'list')
                      }
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
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
                      className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                      title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icon Rail'}
                      aria-label="Toggle sidebar expansion"
                    >
                      <PanelLeftClose className="w-3.5 h-3.5" />
                    </button>
                    {/* Mobile Close Button */}
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
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
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                    title="Expand Sidebar"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeftOpen className="w-4 h-4 text-[#0a84ff]" />
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
                      className="flex items-center justify-between px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    >
                      <span>{group.category}</span>
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  )}

                  {/* Category Separator in Compact Rail Mode */}
                  {isSidebarCollapsed && !mobileMenuOpen && (
                    <div className="px-2 py-1">
                      <div className="w-full h-px bg-white/[0.08] my-1" />
                    </div>
                  )}

                  {(!isCollapsed || (isSidebarCollapsed && !mobileMenuOpen)) && (
                    <div
                      className={
                        isSidebarCollapsed && !mobileMenuOpen
                          ? 'space-y-1 px-1.5'
                          : sidebarLayoutMode === 'grid'
                          ? 'grid grid-cols-2 gap-1.5 px-2'
                          : 'space-y-1 px-2'
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
                                : 'items-center justify-between px-3 py-2 rounded-xl min-h-[40px]'
                            } text-xs font-medium ${
                              isActive
                                ? isGridMode
                                  ? 'bg-[#0a84ff]/20 border-[#0a84ff]/60 text-white shadow-xs font-semibold'
                                  : 'bg-[#0a84ff] text-white shadow-[0_4px_16px_rgba(10,132,255,0.35)] font-semibold border border-white/20'
                                : isGridMode
                                ? 'bg-white/[0.04] border-white/[0.08] text-slate-200 hover:bg-white/[0.08] hover:text-white active:scale-98'
                                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white active:scale-98'
                            }`}
                          >
                            <div
                              className={
                                isGridMode
                                  ? 'w-full flex items-center justify-between gap-1'
                                  : 'flex items-center space-x-2.5 truncate'
                              }
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon
                                  className={`shrink-0 transition-transform group-hover:scale-105 ${
                                    isGridMode ? 'w-4 h-4' : 'w-4 h-4'
                                  } ${
                                    isActive
                                      ? 'text-white'
                                      : 'text-slate-300 group-hover:text-white'
                                  }`}
                                />
                                {!isGridMode && (!isSidebarCollapsed || mobileMenuOpen) && (
                                  <span className="truncate font-medium text-[13px] tracking-tight text-slate-200 group-hover:text-white">{item.label}</span>
                                )}
                              </div>

                              {(!isSidebarCollapsed || mobileMenuOpen) && item.badge && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono shrink-0 shadow-2xs ${
                                    isActive
                                      ? isGridMode
                                        ? 'bg-[#0a84ff] text-white'
                                        : 'bg-white/25 text-white border border-white/40'
                                      : item.badge.includes('PROD') || item.badge.includes('ACTIVE') || item.badge === '5'
                                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                      : item.badge.includes('URGENT') || item.badge.includes('FAIL')
                                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {isGridMode && (!isSidebarCollapsed || mobileMenuOpen) && (
                              <span className={`text-[11px] leading-tight truncate w-full mt-1 font-medium ${isActive ? 'text-white font-semibold' : 'text-slate-200 group-hover:text-white'}`}>
                                {item.label}
                              </span>
                            )}

                            {/* Floating Tooltip in Compact Rail Mode */}
                            {isSidebarCollapsed && !mobileMenuOpen && (
                              <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-[#1c1c1e] text-white text-xs font-medium rounded-xl border border-white/[0.1] shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#0a84ff] text-white rounded-full text-[9px]">
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

          {/* Bottom Profile Footer with Apple Frosted Capsule */}
          <div className="p-3 bg-white/[0.04] backdrop-blur-xl border-t border-white/[0.08] mx-2 mb-2 rounded-2xl">
            {(!isSidebarCollapsed || mobileMenuOpen) ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-xs shrink-0">
                    {currentRole[0]}
                  </div>
                  <div className="text-xs text-slate-200 truncate">
                    <p className="font-semibold text-white truncate">Arthur Pendelton</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                      <span>{currentRole}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-xs cursor-pointer"
                  title="Expand Sidebar"
                >
                  {currentRole[0]}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content Workspace Container with Apple Minimalist Atmosphere and Glossy #FFFFFF Canvas */}
        <div className="flex-1 bg-[#FFFFFF] glossy-bg-white flex flex-col overflow-hidden text-zinc-100 w-full relative">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>

      <footer className="bg-[#141416]/75 backdrop-blur-md border-t border-white/[0.08] text-slate-400 text-[10px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between font-mono shrink-0 shadow-2xs py-2 gap-2">
        <LegalFooter />
        <div className="flex items-center gap-4 uppercase font-medium">
          <span className="hidden sm:inline text-slate-500 font-mono">ERP v4.8</span>
          <span className="text-blue-400 flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            Sync: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </footer>
      <CookieConsent />

      {/* Guided Quick-Start Tour Modal with Apple Frosted Glass Dialog */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] border border-white/[0.12] overflow-hidden text-zinc-100">
            <div className="px-6 py-4.5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-semibold text-sm text-white">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>BrandFlow Pro — Guided Workflow Tour</span>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                aria-label="Close guided onboarding tour"
                className="text-slate-400 hover:text-white rounded-full p-1.5 hover:bg-white/[0.08] transition-colors"
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


