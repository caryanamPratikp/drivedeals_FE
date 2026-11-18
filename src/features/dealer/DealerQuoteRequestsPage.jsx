import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ArrowRight, Clock, Users, MapPin, Inbox, FileSpreadsheet, Sparkles } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/Buttons';

export const DealerQuoteRequestsPage = () => {
  const {
    quoteRequests = [],
    groups = [],
    variants = [],
    cars = [],
    quotations = [],
    currentUser,
    dealers = [],
    fetchGroups,
    fetchCars,
  } = useAppStore();

  useEffect(() => {
    fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [fetchGroups, fetchCars, cars.length]);

  const myDealerId = currentUser?.dealerId;
  const dealer = dealers.find((d) => d.id === myDealerId) || {
    businessName: currentUser?.dealershipName || 'Your Dealership',
    brand: currentUser?.brand || 'Mahindra',
  };

  const dealerBrand = (currentUser?.brand || dealer?.brand || dealer?.brandAuthorized || 'Mahindra').trim();
  const isAllBrandDealer =
    dealerBrand.toUpperCase() === 'ALL' ||
    dealerBrand.toUpperCase() === 'MULTI-BRAND' ||
    dealerBrand.toUpperCase() === 'ALL BRANDS';

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Derive RFQ quotation opportunities from active buyer groups scoped strictly by dealer franchise brand
  const effectiveRequests = useMemo(() => {
    const explicit = quoteRequests.filter((r) => !myDealerId || r.dealerId === myDealerId);
    const existingGroupIds = new Set(explicit.map((r) => r.groupId));

    const derived = groups
      .filter((g) => !existingGroupIds.has(g.id))
      .filter((g) => {
        if (isAllBrandDealer) return true;
        const v = g?.variant || variants.find((varItem) => varItem.id === g?.variantId);
        const c = g?.car || cars.find((carItem) => carItem.id === v?.carId || carItem.id === g?.carId);
        const b = (c?.brand || '').toLowerCase();
        return b.includes(dealerBrand.toLowerCase()) || dealerBrand.toLowerCase().includes(b);
      })
      .map((g) => {
        const hasQuote = (quotations || []).some(
          (q) => q.groupId === g.id && (!myDealerId || q.dealerId === myDealerId || q.dealer?.id === myDealerId)
        );
        return {
          id: `rfq-${g.id}`,
          groupId: g.id,
          dealerId: myDealerId,
          status: hasQuote ? 'RESPONDED' : 'OPEN',
          createdAt: g.createdAt || new Date().toISOString(),
          city: g.city || 'Pune',
          currentMembers: g.currentMembers || g.memberIds?.length || 1,
        };
      });

    return [...explicit, ...derived].filter((r) => {
      if (isAllBrandDealer) return true;
      const g = groups.find((grp) => grp.id === r.groupId);
      const v = g?.variant || variants.find((varItem) => varItem.id === g?.variantId);
      const c = g?.car || cars.find((carItem) => carItem.id === v?.carId || carItem.id === g?.carId);
      const b = (c?.brand || '').toLowerCase();
      return b.includes(dealerBrand.toLowerCase()) || dealerBrand.toLowerCase().includes(b);
    });
  }, [quoteRequests, groups, quotations, myDealerId, isAllBrandDealer, dealerBrand, variants, cars]);

  const filteredRequests = effectiveRequests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (isAllBrandDealer && brandFilter !== 'ALL') {
      const g = groups.find((grp) => grp.id === r.groupId);
      const v = g?.variant || variants.find((varItem) => varItem.id === g?.variantId);
      const c = g?.car || cars.find((carItem) => carItem.id === v?.carId || carItem.id === g?.carId);
      const b = (c?.brand || '').toLowerCase();
      if (!b.includes(brandFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 text-[#ED1725] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ED1725]/30">
            <Sparkles size={13} />
            <span>Car Buying Groups</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Buyer Groups Waiting for Quotes
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Groups of verified buyers in your area looking for on-road price quotes from{' '}
            <strong className="text-white font-bold">
              {dealer?.businessName || dealer?.dealershipName || 'Your Dealership'}
            </strong>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAllBrandDealer ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Multi-Brand (All)
              </span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
              >
                <option value="ALL">All Brands</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Kia">Kia</option>
                <option value="Tata">Tata Motors</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Maruti">Maruti Suzuki</option>
                <option value="Toyota">Toyota</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ED1725]/15 text-[#ED1725] border border-[#ED1725]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ED1725]" />
                <span>Franchise: {dealerBrand} Groups Only</span>
              </span>
              <Link
                to="/dealer/profile"
                className="text-xs text-[#A1A1AA] hover:text-white underline underline-offset-2 font-medium"
                title="Switch authorized franchise brand"
              >
                Change Brand
              </Link>
            </div>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-xs font-bold rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
          >
            <option value="ALL">All Requests ({effectiveRequests.length})</option>
            <option value="OPEN">
              Awaiting Quote ({effectiveRequests.filter((r) => r.status === 'OPEN').length})
            </option>
            <option value="RESPONDED">
              Responded ({effectiveRequests.filter((r) => r.status === 'RESPONDED').length})
            </option>
          </select>
        </div>
      </div>

      {/* 2. RFQ Request Cards */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Quotation Requests Found"
          description="There are currently no buyer group quote requests matching your filter."
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const group = groups.find((g) => g.id === req.groupId);
            const variant =
              group?.variant || variants.find((v) => v.id === group?.variantId);
            const car =
              group?.car ||
              cars.find((c) => c.id === variant?.carId || c.id === group?.carId);

            return (
              <motion.div
                key={req.id}
                whileHover={{ y: -3 }}
                className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        req.status === 'OPEN'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {req.status === 'OPEN' ? 'Awaiting Quote' : 'Responded'}
                    </span>
                    <span className="text-xs text-[#71717A] font-mono">
                      Ref #{req.id.slice(-6)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      {car?.brand || 'Vehicle'} {car?.modelName || car?.model || 'Model'} —{' '}
                      {variant?.name || 'Standard Trim'}
                    </h3>
                    <div className="text-xs text-[#A1A1AA] flex items-center gap-3 mt-1 font-normal">
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <Users size={12} className="text-[#ED1725]" />
                        {group?.currentMembers || 1} Buyers in Collective
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#71717A]" />
                        {group?.city || 'Pune Hub'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={12} className="text-[#71717A]" />
                        Requested {formatDate(req.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to={`/dealer/quote-requests/${req.id}`}>
                  <PrimaryButton size="sm" className="font-bold">
                    <span>{req.status === 'OPEN' ? 'Submit Quotation' : 'Review Submitted Quote'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </PrimaryButton>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
