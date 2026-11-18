import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export const SendMoneyModal = ({ isOpen, onClose, defaultRecipient = null }) => {
  const [recipient, setRecipient] = useState(
    defaultRecipient ? defaultRecipient.name : 'Kothari Hyundai - Baner Outlets'
  );
  const [amount, setAmount] = useState('1840000');
  const [purpose, setPurpose] = useState('Dealership Collective Settlement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid transfer amount greater than 0.');
      return;
    }
    if (!recipient.trim()) {
      setError('Please select or specify a recipient dealership.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg bg-[#141619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-white">
                  Execute Dealership Disbursal
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  DriveDeals Authorized Dealership Clearing Node
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSuccess ? (
            /* Success Feedback State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-heading font-black text-white">
                Disbursal Transmitted Successfully!
              </h4>
              <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
                ₹{parseFloat(amount).toLocaleString('en-IN')} has been credited to {recipient} Treasury via Instant RTGS node.
              </p>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-[#A1A1AA] space-y-1">
                <div>UTR: DD-RTGS-2026-MH12-9904</div>
                <div>Status: Settled (T+0)</div>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSend} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Recipient */}
              <div>
                <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                  Target Dealership Partner
                </label>
                <div className="relative">
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ED1725]"
                  >
                    <option value="Kothari Hyundai - Baner Outlets">Kothari Hyundai - Baner Outlets</option>
                    <option value="Garve Tata Motors - Wakad">Garve Tata Motors - Wakad</option>
                    <option value="Seva Automotive - Pimpri">Seva Automotive (Maruti) - Pimpri</option>
                    <option value="B.U. Bhandari Mahindra - Pune">B.U. Bhandari Mahindra - Pune</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                  Disbursal Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white font-heading font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in INR"
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-heading font-bold focus:outline-none focus:border-[#ED1725]"
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex gap-2 mt-2">
                  {[500000, 1000000, 1840000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-[11px] font-mono border border-white/5"
                    >
                      ₹{(val / 100000).toFixed(1)}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                  Clearing Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ED1725]"
                />
              </div>

              {/* Settlement Summary */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#A1A1AA]">
                  <span>Gateway Fee</span>
                  <span className="text-emerald-400 font-mono">₹0 (Zero Fee Institutional)</span>
                </div>
                <div className="flex items-center justify-between text-[#A1A1AA]">
                  <span>Settlement SLA</span>
                  <span className="text-white font-mono">Instant (T+0 RTGS)</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ED1725] to-[#C0101C] hover:from-[#FF1F2F] hover:to-[#ED1725] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ED1725]/30 transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span>Transmitting Encrypted Disbursal...</span>
                ) : (
                  <>
                    <span>Confirm & Authorize Transfer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
