import React from 'react';
import { Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import authBgImage from '../../assets/images/auth/drivedeals-auth-bg.webp';

export const AuthVisualPanel = () => {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 overflow-hidden min-h-[560px] lg:min-h-full">
      {/* Background Automotive Art with Dark Night City Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Real Automotive Scene Image */}
        <img
          src={authBgImage}
          alt="DriveDeals Premium Automotive Collective"
          className="w-full h-full object-cover object-bottom sm:object-[center_75%] opacity-60 filter brightness-90 contrast-110"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D] via-[#090B0D]/75 to-[#090B0D]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090B0D] via-[#090B0D]/60 to-transparent" />

        {/* Dynamic Red Speed Accent Slashes (Matching Reference Image) */}
        {/* Bottom-Left Red Slashes */}
        <svg
          className="absolute -bottom-10 -left-10 w-64 h-64 text-[#ED1725] opacity-80"
          viewBox="0 0 200 200"
          fill="none"
        >
          <line x1="-20" y1="220" x2="160" y2="40" stroke="#ED1725" strokeWidth="8" strokeLinecap="round" />
          <line x1="10" y1="230" x2="190" y2="50" stroke="#ED1725" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          <line x1="40" y1="240" x2="220" y2="60" stroke="#ED1725" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>

        {/* Top-Right Ambient Red Accent Glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#ED1725]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Foreground Content Section */}
      <div className="relative z-10 max-w-xl space-y-6">
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

        {/* 3 Value Propositions Row */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl">
          {/* Proposition 1 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Zero Haggling</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Get the best price together</p>
            </div>
          </div>

          {/* Proposition 2 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Users size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Direct Group Pricing</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Verified dealers, better deals</p>
            </div>
          </div>

          {/* Proposition 3 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#121417]/80 border border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 text-[#ED1725] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">DPDP 2023 Compliant</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-snug mt-0.5">Your privacy, our priority.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Watermark */}
      <div className="relative z-10 pt-8 sm:pt-12 text-[11px] font-bold tracking-widest text-[#71717A] uppercase flex items-center gap-2">
        <span>BUY SMARTER. TOGETHER.</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#ED1725]" />
        <span className="text-[#A1A1AA]">INDIA&apos;S AUTOMOTIVE COLLECTIVE</span>
      </div>
    </div>
  );
};
export default AuthVisualPanel;
