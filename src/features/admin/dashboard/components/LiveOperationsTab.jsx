import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  Radio,
  Tag,
  Eye,
} from 'lucide-react';
import { formatDate } from '../../../../lib/dates';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { GroupActivityModal } from './modals/GroupActivityModal';
import { staggerContainer, staggerItem } from '../../../../lib/animations';

export const LiveOperationsTab = ({
  dealers = [],
  groups = [],
  leads = [],
  auditEvents = [],
  onApproveDealer,
  onRejectDealer,
  onRefresh,
  loading = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('dealers'); // 'dealers' | 'groups' | 'leads' | 'audit'
  const [selectedGroupForActivity, setSelectedGroupForActivity] = useState(null);

  const pendingDealers = dealers.filter(
    (d) => d.verificationStatus === 'PENDING' || d.status === 'PENDING' || !d.verificationStatus
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Sub-navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#17191D] to-[#111315] p-3.5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('dealers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'dealers'
                ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Dealer Verifications</span>
            {pendingDealers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-mono">
                {pendingDealers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('groups')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'groups'
                ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Demand Groups</span>
            <span className="text-[10px] font-mono text-slate-300">({groups.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'leads'
                ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lead Dispatches</span>
            <span className="text-[10px] font-mono text-slate-300">({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'audit'
                ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
            <span className="text-[10px] font-mono text-slate-300">({auditEvents.length})</span>
          </button>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="self-end sm:self-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-heading font-semibold flex items-center gap-2 border border-white/5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ED1725]' : ''}`} />
          <span>Sync Live DB</span>
        </button>
      </div>

      {/* Subtab Content 1: Dealership Verifications */}
      {activeSubTab === 'dealers' && (
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white">
              Dealership Applications & Authorizations
            </h3>
            <span className="text-xs text-[#A1A1AA]">
              {dealers.length} registered outlets
            </span>
          </div>

          <div className="bg-[#17191D] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-black/30 text-[#A1A1AA] uppercase tracking-wider font-mono text-[10px]">
                    <th className="p-4">Dealership / Franchise</th>
                    <th className="p-4">Brand / OEM</th>
                    <th className="p-4">City / Market</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dealers.map((dealer) => {
                    const isPending =
                      dealer.verificationStatus === 'PENDING' || dealer.status === 'PENDING';
                    const isVerified =
                      dealer.verificationStatus === 'VERIFIED' || dealer.status === 'VERIFIED';

                    return (
                      <tr key={dealer.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-heading font-bold text-white">
                            {dealer.dealershipName || dealer.name || 'Dealership Partner'}
                          </div>
                          <div className="text-[11px] text-[#A1A1AA] font-mono">
                            {dealer.phone || dealer.mobileNumber || dealer.contactPhone || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4 text-white font-medium">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                            {dealer.brand || dealer.brandAuthorized || 'Multibrand'}
                          </span>
                        </td>
                        <td className="p-4 text-[#A1A1AA]">
                          {dealer.city || 'Pune, Maharashtra'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isVerified
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : isPending
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {dealer.verificationStatus || dealer.status || 'VERIFIED'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onApproveDealer(dealer.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-heading font-bold flex items-center gap-1 border border-emerald-500/20"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => onRejectDealer(dealer.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-heading font-bold flex items-center gap-1 border border-rose-500/20"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-mono">
                              Active Franchise
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subtab Content 2: Demand Groups */}
      {activeSubTab === 'groups' && (
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Active Buyer Demand Groups
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Track real-time buyer purchase signals, dealer quotations, and cohort progression.
              </p>
            </div>
            <span className="text-xs text-[#A1A1AA] font-mono">{groups.length} Groups</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const signalsCount = group.buyerSignals?.length || 0;
              const quotesCount = group.dealerQuotes?.length || group.quotesCount || 0;
              const buyersCount = group.currentMembers ?? group.currentSize ?? group.memberCount ?? group.members?.length ?? 0;
              const targetSize = group.targetMembers || group.targetSize || 15;
              const carTitle = group.carModel || group.car?.modelName || group.car?.model || group.targetModel || 'Vehicle Demand Group';

              return (
                <div
                  key={group.id}
                  className="p-5 rounded-2xl bg-[#17191D] border border-white/5 space-y-3.5 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#ED1725] bg-[#ED1725]/10 px-2 py-0.5 rounded">
                      {group.city || 'Pune'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      {group.stage || group.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div>
                    <div className="font-heading font-bold text-white text-base">
                      {carTitle}
                    </div>
                    {group.variant?.name && (
                      <div className="text-xs text-[#A1A1AA] truncate mt-0.5">
                        {group.variant.name}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl text-center">
                    <div>
                      <div className="text-[10px] text-[#A1A1AA]">Buyers</div>
                      <div className="font-heading font-bold text-white text-xs mt-0.5">
                        {buyersCount}/{targetSize}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#A1A1AA]">Signals</div>
                      <div className="font-heading font-bold text-[#ED1725] text-xs mt-0.5 flex items-center justify-center gap-1">
                        <Radio size={11} />
                        <span>{signalsCount}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#A1A1AA]">Quotes</div>
                      <div className="font-heading font-bold text-emerald-400 text-xs mt-0.5 flex items-center justify-center gap-1">
                        <Tag size={11} />
                        <span>{quotesCount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedGroupForActivity(group)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-heading font-bold flex items-center justify-center gap-2 border border-white/10 hover:border-[#ED1725]/40 transition-all cursor-pointer"
                  >
                    <Eye size={13} className="text-[#ED1725]" />
                    <span>Track Activity & Quotes</span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Subtab Content 3: Leads Pipeline */}
      {activeSubTab === 'leads' && (
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white">
              Lead Dispatch & Transmission Pipeline
            </h3>
            <span className="text-xs text-[#A1A1AA]">{leads.length} Records</span>
          </div>

          <div className="bg-[#17191D] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-black/30 text-[#A1A1AA] uppercase tracking-wider font-mono text-[10px]">
                    <th className="p-4">Lead ID</th>
                    <th className="p-4">Buyer / City</th>
                    <th className="p-4">Vehicle Model</th>
                    <th className="p-4">Dealer Assigned</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono text-white text-[11px]">{lead.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{lead.buyerName || 'Verified Buyer'}</div>
                        <div className="text-[10px] text-[#A1A1AA] font-mono">{lead.city || 'Pune'}</div>
                      </td>
                      <td className="p-4 text-white font-medium">{lead.carModel || 'Tata Nexon'}</td>
                      <td className="p-4 text-slate-300 font-mono text-[11px]">
                        {lead.dealerName || lead.dealershipName || 'Franchise Partner'}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {lead.status || 'DISPATCHED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subtab Content 4: Immutable Audit Stream */}
      {activeSubTab === 'audit' && (
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white">
              Chronological Audit & Governance Log
            </h3>
            <span className="text-xs text-[#A1A1AA] font-mono">
              Immutable System Stream
            </span>
          </div>

          <div className="bg-[#17191D] rounded-2xl border border-white/5 p-4 space-y-3 font-mono text-xs">
            {auditEvents.slice(0, 15).map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#ED1725] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-bold">{evt.eventType || evt.action || 'PLATFORM_EVENT'}</span>
                    <span className="text-[10px] text-[#A1A1AA]">{evt.timestamp || 'Just now'}</span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5 truncate">
                    Actor: {evt.actorId || 'ADMIN'} • {evt.details || 'System event captured'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Activity, Signals & Quotations Inspection Modal */}
      <GroupActivityModal
        isOpen={!!selectedGroupForActivity}
        group={selectedGroupForActivity}
        onClose={() => setSelectedGroupForActivity(null)}
      />
    </motion.div>
  );
};
