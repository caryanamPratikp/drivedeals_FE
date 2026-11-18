import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  Search,
  Bell,
  Eye,
  EyeOff,
  Send,
  Layers,
  PiggyBank,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { mockFinanceData } from './dashboard/data/mockFinanceData';
import { FinanceStatCard } from './dashboard/components/FinanceStatCard';
import { AccountDetailsCard } from './dashboard/components/AccountDetailsCard';
import { TransferInfoCard } from './dashboard/components/TransferInfoCard';
import { SpendingMapCard } from './dashboard/components/SpendingMapCard';
import { BudgetStatsCard } from './dashboard/components/BudgetStatsCard';
import { EverydayBankCard } from './dashboard/components/EverydayBankCard';
import { SavingsScreen } from './dashboard/components/SavingsScreen';
import { LiveOperationsTab } from './dashboard/components/LiveOperationsTab';

// Modals
import { SearchModal } from './dashboard/components/modals/SearchModal';
import { NotificationPopover } from './dashboard/components/modals/NotificationPopover';
import { SendMoneyModal } from './dashboard/components/modals/SendMoneyModal';
import { AddGoalModal } from './dashboard/components/modals/AddGoalModal';
import { RecipientModal } from './dashboard/components/modals/RecipientModal';

import { staggerContainer, staggerItem, luxuryEase } from '../../lib/animations';

