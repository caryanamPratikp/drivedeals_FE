import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { formatDateTime } from '../../lib/dates';
import { ShieldCheck, FileText, Search } from 'lucide-react';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminAuditPage = () => {
  const { auditEvents = [], fetchAdminAuditEvents } = useAppStore();
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminAuditEvents();
  }, [fetchAdminAuditEvents]);

  const filteredEvents = auditEvents.filter((ev) => {
    if (entityFilter !== 'ALL' && ev.entityType !== entityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (ev.summary || '').toLowerCase().includes(q) ||
        (ev.action || '').toLowerCase().includes(q) ||
        (ev.actorName || '').toLowerCase().includes(q) ||
        (ev.entityId || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-audit-help"
        title="Immutable Audit Stream & Regulatory Compliance"
        tips={[
          'Every user interaction with legal, pricing, or consent impact generates an append-only audit event.',
          'Quotation version updates capture before/after financial diffs to prevent retrospective alterations.',
          'Consent grant and revocation events record timestamped consent versions.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Append-Only Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Platform Audit Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Chronological log of all business events, quotation revisions, consents, and status changes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl border border-white/10 bg-dd-card text-white placeholder-slate-500 focus:outline-none focus:border-dd-red transition-colors w-48 sm:w-60"
            />
          </div>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl border border-white/10 bg-dd-card text-white focus:outline-none focus:border-dd-red transition-colors"
          >
            <option value="ALL" className="bg-dd-card text-white">All Entity Types</option>
            <option value="QUOTATION" className="bg-dd-card text-white">Quotation Events</option>
            <option value="CONSENT" className="bg-dd-card text-white">Consent Grants/Withdrawals</option>
            <option value="LEAD" className="bg-dd-card text-white">Lead Lifecycles</option>
            <option value="DEALER" className="bg-dd-card text-white">Dealer Applications</option>
            <option value="GROUP" className="bg-dd-card text-white">Group Milestones</option>
            <option value="DISPUTE" className="bg-dd-card text-white">Dispute Events</option>
            <option value="MODERATION" className="bg-dd-card text-white">Moderation Decisions</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Audit Events Recorded"
            description={
              searchQuery || entityFilter !== 'ALL'
                ? 'No audit log entries match your active search and filter criteria.'
                : 'Platform audit log is currently clear. Events will record automatically upon user, dealer, and admin activities.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Timestamp</th>
                  <th className="p-4 font-bold">Event Type</th>
                  <th className="p-4 font-bold">Action Taken</th>
                  <th className="p-4 font-bold">Actor</th>
                  <th className="p-4 font-bold">Entity Ref</th>
                  <th className="p-4 font-bold">Summary Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {formatDateTime(ev.timestamp || ev.createdAt)}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-dd-surface text-slate-300 font-mono font-bold text-[10px] border border-white/10">
                        {ev.entityType}
                      </span>
                    </td>

                    <td className="p-4 font-heading font-bold text-white">
                      {(ev.action || 'EVENT').replace(/_/g, ' ')}
                    </td>

                    <td className="p-4 text-slate-300">
                      <div className="font-medium text-white">{ev.actorName || 'System'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {ev.actorRole || 'SYSTEM'}
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {ev.entityId}
                    </td>

                    <td className="p-4 text-slate-300 max-w-md font-normal leading-relaxed">
                      {ev.summary || ev.description}
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
