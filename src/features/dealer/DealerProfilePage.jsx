import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Building2, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DealerProfilePage = () => {
  const { currentUser, dealers = [], updateDealerBrand } = useAppStore();
  const myDealerId = currentUser?.dealerId;
  const dealer = dealers.find((d) => d.id === myDealerId) || dealers[0] || {
    businessName: currentUser?.dealershipName || 'Authorized OEM Dealership',
    legalEntityName: currentUser?.dealershipName || 'Dealership Franchise Partner',
    brand: currentUser?.brand || 'Mahindra',
    city: currentUser?.city || 'Pune',
    address: currentUser?.address || 'Official Dealership Showroom, Pune, Maharashtra'
  };

  const activeBrand = currentUser?.brand || dealer.brand || 'Mahindra';
  const availableBrands = ['Mahindra', 'Kia', 'Tata Motors', 'Hyundai', 'Maruti Suzuki', 'Toyota', 'ALL'];

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 text-[#ED1725] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ED1725]/30">
          <Sparkles size={13} />
          <span>Authorized Dealership Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Dealership Credentials & Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Verified franchise credentials and authorized automotive brand affiliations.
        </p>
      </div>

      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#090B0D] border border-white/10 text-white font-black text-xl flex items-center justify-center shadow-inner">
              <Building2 className="w-8 h-8 text-[#ED1725]" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-black text-white">
                {dealer.businessName || dealer.dealershipName}
              </h2>
              <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">
                {dealer.legalEntityName || 'Authorized OEM Franchise Partner'}
              </p>
            </div>
          </div>

          <StatusBadge status={dealer.verificationStatus || dealer.status || 'VERIFIED'} />
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#71717A] font-bold block uppercase text-[10px]">Showroom Address:</span>
              <p className="font-bold text-white leading-relaxed">{dealer.address || dealer.city || 'Regional Showroom, Pune'}</p>
            </div>

            <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#71717A] font-bold block uppercase text-[10px]">Operating Hub:</span>
              <p className="font-bold text-white">Pune Regional Hub (MH-12 & MH-14), Maharashtra</p>
            </div>
          </div>

          <div className="p-5 bg-[#090B0D] rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#71717A] font-bold block uppercase text-[10px]">
                Authorized Brand Franchises (Click to Set Active):
              </span>
              <span className="text-xs text-[#22C55E] font-bold">
                Active: {activeBrand === 'ALL' ? 'Multi-Brand (All)' : activeBrand}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map((brand) => {
                const isActive = activeBrand.toLowerCase() === brand.toLowerCase();
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => updateDealerBrand(brand)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#ED1725] border-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30 scale-105'
                        : 'bg-[#17191D] border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20'
                    }`}
                  >
                    {brand === 'ALL' ? 'Multi-Brand (All)' : brand}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#71717A]">
              Select the franchise authority you are officially quoting on behalf of.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-[#71717A] font-bold">Commercial Manager:</span>
              <span className="font-bold text-white">
                {dealer.displayContactName || dealer.contactPerson || currentUser?.name || 'Authorized Lead'}
              </span>
            </div>
            <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-[#71717A] font-bold">Official Hotline:</span>
              <span className="font-mono font-bold text-white">
                {dealer.phone || currentUser?.phone || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
