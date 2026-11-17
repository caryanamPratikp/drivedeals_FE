import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ArrowRight, ShieldCheck, Activity, Building2, FileText, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecondaryButton } from '../../components/common/Buttons';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminDashboard = () => {
  const {
    users = [],
    dealers = [],
    groups = [],
    quotationVersions = [],
    leads = [],
    leadDisputes = [],
    auditEvents = [],
  } = useAppStore();
  const navigate = useNavigate();

  // Platform KPIs computed dynamically from state
  const buyersCount = users.filter((u) => u.role === 'BUYER').length;
  const activeGroupsCount = groups.filter((g) => g.status !== 'CLOSED' && g.stage !== 'CLOSED').length;
  const verifiedDealersCount = dealers.filter((d) => d.verificationStatus === 'VERIFIED' || d.status === 'VERIFIED').length;
  const publishedOffersCount = quotationVersions.filter((v) => v.status === 'PUBLISHED').length;
  const leadsCount = leads.length;
  const pendingDisputesCount = leadDisputes.filter((d) => d.status === 'UNDER_REVIEW' || d.status === 'PENDING').length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 1. Dark Luxury Header */}
      <motion.div
        variants={staggerItem}
        className="bg-gradient-to-br from-dd-card via-dd-card to-dd-surface text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-dd-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-dd-red" />
              <span>Platform Governance</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white">
              Operations & Audit Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-xl leading-relaxed">
              Real-time platform telemetry, dealership verification queues, content moderation, and immutable audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl text-slate-300 font-mono flex items-center gap-2 backdrop-blur-sm">
              <Activity className="w-3.5 h-3.5 text-dd-green animate-pulse" />
              <span>Production Pipeline Active</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Stats Grid */}
      <motion.div
        variants={staggerItem}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5"
      >
        <StatCard
          label="Registered Buyers"
          value={buyersCount}
          subtext="Verified users"
          onClick={() => navigate('/admin/dealers')}
        />
        <StatCard
          label="Active Groups"
          value={activeGroupsCount}
          subtext="Volume demand"
          concept="buyerGroup"
          onClick={() => navigate('/admin/groups')}
        />
        <StatCard
          label="Verified Dealers"
          value={verifiedDealersCount}
          subtext="Franchise outlets"
          concept="verifiedDealer"
          onClick={() => navigate('/admin/dealers')}
        />
        <StatCard
          label="Published Quotes"
          value={publishedOffersCount}
          subtext="Group quotations"
          concept="dealerQuotation"
          onClick={() => navigate('/admin/groups')}
        />
        <StatCard
          label="Customer Leads"
          value={leadsCount}
          subtext="Authorized handoffs"
          concept="leadSharing"
          onClick={() => navigate('/admin/leads')}
        />
        <StatCard
          label="Active Disputes"
          value={pendingDisputesCount}
          subtext="Requiring review"
          trendType={pendingDisputesCount > 0 ? 'negative' : 'neutral'}
          onClick={() => navigate('/admin/leads')}
        />
      </motion.div>

      {/* 3. Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Dealership Verification Queue */}
        <motion.div
          variants={staggerItem}
          className="bg-dd-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-dd-red" />
                <h2 className="text-base font-heading font-black text-white tracking-tight">
                  Dealership Verification Queue
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Franchise applications pending commercial audit.
              </p>
            </div>
            <Link to="/admin/dealers">
              <SecondaryButton size="sm" icon={<ArrowRight size={13} />} iconPosition="right">
                All Dealers
              </SecondaryButton>
            </Link>
          </div>

          <div className="space-y-3">
            {dealers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-normal">
                No dealership records found in the database.
              </div>
            ) : (
              dealers.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl border border-white/5 bg-dd-surface/80 hover:border-white/10 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-white truncate">
                      {d.businessName || d.dealershipName}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5 font-normal truncate">
                      {d.city || d.address || 'Regional Outlet'}
                      {d.gstin && <span className="font-mono text-slate-500 ml-2">GSTIN: {d.gstin}</span>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={d.verificationStatus || d.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Live Audit Log Stream */}
        <motion.div
          variants={staggerItem}
          className="bg-dd-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-dd-red" />
                <h2 className="text-base font-heading font-black text-white tracking-tight">
                  Platform Audit Stream
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Immutable chronological trail of verified platform events.
              </p>
            </div>
            <Link to="/admin/audit">
              <SecondaryButton size="sm" icon={<ArrowRight size={13} />} iconPosition="right">
                Full Log
              </SecondaryButton>
            </Link>
          </div>

          <div className="space-y-3">
            {auditEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-normal">
                No audit events recorded yet.
              </div>
            ) : (
              auditEvents.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl border border-white/5 bg-dd-surface/80 hover:border-white/10 transition-colors flex items-start gap-3 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-dd-red mt-1.5 shrink-0 shadow-sm shadow-dd-red/50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-heading font-bold text-white truncate">
                        {(evt.action || 'EVENT').replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {formatDate(evt.createdAt || evt.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px] font-normal leading-relaxed line-clamp-2">
                      {evt.summary || evt.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