export const AdminDashboard = () => {
  const {
    currentUser,
    adminAnalytics,
    dealers = [],
    groups = [],
    users = [],
    leads = [],
    auditEvents = [],
    adminLoading = false,
    fetchAdminOverview,
    reviewDealerApplication,
  } = useAppStore();

  // Tab State: 'overview' | 'savings' | 'operations'
  const [activeTab, setActiveTab] = useState('overview');

  // Master UI States
  const [hideAmounts, setHideAmounts] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // Dynamic Notifications State
  const [notificationsList, setNotificationsList] = useState(mockFinanceData.notifications);
  const unreadCount = notificationsList.filter((n) => !n.read).length;

  // Local Goals State for Savings Screen
  const [customGoals, setCustomGoals] = useState(mockFinanceData.savingsGoals);

  // Fetch admin telemetry on mount
  useEffect(() => {
    fetchAdminOverview();
  }, [fetchAdminOverview]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleGoalCreated = (newGoal) => {
    setCustomGoals((prev) => [newGoal, ...prev]);
  };

  // Combine real store analytics with mock sparkline visual points
  const statCardsData = [
    {
      ...mockFinanceData.overviewStats[0],
      amount: adminAnalytics?.grossDealVolume || mockFinanceData.overviewStats[0].amount,
      formattedAmount: adminAnalytics?.grossDealVolume
        ? `₹${(adminAnalytics.grossDealVolume / 10000000).toFixed(2)} Cr`
        : mockFinanceData.overviewStats[0].formattedAmount,
      isCurrency: true,
    },
    {
      ...mockFinanceData.overviewStats[1],
      amount: adminAnalytics?.collectiveSavings || mockFinanceData.overviewStats[1].amount,
      formattedAmount: adminAnalytics?.collectiveSavings
        ? `₹${(adminAnalytics.collectiveSavings / 100000).toFixed(2)} L`
        : mockFinanceData.overviewStats[1].formattedAmount,
      isCurrency: true,
    },
    {
      ...mockFinanceData.overviewStats[2],
      amount: adminAnalytics?.totalBuyers || mockFinanceData.overviewStats[2].amount,
      formattedAmount: `${adminAnalytics?.totalBuyers || users.length || 148} Buyers`,
      isCurrency: false,
    },
    {
      ...mockFinanceData.overviewStats[3],
      amount: adminAnalytics?.dealerConversionRate || mockFinanceData.overviewStats[3].amount,
      formattedAmount: `${adminAnalytics?.dealerConversionRate || 78.4}%`,
      isCurrency: false,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 pb-12"
    >
      {/* 4.A Welcome Header */}
      <motion.div
        variants={staggerItem}
        className="relative rounded-3xl bg-gradient-to-br from-[#17191D] via-[#141619] to-[#0E1012] p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Subtitle */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/10 border border-[#ED1725]/20 text-[#ED1725] text-xs font-heading font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Governance & Treasury Hub</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white flex items-center gap-3">
              <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'Pratik'}</span>
              <span className="text-xl sm:text-2xl font-normal text-slate-500">/</span>
              <span className="text-base sm:text-xl font-mono text-[#ED1725] font-bold">
                Admin
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-xl leading-relaxed">
              Real-time collective volume concessions, Pune dealership verification queues, and institutional escrow settlement pipelines.
            </p>
          </div>

          {/* Right Controls & Primary Action Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Live Telemetry Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pune Hub • Active</span>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors relative group"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-slate-300 group-hover:text-white" />
            </motion.button>

            {/* Notification Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationOpen(true)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors relative group"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300 group-hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ED1725] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md shadow-[#ED1725]/50 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Privacy / Amount Visibility Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHideAmounts(!hideAmounts)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors relative group"
              title={hideAmounts ? 'Reveal Financial Amounts' : 'Hide Financial Amounts (Privacy Mode)'}
            >
              {hideAmounts ? (
                <EyeOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-300 group-hover:text-white" />
              )}
            </motion.button>

            {/* Primary Action Button: "Send Money" / "Broadcast Fleet Deal" */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSendMoneyOpen(true)}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#ED1725] to-[#C0101C] hover:from-[#FF1F2F] hover:to-[#ED1725] text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#ED1725]/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Money / Disburse</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 4.B Financial Statistics Cards */}
      <motion.div
        variants={staggerItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCardsData.map((stat) => (
          <FinanceStatCard
            key={stat.id}
            title={stat.title}
            amount={stat.amount}
            formattedAmount={stat.formattedAmount}
            changePercent={stat.changePercent}
            trend={stat.trend}
            period={stat.period}
            sparkline={stat.sparkline}
            iconName={stat.iconName}
            accentColor={stat.accentColor}
            hideAmounts={hideAmounts}
            isCurrency={stat.isCurrency}
          />
        ))}
      </motion.div>

      {/* Top Navigation Tabs */}
      <motion.div
        variants={staggerItem}
        className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-white/10 text-white border border-white/15 shadow-md'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-[#ED1725]" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('savings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'savings'
              ? 'bg-white/10 text-white border border-white/15 shadow-md'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <PiggyBank className="w-4 h-4 text-emerald-400" />
          <span>Savings & Deal Allocations</span>
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'operations'
              ? 'bg-white/10 text-white border border-white/15 shadow-md'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <span>Live Operations & Tracks</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>
      </motion.div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {/* Tab 1: Platform Overview (Section 4 Main Dashboard Screen) */}
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Row 1: Account Details (4.C) & Transfer Info (4.D) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccountDetailsCard
                accountDetails={mockFinanceData.accountDetails}
                hideAmounts={hideAmounts}
                onOpenRecipientModal={(recipient) => setSelectedRecipient(recipient)}
                onOpenQuickTransfer={() => setIsSendMoneyOpen(true)}
              />
              <TransferInfoCard
                transferDetails={mockFinanceData.transferDetails}
                hideAmounts={hideAmounts}
                onInitiateTransfer={() => setIsSendMoneyOpen(true)}
              />
            </div>

            {/* Row 2: Spending Map (4.E) & Budget Stats (4.F) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingMapCard
                clusters={mockFinanceData.demandMapClusters}
                hideAmounts={hideAmounts}
              />
              <BudgetStatsCard
                budgetStats={mockFinanceData.budgetStats}
                hideAmounts={hideAmounts}
              />
            </div>

            {/* Row 3: Everyday Bank Card (4.G) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EverydayBankCard
                bankCard={mockFinanceData.bankCard}
                hideAmounts={hideAmounts}
              />

              {/* Quick Navigation Panel */}
              <div className="rounded-2xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-1">
                    Direct Operational Links
                  </h3>
                  <p className="text-[11px] text-[#A1A1AA] mb-4">
                    Fast access to dealership moderation, volume groups, and audit trails
                  </p>

                  <div className="space-y-2">
                    <a
                      href="/admin/dealers"
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 flex items-center justify-between text-xs transition-colors group"
                    >
                      <span className="text-white font-medium group-hover:text-[#ED1725] transition-colors">
                        Review Dealership Franchise Licenses
                      </span>
                      <span className="text-[11px] font-mono text-[#A1A1AA]">
                        {dealers.length} registered
                      </span>
                    </a>
                    <a
                      href="/admin/groups"
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 flex items-center justify-between text-xs transition-colors group"
                    >
                      <span className="text-white font-medium group-hover:text-[#ED1725] transition-colors">
                        Inspect Active Demand Groups
                      </span>
                      <span className="text-[11px] font-mono text-[#A1A1AA]">
                        {groups.length} groups
                      </span>
                    </a>
                    <a
                      href="/admin/audit"
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 flex items-center justify-between text-xs transition-colors group"
                    >
                      <span className="text-white font-medium group-hover:text-[#ED1725] transition-colors">
                        Immutable Cryptographic Audit Trail
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        100% Verified
                      </span>
                    </a>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span>System Version: DriveDeals 2.4.0</span>
                  <span className="font-mono text-slate-400">Node: Pune Central</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Savings Screen (Master Prompt Section 5) */}
        {activeTab === 'savings' && (
          <motion.div
            key="tab-savings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SavingsScreen
              savingsData={{
                overview: mockFinanceData.savingsOverview,
                categoriesProgress: mockFinanceData.savingsOverview.categoriesProgress,
                initialGoals: customGoals,
                projections: mockFinanceData.projections,
                roundUpsData: mockFinanceData.roundUps,
              }}
              hideAmounts={hideAmounts}
              onOpenAddGoalModal={() => setIsAddGoalOpen(true)}
              onOpenAddMoneyModal={(goal) => setIsSendMoneyOpen(true)}
            />
          </motion.div>
        )}

        {/* Tab 3: Live Operations & Tracks Screen */}
        {activeTab === 'operations' && (
          <motion.div
            key="tab-operations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LiveOperationsTab
              dealers={dealers}
              groups={groups}
              leads={leads}
              auditEvents={auditEvents}
              onApproveDealer={(id) => reviewDealerApplication(id, 'VERIFIED')}
              onRejectDealer={(id) => reviewDealerApplication(id, 'REJECTED')}
              onRefresh={fetchAdminOverview}
              loading={adminLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationPopover
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notificationsList}
        onMarkAllRead={handleMarkAllRead}
      />

      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        defaultRecipient={selectedRecipient}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onGoalCreated={handleGoalCreated}
      />

      <RecipientModal
        isOpen={!!selectedRecipient}
        recipient={selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
      />
    </motion.div>
  );
};

export default AdminDashboard;
