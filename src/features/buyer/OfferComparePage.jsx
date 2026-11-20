import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Building2,
  Clock,
  Car
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const OfferComparePage = () => {
  const { quotationVersions = [], quotations = [], dealers = [], variants = [], cars = [] } = useAppStore();
  const navigate = useNavigate();
  const [selectedVariantFilter, setSelectedVariantFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('price');
  const [expandedOfferIds, setExpandedOfferIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedOfferIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isDealerVerified = (dealerId, dealerObj) => {
    if (dealerObj?.isVerified === true) return true;
    if (dealerObj?.status === 'VERIFIED' || dealerObj?.verificationStatus === 'VERIFIED') return true;
    const d = (dealers || []).find((item) => item.id === dealerId);
    return d?.status === 'VERIFIED' || d?.verificationStatus === 'VERIFIED';
  };

  const publishedVersions = useMemo(() => {
    return quotationVersions
      .filter((qv) => qv.status === 'PUBLISHED')
      .filter((qv) => {
        const q = quotations.find((quote) => quote.id === qv.quotationId);
        return isDealerVerified(q?.dealerId || q?.dealer?.id, q?.dealer);
      });
  }, [quotationVersions, quotations, dealers]);

  const variantsWithOffers = useMemo(() => {
    const varIds = Array.from(
      new Set(
        publishedVersions
          .map((v) => {
            const q = quotations.find((quote) => quote.id === v.quotationId);
            return q?.variantId;
          })
          .filter(Boolean)
      )
    );
    return variants.filter((v) => varIds.includes(v.id));
  }, [publishedVersions, quotations, variants]);

  const offersToCompare = useMemo(() => {
    let list = publishedVersions.filter((v) => {
      const q = quotations.find((quote) => quote.id === v.quotationId);
      if (selectedVariantFilter !== 'ALL' && q?.variantId !== selectedVariantFilter) {
        return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'price') {
        return a.calculatedOnRoadPrice - b.calculatedOnRoadPrice;
      }
      if (sortBy === 'delivery') {
        return a.deliveryMinDays - b.deliveryMinDays;
      }
      if (sortBy === 'expiry') {
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }
      return 0;
    });

    return list;
  }, [publishedVersions, quotations, selectedVariantFilter, sortBy]);

  const lowestPrice = useMemo(() => {
    if (offersToCompare.length === 0) return 0;
    return Math.min(...offersToCompare.map((o) => o.calculatedOnRoadPrice));
  }, [offersToCompare]);

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ED1725]">
              Compare Prices
            </span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs text-[#A1A1AA] font-medium">Find the Best Deal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-1.5">
            Compare Showroom Price Quotes
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl leading-relaxed">
            See exactly what each local dealer is offering with zero hidden fees. Pick the lowest price, best discount, or fastest delivery.
          </p>
        </div>
      </div>

      {/* 2. Filter & Sort Bar */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
            Filter Variant:
          </label>
          <select
            value={selectedVariantFilter}
            onChange={(e) => setSelectedVariantFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725]"
          >
            <option value="ALL">All Available Variants ({variantsWithOffers.length})</option>
            {variantsWithOffers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#71717A] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725]"
          >
            <option value="price">Lowest On-Road Price</option>
            <option value="delivery">Fastest Delivery Timeline</option>
            <option value="expiry">Offer Expiry Deadline</option>
          </select>
        </div>
      </div>

      {/* 3. Comparison Grid */}
      {offersToCompare.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No Published Offers Matching Your Filters"
          description="Verified OEM franchise dealerships will submit quotations as group demand collectives reach critical volume."
          actionText="Browse Active Collectives"
          onAction={() => navigate('/groups')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersToCompare.map((version) => {
            const quotation = quotations.find((q) => q.id === version.quotationId);
            const dealer =
              dealers.find((d) => d.id === quotation?.dealerId) ||
              dealers[0] || { businessName: 'Authorized Dealership', brand: 'Dealership' };
            const variant =
              variants.find((v) => v.id === quotation?.variantId) ||
              variants[0] || { name: 'Trim Variant' };
            const car =
              cars.find((c) => c.id === variant?.carId) ||
              cars[0] || { brand: 'Vehicle', modelName: 'Model' };
            const isLowest = version.calculatedOnRoadPrice === lowestPrice && lowestPrice > 0;
            const isExpanded = !!expandedOfferIds[version.id];

            return (
              <motion.div
                key={version.id}
                whileHover={{ y: -4 }}
                className={`bg-[#17191D] rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                  isLowest ? 'border-[#ED1725] ring-1 ring-[#ED1725]/40' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {isLowest && (
                    <div className="bg-[#ED1725] text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Best Audited On-Road Margin</span>
                    </div>
                  )}

                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                          <Building2 size={14} className="text-[#ED1725]" />
                          {dealer.businessName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                          <ShieldCheck size={11} className="stroke-[2.5]" />
                          Verified
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#090B0D] text-white px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
                        v{version.versionNumber}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                        {car.brand}
                      </div>
                      <h3 className="font-heading font-black text-lg text-white">{variant.name}</h3>
                    </div>

                    <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-[#A1A1AA]">On-Road Pune</span>
                        <span className="text-2xl font-heading font-black text-white tracking-tight">
                          {formatINR(version.calculatedOnRoadPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                        <span className="text-[#22C55E] font-bold">Volume Concession:</span>
                        <span className="font-bold text-[#22C55E]">
                          − {formatINR(version.discountAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#A1A1AA] space-y-1.5 pt-1">
                      <div className="flex justify-between">
                        <span>Delivery Window:</span>
                        <strong className="text-white font-bold">
                          {version.deliveryMinDays}–{version.deliveryMaxDays} days
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Flexibility:</span>
                        <strong className="text-white font-bold">
                          {version.insuranceFlexibilityAllowed ? 'Buyer Selectable' : 'Dealership Bundle'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="text-white font-mono">{formatDate(version.expiresAt)}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-3 border-t border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex justify-between text-[#A1A1AA]">
                          <span>Ex-Showroom:</span>
                          <span className="font-bold text-white">{formatINR(version.exShowroomPrice)}</span>
                        </div>
                        <div className="flex justify-between text-[#A1A1AA]">
                          <span>RTO & Taxes:</span>
                          <span className="font-bold text-white">{formatINR(version.registrationCharges)}</span>
                        </div>
                        <div className="flex justify-between text-[#A1A1AA]">
                          <span>Comprehensive Insurance:</span>
                          <span className="font-bold text-white">{formatINR(version.insuranceAmount)}</span>
                        </div>
                        <div className="flex justify-between text-[#A1A1AA]">
                          <span>Showroom Accessories:</span>
                          <span className="font-bold text-white">{formatINR(version.accessoriesAmount)}</span>
                        </div>
                      </motion.div>
                    )}

                    <button
                      onClick={() => toggleExpand(version.id)}
                      className="w-full text-center text-[11px] font-bold text-[#A1A1AA] hover:text-white flex items-center justify-center gap-1 pt-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Hide Itemized Details <ChevronUp size={13} />
                        </>
                      ) : (
                        <>
                          View Itemized Breakdown <ChevronDown size={13} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/10 mt-2">
                  <div className="pt-4 flex items-center gap-3">
                    <Link to={`/buyer/offers/${version.quotationId}`} className="flex-1">
                      <SecondaryButton size="sm" className="w-full justify-center">
                        Inspect
                      </SecondaryButton>
                    </Link>
                    <Link
                      to={`/buyer/offers/${version.quotationId}?action=select`}
                      className="flex-1"
                    >
                      <PrimaryButton size="sm" className="w-full justify-center font-bold">
                        Select Offer
                      </PrimaryButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
