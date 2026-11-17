import React from 'react';
import { formatINR } from '../../lib/currency';
import { InfoTooltip } from './InfoTooltip';

export const PriceBreakdown = ({
  version,
  compact = false,
  isIllustrative = false,
  className = '',
}) => {
  if (!version) return null;

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#17191D] ${
        compact ? 'p-4 sm:p-5' : 'p-6 sm:p-7'
      } shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-white text-sm">On-Road Price Breakdown</h4>
            {isIllustrative && (
              <span className="text-[10px] bg-white/5 text-[#A1A1AA] px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
                Sample Estimate
              </span>
            )}
          </div>
          <p className="text-xs text-[#71717A] mt-0.5 font-normal">
            Exact price details from the showroom with zero hidden charges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {version.versionNumber && (
            <span className="text-xs bg-white/5 text-white px-2.5 py-1 rounded-xl border border-white/10 font-mono font-bold">
              Offer v{version.versionNumber}
            </span>
          )}
          <InfoTooltip concept="quotationVersion" iconSize={13} />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <span>Ex-Showroom Price</span>
            <InfoTooltip concept="exShowroom" iconSize={12} />
          </span>
          <span className="font-bold text-white">{formatINR(version.exShowroomPrice)}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <span>Registration & RTO Road Tax</span>
            <InfoTooltip concept="registrationRTO" iconSize={12} />
            <span className="text-[10px] text-[#71717A] hidden sm:inline">(Government Tax)</span>
          </span>
          <span className="font-bold text-white">{formatINR(version.registrationCharges)}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <span>Comprehensive Zero-Dep Insurance</span>
            <InfoTooltip concept="insurance" iconSize={12} />
            {version.insuranceFlexibilityAllowed && (
              <span className="text-[10px] bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-md border border-[#22C55E]/30 font-bold">
                You can choose your own insurance
              </span>
            )}
          </span>
          <span className="font-bold text-white">{formatINR(version.insuranceAmount)}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <span>Optional Accessories</span>
            <InfoTooltip concept="accessories" iconSize={12} />
          </span>
          <span className="font-bold text-white">{formatINR(version.accessoriesAmount)}</span>
        </div>

        {version.otherCharges > 0 && (
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <span>Fastag & Incidental Handling</span>
              <InfoTooltip concept="otherCharges" iconSize={12} />
            </span>
            <span className="font-bold text-white">{formatINR(version.otherCharges)}</span>
          </div>
        )}

        {/* Group Volume Discount */}
        <div className="flex justify-between items-center text-[#22C55E] font-bold pt-3 border-t border-dashed border-white/10 text-xs sm:text-sm">
          <span className="flex items-center gap-1.5">
            <span>Special Group Discount</span>
            <InfoTooltip concept="dealerDiscount" iconSize={12} />
          </span>
          <span className="font-black text-sm">− {formatINR(version.discountAmount || version.baseDiscount)}</span>
        </div>

        {/* Final On-Road Total */}
        <div className="pt-4 border-t border-white/15 flex justify-between items-baseline">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-white text-base">Final On-Road Price</span>
              <InfoTooltip concept="onRoadPrice" iconSize={13} />
            </div>
            <div className="text-[10px] text-[#71717A] font-normal mt-0.5">
              Total price you pay to take the car home
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-heading font-black text-[#22C55E] tracking-tight">
              {formatINR(version.calculatedOnRoadPrice || version.onRoadPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
