import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, RefreshCw, ShieldCheck, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../lib/currency';

export const VehicleImagePreview = ({
  brandName,
  modelName,
  modelYear,
  powertrain,
  variantName,
  colourName,
  colourHex,
  secondaryHex,
  isDualTone = false,
  imageUrl,
  isVerified = true,
  startingPrice,
  bodyType,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setImageError(false);
    setTimeout(() => setIsRetrying(false), 400);
  };

  return (
    <div
      className={`bg-[#090B0D] rounded-3xl border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group ${className}`}
    >
      {/* Background ambient lighting glow (reflects real vehicle hue dynamically without applying CSS filters to the car) */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500"
        style={{
          background: isDualTone && secondaryHex
            ? `radial-gradient(circle, ${colourHex} 0%, ${secondaryHex} 100%)`
            : colourHex || '#ED1725',
        }}
      />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info Banner */}
      <div className="relative z-10 space-y-2 border-b border-white/5 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-heading font-bold uppercase tracking-wider">
            <span>{brandName || 'Automotive'}</span>
            <span>•</span>
            <span>{bodyType || 'SUV'}</span>
            {modelYear && (
              <>
                <span>•</span>
                <span className="text-white font-mono">{modelYear}</span>
              </>
            )}
            {powertrain && (
              <>
                <span>•</span>
                <span className={powertrain === 'ELECTRIC' ? 'text-cyan-400' : 'text-dd-red'}>
                  {powertrain}
                </span>
              </>
            )}
          </div>

          {/* Genuine Photography vs Representative Fallback Badge */}
          {isVerified ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-heading font-bold">
              <CheckCircle2 size={11} />
              <span>Verified Asset</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-heading font-bold">
              <Info size={11} />
              <span>Representative Preview</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-black text-white tracking-tight">
              {modelName ? `${brandName} ${modelName}` : 'Select a Vehicle Model'}
            </h3>
            <p className="text-xs text-dd-red font-heading font-bold mt-0.5">
              {variantName || 'Select Trim Variant'}
            </p>
          </div>

          {colourName && (
            <div className="flex items-center gap-2 bg-[#17191D] border border-white/10 px-3 py-1.5 rounded-2xl shadow-sm shrink-0">
              <div className="relative flex items-center">
                <span
                  className="w-3 h-3 rounded-full border border-white/30 inline-block shadow-sm"
                  style={{ backgroundColor: colourHex }}
                />
                {isDualTone && secondaryHex && (
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/40 -ml-1 inline-block shadow-sm"
                    style={{ backgroundColor: secondaryHex }}
                  />
                )}
              </div>
              <span className="text-[11px] font-heading font-bold text-white max-w-[120px] truncate">
                {colourName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Image Showcase Display - PURE UNALTERED ASSET: NO CSS COLOR OVERLAYS */}
      <div className="relative my-4 h-52 sm:h-64 rounded-2xl bg-[#111315]/90 border border-white/5 overflow-hidden flex items-center justify-center p-4">
        {/* Dynamic Studio Under-Chassis Showroom Floor Glow */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-xl opacity-40 transition-all duration-500 pointer-events-none"
          style={{
            background: isDualTone && secondaryHex
              ? `linear-gradient(90deg, ${colourHex} 0%, ${secondaryHex} 100%)`
              : colourHex || '#ED1725',
          }}
        />
        {imageError ? (
          <div className="text-center p-6 space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-white">Visual Preview Unavailable</p>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">
                Asset could not be loaded for {colourName || modelName}.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-heading font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>Retry Load</span>
            </button>
          </div>
        ) : imageUrl ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={imageUrl + (colourName || '')}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <img
                src={imageUrl}
                alt={`${brandName} ${modelName} in ${colourName || 'Default Exterior'}`}
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl select-none"
                onError={() => setImageError(true)}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center p-4 text-xs text-slate-500">
            Configure vehicle parameters to render live preview.
          </div>
        )}

        {/* Honest Fallback Banner when image is representative */}
        {!isVerified && colourName && !imageError && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#090B0D]/90 backdrop-blur-md border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-[10px] text-amber-300 flex items-center gap-1.5 z-20">
            <AlertCircle size={12} className="shrink-0 text-amber-400" />
            <span className="truncate">
              Representative Model Preview — Exact colour image for <strong className="text-white">{colourName}</strong> is pending verification.
            </span>
          </div>
        )}
      </div>

      {/* Footer Metrics & Benchmarks */}
      <div className="relative z-10 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Ex-Showroom Benchmark
          </span>
          <span className="font-mono font-bold text-white text-sm">
            {formatINR(startingPrice || 800000)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-dd-red" />
          <span>OEM Verified Data</span>
        </div>
      </div>
    </div>
  );
};
