import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, UserCheck, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] to-[#111315] border border-white/10 p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ED1725]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
            <ShieldCheck size={14} className="text-[#ED1725]" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
            Privacy Policy & Consent Framework
          </h1>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
            DriveDeals operates under a strict Zero-Spam, Explicit-Consent-Only architecture. Your personal contact details are completely shielded until you explicitly choose a winning quotation.
          </p>
          <div className="pt-2 text-xs font-mono text-[#71717A]">
            Specification Version: DPDP-2023-v2.1 • Jurisdiction: Maharashtra, India
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl space-y-8 text-sm leading-relaxed text-[#A1A1AA]">
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-white">
            <EyeOff size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">1. The Zero-Spam Shield Guarantee</h2>
          </div>
          <p>
            Unlike traditional lead-generation portals that sell or broadcast your phone number to dozens of dealerships the moment you register, DriveDeals keeps your identity <strong className="text-white">100% anonymous</strong> during group formation and dealer bidding.
          </p>
          <p>
            Participating OEM franchise dealerships only see aggregate demand telemetry (e.g. <em>"5 buyers in Pune West seeking Creta SX(O) Petrol IVT within 30 days"</em>). They have zero access to your name, mobile number, or email.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <UserCheck size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">2. Explicit Data Disclosure Gate</h2>
          </div>
          <p>
            Your personal information is only transmitted when you click <strong>"Accept Offer & Consent"</strong> on a specific dealership quotation. Before any transmission occurs, you are presented with a detailed disclosure modal detailing:
          </p>
          <div className="bg-[#090B0D] rounded-2xl border border-white/10 p-5 space-y-2 text-xs">
            <div className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              Transmitted Contact Payload:
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[#A1A1AA]">
              <li><strong className="text-white">Full Name</strong> (as registered on DriveDeals)</li>
              <li><strong className="text-white">Verified Mobile Number</strong> (+91 OTP verified)</li>
              <li><strong className="text-white">Vehicle Trim & Fuel Configuration</strong></li>
              <li><strong className="text-white">Agreed Itemized Quotation Reference</strong> (locked on-road price)</li>
              <li><strong className="text-white">Delivery City Hub</strong> (e.g. Pune / Mumbai)</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <Lock size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">3. Right to Withdraw & Revoke Consent</h2>
          </div>
          <p>
            Under the provisions of the Digital Personal Data Protection Act, 2023, you hold the unconditional right to withdraw contact sharing consent at any time via your <Link to="/buyer/consents" className="text-[#ED1725] underline font-bold hover:text-red-400">Buyer Consent History</Link> dashboard.
          </p>
          <p>
            Upon revocation, the dealership's portal access to your contact record is immediately suspended and the transaction is recorded in our tamper-evident audit ledger.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-white">
            <FileText size={18} className="text-[#ED1725]" />
            <h2 className="text-lg font-heading font-black">4. Data Retention & Cryptographic Security</h2>
          </div>
          <p>
            All buyer sessions and transmission payloads are secured using industry-standard TLS 1.3 encryption in transit and AES-256 encryption at rest. Authentication tokens are digitally signed with cryptographic expiration limits.
          </p>
        </section>

        {/* Contact info box */}
        <div className="rounded-2xl bg-[#090B0D] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-heading font-bold text-white">Questions about our privacy protocol?</div>
            <div className="text-xs text-[#71717A] mt-0.5">Contact our Data Grievance Officer at privacy@drivedeals.in</div>
          </div>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ED1725] hover:underline"
          >
            <span>Learn How It Works</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
