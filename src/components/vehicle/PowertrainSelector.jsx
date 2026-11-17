import React from 'react';
import { Fuel, Zap, Leaf, Flame, ShieldAlert } from 'lucide-react';

export const PowertrainSelector = ({
  powertrains = [],
  selectedPowertrain,
  onSelectPowertrain,
  modelName = '',
  className = '',
}) => {
  const getPowertrainIcon = (p) => {
    switch (p) {
      case 'ELECTRIC':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'HYBRID':
        return <Leaf className="w-3.5 h-3.5 text-emerald-400" />;
      case 'CNG':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'DIESEL':
      case 'PETROL':
      default:
        return <Fuel className="w-3.5 h-3.5 text-dd-red" />;
    }
  };

  const getPowertrainLabel = (p) => {
    switch (p) {
      case 'ELECTRIC':
        return 'Electric (EV)';
      case 'HYBRID':
        return 'Strong Hybrid';
      case 'CNG':
        return 'Bi-Fuel CNG';
      case 'DIESEL':
        return 'Turbo Diesel';
      case 'PETROL':
        return 'Turbo Petrol';
      default:
        return p;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Fuel className="w-3.5 h-3.5 text-dd-red" />
          <span>4. Fuel Type / Powertrain</span> <span className="text-dd-red">*</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {powertrains.length} Available for {modelName || 'Model'}
        </span>
      </div>

      {powertrains.length === 0 ? (
        <div className="p-3 text-xs text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>No compatible powertrains found for this model year.</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {powertrains.map((p) => {
            const isSelected = selectedPowertrain === p;
            return (
              <button
                type="button"
                key={p}
                onClick={() => onSelectPowertrain(p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  isSelected
                    ? 'border-dd-red bg-dd-red/10 text-white ring-1 ring-dd-red shadow-md shadow-dd-red/20'
                    : 'border-white/10 hover:border-white/20 bg-[#090B0D] text-slate-400 hover:text-white'
                }`}
              >
                {getPowertrainIcon(p)}
                <span>{getPowertrainLabel(p)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
