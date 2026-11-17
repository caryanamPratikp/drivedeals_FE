import React from 'react';
import { motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

export const StatCard = ({
  label,
  value,
  subtext,
  icon,
  concept,
  trend,
  trendType = 'neutral',
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={onClick ? { y: -3, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(237, 23, 37, 0.08)' } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      className={`bg-[#17191D] rounded-2xl border border-white/10 p-5 shadow-sm transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:border-white/25 hover:bg-[#1C1F24]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
          <span>{label}</span>
          {concept && <InfoTooltip concept={concept} iconSize={12} />}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 text-[#ED1725] shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold ${
              trendType === 'positive'
                ? 'text-[#22C55E]'
                : trendType === 'negative'
                ? 'text-[#EF4444]'
                : 'text-[#A1A1AA]'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-[#71717A] leading-relaxed font-normal">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};
