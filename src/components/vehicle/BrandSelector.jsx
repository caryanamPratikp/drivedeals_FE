import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';

export const BrandSelector = ({
  brands = [],
  selectedBrandId,
  onSelectBrand,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.country && b.country.toLowerCase().includes(q))
    );
  }, [brands, searchQuery]);

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider">
          1. Manufacturer / Brand <span className="text-dd-red">*</span>
        </label>
        {brands.length > 5 && (
          <span className="text-[11px] text-slate-500 font-normal">
            {filteredBrands.length} of {brands.length} Brands
          </span>
        )}
      </div>

      {/* Optional Search filter if brands > 4 */}
      {brands.length > 4 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manufacturer (e.g. Tata, Hyundai)..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#090B0D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-dd-red transition-colors"
          />
        </div>
      )}

      {/* Brand Grid / Chips */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {filteredBrands.map((brand) => {
          const isSelected = selectedBrandId === brand.id;
          return (
            <button
              type="button"
              key={brand.id}
              onClick={() => onSelectBrand(brand.id)}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group ${
                isSelected
                  ? 'border-dd-red bg-dd-red/10 ring-1 ring-dd-red shadow-lg shadow-dd-red/20'
                  : 'border-white/5 hover:border-white/20 bg-[#090B0D]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-dd-red text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span
                className={`text-[11px] font-heading font-bold truncate max-w-full ${
                  isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {brand.name}
              </span>
            </button>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="p-3 text-center text-xs text-slate-500 bg-[#090B0D] rounded-xl border border-white/5">
          No brands match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </div>
  );
};
