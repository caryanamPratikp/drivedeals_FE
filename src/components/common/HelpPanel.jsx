import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export const HelpPanel = ({ id, title, summary, steps, tips, className = '' }) => {
  const storageKey = `motorcircle_help_dismissed_${id}`;
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // ignore
    }
  };

  const handleReopen = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  if (isDismissed) {
    return (
      <div className={`flex justify-end mb-3 ${className}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReopen}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-dd-card border border-white/10 shadow-sm hover:border-dd-red/40 font-medium"
          title="Reopen operational guidance"
        >
          <HelpCircle size={13} className="text-dd-red" />
          <span>Protocol Guidance</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-dd-card border border-white/10 rounded-3xl p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden transition-all ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-dd-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-dd-red/10 text-dd-red border border-dd-red/20 flex items-center justify-center shrink-0 shadow-sm">
            <HelpCircle size={16} />
          </div>
          <div>
            <h4 className="text-sm font-heading font-bold text-white">{title}</h4>
            {summary && <p className="text-xs text-slate-400 mt-0.5 font-normal">{summary}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors"
            aria-label={isExpanded ? 'Collapse guide' : 'Expand guide'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-dd-red rounded-xl transition-colors"
            title="Dismiss this guide (can be reopened anytime)"
            aria-label="Dismiss guide"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-4 pt-3.5 border-t border-white/10 space-y-3">
              {steps && steps.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-dd-surface/80 p-3.5 rounded-2xl border border-white/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-dd-red text-white font-heading font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-heading font-bold text-white">{step.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-7 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {tips && tips.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-1">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-dd-red shrink-0" />
                      <span className="font-normal text-slate-300">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
