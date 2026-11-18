import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ChevronDown, ChevronUp, Wifi, ShieldCheck, Zap } from 'lucide-react';

export const EverydayBankCard = ({ bankCard, hideAmounts = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    cardName,
    cardHolder,
    maskedNumber,
    expiry,
    cardType,
    status,
    dailyLimit,
    availableLimit,
    autoDebitEnabled,
    settlementCycle,
  } = bankCard;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.14)' }}
      className="relative rounded-2xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4 text-[#ED1725]" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                Institutional Fleet & Treasury Card
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">{cardType}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {status}
          </span>
        </div>

        {/* Physical Platinum Fleet Card Mockup */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="relative w-full rounded-2xl p-5 sm:p-6 text-white overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-br from-[#26282E] via-[#1A1C20] to-[#0D0E10]"
        >
          {/* Subtle Brushed Metal & Speed Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#ED1725]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Card Row */}
          <div className="flex items-center justify-between relative z-10 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ED1725] flex items-center justify-center font-heading font-black text-xs shadow-md">
                D
              </div>
              <span className="text-xs font-heading font-bold tracking-widest uppercase">
                {cardName}
              </span>
            </div>
            <Wifi className="w-5 h-5 text-white/70 rotate-90" />
          </div>

          {/* EMV Chip & Contactless */}
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 shadow-inner flex flex-col justify-around px-1.5 py-1">
              <div className="h-0.5 bg-amber-700/40 rounded-full" />
              <div className="h-0.5 bg-amber-700/40 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
              Treasury Token
            </span>
          </div>

          {/* Masked Card Number */}
          <div className="relative z-10 text-base sm:text-lg font-mono font-bold tracking-[0.22em] text-white/95 mb-4 drop-shadow">
            {maskedNumber}
          </div>

          {/* Bottom Card Row */}
          <div className="relative z-10 flex items-end justify-between text-xs">
            <div>
              <div className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">
                Cardholder
              </div>
              <div className="font-heading font-bold text-white tracking-wider">
                {cardHolder}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">
                Expires
              </div>
              <div className="font-mono font-bold text-white">{expiry}</div>
            </div>
          </div>
        </motion.div>

        {/* Expand / Collapse Drawer Controls */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-1.5 flex items-center justify-between text-xs text-[#A1A1AA] hover:text-white transition-colors"
          >
            <span className="font-medium">
              {isExpanded ? 'Hide Fleet Limits & Controls' : 'Show Fleet Settlement Limits & Controls'}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pt-3 space-y-2 text-xs"
              >
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">Daily Settlement Volume</span>
                    <span className="text-white font-mono font-bold">{dailyLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">Available Limit Buffer</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {hideAmounts ? '••••••••' : availableLimit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">Settlement Clearing Cycle</span>
                    <span className="text-slate-300 font-mono text-[11px]">{settlementCycle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">Auto-Disburse Token</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {autoDebitEnabled ? 'Enabled & Monitored' : 'Manual'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
