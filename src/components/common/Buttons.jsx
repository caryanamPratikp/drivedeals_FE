import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const PrimaryButton = ({
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-1.5',
    md: 'py-2.5 px-4 text-xs font-bold rounded-xl gap-2',
    lg: 'py-3.5 px-6 text-sm font-bold rounded-2xl gap-2.5',
  }[size];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985, y: 0 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center bg-[#ED1725] hover:bg-[#A30E18] text-white border border-[#ED1725]/40 shadow-lg shadow-[#ED1725]/25 hover:shadow-[#ED1725]/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED1725] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B0D] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 12 : 15} />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export const SecondaryButton = ({
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-1.5',
    md: 'py-2.5 px-4 text-xs font-bold rounded-xl gap-2',
    lg: 'py-3.5 px-6 text-sm font-bold rounded-2xl gap-2.5',
  }[size];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985, y: 0 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center bg-[#17191D] hover:bg-[#202328] text-white border border-white/10 hover:border-white/20 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B0D] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin text-white shrink-0" size={size === 'sm' ? 12 : 15} />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export const GhostButton = ({
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs rounded-xl gap-1.5',
    md: 'py-2 px-3 text-xs font-bold rounded-xl gap-2',
    lg: 'py-2.5 px-4 text-sm font-bold rounded-xl gap-2',
  }[size];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 12 : 15} />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export const DangerButton = ({
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-1.5',
    md: 'py-2.5 px-4 text-xs font-bold rounded-xl gap-2',
    lg: 'py-3.5 px-6 text-sm font-bold rounded-2xl gap-2.5',
  }[size];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985, y: 0 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin text-[#EF4444] shrink-0" size={size === 'sm' ? 12 : 15} />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};
