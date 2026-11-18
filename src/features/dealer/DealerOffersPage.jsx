import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ArrowRight, Plus, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const DealerOffersPage = () => {
  const {
    quotations = [],
    quotationVersions = [],
    dealers = [],
    groups = [],
    variants = [],
    cars = [],
    currentUser,
    fetchDealerQuotations,
    fetchGroups,
    fetchCars,
  } = useAppStore();

  useEffect(() => {
    if (typeof fetchDealerQuotations === 'function') {
      fetchDealerQuotations();
    }
    if (groups.length === 0) fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [fetchDealerQuotations, fetchGroups, fetchCars, groups.length, cars.length]);

  const myDealerId = currentUser?.dealerId;
  const myQuotations = (quotations || []).filter(
    (q) => !myDealerId || q.dealerId === myDealerId || q.dealer?.id === myDealerId || (currentUser?.id && q.dealer?.id === currentUser?.id)
  );

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 text-[#ED1725] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ED1725]/30">
            <Sparkles size={13} />
            <span>Published Inventory Quotations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Quotations & Version History
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-normal">
            Manage your dealership's active quotations and inspect historical immutable version revisions.
          </p>
        </div>

        <Link to="/dealer/quote-requests">
          <PrimaryButton size="sm" className="font-bold">
            <Plus size={15} />
            <span>Create New Quotation</span>
          </PrimaryButton>
        </Link>
      </div>

      {/* 2. Quotation Cards */}
      {myQuotations.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No Quotations Published Yet"
          description="Check your incoming quote requests to prepare competitive group offers."
          actionText="View Quote Requests"
          onAction={() => window.location.assign('/dealer/quote-requests')}
        />
      ) : (
        <div className="space-y-4">
          {myQuotations.map((quote) => {
            const group = groups.find((g) => g.id === quote.groupId);
            const variant =
              group?.variant ||
              variants.find((v) => v.id === quote.variantId || v.id === group?.variantId) ||
              { name: 'Selected Trim' };
            const car =
              group?.car ||
              cars.find((c) => c.id === variant?.carId || c.id === group?.carId) ||
              { brand: 'Vehicle', modelName: 'Model' };
            const versions = quotationVersions
              .filter((v) => v.quotationId === quote.id)
              .sort((a, b) => b.versionNumber - a.versionNumber);
            const currentVersion =
              quote.currentVersion ||
              versions.find((v) => v.status === 'PUBLISHED') ||
              versions[0] || {
                versionNumber: 1,
                calculatedOnRoadPrice: 1500000,
                discountAmount: 25000,
                status: 'PUBLISHED',
              };

            return (
              <motion.div
                key={quote.id}
                whileHover={{ y: -3 }}
                className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-heading font-bold text-base text-white">
                      {car?.brand} {car?.modelName || car?.model} — {variant?.name}
                    </span>
                    <span className="text-xs bg-[#090B0D] text-white px-2.5 py-0.5 rounded-full font-mono font-bold border border-white/10">
                      Latest v{currentVersion.versionNumber}
                    </span>
                  </div>
                  <StatusBadge status={currentVersion.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10">
                    <span className="text-[#71717A] block text-[11px] font-bold uppercase">
                      Calculated On-Road
                    </span>
                    <span className="font-heading font-black text-white text-lg tracking-tight">
                      {formatINR(currentVersion.calculatedOnRoadPrice)}
                    </span>
                  </div>
                  <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10">
                    <span className="text-[#71717A] block text-[11px] font-bold uppercase">
                      Group Concession
                    </span>
                    <span className="font-bold text-[#22C55E] text-base">
                      − {formatINR(currentVersion.discountAmount)}
                    </span>
                  </div>
                  <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10">
                    <span className="text-[#71717A] block text-[11px] font-bold uppercase">
                      Total Versions Created
                    </span>
                    <span className="font-bold text-white text-base flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#ED1725]" />
                      {versions.length || 1} Immutable Versions
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#71717A] font-mono">
                    Target Collective: #{quote.groupId?.slice(-6)}
                  </span>

                  <Link to={`/dealer/offers/${quote.id}`}>
                    <PrimaryButton size="sm" className="font-bold">
                      <span>Inspect & Revise Offer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </PrimaryButton>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
