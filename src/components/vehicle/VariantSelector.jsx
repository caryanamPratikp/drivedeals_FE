import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { formatINR } from '../../lib/currency';

export const VariantSelector = ({
  variants = [],
  selectedVariantId,
  onSelectVariant,
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-dd-red" />
          <span>7. Variant Trim</span> <span className="text-dd-red">*</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {variants.length} Trim{variants.length > 1 ? 's' : ''} Compatible
        </span>
      </div>

      {variants.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-[#090B0D] rounded-2xl border border-white/5">
          No trims match this configuration.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {variants.map((v) => {
            const isSelected = selectedVariantId === v.id;
            return (
              <button
                type="button"
                key={v.id}
                onClick={() => onSelectVariant(v.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isSelected
                    ? 'border-dd-red bg-dd-red/10 ring-1 ring-dd-red shadow-lg shadow-dd-red/20'
                    : 'border-white/5 hover:border-white/20 bg-[#090B0D]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-heading font-bold text-white truncate">
                      {v.variantName || v.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                      {v.powertrain || v.fuelType}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                    Ex-Showroom:{' '}
                    <span className="text-white">
                      {formatINR(v.exShowroomPrice || 900000)}
                    </span>
                  </div>

                  {Array.isArray(v.keyFeatures) && v.keyFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {v.keyFeatures.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-dd-red text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-white/40" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
