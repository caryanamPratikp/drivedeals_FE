import React from 'react';
import { Calendar } from 'lucide-react';

export const ModelYearSelector = ({
  modelYears = [],
  selectedYear,
  onSelectYear,
  className = '',
}) => {
  if (!modelYears || modelYears.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-dd-red" />
          <span>3. Model Year</span> <span className="text-dd-red">*</span>
        </label>
        <span className="text-[11px] text-slate-500">Official Production Run</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {modelYears.map((year) => {
          const isSelected = Number(selectedYear) === Number(year);
          return (
            <button
              type="button"
              key={year}
              onClick={() => onSelectYear(Number(year))}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'border-dd-red bg-dd-red/10 text-white ring-1 ring-dd-red shadow-md shadow-dd-red/20'
                  : 'border-white/10 hover:border-white/20 bg-[#090B0D] text-slate-400 hover:text-white'
              }`}
            >
              <span>{year} Edition</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
