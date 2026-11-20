import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Clock, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';

export const VerificationPendingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-md bg-[#17191D] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
            <Clock size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Verification in Progress
          </div>

          <h3 className="text-xl font-heading font-black text-white mb-2">
            Dealership Details Under Review
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            Details are yet to be verified by platform administrator. Once verified, you will be able to review specific demands and submit competitive group quotations.
          </p>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-left space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Onboarding Status:</span>
              <span className="text-amber-400 font-bold font-mono">SUBMITTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Access:</span>
              <span className="text-white font-medium">Bulk Demand View (Aggregate)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Quote Submissions:</span>
              <span className="text-amber-300 font-medium">Unlocked Upon Admin Approval</span>
            </div>
          </div>

          <PrimaryButton fullWidth onClick={onClose} className="font-bold py-3 text-sm">
            Continue Exploring in Bulk
          </PrimaryButton>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VerificationPendingModal;
