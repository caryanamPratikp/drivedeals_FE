import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { AlertCircle, Users, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminGroupsPage = () => {
  const { groups = [], variants = [], cars = [], quotations = [], quotationVersions = [], updateGroupStatus } =
    useAppStore();
  const [feedback, setFeedback] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
        title="Group Lifecycle Operations Guidance"
        tips={[
          'Groups advance from "Formation" (Building Collective) to "Open for Quotes" once buyer threshold is met.',
          'Advancing to "Under Review" enables registered buyers to compare quotations and start dealer consent handoffs.',
          'Closing a group locks participation while archiving final transactions for audit.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Demand Aggregation
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Group Lifecycle Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Monitor demand consolidation stages and control quote collection milestones across regional markets.
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
                  <th className="p-4 font-bold">Joined Buyers</th>
                  <th className="p-4 font-bold">Published Offers</th>
                  <th className="p-4 font-bold">Current Status</th>
                  <th className="p-4 font-bold text-right">Lifecycle Transition</th>
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

                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-heading font-bold text-white text-sm">
                          {car?.brand || 'Vehicle'} {car?.modelName || car?.model || 'Model'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {variant?.name || 'Standard Trim'} •{' '}
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

                      <td className="p-4 font-heading font-bold text-white">
                        {publishedOffers.length} {publishedOffers.length === 1 ? 'offer' : 'offers'}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={curStage} showInfo={false} />
                      </td>

                      <td className="p-4 text-right">
                        <select
                          value={curStage}
                          onChange={(e) => handleStatusChange(group.id, e.target.value)}
                          className="px-3 py-1.5 text-xs font-heading font-bold rounded-xl border border-white/10 bg-dd-surface text-white focus:outline-none focus:border-dd-red transition-colors"
                        >
                          <option value="FORMATION" className="bg-dd-card text-white">Formation (Building)</option>
                          <option value="OPEN_FOR_QUOTES" className="bg-dd-card text-white">Open for Quotes</option>
                          <option value="UNDER_REVIEW" className="bg-dd-card text-white">Under Review</option>
                          <option value="CLOSED" className="bg-dd-card text-white">Closed (Fulfilled)</option>
                          <option value="CANCELLED" className="bg-dd-card text-white">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
