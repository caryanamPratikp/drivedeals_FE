import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, CheckCircle, Target } from 'lucide-react';
import { luxuryEase } from '../../../../lib/animations';

export const BudgetStatsCard = ({ budgetStats = {}, hideAmounts = false }) => {
  const {
    monthlyQuotaTarget = 50000000,
    currentFulfilled = 0,
    completionPercentage = 0,
    previousMonthComparison = 'Platform Goal Tracking',
    remainingTarget = '₹50,00,000 target',
    categories = [],
  } = budgetStats;

  // SVG Radial Circle Parameters
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.16)' }}
      className="relative rounded-[28px] sm:rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/10 shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Target className="w-5 h-5 text-[#ED1725]" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                Deal Booking Quota & Budget
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">Monthly Platform Fulfillment</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <TrendingUp className="w-3 h-3" />
            <span>{previousMonthComparison}</span>
          </span>
        </div>

        {/* Center: Circular Progress Ring & Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 my-4 py-2">
          {/* Animated SVG Radial Indicator */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-white/5"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {/* Dynamic Animated Progress Track */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#ED1725"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: progressOffset }}
                transition={{ duration: 1.2, ease: luxuryEase }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Metric Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-heading font-black text-white">
                {completionPercentage}%
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA]">
                Quota Met
              </span>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="space-y-3 w-full sm:w-auto">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                Current Fulfilled
              </div>
              <div className="text-lg font-heading font-black text-white">
                {hideAmounts ? '••••••••' : `₹${(currentFulfilled / 10000000).toFixed(2)} Cr`}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                82.4% of ₹5.00 Cr target
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                Remaining Gap
              </div>
              <div className="text-sm font-heading font-bold text-slate-300">
                {hideAmounts ? '••••••' : remainingTarget}
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Progress Segments */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-xs font-heading font-medium text-[#A1A1AA] uppercase tracking-wider mb-2.5">
            Vehicle Category Contribution
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <div className="text-xs font-medium text-white truncate max-w-[110px]">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA]">
                      {hideAmounts ? '••••' : cat.amount}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
