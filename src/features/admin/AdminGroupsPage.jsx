import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { AlertCircle, Users, CheckCircle2, Radio, Tag, Activity, Eye } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { GroupActivityModal } from './dashboard/components/modals/GroupActivityModal';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminGroupsPage = () => {
  const {
    groups = [],
    variants = [],
    cars = [],
    quotations = [],
    quotationVersions = [],
    fetchAdminGroups,
    fetchCars,
    updateGroupStatus,
  } = useAppStore();
  const [feedback, setFeedback] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedGroupForActivity, setSelectedGroupForActivity] = useState(null);

  useEffect(() => {
    fetchAdminGroups();
    fetchCars();
  }, [fetchAdminGroups, fetchCars]);

  const handleStatusChange = (groupId, newStatus) => {
    setFeedback(null);
    setSuccessMsg(null);
    const res = updateGroupStatus(groupId, newStatus);
    if (!res.success) {
      setFeedback(res.error || 'Failed to update group lifecycle status.');
    } else {
      setSuccessMsg(`Group lifecycle status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-groups-help"
        title="Group Lifecycle & Activity Tracking Guidance"
        tips={[
          'Track live buyer signals (delivery timeline, finance mode, old car exchange) for every collective.',
          'Review all published dealership quotations, on-road prices, and accessories packages per group.',
          'Advancing stage to "Open for Quotes" invites verified dealerships to bid collective volume pricing.',
          'Click "Track Activity" on any group to inspect its chronological audit trail, signals, and quotes.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Demand Aggregation & Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Group Lifecycle & Activity Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Track live buyer purchase signals, dealer quote versions, and cohort progression across regional markets.
          </p>
        </div>
      </motion.div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 text-dd-red rounded-2xl text-xs flex items-center gap-2.5 font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-dd-red" />
          <span>{feedback}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-dd-green rounded-2xl text-xs flex items-center gap-2.5 font-medium"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-dd-green" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      <motion.div
        variants={staggerItem}
        className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Buyer Collectives Found"
            description="There are currently no active or historical demand collectives in the database."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Group / Variant</th>
                  <th className="p-4 font-bold">City</th>
                  <th className="p-4 font-bold">Buyers</th>
                  <th className="p-4 font-bold">Buyer Signals</th>
                  <th className="p-4 font-bold">Dealer Quotes</th>
                  <th className="p-4 font-bold">Stage</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groups.map((group) => {
                  const variant =
                    group.variant || variants.find((v) => v.id === group.variantId);
                  const car =
                    group.car ||
                    cars.find((c) => c.id === variant?.carId || c.id === group.carId);
                  const groupQuotes = quotations.filter((q) => q.groupId === group.id);
                  const publishedOffers = quotationVersions.filter(
                    (qv) =>
                      groupQuotes.some((q) => q.id === qv.quotationId) &&
                      qv.status === 'PUBLISHED'
                  );

                  const curStage = group.stage || group.status;
                  const signalsCount = group.buyerSignals?.length || 0;
                  const quotesCount = group.dealerQuotes?.length || publishedOffers.length || 0;

                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-heading font-bold text-white text-sm">
                          {group.carBrand || car?.brand || 'Vehicle'} {group.carModel || car?.modelName || car?.model || 'Model'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {group.variantName || variant?.name || 'Standard Trim'} •{' '}
                          <span className="font-mono text-slate-500">#{group.id.slice(-6)}</span>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-slate-200">
                        {group.city || 'Pune'}
                      </td>

                      <td className="p-4">
                        <span className="font-heading font-bold text-white">
                          {group.currentMembers || group.memberIds?.length || 1}
                        </span>
                        <span className="text-slate-500"> / {group.targetMembers || 5}</span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                            signalsCount > 0
                              ? 'bg-[#ED1725]/15 text-[#ED1725] border border-[#ED1725]/30'
                              : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          <Radio className="w-3 h-3" />
                          <span>{signalsCount} {signalsCount === 1 ? 'signal' : 'signals'}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                            quotesCount > 0
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          <span>{quotesCount} {quotesCount === 1 ? 'quote' : 'quotes'}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={curStage} showInfo={false} />
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedGroupForActivity(group)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-heading font-bold flex items-center gap-1.5 transition-all hover:border-[#ED1725]/40"
                            title="Inspect buyer signals, dealer quotes, and activity"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#ED1725]" />
                            <span>Track Activity</span>
                          </button>

                          <select
                            value={curStage}
                            onChange={(e) => handleStatusChange(group.id, e.target.value)}
                            className="px-2.5 py-1.5 text-xs font-heading font-bold rounded-xl border border-white/10 bg-dd-surface text-white focus:outline-none focus:border-dd-red transition-colors"
                          >
                            <option value="FORMATION" className="bg-dd-card text-white">Formation</option>
                            <option value="OPEN_FOR_QUOTES" className="bg-dd-card text-white">Open for Quotes</option>
                            <option value="UNDER_REVIEW" className="bg-dd-card text-white">Under Review</option>
                            <option value="CLOSED" className="bg-dd-card text-white">Closed</option>
                            <option value="CANCELLED" className="bg-dd-card text-white">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Activity, Signals & Quotes Modal */}
      <GroupActivityModal
        isOpen={!!selectedGroupForActivity}
        group={selectedGroupForActivity}
        onClose={() => setSelectedGroupForActivity(null)}
      />
    </motion.div>
  );
};
