import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  X,
  CheckCircle2,
  Phone,
  User,
  Car,
  MapPin,
  Building2,
  Calendar
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const ConsentReviewDialog = ({
  isOpen,
  onClose,
  dealer,
  version,
  quotation,
  variant,
  car,
}) => {
  const { currentUser, grantConsentAndCreateLead } = useAppStore();
  const navigate = useNavigate();

  // Checkbox starts UNCHECKED by default per DPDP 2023 privacy spec
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const dataFieldsToShare = [
    { label: 'Buyer Full Name', val: currentUser?.name || 'Verified Buyer' },
    { label: 'Verified Mobile', val: currentUser?.phone || '-' },
    { label: 'Vehicle & Exact Trim', val: `${car?.brand || 'Vehicle'} ${car?.modelName || car?.model || ''} (${variant?.name || 'Trim'})` },
    { label: 'Delivery Hub', val: `${currentUser?.city || 'Pune'}, Maharashtra` },
    { label: 'Selected Quotation Benchmark', val: `Ref #${quotation?.id?.slice(-6) || 'QUOTE'} (v${version?.versionNumber || 1}) • ₹${formatINR(version?.calculatedOnRoadPrice || 0)}` },
  ];

  const handleConfirmAndShare = async () => {
    setError(null);
    if (!isAuthorized) {
      setError('Please check the authorization box to confirm your explicit DPDP consent.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await grantConsentAndCreateLead({
        buyerId: currentUser?.id,
        dealerId: dealer?.id,
        groupId: quotation?.groupId,
        offerId: quotation?.id,
        offerVersionId: version?.id,
        purpose:
          'Direct dealership consultation, test-drive coordination, and vehicle purchase finalization under DPDP Act 2023.',
        dataFields: dataFieldsToShare.map((f) => `${f.label}: ${f.val}`),
        buyerName: currentUser?.name || 'Verified Buyer',
        authorizedPhone: currentUser?.phone,
        preferredTimeline: 'WITHIN_30_DAYS',
      });
      setIsSubmitting(false);
      if (res.success && res.leadId) {
        onClose();
        navigate(`/buyer/leads/${res.leadId}`);
      } else {
        setError(res.error || 'Failed to complete lead handoff.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to connect to backend server');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto select-none">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#090B0D]/85 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative transform overflow-hidden rounded-3xl bg-[#17191D] text-left shadow-2xl sm:my-8 sm:w-full sm:max-w-xl border border-white/10 p-6 sm:p-8 space-y-6 z-10 text-white"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#22C55E] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Private & Spam-Free</span>
                </div>
                <h3 className="text-xl font-heading font-black text-white mt-1">
                  Connect with this Showroom
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  You are choosing <strong className="text-white">{dealer?.businessName || 'this authorized dealer'}</strong>. Only they will receive your contact details.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#A1A1AA] hover:text-white rounded-xl bg-[#090B0D] border border-white/10 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dealership & Vehicle Context Card */}
            <div className="bg-[#090B0D] rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-white text-sm flex items-center justify-between">
                <span>Selected Showroom</span>
                <span className="text-[#22C55E] font-bold flex items-center gap-1 text-[11px]">
                  <ShieldCheck size={12} /> Verified Franchise Dealer
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Showroom Name:</span>
                <span className="font-bold text-white">{dealer?.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Car & Variant:</span>
                <span className="font-bold text-[#ED1725]">
                  {car?.brand} {car?.modelName || car?.model} ({variant?.name})
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span className="text-[#71717A]">Final On-Road Price:</span>
                <span className="font-heading font-black text-[#22C55E] text-sm">
                  {formatINR(version?.calculatedOnRoadPrice || 0)}
                </span>
              </div>
            </div>

            {/* Data Sharing Disclosure */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Details shared only with this dealer:
              </span>
              <ul className="space-y-2 text-xs text-[#A1A1AA] bg-[#090B0D] p-4 rounded-2xl border border-white/10">
                {dataFieldsToShare.map((field, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="text-[#71717A] flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#22C55E] shrink-0" />
                      <span>{field.label}:</span>
                    </span>
                    <span className="font-bold text-white">{field.val}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-[#090B0D] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#17191D] text-[#ED1725] focus:ring-[#ED1725]"
              />
              <span className="text-[#A1A1AA] leading-relaxed">
                I agree to let <strong className="text-white font-bold">{dealer?.businessName}</strong> contact me to schedule a test drive and discuss this quote. I can cancel permission anytime in my profile.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <SecondaryButton size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                size="sm"
                onClick={handleConfirmAndShare}
                disabled={!isAuthorized || isSubmitting}
                className="font-bold px-6 shadow-lg shadow-dd-red/20"
              >
                {isSubmitting ? 'Connecting...' : 'Confirm & Connect with Showroom'}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
