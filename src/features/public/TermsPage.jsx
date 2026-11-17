import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] to-[#111315] border border-white/10 p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ED1725]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
            <Scale size={14} className="text-[#ED1725]" />
            <span>Platform Governance & Terms of Use</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
            Terms of Participation
          </h1>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
            Governing rules and operational protocols for buyers, authorized OEM franchise dealerships, and collective demand groups on DriveDeals.
          </p>
          <div className="pt-2 text-xs font-mono text-[#71717A]">
            Effective Date: November 2026 • Jurisdiction: Mumbai & Pune, Maharashtra
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl space-y-8 text-sm leading-relaxed text-[#A1A1AA]">
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-white">
            <FileText size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">1. Platform Nature & Scope</h2>
          </div>
          <p>
            DriveDeals operates solely as an independent automotive demand coordination, reverse-discovery, and quotation auditing technology platform developed by Pratik Shirish Patil.
          </p>
          <p>
            DriveDeals is <strong className="text-white">not</strong> an automobile dealership, OEM motor manufacturer, insurance agent, or direct banking institution. DriveDeals never takes physical possession of vehicles, does not collect purchase monies or token advance booking amounts on behalf of dealers, and does not charge retail buyers subscription or commission fees.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <Scale size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">2. Dealership Quotations & Price Formulas</h2>
          </div>
          <p>
            All quotations submitted by participating dealerships represent structured, binding commercial bids based on standardized price calculation formulas:
          </p>
          <div className="bg-[#090B0D] rounded-2xl border border-white/10 p-5 space-y-2 text-xs font-mono text-[#A1A1AA]">
            <div className="text-white font-bold mb-1">Standardized Quotation Composition:</div>
            <div>[+] Ex-Showroom Vehicle Price (OEM Benchmark)</div>
            <div>[+] State Registration & Regional Transport Office (RTO) Fee</div>
            <div>[+] Standard Zero-Depreciation Comprehensive Motor Insurance</div>
            <div>[+] Optional Accessories Kit & Fastag (Audited Line-Items)</div>
            <div className="text-[#22C55E] font-bold">[-] Direct Collective Group Concession / Discount</div>
            <div className="pt-2 border-t border-white/10 text-white font-bold font-sans">
              = Total Itemized On-Road Purchase Price
            </div>
          </div>
          <p>
            Participating dealers guarantee quotation validity across the stated validity window and allocation timeframe.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <CheckCircle2 size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">3. Complete Buyer Autonomy</h2>
          </div>
          <p>
            Joining a buyer collective or comparing dealer quotations creates <strong className="text-white">no legal or financial obligation</strong> to execute a transaction. Individual buyers retain complete freedom to accept or decline any submitted quotation without penalty.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <AlertTriangle size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">4. Dealer Code of Conduct & Dispute Escalation</h2>
          </div>
          <p>
            All registered dealerships must hold an active OEM franchise agreement, valid GSTIN, and agree to our Fair Dealing Covenant. Any dealer found submitting fraudulent quotations, altering agreed terms upon showroom arrival, or unsolicited harassment will face immediate suspension and referral to our Admin Moderation Board.
          </p>
        </section>

        {/* Bottom banner */}
        <div className="rounded-2xl bg-[#090B0D] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-heading font-bold text-white">Have questions regarding our terms?</div>
            <div className="text-xs text-[#71717A] mt-0.5">Reach out to legal@drivedeals.in</div>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ED1725] hover:underline"
          >
            <span>Explore Live Catalogue</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
