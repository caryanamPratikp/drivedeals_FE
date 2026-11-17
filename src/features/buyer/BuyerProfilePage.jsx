import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Phone, MapPin, Mail, ShieldCheck, User } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const BuyerProfilePage = () => {
  const { currentUser } = useAppStore();
  const initial = (currentUser?.name || 'User').charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-8 select-none">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 text-[#ED1725] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ED1725]/30">
          Buyer Profile
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Account & Contact Credentials
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Verified mobile identity and privacy-shielded credentials for collective vehicle purchasing.
        </p>
      </div>

      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#090B0D] border border-white/10 text-white font-heading font-black text-2xl flex items-center justify-center shadow-inner">
            <span className="text-[#ED1725]">{initial}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-heading font-black text-white">{currentUser?.name || 'Verified Buyer'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Operating Hub: {currentUser?.city || 'Pune Regional Hub, Maharashtra'}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090B0D] border border-white/10">
            <div className="flex items-center gap-2.5 text-[#A1A1AA]">
              <Phone className="w-4 h-4 text-[#ED1725]" />
              <span className="font-medium">Verified Mobile:</span>
            </div>
            <span className="font-mono font-bold text-white">{currentUser?.phone || '-'}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090B0D] border border-white/10">
            <div className="flex items-center gap-2.5 text-[#A1A1AA]">
              <Mail className="w-4 h-4 text-[#ED1725]" />
              <span className="font-medium">Email Address:</span>
            </div>
            <span className="font-bold text-white">{currentUser?.email || 'Not provided'}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090B0D] border border-white/10">
            <div className="flex items-center gap-2.5 text-[#A1A1AA]">
              <MapPin className="w-4 h-4 text-[#ED1725]" />
              <span className="font-medium">Operating Hub:</span>
            </div>
            <span className="font-bold text-white">{currentUser?.city || 'Pune Hub'}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090B0D] border border-white/10">
            <div className="flex items-center gap-2.5 text-[#A1A1AA]">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span className="font-medium">DPDP Consent Security:</span>
            </div>
            <span className="font-bold text-[#22C55E]">Active Shield (Zero Contact Broadcast)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
