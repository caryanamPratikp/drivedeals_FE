import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  ShieldCheck,
  Tag,
  Car
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const BuyerDashboard = () => {
  const {
    currentUser,
    groups = [],
    memberships = [],
    quotations = [],
    quotationVersions = [],
    leads = [],
    variants = [],
    cars = [],
    dealers = [],
    fetchGroups,
    fetchCars,
    fetchConsents
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    if (cars.length === 0) fetchCars();
    fetchConsents();
  }, [fetchGroups, fetchCars, fetchConsents, cars.length]);

  // Model-accurate photography
  const getCarImage = (car) => {
    if (!car) return '/cars/hyundai_creta.webp';
    const name = (car.modelName || car.model || '').toLowerCase();
    if (name.includes('nexon')) return '/cars/tata_nexon.webp';
    if (name.includes('creta')) return '/cars/hyundai_creta.webp';
    if (name.includes('xuv700')) return '/cars/mahindra_xuv700.webp';
    if (name.includes('seltos')) return '/cars/seltos.webp';
    if (name.includes('grand vitara') || name.includes('vitara')) return '/cars/grand_vitara.webp';
    if (name.includes('elevate')) return '/cars/elevate.webp';
    return car.imageUrl || '/cars/hyundai_creta.webp';
  };

  // Active group memberships
  const myMemberships = useMemo(
    () => (memberships || []).filter((m) => m.buyerId === currentUser?.id && m.status === 'ACTIVE'),
    [memberships, currentUser?.id]
  );
  const myGroupIds = useMemo(
    () => myMemberships.map((m) => m.groupId),
    [myMemberships]
  );
  const myGroups = useMemo(
    () => (groups || []).filter((g) => g.isCurrentUserMember || myGroupIds.includes(g.id) || (g.memberIds && g.memberIds.includes(currentUser?.id))),
    [groups, myGroupIds, currentUser?.id]
  );

  // Available offers in groups
  const myGroupQuotations = useMemo(
    () => (quotations || []).filter((q) => myGroupIds.includes(q.groupId)),
    [quotations, myGroupIds]
  );
  const availableOffers = useMemo(
    () => (quotationVersions || []).filter((qv) => myGroupQuotations.some((q) => q.id === qv.quotationId) && qv.status === 'PUBLISHED'),
    [quotationVersions, myGroupQuotations]
  );

  // Leads
  const myLeads = useMemo(
    () => (leads || []).filter((l) => l.buyerId === currentUser?.id),
    [leads, currentUser?.id]
  );

  return (
    <div className="space-y-8 select-none">
      {/* 1. Executive Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] via-[#111315] to-[#090B0D] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#ED1725]" />
              <span>Buyer Hub • {currentUser?.city || 'Pune'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white">
              Welcome back, {(currentUser?.name || 'Buyer').split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl font-normal leading-relaxed">
              Buy together, save together. Join car groups to unlock dealer volume discounts, compare transparent on-road quotes, and test drive with zero spam calls.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/buyer/cars">
              <PrimaryButton size="md" className="font-bold px-6 py-3">
                <Car size={16} />
                <span>Explore Cars</span>
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive How It Works 3-Step Banner */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ED1725]">Simple & Transparent</span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs font-medium text-white">How Group Buying Works</span>
          </div>
          <span className="text-[11px] bg-emerald-500/15 text-[#22C55E] px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold hidden sm:inline">
            100% Free • No Obligation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#090B0D] p-4 rounded-2xl border border-white/10 space-y-2 hover:border-[#ED1725]/40 transition-all">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ED1725] text-white text-xs font-black flex items-center justify-center">1</span>
              <h4 className="font-bold text-white text-sm">Join a Car Group</h4>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Pick your dream car and team up with other buyers in your city. Joining is completely free with zero deposit.
            </p>
          </div>

          <div className="bg-[#090B0D] p-4 rounded-2xl border border-white/10 space-y-2 hover:border-[#ED1725]/40 transition-all">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ED1725] text-white text-xs font-black flex items-center justify-center">2</span>
              <h4 className="font-bold text-white text-sm">Dealers Offer Group Discounts</h4>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Authorized local showrooms compete by submitting discount quotes with clear on-road price breakdowns.
            </p>
          </div>

          <div className="bg-[#090B0D] p-4 rounded-2xl border border-white/10 space-y-2 hover:border-[#ED1725]/40 transition-all">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#22C55E] text-black text-xs font-black flex items-center justify-center">3</span>
              <h4 className="font-bold text-white text-sm">Choose Best Deal & Test Drive</h4>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Pick the offer you like. Only the winning dealer gets your number to arrange your test drive. Zero spam guaranteed!
            </p>
          </div>
        </div>
      </div>

      {/* 3. Key Performance Indicators (StatCards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Car Groups"
          value={myGroups.length}
          subtext="Groups you joined"
          concept="buyerGroup"
          icon={<Users className="w-5 h-5 text-[#ED1725]" />}
          onClick={() => navigate('/buyer/groups')}
        />
        <StatCard
          label="Showroom Offers"
          value={availableOffers.length}
          subtext="Quotes ready to view"
          concept="dealerQuotation"
          icon={<FileSpreadsheet className="w-5 h-5 text-blue-400" />}
          onClick={() => navigate('/buyer/offers')}
        />
        <StatCard
          label="Test Drives & Visits"
          value={myLeads.filter((l) => l.status !== 'LOST' && l.status !== 'PURCHASED').length}
          subtext="Showrooms connected"
          concept="leadStatus"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          onClick={() => navigate('/buyer/leads')}
        />
        <StatCard
          label="Cars Delivered"
          value={myLeads.filter((l) => l.status === 'PURCHASED').length}
          subtext="Completed deliveries"
          icon={<Clock className="w-5 h-5 text-[#71717A]" />}
        />
      </div>

      {/* 4. Main Dashboard Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Groups & Quotations Review */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Groups Section */}
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-heading font-black text-white tracking-tight">
                  Your Car Groups
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Car groups you are in. When more buyers join, showrooms give bigger discounts!
                </p>
              </div>
              <Link to="/buyer/groups">
                <SecondaryButton size="sm">
                  <span>View All</span>
                  <ArrowRight size={13} />
                </SecondaryButton>
              </Link>
            </div>

            {myGroups.length === 0 ? (
              <EmptyState
                icon={Users}
                title="You Haven't Joined a Car Group Yet"
                description="Explore cars and join an active group in your city to unlock special group discount pricing."
                actionText="Explore Cars"
                onAction={() => navigate('/buyer/cars')}
              />
            ) : (
              <div className="space-y-4">
                {myGroups.map((group) => {
                  const variant = group.variant || variants.find((v) => v.id === group.variantId);
                  const car = group.car || cars.find((c) => c.id === variant?.carId || c.id === group.carId);
                  const groupOffers = availableOffers.filter((o) => {
                    const quote = quotations.find((q) => q.id === o.quotationId);
                    return quote?.groupId === group.id;
                  });

                  return (
                    <motion.div
                      key={group.id}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl border border-white/10 hover:border-white/20 bg-[#090B0D] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getCarImage(car)}
                          alt={car?.modelName || 'Vehicle'}
                          className="w-20 h-14 object-cover rounded-xl border border-white/10 shrink-0 hidden sm:block"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={group.stage || group.status} showInfo={false} />
                            <span className="text-[11px] text-[#71717A] font-mono">
                              #{group.id.slice(-6)}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-base text-white">
                            {car?.brand || 'Vehicle'} {car?.modelName || car?.model || 'Car'}
                          </h4>
                          <div className="text-xs text-[#ED1725] font-semibold">{variant?.name || 'Trim'}</div>
                          <div className="text-[11px] text-[#A1A1AA] flex items-center gap-2.5 pt-1">
                            <span>{group.currentMembers || group.memberIds?.length || 1} Members</span>
                            <span>•</span>
                            <span className="text-white font-bold">{groupOffers.length} Showroom Offers</span>
                            <span>•</span>
                            <span>Goal: {group.targetMembers || 15} cars</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link to={`/buyer/groups/${group.id}`} className="w-full sm:w-auto">
                          <PrimaryButton size="sm" className="w-full sm:w-auto font-bold justify-center">
                            Open Group
                          </PrimaryButton>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quotations Awaiting Review */}
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-heading font-black text-white tracking-tight">
                  Showroom Offers for You
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Discounted on-road price quotes submitted by authorized dealers in your city.
                </p>
              </div>
              <Link to="/buyer/offers">
                <SecondaryButton size="sm">
                  <span>Compare All Offers</span>
                  <ArrowRight size={13} />
                </SecondaryButton>
              </Link>
            </div>

            {availableOffers.length === 0 ? (
              <EmptyState
                icon={FileSpreadsheet}
                title="Waiting for Showroom Offers"
                description="Verified dealers in your city are preparing prices for your groups. Quotes will appear here automatically."
              />
            ) : (
              <div className="space-y-4">
                {availableOffers.slice(0, 3).map((offer) => {
                  const quote = quotations.find((q) => q.id === offer.quotationId);
                  const dealer = dealers.find((d) => d.id === offer.createdByDealerId);
                  const variant = variants.find((v) => v.id === quote?.variantId);
                  const car = cars.find((c) => c.id === variant?.carId);

                  return (
                    <motion.div
                      key={offer.id}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090B0D]"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#ED1725]" />
                            {dealer?.businessName || dealer?.dealershipName || 'Authorized Showroom'}
                          </span>
                          <span className="text-[10px] bg-[#17191D] text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">
                            v{offer.versionNumber}
                          </span>
                        </div>
                        <div className="text-sm font-heading font-bold text-white">
                          {car?.brand} {car?.modelName} — {variant?.name}
                        </div>
                        <div className="text-xs text-[#A1A1AA] flex items-center gap-3 pt-0.5">
                          <span className="text-[#22C55E] font-bold">
                            Group Discount: −{formatINR(offer.discountAmount)}
                          </span>
                          <span>•</span>
                          <span>Delivery: {offer.deliveryMinDays}–{offer.deliveryMaxDays} days</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                        <div className="text-lg sm:text-xl font-heading font-black text-[#22C55E]">
                          {formatINR(offer.calculatedOnRoadPrice)}
                        </div>
                        <Link to={`/buyer/offers/${offer.quotationId}`} className="w-full sm:w-auto">
                          <PrimaryButton size="sm" className="w-full sm:w-auto font-bold justify-center">
                            View Full Price Breakdown
                          </PrimaryButton>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Dealership Follow-ups & Privacy Shield */}
        <div className="space-y-6">
          {/* Active Connections Panel */}
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-heading font-black text-white tracking-tight">
                Test Drives & Showroom Visits
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Showrooms you gave permission to call you for test drives and bookings.
              </p>
            </div>

            {myLeads.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No Active Showroom Visits"
                description="Once you compare offers and pick a deal, your showroom appointments appear here."
              />
            ) : (
              <div className="space-y-3">
                {myLeads.map((lead) => {
                  const dealer = dealers.find((d) => d.id === lead.dealerId);
                  const group = groups.find((g) => g.id === lead.groupId);
                  const variant = variants.find((v) => v.id === group?.variantId);
                  const car = cars.find((c) => c.id === variant?.carId);

                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl border border-white/10 bg-[#090B0D] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {dealer?.businessName || dealer?.dealershipName || 'Franchise Showroom'}
                        </span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <div className="text-xs text-[#A1A1AA]">
                        {car?.brand} {car?.modelName} ({variant?.name})
                      </div>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-[#71717A] text-[11px] font-mono">
                          #{lead.id.slice(-6)}
                        </span>
                        <Link
                          to={`/buyer/leads/${lead.id}`}
                          className="font-bold text-[#ED1725] hover:underline"
                        >
                          Track Status →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy & Anti-Spam Card */}
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <ShieldCheck size={18} className="text-[#22C55E]" />
              <h3 className="text-sm font-heading font-black">100% Spam-Free Guarantee</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Your mobile number is completely hidden. Showrooms cannot call you until you accept their price quote. You can cancel permission anytime with one click.
            </p>
            <div className="pt-1">
              <Link to="/buyer/consents" className="text-xs font-bold text-[#ED1725] hover:underline flex items-center gap-1">
                <span>View Privacy & Sharing Settings</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
