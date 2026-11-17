import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

export const VehicleColourSelector = ({
  colours = [],
  selectedColourId,
  onSelectColour,
  className = '',
}) => {
  const selectedColour = colours.find((c) => c.id === selectedColourId);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-dd-red" />
          <span>8. Official Exterior Colour</span> <span className="text-dd-red">*</span>
        </label>
        {selectedColour && (
          <span className="text-xs font-heading font-bold text-white flex items-center gap-2">
            <span className="relative inline-flex items-center">
              <span
                className="w-3 h-3 rounded-full border border-white/20 inline-block shadow-sm"
                style={{ backgroundColor: selectedColour.hex }}
              />
              {selectedColour.isDualTone && selectedColour.secondaryHex && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40 -ml-1 inline-block shadow-sm"
                  style={{ backgroundColor: selectedColour.secondaryHex }}
                  title="Dual-Tone Accent"
                />
              )}
            </span>
            <span className="truncate max-w-[200px]">{selectedColour.name}</span>
            {selectedColour.isDualTone && (
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-dd-red/10 text-dd-red border border-dd-red/20 font-mono">
                Dual Tone
              </span>
            )}
          </span>
        )}
      </div>

      {colours.length === 0 ? (
        <div className="p-3 text-center text-xs text-slate-500 bg-[#090B0D] rounded-xl border border-white/5">
          No official colour specifications available for this trim.
        </div>
      ) : (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 pr-1 custom-scrollbar scroll-smooth">
          {colours.map((colour) => {
            const isSelected = selectedColourId === colour.id;
            return (
              <button
                type="button"
                key={colour.id}
                onClick={() => onSelectColour(colour.id)}
                title={`${colour.name}${colour.isDualTone ? ' (Dual Tone)' : ''} - Click to preview`}
                aria-label={`Select ${colour.name}`}
                className={`flex-shrink-0 group relative p-1 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-dd-red ring-offset-2 ring-offset-[#17191D] scale-110'
                    : 'hover:scale-105'
                }`}
              >
                {/* Circular Swatch (Handles Single and Dual Tone) */}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full relative overflow-hidden border shadow-md flex items-center justify-center transition-transform"
                  style={{
                    backgroundColor: colour.hex,
                    borderColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Diagonal split or top badge for Dual-Tone */}
                  {colour.isDualTone && colour.secondaryHex && (
                    <div
                      className="absolute top-0 right-0 w-full h-1/2 -rotate-45 translate-x-2 -translate-y-1 shadow-sm border-b border-black/20"
                      style={{ backgroundColor: colour.secondaryHex }}
                    />
                  )}

                  {isSelected && (
                    <span className="relative z-10 text-white drop-shadow-md">
                      <Check
                        className="w-4 h-4 stroke-[3]"
                        style={{
                          color:
                            colour.hex.toLowerCase() === '#ffffff' ||
                            colour.hex.toLowerCase() === '#f8f9fa' ||
                            colour.hex.toLowerCase() === '#f8fafc'
                              ? '#090B0D'
                              : '#FFFFFF',
                        }}
                      />
                    </span>
                  )}
                </div>

                {/* Subtitle name preview on hover */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#090B0D] text-[10px] text-white rounded-md border border-white/10 whitespace-nowrap z-30 pointer-events-none shadow-lg">
                  {colour.name}
                  {colour.isDualTone && ' (Dual Tone)'}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
