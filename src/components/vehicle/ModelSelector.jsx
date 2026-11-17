import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { formatINR } from '../../lib/currency';

export const ModelSelector = ({
  models = [],
  selectedModelId,
  onSelectModel,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    const q = searchQuery.toLowerCase();
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.bodyType && m.bodyType.toLowerCase().includes(q))
    );
  }, [models, searchQuery]);

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider">
          2. Car Model <span className="text-dd-red">*</span>
        </label>
        {models.length > 3 && (
          <span className="text-[11px] text-slate-500 font-normal">
            {filteredModels.length} of {models.length} Models
          </span>
        )}
      </div>

      {models.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model (e.g. Nexon, Creta)..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#090B0D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-dd-red transition-colors"
          />
        </div>
      )}

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredModels.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
            <button
              type="button"
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                isSelected
                  ? 'border-dd-red bg-dd-red/10 ring-1 ring-dd-red shadow-lg shadow-dd-red/20'
                  : 'border-white/5 hover:border-white/20 bg-[#090B0D]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-heading font-black text-white truncate">
                    {model.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                    {model.bodyType || 'SUV'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  From <span className="text-white font-bold">{formatINR(model.startingPrice || 800000)}</span>
                </div>
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

      {filteredModels.length === 0 && (
        <div className="p-4 text-center text-xs text-slate-500 bg-[#090B0D] rounded-2xl border border-white/5">
          {models.length === 0
            ? 'Please select a manufacturer first.'
            : `No models match "${searchQuery}".`}
        </div>
      )}
    </div>
  );
};
