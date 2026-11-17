import React from 'react';
import { Settings2 } from 'lucide-react';

export const TransmissionSelector = ({
  transmissions = [],
  selectedTransmission,
  onSelectTransmission,
  className = '',
}) => {
  if (!transmissions || transmissions.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Settings2 className="w-3.5 h-3.5 text-dd-red" />
          <span>6. Transmission / Gearbox</span> <span className="text-dd-red">*</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {transmissions.length} Option{transmissions.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {transmissions.map((trans) => {
          const isSelected = selectedTransmission === trans;
          return (
            <button
              type="button"
              key={trans}
              onClick={() => onSelectTransmission(trans)}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'border-dd-red bg-dd-red/10 text-white ring-1 ring-dd-red shadow-md shadow-dd-red/20'
                  : 'border-white/10 hover:border-white/20 bg-[#090B0D] text-slate-400 hover:text-white'
              }`}
            >
              {trans}
            </button>
          );
        })}
      </div>
    </div>
  );
};
