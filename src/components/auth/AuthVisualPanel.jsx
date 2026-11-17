import React from 'react';
import { Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuthVisualPanel = () => {
  return (
    <div className="relative z-10 max-w-xl space-y-6 text-left py-4 sm:py-6">
      {/* Platform Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-xs font-bold text-white shadow-sm backdrop-blur-md">
        <div className="w-5 h-5 rounded-full bg-[#ED1725] flex items-center justify-center text-white">
          <Users size={12} />
        </div>
        <span>India&apos;s Group Car Buying Platform</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-1">
        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
          Buy Together.
        </h1>
        <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#ED1725] tracking-tight leading-[1.08]">
          Save Big on Road.
        </h2>
      </div>

      {/* Supporting Description */}
      <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-lg font-medium">
        Join verified buyers in your city to unlock transparent group pricing and 100% spam-free protection.
      </p>

      {/* 3 Value Propositions */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Zero Haggling</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Get the best price together</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Direct Group Pricing</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Verified dealers, better deals</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">DPDP 2023 Compliant</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Your privacy, our priority.</p>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Tagline */}
      <div className="pt-4 text-[11px] font-bold tracking-widest text-[#71717A] uppercase flex items-center gap-2">
        <span className="w-6 h-[1px] bg-[#ED1725]" />
        <span>Buy Smarter. Together.</span>
      </div>
    </div>
  );
};
export default AuthVisualPanel;
