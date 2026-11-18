import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { modalBackdropVariants, modalContentVariants } from '../../lib/animations';

export const SignInRequiredModal = ({
  isOpen,
  onClose,
  title = 'Sign In Required to View Quotes',
  message = 'Dealership quotations, itemized on-road discounts, and collective buying telemetry are exclusive to registered members to protect dealer pricing and buyer privacy.',
  redirectPath = '/groups',
  groupTitle = null
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSignIn = () => {
    onClose();
    const loginUrl = redirectPath
      ? `/login?redirect=${encodeURIComponent(redirectPath)}`
      : '/login';
    navigate(loginUrl);
  };

  const handleRegister = () => {
    onClose();
    const registerUrl = redirectPath
      ? `/register?redirect=${encodeURIComponent(redirectPath)}`
      : '/register';
    navigate(registerUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative transform overflow-hidden rounded-3xl bg-[#17191D] border border-white/15 p-6 sm:p-8 text-center shadow-2xl sm:my-8 sm:w-full sm:max-w-md z-10 text-white space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              {/* Glowing Icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#A31C18]/15 border border-[#A31C18]/30 flex items-center justify-center text-[#ED1725] mx-auto shadow-inner shadow-[#A31C18]/30">
                <Lock size={28} className="animate-pulse" />
              </div>

              {/* Title & Group Reference */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-[11px] font-bold">
                  <ShieldCheck size={12} className="text-[#ED1725]" />
                  <span>Member-Only Access</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
                  {title}
                </h3>
                {groupTitle && (
                  <p className="text-xs font-semibold text-[#ED1725]">
                    {groupTitle}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed pt-1">
                  {message}
                </p>
              </div>

              {/* Trust Features Badge Strip */}
              <div className="grid grid-cols-2 gap-2 text-left bg-[#090B0D] p-3 rounded-2xl border border-white/10 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span>Verified Dealership Bids</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ED1725]" />
                  <span>Exclusive Group Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span>DPDP 2023 Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>Zero Spam Guarantee</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <PrimaryButton
                  size="md"
                  onClick={handleSignIn}
                  className="w-full justify-center font-bold py-3 text-sm shadow-lg shadow-[#ED1725]/25"
                >
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </PrimaryButton>

                <div className="flex items-center justify-between gap-3 text-xs pt-1">
                  <span className="text-[#A3A3A3]">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="font-bold text-white hover:text-[#ED1725] hover:underline transition-colors cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignInRequiredModal;
