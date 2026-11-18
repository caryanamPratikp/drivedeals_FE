import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank,
  Plus,
  TrendingUp,
  Shield,
  Car,
  Zap,
  Sparkles,
  Calendar,
  MoreVertical,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { luxuryEase, staggerContainer, staggerItem } from '../../../../lib/animations';

const goalIconMap = {
  Shield,
  Car,
  Zap,
  Sparkles,
  PiggyBank,
};

export const SavingsScreen = ({
  savingsData = {},
  hideAmounts = false,
  onOpenAddGoalModal,
  onOpenAddMoneyModal,
}) => {
  const overview = savingsData.overview || { totalSaved: 0, milestonePercent: 0, interestRebateEarned: 0, savedThisMonth: 0 };
  const categoriesProgress = savingsData.categoriesProgress || [];
  const initialGoals = savingsData.initialGoals || [];
  const projections = savingsData.projections || {};
  const roundUpsData = savingsData.roundUpsData || { enabled: false, formattedAccumulated: '₹0', transactionsCount: 0 };

  const [goals, setGoals] = useState(initialGoals);
  const [timeframe, setTimeframe] = useState('1Y'); // '3M' | '6M' | '1Y'
  const [roundUpsEnabled, setRoundUpsEnabled] = useState(roundUpsData.enabled);
  const [activeGoalMenu, setActiveGoalMenu] = useState(null);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  const fallbackProjection = {
    projectedAmount: '₹0',
    currentSavings: '₹0',
    estimatedInterest: '₹0',
    monthlyContribution: '₹0',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { month: 'Q1', actual: 0, projected: 0 },
      { month: 'Q2', actual: null, projected: 0 },
      { month: 'Q3', actual: null, projected: 0 },
      { month: 'Q4', actual: null, projected: 0 },
    ],
  };

  const currentProjection = projections[timeframe] || projections['1Y'] || fallbackProjection;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 5.A Savings Overview Card */}
      <motion.div
        variants={staggerItem}
        className="relative rounded-3xl bg-gradient-to-br from-[#17191D] via-[#141619] to-[#0E1012] p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ED1725]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-heading font-semibold uppercase tracking-wider mb-3">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>Collective Buyer Savings Hub</span>
            </div>
            <h2 className="text-sm sm:text-base font-heading font-medium text-[#A1A1AA]">
              Total Collective Savings Realized
            </h2>
            <div className="text-3xl sm:text-5xl font-heading font-black text-white mt-1 tracking-tight">
              {hideAmounts ? (
                '••••••••'
              ) : (
                <AnimatedCounter
                  value={overview.totalSaved}
                  prefix="₹"
                  decimals={0}
                  duration={1000}
                />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Collective bargaining concession unlocked across Pune authorized dealer franchise networks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddGoalModal}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#ED1725] to-[#C0101C] hover:from-[#FF1F2F] hover:to-[#ED1725] text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#ED1725]/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Deal Allocation Goal</span>
            </button>
          </div>
        </div>

        {/* Supporting KPI Metric Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[11px] font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              Annual Milestone
            </div>
            <div className="text-xl font-heading font-black text-white mt-1">
              {overview.milestonePercent}%
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              ₹50.0 L target
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[11px] font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              Active Deal Goals
            </div>
            <div className="text-xl font-heading font-black text-white mt-1">
              {goals.length} Goals
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Across 4 OEM networks
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[11px] font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              Dealer Rebates Earned
            </div>
            <div className="text-xl font-heading font-black text-emerald-400 mt-1">
              {hideAmounts ? '••••••' : `₹${(overview.interestRebateEarned / 100000).toFixed(2)} L`}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              Volume incentive rebate
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[11px] font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              Saved This Month
            </div>
            <div className="text-xl font-heading font-black text-white mt-1">
              {hideAmounts ? '••••••' : `₹${(overview.savedThisMonth / 100000).toFixed(2)} L`}
            </div>
            <div className="text-[10px] text-[#38BDF8] font-mono mt-1">
              +18.2% vs previous
            </div>
          </div>
        </div>

        {/* 5.B Horizontal Segmented Progress Overview */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              OEM Category Share of Savings
            </span>
            <span className="text-slate-400 font-mono text-[11px]">100% Allocated</span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden flex p-0.5 gap-1 border border-white/5">
            {categoriesProgress.map((seg) => (
              <motion.div
                key={seg.id}
                initial={{ width: 0 }}
                animate={{ width: `${seg.percent}%` }}
                transition={{ duration: 1, ease: luxuryEase }}
                className="h-full rounded-full cursor-pointer relative group"
                style={{ backgroundColor: seg.color }}
                title={`${seg.name}: ${seg.percent}% (${seg.saved})`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
            {categoriesProgress.map((seg) => (
              <div key={seg.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-white font-medium truncate">{seg.name}</span>
                <span className="text-[#A1A1AA] font-mono font-bold">
                  {seg.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5.C & 5.D Individual Savings Goal Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white tracking-wide">
              Active Deal & Savings Goals
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Monitor collective booking thresholds and escrow accumulation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {goals.map((goal) => {
            const Icon = goalIconMap[goal.iconName] || PiggyBank;
            const radius = 24;
            const circ = 2 * Math.PI * radius;
            const strokeOffset = circ - (goal.percent / 100) * circ;

            return (
              <motion.div
                key={goal.id}
                whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.16)' }}
                className="relative rounded-2xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 border border-white/5 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10"
                      style={{
                        backgroundColor: `${goal.accentColor}15`,
                        color: goal.accentColor,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveGoalMenu(activeGoalMenu === goal.id ? null : goal.id)
                        }
                        className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#A1A1AA] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeGoalMenu === goal.id && (
                        <div className="absolute right-0 top-8 w-36 rounded-xl bg-[#1C1F24] border border-white/10 shadow-2xl py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setActiveGoalMenu(null);
                              onOpenAddMoneyModal && onOpenAddMoneyModal(goal);
                            }}
                            className="w-full px-3 py-1.5 text-left text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <span>Add Allocation</span>
                          </button>
                          <button
                            onClick={() => setActiveGoalMenu(null)}
                            className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-white/5 flex items-center gap-2"
                          >
                            <span>Archive Goal</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Goal Title */}
                  <h4 className="text-sm font-heading font-bold text-white group-hover:text-[#ED1725] transition-colors mb-1 truncate">
                    {goal.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#A1A1AA] bg-white/5 px-2 py-0.5 rounded">
                    {goal.category}
                  </span>

                  {/* Progress & Circular Ring Row */}
                  <div className="flex items-center justify-between my-4 pt-2">
                    <div>
                      <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                        Accumulated
                      </div>
                      <div className="text-base font-heading font-black text-white">
                        {hideAmounts ? '••••••' : `₹${(goal.savedAmount / 100000).toFixed(2)} L`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Target: ₹{(goal.targetAmount / 100000).toFixed(2)} L
                      </div>
                    </div>

                    {/* Circular Radial Indicator */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 60 60">
                        <circle
                          cx="30"
                          cy="30"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-white/5"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="30"
                          cy="30"
                          r={radius}
                          stroke={goal.accentColor}
                          strokeWidth="4"
                          strokeDasharray={circ}
                          initial={{ strokeDashoffset: circ }}
                          animate={{ strokeDashoffset: strokeOffset }}
                          transition={{ duration: 1, ease: luxuryEase }}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-mono font-bold text-white">
                        {Math.round(goal.percent)}%
                      </span>
                    </div>
                  </div>

                  {/* Supporting Timeline Details */}
                  <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span>Time Remaining</span>
                      <span className="text-white font-medium">{goal.timeRemaining}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span>Pace</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {goal.monthlyContribution}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span>Est. Delivery</span>
                      <span className="text-slate-300 font-medium">{goal.estimatedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Add Money / Allocation Button */}
                <div className="pt-4 mt-3 border-t border-white/5">
                  <button
                    onClick={() => onOpenAddMoneyModal && onOpenAddMoneyModal(goal)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all hover:border-[#ED1725]/40"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#ED1725]" />
                    <span>Add Allocation</span>
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* 5.D Add New Savings Goal Card */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(237, 23, 37, 0.4)' }}
            onClick={onOpenAddGoalModal}
            className="rounded-2xl border-2 border-dashed border-white/10 hover:border-[#ED1725]/50 bg-white/[0.01] hover:bg-white/[0.03] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[300px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#ED1725]/10 border border-white/10 group-hover:border-[#ED1725]/30 flex items-center justify-center text-white group-hover:text-[#ED1725] transition-all mb-4 group-hover:scale-110">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-heading font-bold text-white group-hover:text-[#ED1725] transition-colors">
              Add New Deal Goal
            </h4>
            <p className="text-xs text-[#A1A1AA] max-w-[200px] mt-1.5 leading-relaxed">
              Create a custom bulk negotiation target with dealership quotes and target dates.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5.E Financial & Deal Projections Section ("Where you'll be in a year") */}
      <motion.div
        variants={staggerItem}
        className="rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-6 sm:p-8 border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#ED1725] uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Predictive Fleet Forecast</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
              Where you'll be in a year
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Projected cumulative fleet concessions based on current group acceleration.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5 shrink-0 self-start sm:self-center">
            {['3M', '6M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-[#ED1725] text-white shadow-md'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                {tf === '3M' ? '3 Months' : tf === '6M' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Projection KPI Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
              Projected Total Savings
            </span>
            <div className="text-lg font-heading font-black text-emerald-400 mt-1">
              {hideAmounts ? '••••••' : currentProjection.projectedAmount}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
              Current Baseline
            </span>
            <div className="text-lg font-heading font-black text-white mt-1">
              {hideAmounts ? '••••••' : currentProjection.currentSavings}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
              Volume Rebate Potential
            </span>
            <div className="text-lg font-heading font-black text-white mt-1">
              {hideAmounts ? '••••••' : currentProjection.estimatedInterest}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
              Avg Monthly Velocity
            </span>
            <div className="text-lg font-heading font-black text-[#38BDF8] mt-1">
              {hideAmounts ? '••••••' : currentProjection.monthlyContribution}
            </div>
          </div>
        </div>

        {/* Interactive SVG Projection Area Chart */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-black/40 border border-white/5 p-4 sm:p-6 overflow-hidden flex flex-col justify-end">
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-15">
            <div className="border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-b border-white" />
          </div>

          {/* SVG Area & Stroke Paths */}
          <div className="relative w-full h-full flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ED1725" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ED1725" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <motion.path
                d="M 0,160 Q 150,110 300,60 T 500,10 L 500,200 L 0,200 Z"
                fill="url(#projGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: luxuryEase }}
              />

              {/* Foreground Stroke */}
              <motion.path
                d="M 0,160 Q 150,110 300,60 T 500,10"
                fill="none"
                stroke="#ED1725"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: luxuryEase }}
              />

              {/* Interactive Data Nodes */}
              {currentProjection.series.map((item, idx) => {
                const totalPoints = currentProjection.series.length;
                const cx = (idx / (totalPoints - 1)) * 500;
                // Approximate Y coordinates along the curve
                const cy = 160 - (idx / (totalPoints - 1)) * 150;

                return (
                  <g key={item.month}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      className="fill-[#111315] stroke-[#ED1725] stroke-[3px] hover:r-8 cursor-pointer transition-all"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X-Axis Month Labels */}
          <div className="relative flex justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-[#A1A1AA]">
            {currentProjection.labels.map((lbl) => (
              <span key={lbl}>{lbl}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5.F Round-Ups / Escrow Buffer Component */}
      <motion.div
        variants={staggerItem}
        className="rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-white">
                Automated Round-Up Escrow Buffer
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Rounds booking tokens to nearest ₹100 into zero-risk treasury buffer
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed pt-1">
            Whenever buyers place token bookings or dealership deposits, DriveDeals micro-rounds the payment into your collective escrow pool, compounding risk protection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
          <div className="bg-black/40 px-5 py-3 rounded-2xl border border-white/5 text-right sm:text-left">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
              Accumulated Buffer
            </span>
            <span className="text-xl font-heading font-black text-emerald-400">
              {hideAmounts ? '••••••' : roundUpsData.formattedAccumulated}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {roundUpsData.transactionsCount} round-ups
            </span>
          </div>

          {/* Functional Toggle Switch */}
          <button
            onClick={() => setRoundUpsEnabled(!roundUpsEnabled)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs transition-all border ${
              roundUpsEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {roundUpsEnabled ? (
              <ToggleRight className="w-6 h-6 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-500" />
            )}
            <span>{roundUpsEnabled ? 'Buffer Active' : 'Buffer Paused'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
