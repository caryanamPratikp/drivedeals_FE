import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const RecipientModal = ({ isOpen, onClose, recipient }) => {
  if (!isOpen || !recipient) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md bg-[#141619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-center font-heading font-black text-sm text-[#ED1725]">
                {recipient.initials}
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-white">
                  {recipient.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ED1725]" />
                  <span>{recipient.city}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Body */}
          <div className="space-y-4 pt-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Classification</span>
                <span className="text-white font-medium">{recipient.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Audit Reference</span>
                <span className="text-white font-mono">{recipient.reference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Last Settlement</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {recipient.formattedAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Volume Units</span>
                <span className="text-white font-medium">{recipient.units}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Settlement Timestamp</span>
                <span className="text-slate-300 font-mono">{recipient.date}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>KYC & Franchise License Verified by DriveDeals Operations</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
