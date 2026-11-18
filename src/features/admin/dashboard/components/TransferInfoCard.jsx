import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Check, Clock, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

export const TransferInfoCard = ({
  transferDetails = {},
  hideAmounts = false,
  onInitiateTransfer,
}) => {
  const [isSwapped, setIsSwapped] = useState(false);
  const [activeStep, setActiveStep] = useState(2); // 0-based: 2 = Converting / Allocating

  const oemBenchmark = transferDetails.oemBenchmark || { currency: 'INR', amount: 1099900, label: 'OEM Showroom Base Price' };
  const negotiatedCollective = transferDetails.negotiatedCollective || { currency: 'INR', amount: 985000, label: 'DriveDeals Collective Price' };
  const concessionDelta = transferDetails.concessionDelta || '₹1,14,900 Saved / Car (10.4%)';
  const referenceNumber = transferDetails.referenceNumber || 'DD-SETTLE-LIVE';
  const timelineStatuses = transferDetails.timelineStatuses || [
    { id: 'initiated', label: 'Initiated', timestamp: '09:30 AM', completed: true },
    { id: 'verified', label: 'Verified', timestamp: '10:15 AM', completed: true },
    { id: 'converting', label: 'Allocating', timestamp: '11:00 AM', completed: true, current: true },
    { id: 'delivered', label: 'Delivered', timestamp: 'Pending', completed: false },
  ];

  const topPanel = isSwapped ? negotiatedCollective : oemBenchmark;
  const bottomPanel = isSwapped ? oemBenchmark : negotiatedCollective;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.16)' }}
      className="relative rounded-[28px] sm:rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/10 shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#ED1725]/10 border border-[#ED1725]/20 flex items-center justify-center text-[#ED1725] shadow-inner">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                Volume Price Conversion & Transfer
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">OEM Showroom vs Collective Net</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Ref: {referenceNumber}
          </span>
        </div>

        {/* Currency / Pricing Converter Dual Panels */}
        <div className="relative space-y-2.5 my-3">
          {/* Top Currency Box */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA]">
                {topPanel.label}
              </span>
              <div className="text-base sm:text-lg font-heading font-black text-white">
                {hideAmounts ? '••••••••' : `₹${topPanel.amount.toLocaleString('en-IN')}`}
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">
              INR
            </span>
          </div>

          {/* Swap Button In-Between */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsSwapped(!isSwapped)}
              className="w-8 h-8 rounded-full bg-[#ED1725] text-white flex items-center justify-center shadow-lg shadow-[#ED1725]/30 border-2 border-[#111315]"
              title="Swap comparison order"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Bottom Currency Box */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA]">
                {bottomPanel.label}
              </span>
              <div className="text-base sm:text-lg font-heading font-black text-emerald-400">
                {hideAmounts ? '••••••••' : `₹${bottomPanel.amount.toLocaleString('en-IN')}`}
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NET GROUP
            </span>
          </div>
        </div>

        {/* Delta Callout */}
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-5">
          <span className="text-emerald-300 font-medium">Negotiated Group Advantage</span>
          <span className="text-emerald-400 font-mono font-bold">{concessionDelta}</span>
        </div>

        {/* Transfer Status Timeline */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-xs font-heading font-medium text-[#A1A1AA] uppercase tracking-wider mb-3">
            Transfer Execution Timeline
          </div>

          <div className="grid grid-cols-4 gap-1.5 relative">
            {timelineStatuses.map((step, idx) => {
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;
              const isFuture = idx > activeStep;

              return (
                <div key={step.id} className="text-center group">
                  {/* Step Connector Line & Dot */}
                  <div className="flex items-center justify-center mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        isPast
                          ? 'bg-emerald-500 text-black'
                          : isCurrent
                          ? 'bg-[#ED1725] text-white ring-4 ring-[#ED1725]/20 animate-pulse'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                  </div>
                  <div className={`text-[11px] font-heading font-semibold ${isCurrent ? 'text-white' : 'text-[#A1A1AA]'}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] text-[#A1A1AA]/70 font-mono mt-0.5">
                    {step.timestamp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="pt-5 mt-4 border-t border-white/5">
        <button
          onClick={onInitiateTransfer}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#ED1725] to-[#C0101C] hover:from-[#FF1F2F] hover:to-[#ED1725] text-white text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ED1725]/25 cursor-pointer"
        >
          <span>Broadcast Next Deal Tranche</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
