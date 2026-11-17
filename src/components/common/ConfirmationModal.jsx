import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton } from './Buttons';
import { modalBackdropVariants, modalContentVariants } from '../../lib/animations';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={onCancel}
              aria-hidden="true"
            />

            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative transform overflow-hidden rounded-3xl bg-[#17191D] text-left shadow-2xl sm:my-8 sm:w-full sm:max-w-lg border border-white/15 p-6 sm:p-7 z-10 text-white"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-2xl ${
                    isDestructive
                      ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                      : 'bg-white/5 text-white border border-white/10'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-heading font-bold text-white">{title}</h3>
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-normal">
                      {message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onCancel}
                  className="text-[#71717A] hover:text-white p-1.5 rounded-xl transition-colors hover:bg-white/5 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                <SecondaryButton size="sm" onClick={onCancel}>
                  {cancelLabel}
                </SecondaryButton>
                {isDestructive ? (
                  <DangerButton size="sm" onClick={onConfirm}>
                    {confirmLabel}
                  </DangerButton>
                ) : (
                  <PrimaryButton size="sm" onClick={onConfirm}>
                    {confirmLabel}
                  </PrimaryButton>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
