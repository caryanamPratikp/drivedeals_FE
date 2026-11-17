import React from 'react';
import { Cpu, Battery, Check } from 'lucide-react';

export const EngineBatterySelector = ({
  configs = [],
  selectedConfig,
  onSelectConfig,
  isElectric = false,
  className = '',
}) => {
  if (!configs || configs.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          {isElectric ? <Battery className="w-3.5 h-3.5 text-cyan-400" /> : <Cpu className="w-3.5 h-3.5 text-dd-red" />}
          <span>5. {isElectric ? 'Battery Pack & Capacity' : 'Engine & Displacement'}</span>{' '}
          <span className="text-dd-red">*</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {configs.length} Architecture{configs.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {configs.map((cfg) => {
          const isSelected = selectedConfig === cfg;
          return (
            <button
              type="button"
              key={cfg}
              onClick={() => onSelectConfig(cfg)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'border-dd-red bg-dd-red/10 text-white ring-1 ring-dd-red shadow-md shadow-dd-red/20'
                  : 'border-white/10 hover:border-white/20 bg-[#090B0D] text-slate-400 hover:text-white'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-heading font-bold text-white block leading-snug">
                  {cfg}
                </span>
              </div>
              <div className="shrink-0">
                {isSelected ? (
                  <div className="w-4 h-4 rounded-full bg-dd-red text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
