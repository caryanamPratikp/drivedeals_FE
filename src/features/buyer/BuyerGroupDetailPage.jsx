import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Building2,
  Check,
  Car,
  AlertCircle
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { SignInRequiredModal } from '../../components/common/SignInRequiredModal';

export const BuyerGroupDetailPage = () => {
  const { groupId } = useParams();
  const {
    groups = [],
    variants = [],
    cars = [],
    memberships = [],
    buyerSignals = [],
    quotations = [],
    quotationVersions = [],
    dealers = [],
    currentUser,
    joinGroup,
    leaveGroup,
    submitBuyerSignal,
    auditEvents = [],
    fetchGroupById,
    fetchQuotations,
    fetchCars,
    fetchGroups,
    groupsFetched,
    groupsLoading
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      fetchGroupById(groupId);
      fetchQuotations(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    if (cars.length === 0) fetchCars();
    if (groups.length === 0) fetchGroups();
  }, [cars.length, groups.length]);

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [signalFeedback, setSignalFeedback] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isAuthenticated = Boolean(
    currentUser?.id &&
    currentUser?.id !== 'guest' &&
    currentUser?.role &&
    currentUser?.role !== 'PUBLIC'
  );
  const group = (groups || []).filter(Boolean).find((g) => g?.id === groupId);
  const variant = group?.variant || (variants || []).filter(Boolean).find((v) => v?.id === group?.variantId) || { name: 'Standard Trim', keyFeatures: [] };
  const car = group?.car || (cars || []).filter(Boolean).find((c) => c?.id === variant?.carId || c?.id === group?.carId) || { brand: 'Vehicle', modelName: 'Model', model: 'Model' };

  // Safely parse key features
  const keyFeaturesList = Array.isArray(variant?.keyFeatures)
    ? variant.keyFeatures
    : (typeof variant?.keyFeatures === 'string'
        ? (() => { try { const p = JSON.parse(variant.keyFeatures); return Array.isArray(p) ? p : [variant.keyFeatures]; } catch(e) { return [variant.keyFeatures]; } })()
        : []);

  const myMembership = (memberships || []).filter(Boolean).find((m) => m?.groupId === groupId && (m.buyerId === currentUser?.id || m.buyerId === 'u-buyer-me') && m.status === 'ACTIVE');
  const isMember = Boolean(group?.isCurrentUserMember) || Boolean(myMembership) || (Array.isArray(group?.memberIds) && (group.memberIds.includes(currentUser?.id) || group.memberIds.includes('u-buyer-me')));

  // Existing signal for this buyer
  const mySignal = (buyerSignals || []).filter(Boolean).find((s) => s?.groupId === groupId && s.buyerId === currentUser?.id);

  // Signal form state
  const [targetPrice, setTargetPrice] = useState(mySignal?.targetPrice ? mySignal.targetPrice.toString() : '');
  const [timeline, setTimeline] = useState(mySignal?.purchaseTimeline || myMembership?.purchaseTimeline || 'WITHIN_30_DAYS');
  const [selectedPriorities, setSelectedPriorities] = useState(mySignal?.priorities || myMembership?.priorities || ['LOWEST_ON_ROAD']);
  const [deliveryPref, setDeliveryPref] = useState(mySignal?.deliveryPreference || '');
  const [colorPref, setColorPref] = useState(mySignal?.colorPreference || '');
  const [exchange, setExchange] = useState(mySignal?.exchangeRequired || false);
  const [note, setNote] = useState(mySignal?.note || '');

  if (!group) {
    if (groupsLoading || !groupsFetched) {
      return (
        <div className="text-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-[#ED1725] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <h2 className="text-xl font-heading font-black text-white">Loading Collective Details...</h2>
          <p className="text-sm text-[#A1A1AA]">Fetching the latest demand telemetry from the database.</p>
          <Link to="/buyer/groups">
            <PrimaryButton size="sm">Back to Collectives</PrimaryButton>
          </Link>
        </div>
      );
    }

    return (
      <div className="text-center py-20 space-y-5 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-[#ED1725]/10 border border-[#ED1725]/20 text-[#ED1725] flex items-center justify-center mx-auto mb-2">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white tracking-tight">Collective Not Found</h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 leading-relaxed">
            The vehicle collective with identifier <code className="text-xs text-[#ED1725] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{groupId}</code> is unavailable or has expired.
          </p>
        </div>
        <Link to="/buyer/groups" className="inline-block pt-2">
          <PrimaryButton size="md" className="font-heading font-bold shadow-lg shadow-dd-red/20 px-6">
            <span>Return to Buyer Collectives</span>
            <ArrowRight size={14} />
          </PrimaryButton>
        </Link>
      </div>
    );
  }

  // Quotations for this group
  const groupQuotes = (quotations || []).filter(Boolean).filter((q) => q?.groupId === group.id);
  const publishedOffers = (quotationVersions || []).filter(Boolean).filter((qv) => groupQuotes.some((q) => q?.id === qv?.quotationId) && qv?.status === 'PUBLISHED');

  // Group Signals
  const groupSignals = (buyerSignals || []).filter(Boolean).filter((s) => s?.groupId === group.id);
  const totalSignalsCount = groupSignals.length;
  const memberCount =
    group?.currentMembers ||
    (Array.isArray(group?.memberIds)
      ? group.memberIds.length
      : Array.isArray(group?.members)
      ? group.members.length
      : 1);

  const handleSignalSubmit = async (e) => {
    e.preventDefault();
    setSignalFeedback(null);
    const numericPrice = targetPrice ? parseInt(targetPrice, 10) : undefined;
    if (numericPrice && numericPrice <= 0) {
      setSignalFeedback('Target price must be greater than zero.');
      return;
    }
    const res = await submitBuyerSignal({
      groupId: group.id,
      buyerId: currentUser?.id || 'u-buyer-me',
      targetPrice: numericPrice,
      purchaseTimeline: timeline,
      priorities: selectedPriorities,
      deliveryPreference: deliveryPref || undefined,
      colorPreference: colorPref || undefined,
      exchangeRequired: exchange,
      note: note.trim() || undefined,
    });
    if (res && res.success) {
      setSignalFeedback('Your buying preferences were successfully updated.');
    } else {
      setSignalFeedback(res?.error || 'Failed to update preferences.');
    }
  };

  const [joinLoading, setJoinLoading] = useState(false);
  const handleJoinToggle = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      setJoinLoading(true);
      if (isMember) {
        const res = await leaveGroup(group.id, currentUser.id);
        if (!res.success) {
          alert(res.error || 'Failed to leave group.');
        }
      } else {
        const res = await joinGroup(group.id, currentUser.id, timeline, selectedPriorities);
        if (!res.success) {
          alert(res.error || 'Failed to join group.');
        }
      }
    } finally {
      setJoinLoading(false);
    }
  };

  const myActivity = (auditEvents || []).filter(Boolean).filter((a) => a?.entityId === group?.id);

  return (
    <div className="space-y-8 select-none">
      {/* 1. Main Group Header Card */}
      <div className="relative bg-gradient-to-r from-[#17191D] via-[#111315] to-[#090B0D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={group.stage || group.status} showInfo={false} />
              <span className="text-xs text-[#71717A] font-mono">
                Group Ref: #{group?.id ? String(group.id).slice(-6) : 'DEMAND'}
              </span>
              {isMember && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  <CheckCircle2 size={12} className="text-[#22C55E]" />
                  You are a Member
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                {car.brand || 'Vehicle'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
                {car.modelName || car.model || 'Model'} {variant.name ? `— ${variant.name}` : ''}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A1A1AA] pt-1">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Users size={14} className="text-[#ED1725]" />
                <span>{memberCount} {memberCount === 1 ? 'Buyer Joined' : 'Buyers Joined'}</span>
              </span>
              {group.joinDeadline && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#ED1725]" />
                  <span>Join Before: {formatDate(group.joinDeadline)}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#71717A]" />
                <span>{group.city || 'Pune'}</span>
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 shrink-0">
            {isMember ? (
              <SecondaryButton size="md" onClick={handleJoinToggle} disabled={joinLoading}>
                Leave Car Group
              </SecondaryButton>
            ) : (
              <PrimaryButton size="md" onClick={handleJoinToggle} disabled={joinLoading} className="font-bold px-6 shadow-lg shadow-dd-red/20">
                Join This Car Group (Free)
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px">
        {[
          { id: 'OVERVIEW', label: 'Car & Group Details' },
          { id: 'SIGNALS', label: 'My Buying Preferences', count: totalSignalsCount },
          { id: 'OFFERS', label: 'Showroom Offers', count: publishedOffers.length },
          { id: 'ACTIVITY', label: 'Group Activity' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'OFFERS' && !isAuthenticated) {
                  setAuthModalOpen(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`relative pb-3 px-4 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive ? 'text-white' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#ED1725] text-white'
                      : 'bg-[#17191D] text-[#A1A1AA]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="buyerGroupDetailActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ED1725]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="text-lg font-heading font-black text-white">About this Car & Group</h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                This group connects genuine car buyers in {group.city || 'Pune'} who want to buy the{' '}
                <strong className="text-white">{car.brand} {car.modelName || car.model} ({variant.name})</strong>. By buying together as a group, local showrooms offer special wholesale discounts with clear on-road price breakdowns.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[11px] font-semibold text-[#71717A] uppercase">Engine & Performance</span>
                  <div className="text-sm font-bold text-white">{variant.engineSpecs || 'Standard Manufacturer Spec'}</div>
                </div>
                <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[11px] font-semibold text-[#71717A] uppercase">Top Features</span>
                  <div className="text-xs font-medium text-white">{keyFeaturesList.slice(0, 3).join(', ') || 'Standard Equipment'}</div>
                </div>
              </div>
            </div>

            {/* Competing Offers Quick Peek */}
            <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-heading font-black text-base text-white">Showroom Offers</h3>
                  <p className="text-xs text-[#A1A1AA]">Price quotes submitted by verified dealers for this group.</p>
                </div>
                {publishedOffers.length > 1 && (
                  <Link to="/buyer/offers">
                    <SecondaryButton size="sm">
                      <span>Compare Prices</span>
                      <ArrowRight size={13} />
                    </SecondaryButton>
                  </Link>
                )}
              </div>

              {publishedOffers.length === 0 ? (
                <div className="p-8 text-center bg-[#090B0D] rounded-2xl border border-dashed border-white/10 text-xs text-[#A1A1AA]">
                  Showroom quote requests are open. Local dealers are preparing their bids!
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedOffers.map((offer) => {
                    const dealer = dealers.find((d) => d.id === offer.createdByDealerId);
                    return (
                      <div
                        key={offer.id}
                        className="p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090B0D]"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-[#ED1725]" />
                              {dealer?.businessName || dealer?.dealershipName || 'Authorized Showroom'}
                            </span>
                            <span className="text-[10px] bg-[#17191D] text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">
                              Offer v{offer.versionNumber}
                            </span>
                          </div>
                          <div className="text-xs text-[#A1A1AA] flex items-center gap-3">
                            <span className="text-[#22C55E] font-bold">
                              Group Discount: −{formatINR(offer.discountAmount)}
                            </span>
                            <span>•</span>
                            <span>Delivery: {offer.deliveryMinDays}–{offer.deliveryMaxDays} days</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <div className="text-lg font-heading font-black text-[#22C55E] tracking-tight">
                              {formatINR(offer.calculatedOnRoadPrice)}
                            </div>
                            <div className="text-[10px] text-[#71717A]">Final On-Road</div>
                          </div>

                          <Link to={`/buyer/offers/${offer.quotationId}`}>
                            <PrimaryButton size="sm" className="font-bold">
                              View Price Details
                            </PrimaryButton>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Timeline & Privacy */}
          <div className="space-y-6">
            <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-sm text-white">Group Milestones</h3>
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ED1725] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Group Started</div>
                    <div className="text-[#A1A1AA]">{formatDate(group.createdAt)}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ED1725] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Last Date to Join</div>
                    <div className="text-[#A1A1AA]">{formatDate(group.joinDeadline)}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Showroom Offers Open</div>
                    <div className="text-[#A1A1AA]">Dealers are bidding discount prices</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 space-y-2 text-xs shadow-xl">
              <div className="font-heading font-black flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>100% Privacy Guarantee</span>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed">
                Showrooms cannot see your name or mobile number while you are in this group. You can compare all prices privately, and only share your contact when you choose to connect.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Buyer Preferences */}
      {activeTab === 'SIGNALS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Signal Submission Form */}
          <div className="lg:col-span-2 bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-heading font-black text-white">What I'm Looking For</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Tell dealers what you want. Your name and phone number stay 100% hidden.
              </p>
            </div>

            {signalFeedback && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{signalFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSignalSubmit} className="space-y-5">
              {/* Target Price */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                  Target On-Road Budget (Optional)
                </label>
                <div className="relative rounded-xl border border-white/10 overflow-hidden focus-within:border-[#ED1725] bg-[#090B0D]">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#71717A]">₹</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 1150000"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm font-medium bg-transparent text-white focus:outline-none placeholder-[#71717A]"
                  />
                </div>
              </div>

              {/* Purchase Timeline */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                  Purchase Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725]"
                >
                  <option value="WITHIN_7_DAYS">Within 7 Days (Ready for immediate purchase)</option>
                  <option value="WITHIN_30_DAYS">Within 30 Days (Active month buyer)</option>
                  <option value="WITHIN_60_DAYS">Within 60 Days</option>
                  <option value="WITHIN_90_DAYS">Within 90 Days</option>
                  <option value="JUST_RESEARCHING">Just Researching</option>
                </select>
              </div>

              {/* Priorities */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                  Negotiation Priorities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { id: 'LOWEST_ON_ROAD', label: 'Lowest On-Road Price' },
                    { id: 'CASH_DISCOUNT', label: 'Cash Discount' },
                    { id: 'INSURANCE_FLEXIBILITY', label: 'Insurance Flexibility' },
                    { id: 'NO_COMPULSORY_ACCESSORIES', label: 'No Compulsory Accessories' },
                    { id: 'FAST_DELIVERY', label: 'Fast Delivery' },
                    { id: 'PREFERRED_COLOR', label: 'Preferred Color Stock' },
                    { id: 'EXCHANGE_EVALUATION', label: 'Exchange Evaluation' },
                  ].map((item) => {
                    const checked = selectedPriorities.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          checked
                            ? 'border-[#ED1725] bg-[#ED1725]/10 text-white font-semibold'
                            : 'border-white/10 bg-[#090B0D] text-[#A1A1AA] hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setSelectedPriorities(selectedPriorities.filter((p) => p !== item.id));
                            } else {
                              setSelectedPriorities([...selectedPriorities, item.id]);
                            }
                          }}
                          className="w-4 h-4 text-[#ED1725] rounded border-white/20 bg-[#090B0D] focus:ring-[#ED1725]"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Delivery and Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">
                    Preferred Color (Optional)
                  </label>
                  <input
                    type="text"
                    value={colorPref}
                    onChange={(e) => setColorPref(e.target.value)}
                    placeholder="e.g. Daytona Grey"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725] placeholder-[#71717A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">Old Car Exchange</label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 text-xs font-medium cursor-pointer bg-[#090B0D] text-white">
                    <input
                      type="checkbox"
                      checked={exchange}
                      onChange={(e) => setExchange(e.target.checked)}
                      className="w-4 h-4 text-[#ED1725] rounded border-white/20 bg-[#090B0D] focus:ring-[#ED1725]"
                    />
                    <span>Yes, I have an old car for exchange</span>
                  </label>
                </div>
              </div>

              {/* Optional Note (Max 200 chars) */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="text-xs font-bold text-[#A1A1AA]">
                    Optional Note to Dealers (Max 200 Chars)
                  </label>
                  <span className={`text-[11px] font-mono ${note.length > 200 ? 'text-[#EF4444]' : 'text-[#71717A]'}`}>
                    {note.length}/200
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Looking for zero compulsory accessories and prompt delivery."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725] placeholder-[#71717A]"
                />
                <p className="text-[11px] text-[#71717A] mt-1">
                  Do not include phone numbers or emails here. Notes are automatically screened by content moderation.
                </p>
              </div>

              <PrimaryButton size="md" type="submit" className="w-full justify-center font-bold">
                Save My Preferences
              </PrimaryButton>
            </form>
          </div>

          {/* Group Aggregate Summary Card */}
          <div className="space-y-6">
            <div className="bg-[#17191D] text-white rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[#ED1725] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Combined Group Wishlist
              </div>

              <h3 className="text-base font-heading font-black text-white">What Dealers See</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Showrooms only see these combined group stats when preparing discounts. Your identity is 100% private.
              </p>

              <div className="space-y-3 pt-2 text-xs divide-y divide-white/10">
                <div className="pt-2 flex justify-between">
                  <span className="text-[#A1A1AA]">Preferences Shared:</span>
                  <span className="font-bold text-white">{totalSignalsCount} Buyers</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#A1A1AA]">Need Car Within 30 Days:</span>
                  <span className="font-bold text-white">
                    {groupSignals.filter((s) => s.purchaseTimeline === 'WITHIN_30_DAYS' || s.purchaseTimeline === 'WITHIN_7_DAYS').length} Buyers
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#A1A1AA]">Flexible Insurance Wanted:</span>
                  <span className="font-bold text-white">
                    {groupSignals.filter((s) => Array.isArray(s.priorities) && s.priorities.includes('INSURANCE_FLEXIBILITY')).length} Buyers
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#A1A1AA]">Old Car Exchange:</span>
                  <span className="font-bold text-white">
                    {groupSignals.filter((s) => s.exchangeRequired).length} Buyers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dealer Offers */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-heading font-black text-white">Valid Published Quotations</h2>
              <p className="text-xs text-[#A1A1AA]">
                Authorized dealerships in {group.city || 'India'} competing for this group with structured pricing.
              </p>
            </div>

            {publishedOffers.length > 1 && (
              <Link to="/buyer/offers">
                <SecondaryButton size="sm">
                  <FileSpreadsheet size={14} />
                  <span>Compare Side-by-Side</span>
                </SecondaryButton>
              </Link>
            )}
          </div>

          {publishedOffers.length === 0 ? (
            <div className="bg-[#17191D] rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#090B0D] flex items-center justify-center mx-auto text-white border border-white/10">
                <Clock className="w-6 h-6 text-[#ED1725]" />
              </div>
              <h3 className="font-heading font-black text-white text-base">No dealer offers published yet</h3>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                Dealerships are currently preparing their structured quotations. You will be notified as soon as an offer is submitted.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedOffers.map((offer) => {
                const dealer = dealers.find((d) => d.id === offer.createdByDealerId);
                return (
                  <div
                    key={offer.id}
                    className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-white/20 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-base text-white">
                            {dealer?.businessName || dealer?.dealershipName || 'Authorized Dealership'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                            Verified
                          </span>
                        </div>
                        <span className="text-xs font-mono text-white bg-[#090B0D] px-2.5 py-0.5 rounded-full border border-white/10">
                          v{offer.versionNumber}
                        </span>
                      </div>

                      {/* Pricing Highlight */}
                      <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-[#71717A] block uppercase font-bold">Final On-Road</span>
                          <span className="text-2xl font-heading font-black text-white tracking-tight">
                            {formatINR(offer.calculatedOnRoadPrice)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#22C55E] bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            Discount: −{formatINR(offer.discountAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Terms & Delivery */}
                      <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                        <div className="flex justify-between">
                          <span>Estimated Delivery:</span>
                          <span className="font-semibold text-white">{offer.deliveryMinDays}–{offer.deliveryMaxDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quotation Expiry:</span>
                          <span className="font-mono text-white">{formatDate(offer.expiresAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock Availability:</span>
                          <span className="font-medium text-white">{offer.stockStatus ? offer.stockStatus.replace(/_/g, ' ') : 'In Stock'}</span>
                        </div>
                      </div>

                      {offer.note && (
                        <div className="text-xs bg-[#090B0D] p-3 rounded-xl text-[#A1A1AA] italic border border-white/10">
                          “{offer.note}”
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2 border-t border-white/10">
                      <Link to={`/buyer/offers/${offer.quotationId}`} className="flex-1">
                        <SecondaryButton size="sm" className="w-full justify-center">
                          View Full Breakdown
                        </SecondaryButton>
                      </Link>
                      <Link to={`/buyer/offers/${offer.quotationId}?action=select`}>
                        <PrimaryButton size="sm" className="font-bold">
                          Select Dealer
                        </PrimaryButton>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: My Activity */}
      {activeTab === 'ACTIVITY' && (
        <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-base font-heading font-black text-white">Your Collective Activity Log</h2>
          {myActivity.length === 0 ? (
            <p className="text-xs text-[#71717A] py-6 text-center">No recorded activity for this collective yet.</p>
          ) : (
            <div className="space-y-3">
              {myActivity.map((event) => (
                <div key={event.id} className="p-4 rounded-2xl border border-white/10 bg-[#090B0D] flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#ED1725] mt-2 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{event.action ? event.action.replace(/_/g, ' ') : 'Activity'}</div>
                    <p className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed">{event.summary}</p>
                    <span className="text-[10px] text-[#71717A] mt-1 block font-mono">{formatDate(event.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sign In Required Overlay Popup Modal */}
      <SignInRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Sign In Required to View Quotes"
        message="Dealership quotations, itemized on-road discounts, and collective member bids are exclusive to registered members to protect dealer pricing and buyer privacy."
        redirectPath={`/groups/${groupId}`}
        groupTitle={
          car?.brand
            ? `${car.brand} ${car.modelName || car.model || ''} (${variant?.name || 'Selected Trim'})`
            : null
        }
      />
    </div>
  );
};
