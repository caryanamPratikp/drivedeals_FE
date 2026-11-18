import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PiggyBank, Users, CheckCircle2, DollarSign } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { luxuryEase } from '../../../../lib/animations';

const iconMap = {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Users,
  CheckCircle2,
  DollarSign,
};

/**
 * Reusable animated SVG sparkline
 */
export const Sparkline = ({ points = [], color = '#ED1725', height = 36, width = 110 }) => {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const stepX = width / (points.length - 1);
  const coordinates = points.map((val, idx) => {
    const x = idx * stepX;
    // Invert Y so high value is near top (with 4px padding)
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return `${x},${y}`;
  });

  const pathD = `M ${coordinates.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <motion.path
          d={areaD}
          fill={`url(#grad-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        />

        {/* Line Stroke */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: luxuryEase }}
        />
      </svg>
    </div>
  );
};

export const FinanceStatCard = ({
  title,
  amount,
  formattedAmount,
  changePercent = 0,
  trend = 'up',
  period = 'vs last month',
  sparkline = [],
  iconName = 'TrendingUp',
  accentColor = '#ED1725',
  hideAmounts = false,
  isCurrency = false,
  onClick,
}) => {
  const IconComponent = iconMap[iconName] || TrendingUp;
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.16)',
      }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={`group relative rounded-[28px] sm:rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/10 shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle Top Ambient Glow */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-xs sm:text-sm font-heading font-medium text-[#A1A1AA] tracking-wide">
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.04] shadow-inner transition-colors group-hover:border-white/20"
          style={{ color: accentColor }}
        >
          <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        {hideAmounts ? (
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-widest text-white/50">
            ••••••••
          </div>
        ) : (
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-baseline gap-1">
            {isCurrency && typeof amount === 'number' ? (
              <AnimatedCounter
                value={amount}
                prefix="₹"
                decimals={0}
                duration={900}
                className="font-heading font-black"
              />
            ) : (
              <span>{formattedAmount}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Change Badge + Sparkline */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}{changePercent}%
          </span>
          <span className="text-[11px] text-[#A1A1AA]/80 hidden sm:inline">
            {period}
          </span>
        </div>

        {/* Sparkline Miniature Graph */}
        <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <Sparkline points={sparkline} color={accentColor} height={32} width={90} />
        </div>
      </div>
    </motion.div>
  );
};
