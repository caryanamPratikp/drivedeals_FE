import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const StepIndicator = ({ steps, currentStep, onStepClick, className = '' }) => {
  return (
    <nav aria-label="Progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-between relative">
        {/* Connecting progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-white/10 w-full -z-0"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-dd-red"
            initial={{ width: 0 }}
            animate={{
              width: `${(Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <li key={step.id} className="relative flex flex-col items-center group z-10">
              <motion.button
                type="button"
                whileHover={!isUpcoming && onStepClick ? { scale: 1.08 } : {}}
                whileTap={!isUpcoming && onStepClick ? { scale: 0.95 } : {}}
                disabled={!onStepClick || isUpcoming}
                onClick={() => onStepClick && onStepClick(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
                  isCompleted
                    ? 'bg-dd-red text-white shadow-md shadow-dd-red/30'
                    : isCurrent
                    ? 'bg-dd-surface border-2 border-dd-red text-white ring-4 ring-dd-red/20 shadow-md'
                    : 'bg-dd-surface border border-white/10 text-slate-500 hover:border-white/20'
                } ${onStepClick && !isUpcoming ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {isCompleted ? <Check size={14} className="stroke-[2.5]" /> : <span>{idx + 1}</span>}
              </motion.button>

              <div className="mt-2 text-center">
                <span
                  className={`text-xs block font-heading font-bold transition-colors ${
                    isCurrent
                      ? 'text-white'
                      : isCompleted
                      ? 'text-slate-300 font-medium'
                      : 'text-slate-500 font-normal'
                  }`}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5 font-normal">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
