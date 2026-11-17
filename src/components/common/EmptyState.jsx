import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from './Buttons';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-3xl border border-dashed border-white/15 bg-[#17191D] p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xl text-white ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] mb-4 shadow-lg shadow-[#ED1725]/10">
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-heading font-black text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mb-6 leading-relaxed font-normal">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {secondaryActionText && onSecondaryAction && (
          <SecondaryButton size="sm" onClick={onSecondaryAction}>
            {secondaryActionText}
          </SecondaryButton>
        )}
        {actionText && onAction && (
          <PrimaryButton size="sm" onClick={onAction}>
            {actionText}
          </PrimaryButton>
        )}
      </div>
    </motion.div>
  );
};
