import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  History,
  Building2,
  Clock,
  Car
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { PriceBreakdown } from '../../components/common/PriceBreakdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConsentReviewDialog } from './ConsentReviewDialog';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const OfferDetailPage = () => {
  const { offerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    quotations = [],
    quotationVersions = [],
    dealers = [],
    variants = [],
    cars = [],
    consents = [],
    leads = [],
    fetchConsents
  } = useAppStore();
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  useEffect(() => {
    if (typeof fetchConsents === 'function') {
      fetchConsents();
    }
  }, []);

  const quotation = quotations.find((q) => q.id === offerId);
  const dealer =
    dealers.find((d) => d.id === quotation?.dealerId) ||
    dealers[0] || { businessName: 'Authorized Dealership', brand: 'Dealership' };
  const variant =
    variants.find((v) => v.id === quotation?.variantId) ||
    variants[0] || { name: 'Trim Variant', fuelType: 'Petrol', transmission: 'Auto' };
  const car =
    cars.find((c) => c.id === variant?.carId) ||
    cars[0] || { brand: 'Vehicle', modelName: 'Model' };

  // All versions of this quotation sorted newest first
  const allVersions = quotationVersions
    .filter((v) => v.quotationId === offerId)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  const currentVersion =
    allVersions.find((v) => v.status === 'PUBLISHED') ||
    allVersions[0] || {
      versionNumber: 1,
      calculatedOnRoadPrice: 1500000,
      deliveryMinDays: 7,
      deliveryMaxDays: 10,
      stockStatus: 'IN_STOCK',
      status: 'PUBLISHED',
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    };

  const [activeViewingVersion, setActiveViewingVersion] = useState(currentVersion);

  useEffect(() => {
    if (currentVersion) {
      setActiveViewingVersion(currentVersion);
    }
  }, [currentVersion]);

  // Check if buyer has already granted consent for this quotation
  const existingConsent = consents.find(
    (c) =>
      (c.quotationId === offerId || c.offerId === offerId) &&
      (c.status === 'GRANTED' || c.status === 'ACTIVE')
  );
  const matchingLead = existingConsent
    ? leads.find(
        (l) =>
          l.consentId === existingConsent.id ||
          l.id === `lead-${existingConsent.id}` ||
          l.offerId === offerId
      )
    : null;
  const leadTargetId = matchingLead?.id || (existingConsent ? `lead-${existingConsent.id}` : null);

  useEffect(() => {
    if (searchParams.get('action') === 'select') {
      if (existingConsent && leadTargetId) {
        navigate(`/buyer/leads/${leadTargetId}`);
      } else {
        setIsConsentOpen(true);
      }
    }
  }, [searchParams, existingConsent, leadTargetId, navigate]);

  if (!quotation) {
    return (
      <div className="text-center py-20 space-y-4 select-none">
        <h2 className="text-xl font-heading font-black text-white">Quotation Not Found</h2>
        <p className="text-sm text-[#A1A1AA]">
          The requested quotation could not be loaded from active groups.
        </p>
        <Link to="/buyer/offers">
          <PrimaryButton size="sm">Back to Offers</PrimaryButton>
        </Link>
      </div>
    );
  }

  const isExpired = new Date(activeViewingVersion.expiresAt).getTime() < Date.now();

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* 1. Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/buyer/groups/${quotation.groupId}`}
          className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collective
        </Link>
        <span className="text-xs text-[#71717A] font-mono">
          Quotation Ref: #{quotation.id.slice(-6)}
        </span>
      </div>

      {/* 2. Main Quotation Header */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ED1725]" />
              {dealer.businessName}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              Verified Dealership
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={activeViewingVersion.status} />
            <span className="text-xs bg-[#090B0D] text-white font-mono font-bold px-2.5 py-0.5 rounded-full border border-white/10">
              v{activeViewingVersion.versionNumber}
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
            {car.brand}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-0.5">
            {car.modelName || car.model} — {variant.name}
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-normal">
            {variant.fuelType} • {variant.transmission} • MY {variant.modelYear || 2025}
          </p>
        </div>

        {/* Pricing Breakdown Card */}
        <PriceBreakdown version={activeViewingVersion} />

        {/* Version Switcher */}
        {allVersions.length > 1 && (
          <div className="p-5 bg-[#090B0D] rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#ED1725]" />
                <span>Quotation Revision History</span>
              </span>
              <span className="text-[#A1A1AA] font-normal">
                {allVersions.length} Recorded Versions
              </span>
            </div>
            <p className="text-[11px] text-[#71717A]">
              Immutable versioning preserves all previous revisions without overwriting history.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allVersions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveViewingVersion(v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    activeViewingVersion.id === v.id
                      ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-sm'
                      : 'bg-[#17191D] text-[#A1A1AA] border-white/10 hover:text-white'
                  }`}
                >
                  v{v.versionNumber} ({formatINR(v.calculatedOnRoadPrice)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quotation Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
            <span className="text-[#71717A] block font-bold text-[11px] uppercase">
              Estimated Delivery
            </span>
            <span className="font-heading font-black text-white text-base">
              {activeViewingVersion.deliveryMinDays}–{activeViewingVersion.deliveryMaxDays} Days
            </span>
          </div>

          <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
            <span className="text-[#71717A] block font-bold text-[11px] uppercase">Stock Status</span>
            <span className="font-heading font-black text-white text-base">
              {activeViewingVersion.stockStatus?.replace(/_/g, ' ') || 'In Stock'}
            </span>
          </div>

          <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
            <span className="text-[#71717A] block font-bold text-[11px] uppercase">Offer Validity</span>
            <span
              className={`font-mono font-bold text-sm ${
                isExpired ? 'text-[#EF4444]' : 'text-white'
              }`}
            >
              {isExpired ? 'Expired' : `Until ${formatDate(activeViewingVersion.expiresAt)}`}
            </span>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#A1A1AA] max-w-md leading-relaxed">
            {existingConsent ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 size={15} className="text-[#22C55E] shrink-0" />
                <span>You are connected with this showroom! They can call you to arrange your test drive.</span>
              </span>
            ) : (
              'Accepting this quote lets this showroom call you to arrange a test drive. Your details remain 100% hidden from all other dealers.'
            )}
          </div>

          {existingConsent ? (
            <Link to={`/buyer/leads/${leadTargetId}`} className="w-full sm:w-auto">
              <PrimaryButton
                size="lg"
                className="w-full sm:w-auto font-bold px-8 bg-emerald-600 hover:bg-emerald-500 border-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 size={16} className="text-white" />
                <span>Track Test Drive & Visit</span>
              </PrimaryButton>
            </Link>
          ) : (
            <PrimaryButton
              size="lg"
              disabled={isExpired}
              onClick={() => setIsConsentOpen(true)}
              className="w-full sm:w-auto font-bold px-8 shadow-lg shadow-dd-red/25"
            >
              {isExpired ? 'Offer Expired' : 'Accept Quote & Book Test Drive'}
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Consent Dialog */}
      <ConsentReviewDialog
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        dealer={dealer}
        version={activeViewingVersion}
        quotation={quotation}
        variant={variant}
        car={car}
      />
    </div>
  );
};
