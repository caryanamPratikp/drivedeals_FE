import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Tag,
  Radio,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { StatusBadge } from '../../../../../components/common/StatusBadge';
import { formatDate } from '../../../../../lib/dates';

export const GroupActivityModal = ({ isOpen, onClose, group }) => {
  const [activeTab, setActiveTab] = useState('signals'); // 'signals' | 'quotes' | 'activity' | 'members'

  if (!isOpen || !group) return null;

  const buyerSignals = group.buyerSignals || [];
  const dealerQuotes = group.dealerQuotes || [];
  const activities = group.activities || [];
  const members = group.members || [];

  // Computed summary metrics
  const cashCount = buyerSignals.filter((s) => s.purchaseMode === 'CASH').length;
  const financeCount = buyerSignals.filter((s) => s.purchaseMode === 'LOAN_FINANCE' || s.purchaseMode === 'FINANCE').length;
  const exchangeCount = buyerSignals.filter((s) => s.exchangeCar).length;
  const immediateCount = buyerSignals.filter(
    (s) => s.timelineMonths === 'IMMEDIATE_30_DAYS' || s.timelineMonths === 'IMMEDIATE'
  ).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#141619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#17191D] to-[#111315] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                    {group.carBrand || 'Vehicle'} {group.carModel || 'Model'}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                    {group.variantName || 'All Trims'}
                  </span>
                  <StatusBadge status={group.stage || group.status || 'FORMATION'} showInfo={false} />
                </div>
                <div className="text-xs text-[#A1A1AA] flex items-center gap-3 mt-1 flex-wrap">
                  <span>Market: <strong className="text-white">{group.city || 'Pune'}</strong></span>
                  <span>•</span>
                  <span>Buyers: <strong className="text-emerald-400">{group.currentMembers || members.length || 1} / {group.targetMembers || 15}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-slate-500">ID: {group.id}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="self-end sm:self-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="px-5 sm:px-6 pt-3 bg-black/20 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('signals')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'signals'
                  ? 'border-[#ED1725] text-white'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#ED1725]" />
              <span>Buyer Signals ({buyerSignals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'quotes'
                  ? 'border-[#ED1725] text-white'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dealer Quotes ({dealerQuotes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-[#ED1725] text-white'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Activity Stream ({activities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'members'
                  ? 'border-[#ED1725] text-white'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Group Buyers ({members.length || group.currentMembers || 1})</span>
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* TAB 1: BUYER SIGNALS */}
            {activeTab === 'signals' && (
              <div className="space-y-4">
                {/* Signals Telemetry Summary Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                      Signals Logged
                    </span>
                    <div className="text-xl font-heading font-black text-white mt-0.5">
                      {buyerSignals.length}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      Active Buyer Intent
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                      Purchase Mode
                    </span>
                    <div className="text-xs font-heading font-bold text-white mt-1">
                      {financeCount} Finance • {cashCount} Cash
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Funding breakdown
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                      Exchange Intent
                    </span>
                    <div className="text-xl font-heading font-black text-[#F59E0B] mt-0.5">
                      {exchangeCount} Cars
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Trade-in requested
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                      Ready to Buy
                    </span>
                    <div className="text-xl font-heading font-black text-emerald-400 mt-0.5">
                      {immediateCount}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Within 30 days
                    </div>
                  </div>
                </div>

                {buyerSignals.length === 0 ? (
                  <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 text-xs text-[#A1A1AA]">
                    <Radio className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No buyer signals emitted for this group yet. Signals are logged when buyers select delivery timelines and payment preferences.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {buyerSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className="p-4 rounded-2xl bg-[#17191D] border border-white/5 hover:border-white/10 transition-colors space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-heading font-black text-xs text-white">
                              {(signal.buyerName || 'B')[0]}
                            </div>
                            <div>
                              <div className="text-xs font-heading font-bold text-white flex items-center gap-2">
                                <span>{signal.buyerName || 'Verified Buyer'}</span>
                                {signal.buyerPhone && (
                                  <span className="text-[10px] text-[#A1A1AA] font-mono">
                                    ({signal.buyerPhone})
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Logged {signal.createdAt ? new Date(signal.createdAt).toLocaleString() : 'Recently'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                              {signal.timelineMonths || 'Immediate'}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 text-[10px] font-mono font-semibold">
                              {signal.purchaseMode || 'CASH'}
                            </span>
                          </div>
                        </div>

                        {/* Trade in & Custom Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
                              Exchange Vehicle
                            </span>
                            <span className="text-white font-medium text-[11px]">
                              {signal.exchangeCar
                                ? signal.exchangeCarDetails || 'Yes (Details pending inspection)'
                                : 'No exchange vehicle'}
                            </span>
                          </div>

                          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
                              Buyer Preferences & Notes
                            </span>
                            <span className="text-slate-300 text-[11px] italic">
                              {signal.notes ? `"${signal.notes}"` : 'No specific requests noted.'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DEALER QUOTES */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                {dealerQuotes.length === 0 ? (
                  <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 text-xs text-[#A1A1AA]">
                    <Tag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No dealership quotations have been submitted for this collective yet. Authorized franchise dealers will publish volume quotes once stage advances to "Open for Quotes".
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealerQuotes.map((quote) => (
                      <div
                        key={quote.quotationId + '-' + quote.versionNumber}
                        className="p-5 rounded-2xl bg-[#17191D] border border-white/5 hover:border-white/10 transition-colors space-y-4"
                      >
                        {/* Quote Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-heading font-black text-sm text-emerald-400">
                              {(quote.dealershipName || 'D')[0]}
                            </div>
                            <div>
                              <div className="text-sm font-heading font-bold text-white flex items-center gap-2">
                                <span>{quote.dealershipName}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                                  v{quote.versionNumber}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#A1A1AA]">
                                {quote.dealerBrand} Franchise • {quote.dealerCity}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">
                              Offered On-Road Price
                            </span>
                            <span className="text-xl font-heading font-black text-emerald-400">
                              ₹{Number(quote.totalOnRoadPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Concession Breakdown Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                          <div>
                            <span className="text-[10px] text-[#A1A1AA] uppercase block">
                              Ex-Showroom Base
                            </span>
                            <span className="font-mono font-bold text-white">
                              ₹{Number(quote.exShowroomPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#A1A1AA] uppercase block">
                              Collective Group Discount
                            </span>
                            <span className="font-mono font-bold text-emerald-400">
                              -₹{Number(quote.groupDiscount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#A1A1AA] uppercase block">
                              Corporate Concession
                            </span>
                            <span className="font-mono font-bold text-[#38BDF8]">
                              -₹{Number(quote.corporateDiscount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#A1A1AA] uppercase block">
                              Delivery Timeline
                            </span>
                            <span className="font-mono font-bold text-white">
                              {quote.deliveryTimelineWeeks} Weeks
                            </span>
                          </div>
                        </div>

                        {/* Accessories & Warranty Meta */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#A1A1AA] pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Gift className="w-3.5 h-3.5 text-[#ED1725]" />
                            <span>Package: {quote.accessoryPackage || 'Standard OEM Dealer Matting & Car Care Kit'}</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span>Warranty: {quote.warrantyYears || 3} Years</span>
                            <span>•</span>
                            <span className="text-emerald-400">Status: {quote.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACTIVITY STREAM */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 text-xs text-[#A1A1AA]">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No historical events recorded for this group.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                    {activities.map((act) => {
                      const isSignal = act.type === 'BUYER_SIGNAL';
                      const isQuote = act.type === 'DEALER_QUOTE';
                      const isJoin = act.type === 'BUYER_JOINED';
                      const isCreated = act.type === 'GROUP_CREATED';

                      return (
                        <div key={act.id} className="relative group">
                          {/* Dot */}
                          <div
                            className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-[#141619] ${
                              isQuote
                                ? 'bg-emerald-500'
                                : isSignal
                                ? 'bg-[#ED1725]'
                                : isJoin
                                ? 'bg-[#38BDF8]'
                                : 'bg-amber-400'
                            }`}
                          />

                          <div className="p-3.5 rounded-2xl bg-[#17191D] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-heading font-bold text-white flex items-center gap-2">
                                <span>{act.title}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                                  {act.actorName} ({act.actorRole})
                                </span>
                              </span>
                              <span className="text-[10px] font-mono text-[#A1A1AA]">
                                {act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Just now'}
                              </span>
                            </div>
                            <p className="text-xs text-[#A1A1AA] leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GROUP MEMBERS */}
            {activeTab === 'members' && (
              <div className="space-y-3">
                {members.length === 0 ? (
                  <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 text-xs text-[#A1A1AA]">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    1 buyer collective member registered (Initiator).
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {members.map((m) => (
                      <div
                        key={m.membershipId}
                        className="p-3.5 rounded-2xl bg-[#17191D] border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-heading font-black text-xs text-white">
                            {(m.userName || 'B')[0]}
                          </div>
                          <div>
                            <div className="text-xs font-heading font-bold text-white">
                              {m.userName}
                            </div>
                            <div className="text-[10px] font-mono text-[#A1A1AA]">
                              {m.userPhone || 'Verified Account'} • {m.userCity}
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>DriveDeals Group Telemetry & Operations Console</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
