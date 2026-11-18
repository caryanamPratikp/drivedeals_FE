import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { AlertTriangle, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminLeadsPage = () => {
  const { leads = [], leadDisputes = [], dealers = [], fetchAdminLeads, resolveLeadDispute } = useAppStore();
  const [activeTab, setActiveTab] = useState('DISPUTES');

  useEffect(() => {
    fetchAdminLeads();
  }, [fetchAdminLeads]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [activeDisputeId, setActiveDisputeId] = useState(null);

  const handleResolve = (disputeId, decision) => {
    resolveLeadDispute(
      disputeId,
      decision,
      resolutionNote.trim() || 'Reviewed and finalized by platform administrator.'
    );
    setActiveDisputeId(null);
    setResolutionNote('');
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-leads-help"
        title="Consent Handoffs & Dispute Adjudication"
        tips={[
          'Leads are created strictly after an individual car buyer grants affirmative, un-pre-checked consent under the DPDP Act 2023.',
          'Dealers can file disputes for inaccurate phone numbers or unreachable customers within 48 hours.',
          'Resolving disputes keeps dealer trust high while monitoring buyer authenticity.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Handoff Pipeline & Adjudication
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Customer Leads & Dispute Resolution
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Monitor dealer handoffs, audit buyer consent records, and resolve contested lead inquiries.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('DISPUTES')}
          className={`relative pb-3 px-4 text-xs sm:text-sm font-heading font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'DISPUTES'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Contested Disputes</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'DISPUTES'
                ? 'bg-dd-red text-white'
                : 'bg-dd-surface text-slate-400'
            }`}
          >
            {leadDisputes.length}
          </span>
          {activeTab === 'DISPUTES' && (
            <motion.div
              layoutId="adminLeadsActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-dd-red"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ALL_LEADS')}
          className={`relative pb-3 px-4 text-xs sm:text-sm font-heading font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'ALL_LEADS'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>All Platform Leads</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ALL_LEADS'
                ? 'bg-white text-dd-bg'
                : 'bg-dd-surface text-slate-400'
            }`}
          >
            {leads.length}
          </span>
          {activeTab === 'ALL_LEADS' && (
            <motion.div
              layoutId="adminLeadsActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-dd-red"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {activeTab === 'DISPUTES' ? (
        leadDisputes.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Active Lead Disputes"
            description="All buyer leads in the system are currently verified with zero unresolved dealer disputes."
          />
        ) : (
          <div className="space-y-4">
            {leadDisputes.map((dispute) => {
              const lead = leads.find((l) => l.id === dispute.leadId);
              const dealer = dealers.find((d) => d.id === dispute.dealerId);

              return (
                <div
                  key={dispute.id}
                  className="bg-dd-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-dd-red" />
                      <span className="font-heading font-bold text-sm text-white">
                        Dispute Ref: #{dispute.id.slice(-6)}
                      </span>
                    </div>
                    <span className="text-xs bg-red-500/10 text-dd-red px-3 py-1 rounded-full border border-red-500/20 font-heading font-bold uppercase">
                      {dispute.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-dd-surface/80 rounded-2xl border border-white/5">
                      <span className="text-slate-400 block font-heading font-bold mb-1">
                        Reporting Dealership
                      </span>
                      <div className="font-heading font-bold text-white text-sm">
                        {dealer?.businessName || dealer?.dealershipName || 'Franchise Dealer'}
                      </div>
                    </div>
                    <div className="p-3.5 bg-dd-surface/80 rounded-2xl border border-white/5">
                      <span className="text-slate-400 block font-heading font-bold mb-1">
                        Customer Lead Name
                      </span>
                      <div className="font-heading font-bold text-white text-sm">
                        {lead?.buyerName || 'Buyer'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-dd-surface/80 rounded-2xl border border-white/5 text-xs">
                    <span className="font-heading font-bold text-slate-400 block mb-1">
                      Reported Issue:
                    </span>
                    <p className="text-slate-300 font-normal leading-relaxed">{dispute.reason}</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleResolve(dispute.id, 'RESOLVED')}
                      className="px-4 py-2 bg-dd-green text-white font-heading font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      Accept Dispute & Credit Dealer
                    </button>
                    <button
                      onClick={() => handleResolve(dispute.id, 'REJECTED')}
                      className="px-4 py-2 bg-dd-surface text-slate-300 border border-white/10 font-heading font-bold text-xs rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Dismiss Dispute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Platform Leads Generated"
          description="Zero buyer leads have been consented or transferred to dealerships yet."
        />
      ) : (
        <div className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Lead ID</th>
                  <th className="p-4 font-bold">Buyer</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Timeline Preference</th>
                  <th className="p-4 font-bold">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      #{l.id.slice(-6)}
                    </td>
                    <td className="p-4 font-heading font-bold text-white">{l.buyerName}</td>
                    <td className="p-4">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="p-4 text-slate-400">
                      {l.preferredTimeline?.replace(/_/g, ' ') || '30 Days'}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
