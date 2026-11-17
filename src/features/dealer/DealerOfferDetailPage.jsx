import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ArrowLeft, History, Edit3, Building2 } from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { PriceBreakdown } from '../../components/common/PriceBreakdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QuotationComposer } from './QuotationComposer';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const DealerOfferDetailPage = () => {
  const { offerId } = useParams();
  const { quotations = [], quotationVersions = [], dealers = [], variants = [], cars = [] } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const quotation = quotations.find((q) => q.id === offerId);
  const dealer =
    dealers.find((d) => d.id === quotation?.dealerId) ||
    dealers[0] || { businessName: 'Authorized Dealership', brand: 'Dealership' };
  const variant =
    variants.find((v) => v.id === quotation?.variantId) ||
    variants[0] || { name: 'Standard Trim' };
  const car =
    cars.find((c) => c.id === variant?.carId) ||
    cars[0] || { brand: 'Vehicle', modelName: 'Model' };

  const versions = quotationVersions
    .filter((v) => v.quotationId === offerId)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  const latestVersion =
    versions.find((v) => v.status === 'PUBLISHED') ||
    versions[0] || {
      versionNumber: 1,
      calculatedOnRoadPrice: 1500000,
      discountAmount: 25000,
      status: 'PUBLISHED',
      deliveryMinDays: 7,
      deliveryMaxDays: 10,
    };

  const [activeViewingVersion, setActiveViewingVersion] = useState(latestVersion);

  if (!quotation) {
    return (
      <div className="text-center py-20 space-y-4 select-none">
        <h2 className="text-xl font-heading font-black text-white">Quotation Not Found</h2>
        <Link to="/dealer/offers">
          <PrimaryButton size="sm">Back to Offers</PrimaryButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <Link
          to="/dealer/offers"
          className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Quotations
        </Link>
      </div>

      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ED1725]" />
              {dealer.businessName}
            </span>
            <span className="text-xs text-white bg-[#090B0D] px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
              Verified Showroom
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={activeViewingVersion.status} />
            <span className="text-xs font-mono font-bold bg-[#090B0D] text-white px-2.5 py-0.5 rounded-full border border-white/10">
              Version {activeViewingVersion.versionNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              {car.brand} {car.modelName || car.model} — {variant.name}
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Quotation Ref: <strong className="font-mono text-white">#{quotation.id.slice(-6)}</strong> • Car Group: #{quotation.groupId?.slice(-6)}
            </p>
          </div>

          {!isEditing && (
            <PrimaryButton
              size="md"
              onClick={() => setIsEditing(true)}
              className="font-bold shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Create Revised Version</span>
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Editor or Viewing Display */}
      {isEditing ? (
        <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-heading font-black text-white">
              Composing Revision v{latestVersion.versionNumber + 1}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-[#A1A1AA] hover:text-white cursor-pointer"
            >
              Cancel Revision
            </button>
          </div>

          <QuotationComposer
            groupId={quotation.groupId}
            existingQuotationId={quotation.id}
            previousVersion={latestVersion}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <PriceBreakdown version={activeViewingVersion} />

          {/* Historical versions */}
          {versions.length > 1 && (
            <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-3">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#ED1725]" />
                Immutable Revision Ledger
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveViewingVersion(v)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      activeViewingVersion.id === v.id
                        ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-sm'
                        : 'bg-[#090B0D] text-[#A1A1AA] border-white/10 hover:text-white'
                    }`}
                  >
                    v{v.versionNumber} ({formatINR(v.calculatedOnRoadPrice)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
