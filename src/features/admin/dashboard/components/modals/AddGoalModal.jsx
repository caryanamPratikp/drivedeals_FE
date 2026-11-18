import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, PiggyBank, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AddGoalModal = ({ isOpen, onClose, onGoalCreated }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Bulk OEM Deal');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!goalName.trim()) {
      setError('Please provide a descriptive goal name.');
      return;
    }
    const target = parseFloat(targetAmount);
    if (!target || target <= 0) {
      setError('Target amount must be greater than zero.');
      return;
    }
    const deposit = parseFloat(initialDeposit || 0);
    if (deposit < 0) {
      setError('Initial deposit cannot be negative.');
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      iconName: 'Car',
      savedAmount: deposit,
      targetAmount: target,
      percent: Math.min(Math.round((deposit / target) * 100), 100),
      timeRemaining: '45 days left',
      monthlyContribution: `₹${Math.round(target / 4).toLocaleString('en-IN')}/mo`,
      estimatedDate: targetDate || 'Jan 15, 2027',
      accentColor: '#ED1725',
      category,
    };

    if (onGoalCreated) {
      onGoalCreated(newGoal);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setSuccess(false);
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
          onClick={handleClose}
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
              <div className="w-10 h-10 rounded-xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-white">
                  Create Deal Allocation Goal
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Establish collective threshold for OEM volume
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-heading font-black text-white">
                Deal Goal Established!
              </h4>
              <p className="text-xs text-[#A1A1AA]">
                "{goalName}" is now active in the savings and collective pipeline.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maruti Suzuki Invicto Hybrid Bulk"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ED1725]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Target (INR)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ED1725]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Initial Deposit
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ED1725]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ED1725]"
                  >
                    <option value="Bulk OEM Deal">Bulk OEM Deal</option>
                    <option value="Green Mobility">Green Mobility</option>
                    <option value="Treasury Reserve">Treasury Reserve</option>
                    <option value="High Volume Demand">High Volume Demand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-[#1A1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ED1725]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#ED1725] to-[#C0101C] hover:from-[#FF1F2F] hover:to-[#ED1725] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ED1725]/30 transition-all hover:scale-[1.01]"
              >
                <Plus className="w-4 h-4" />
                <span>Establish Deal Goal</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
