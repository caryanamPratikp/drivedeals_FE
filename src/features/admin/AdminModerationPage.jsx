import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { formatDate } from '../../lib/dates';
import { ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminModerationPage = () => {
  const { moderationItems = [], moderateContentItem } = useAppStore();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-moderation-help"
        title="Community Content & Anti-Circumvention Governance"
        tips={[
          'All buyer preference signals and dealer clarifications are scanned for unsolicited phone numbers or external URLs.',
          'Approving content makes it visible across the group activity feed.',
          'Hiding or rejecting content preserves audit trails while removing text from public view.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Safety & Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Content Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Review flagged buyer notes and dealership comments to prevent external contact leaks or unsolicited advertisements.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {moderationItems.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Moderation Queue is Clear"
            description="All community signals, clarifications, and message content have been audited. Zero items awaiting review."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Content Type</th>
                  <th className="p-4 font-bold">Message Content</th>
                  <th className="p-4 font-bold">Flagged Reason</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Created Date</th>
                  <th className="p-4 font-bold text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {moderationItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-heading font-bold text-white font-mono text-[11px] px-2 py-1 rounded-lg bg-dd-surface border border-white/10">
                        {item.entityType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-4 max-w-sm">
                      <p className="font-normal text-slate-300 bg-dd-surface/80 p-3.5 rounded-2xl border border-white/5 leading-relaxed text-xs italic">
                        “{item.content}”
                      </p>
                    </td>

                    <td className="p-4 text-dd-red font-medium">
                      {item.reason || 'Standard community guidelines check'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase border ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-dd-green border-emerald-500/20'
                            : item.status === 'REJECTED'
                            ? 'bg-red-500/10 text-dd-red border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => moderateContentItem(item.id, 'APPROVE')}
                          className="px-3.5 py-1.5 rounded-xl bg-dd-green text-white font-heading font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => moderateContentItem(item.id, 'REJECT')}
                          className="px-3.5 py-1.5 rounded-xl bg-dd-surface text-dd-red border border-red-500/30 font-heading font-bold text-xs hover:bg-red-500/10 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
