import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ShieldCheck, Eye, Send, AlertCircle, X, Sparkles, Building2 } from 'lucide-react';
import { calculateOnRoadPrice, validatePriceBreakdown } from '../../domain/pricing';
import { formatINR } from '../../lib/currency';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { FieldHint } from '../../components/common/FieldHint';

export const QuotationComposer = ({
  groupId,
  quoteRequestId,
  existingQuotationId,
  previousVersion,
  onSuccess,
  onCancel,
}) => {
  const { groups = [], variants = [], cars = [], dealers = [], currentUser, publishQuotationVersion, updateDealerBrand } = useAppStore();
  const group = groups.find((g) => g.id === groupId);
  const variant = variants.find((v) => v.id === group?.variantId);
  const car = cars.find((c) => c.id === variant?.carId);
  const dealerId = currentUser?.dealerId;
  const dealer = dealers.find((d) => d.id === dealerId) || dealers[0] || { businessName: currentUser?.dealershipName || 'Authorized Dealership', brand: currentUser?.brand || 'Dealership' };

  const carBrand = car?.brand || 'Mahindra';
  const dealerBrand = currentUser?.brand || dealer?.brand || 'Hyundai';
  const isBrandMismatch = car?.brand && dealerBrand && dealerBrand !== 'ALL' && dealerBrand.toLowerCase() !== car.brand.toLowerCase();

  // Form State
  const basePrice = Number(variant?.exShowroomPrice || group?.variant?.exShowroomPrice || 1399000);
  const [breakdown, setBreakdown] = useState({
    exShowroomPrice: previousVersion?.exShowroomPrice || basePrice,
    registrationCharges: previousVersion?.registrationCharges || Math.round(basePrice * 0.10),
    insuranceAmount: previousVersion?.insuranceAmount || Math.round(basePrice * 0.045),
    accessoriesAmount: previousVersion?.accessoriesAmount || 12000,
    otherCharges: previousVersion?.otherCharges || 0,
    discountAmount: previousVersion?.discountAmount || Math.round(basePrice * 0.03),
  });

  const [deliveryMinDays, setDeliveryMinDays] = useState(previousVersion?.deliveryMinDays || 7);
  const [deliveryMaxDays, setDeliveryMaxDays] = useState(previousVersion?.deliveryMaxDays || 10);
  const [validityDays, setValidityDays] = useState(previousVersion?.validityDays || 10);
  const [stockStatus, setStockStatus] = useState(previousVersion?.stockStatus || 'IN_STOCK');
  const [note, setNote] = useState(previousVersion?.note || 'Special group discount with flexible insurance options and basic floor mats kit.');
  const [insuranceFlexibility, setInsuranceFlexibility] = useState(previousVersion?.insuranceFlexibilityAllowed ?? true);

  // Real-time calculated price and validation
  const calculatedOnRoadPrice = calculateOnRoadPrice(breakdown);
  const validation = validatePriceBreakdown(breakdown);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Helper presets
  const applyPreset1162 = () => {
    setBreakdown({
      exShowroomPrice: basePrice,
      registrationCharges: Math.round(basePrice * 0.10),
      insuranceAmount: Math.round(basePrice * 0.045),
      accessoriesAmount: 12000,
      otherCharges: 0,
      discountAmount: Math.round(basePrice * 0.03),
    });
    setDeliveryMinDays(7);
    setDeliveryMaxDays(10);
  };

  const applyPreset1362 = () => {
    setBreakdown({
      exShowroomPrice: basePrice,
      registrationCharges: Math.round(basePrice * 0.10),
      insuranceAmount: Math.round(basePrice * 0.04),
      accessoriesAmount: 8000,
      otherCharges: 0,
      discountAmount: Math.round(basePrice * 0.05),
    });
    setDeliveryMinDays(5);
    setDeliveryMaxDays(12);
  };

  const handlePublishSubmit = async () => {
    setFormError(null);
    if (!validation.isValid) {
      setFormError('Please resolve all validation errors in the pricing breakdown.');
      return;
    }
    if (deliveryMinDays > deliveryMaxDays) {
      setFormError('Minimum delivery days cannot exceed maximum delivery days.');
      return;
    }

    try {
      setSubmitting(true);
      const quotationId = existingQuotationId || ('quote-' + (dealerId || 'dealer') + '-' + groupId);
      const res = await publishQuotationVersion({
        quotationId,
        groupId,
        quoteRequestId,
        variantId: group?.variantId || '',
        dealerId: dealerId || dealer?.id,
        breakdown,
        deliveryMinDays,
        deliveryMaxDays,
        validityDays,
        stockStatus,
        note: note.trim() || undefined,
        conditions: ['Offer valid for verified group buyers', 'Includes temporary registration pass'],
        isInsuranceIncluded: breakdown.insuranceAmount > 0,
        insuranceFlexibilityAllowed: insuranceFlexibility,
      });

      if (res && res.success && res.versionId) {
        onSuccess(res.versionId);
      } else {
        setFormError(res?.error || 'Failed to publish quotation version.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to publish quotation version.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Vehicle & Dealership Header */}
      <div className="bg-[#090B0D] rounded-2xl border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">Quotation Composer</span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs font-semibold text-[#22C55E] bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> {dealer?.businessName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight mt-1.5">
            {car?.brand} {car?.modelName} — {variant?.name}
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Group Ref: <span className="font-mono text-white font-semibold">#{groupId.slice(-6)}</span> • City: {group?.city}
          </p>
        </div>

        {/* Spec Preset Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton size="sm" onClick={applyPreset1162} title="Apply Standard 3% Group Discount">
            Apply 3% Discount
          </SecondaryButton>
          <SecondaryButton size="sm" onClick={applyPreset1362} title="Apply Aggressive 5% Group Discount">
            Apply 5% Discount
          </SecondaryButton>
        </div>
      </div>

      {isBrandMismatch && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-300 shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Dealership active franchise is currently registered as <strong className="text-white uppercase">{dealerBrand}</strong>. You are quoting on a <strong className="text-white uppercase">{carBrand}</strong> demand collective.
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateDealerBrand(carBrand)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 cursor-pointer transition-all shadow-md"
          >
            Switch to {carBrand} Franchise
          </button>
        </div>
      )}

      {formError && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2. Main 2-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#090B0D] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-heading font-bold text-white">Itemized Price Breakdown</h3>
            <p className="text-xs text-[#A1A1AA]">All amounts in Indian Rupees (₹). Zero hidden fees permitted.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ex-Showroom */}
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                Ex-Showroom Price (₹) <span className="text-[#ED1725]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.exShowroomPrice || ''}
                onChange={(e) => setBreakdown({ ...breakdown, exShowroomPrice: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
                required
              />
              {validation.errors.exShowroomPrice && (
                <span className="text-[11px] text-[#EF4444] mt-1 block">{validation.errors.exShowroomPrice}</span>
              )}
            </div>

            {/* Registration / RTO */}
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                Registration & RTO (₹) <span className="text-[#ED1725]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.registrationCharges || ''}
                onChange={(e) => setBreakdown({ ...breakdown, registrationCharges: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
                required
              />
              {validation.errors.registrationCharges && (
                <span className="text-[11px] text-[#EF4444] mt-1 block">{validation.errors.registrationCharges}</span>
              )}
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                Comprehensive Insurance (₹) <span className="text-[#ED1725]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.insuranceAmount || ''}
                onChange={(e) => setBreakdown({ ...breakdown, insuranceAmount: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
                required
              />
              {validation.errors.insuranceAmount && (
                <span className="text-[11px] text-[#EF4444] mt-1 block">{validation.errors.insuranceAmount}</span>
              )}
            </div>

            {/* Accessories */}
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                Accessories Package (₹)
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.accessoriesAmount || ''}
                onChange={(e) => setBreakdown({ ...breakdown, accessoriesAmount: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              />
            </div>

            {/* Other Charges */}
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                Other Statutory Charges (₹)
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.otherCharges || ''}
                onChange={(e) => setBreakdown({ ...breakdown, otherCharges: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              />
            </div>

            {/* Group Discount */}
            <div>
              <label className="block text-xs font-bold text-[#22C55E] mb-1.5">
                Special Group Discount (₹) <span className="text-[#ED1725]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={breakdown.discountAmount || ''}
                onChange={(e) => setBreakdown({ ...breakdown, discountAmount: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-emerald-500/30 font-mono font-bold bg-emerald-500/10 text-[#22C55E] focus:outline-none focus:border-emerald-500"
                required
              />
              {validation.errors.discountAmount && (
                <span className="text-[11px] text-[#EF4444] mt-1 block">{validation.errors.discountAmount}</span>
              )}
            </div>
          </div>

          {/* Delivery & Validity Row */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">Min Delivery (Days)</label>
              <input
                type="number"
                min="1"
                value={deliveryMinDays}
                onChange={(e) => setDeliveryMinDays(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">Max Delivery (Days)</label>
              <input
                type="number"
                min="1"
                value={deliveryMaxDays}
                onChange={(e) => setDeliveryMaxDays(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">Offer Validity (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value, 10) || 10)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 font-mono font-bold bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              />
            </div>
          </div>

          {/* Stock Status & Insurance Flexibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#17191D] text-white font-semibold focus:outline-none focus:border-[#ED1725]"
              >
                <option value="IN_STOCK">In Stock (Showroom / Yard)</option>
                <option value="LIMITED_STOCK">Limited Stock (Fast Allotment)</option>
                <option value="FACTORY_ORDER">Factory Order (Fresh Dispatch)</option>
                <option value="TO_BE_CONFIRMED">To Be Confirmed</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white select-none">
                <input
                  type="checkbox"
                  checked={insuranceFlexibility}
                  onChange={(e) => setInsuranceFlexibility(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#17191D] text-[#ED1725] focus:ring-[#ED1725]"
                />
                <span>Allow Buyer External Insurance</span>
              </label>
            </div>
          </div>

          {/* Dealer Note */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-xs font-bold text-[#A1A1AA]">
                Dealer Inclusions Note (Max 200 Chars)
              </label>
              <span className={`text-[11px] font-mono ${note.length > 200 ? 'text-[#EF4444]' : 'text-[#71717A]'}`}>
                {note.length}/200
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
            />
          </div>
        </div>

        {/* Right Column: Live Sticky Calculation Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-[#090B0D] text-white rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-2xl">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Live Formula Calculation
              </span>
              <h4 className="text-sm font-heading font-black text-white mt-0.5">Calculated On-Road Total</h4>
            </div>

            <div className="space-y-2.5 text-xs divide-y divide-white/10">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Ex-Showroom:</span>
                <span className="font-semibold text-white font-mono">{formatINR(breakdown.exShowroomPrice)}</span>
              </div>
              <div className="pt-2.5 flex justify-between text-[#A1A1AA]">
                <span>Registration & RTO:</span>
                <span className="font-semibold text-white font-mono">{formatINR(breakdown.registrationCharges)}</span>
              </div>
              <div className="pt-2.5 flex justify-between text-[#A1A1AA]">
                <span>Comprehensive Insurance:</span>
                <span className="font-semibold text-white font-mono">{formatINR(breakdown.insuranceAmount)}</span>
              </div>
              <div className="pt-2.5 flex justify-between text-[#A1A1AA]">
                <span>Accessories Package:</span>
                <span className="font-semibold text-white font-mono">{formatINR(breakdown.accessoriesAmount)}</span>
              </div>
              {breakdown.otherCharges > 0 && (
                <div className="pt-2.5 flex justify-between text-[#A1A1AA]">
                  <span>Other Charges:</span>
                  <span className="font-semibold text-white font-mono">{formatINR(breakdown.otherCharges)}</span>
                </div>
              )}
              <div className="pt-2.5 flex justify-between text-[#22C55E] font-bold">
                <span>Group Concession:</span>
                <span className="font-mono">− {formatINR(breakdown.discountAmount)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex justify-between items-baseline">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-bold">Total On-Road</span>
                <span className="text-[10px] text-[#71717A] block font-mono">Ex + RTO + Ins + Acc − Disc</span>
              </div>
              <div className="text-2xl font-heading font-black text-white tracking-tight">
                {formatINR(calculatedOnRoadPrice)}
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye size={14} /> Preview as Buyer
              </button>

              <PrimaryButton
                size="md"
                className="w-full justify-center font-bold"
                icon={<Send size={14} />}
                disabled={!validation.isValid}
                onClick={() => setShowPublishConfirm(true)}
              >
                Publish Structured Quotation
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before Publishing */}
      <ConfirmationModal
        isOpen={showPublishConfirm}
        title="Publish Structured Quotation?"
        message="You are about to publish this quotation for the selected car group. Check the price breakdown and offer validity before continuing. Once published, this creates an immutable version visible to all group buyers."
        confirmLabel="Yes, Publish Quotation"
        onConfirm={() => {
          setShowPublishConfirm(false);
          handlePublishSubmit();
        }}
        onCancel={() => setShowPublishConfirm(false)}
      />

      {/* Buyer Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-[#090B0D]/85 backdrop-blur-md"
              onClick={() => setShowPreviewModal(false)}
            />

            <div className="relative transform overflow-hidden rounded-3xl bg-[#17191D] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-white/10 p-6 sm:p-8 space-y-5 z-10 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">Buyer Preview</span>
                  <span className="text-xs text-[#71717A]">• How buyers will see your offer</span>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 text-[#A1A1AA] hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="font-heading font-black text-lg text-white">{dealer?.businessName}</div>
                <div className="text-xs text-[#ED1725] font-semibold">
                  {car?.brand} {car?.modelName} — {variant?.name}
                </div>

                <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Ex-Showroom:</span>
                    <span className="font-semibold text-white font-mono">{formatINR(breakdown.exShowroomPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Registration & RTO:</span>
                    <span className="font-semibold text-white font-mono">{formatINR(breakdown.registrationCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Insurance:</span>
                    <span className="font-semibold text-white font-mono">{formatINR(breakdown.insuranceAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Accessories:</span>
                    <span className="font-semibold text-white font-mono">{formatINR(breakdown.accessoriesAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#22C55E] font-bold pt-1 border-t border-dashed border-white/10">
                    <span>Discount:</span>
                    <span className="font-mono">− {formatINR(breakdown.discountAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold text-sm text-white">
                    <span>Final On-Road Price:</span>
                    <span className="text-xl font-heading font-black">{formatINR(calculatedOnRoadPrice)}</span>
                  </div>
                </div>

                <div className="text-xs text-[#A1A1AA] space-y-1">
                  <div>Delivery: <strong className="text-white">{deliveryMinDays}–{deliveryMaxDays} days</strong></div>
                  <div>Stock: <strong className="text-white">{stockStatus.replace(/_/g, ' ')}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <SecondaryButton size="sm" onClick={() => setShowPreviewModal(false)}>
                  Close Preview
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
