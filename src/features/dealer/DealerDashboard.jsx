import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  ShieldCheck,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Phone,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { EmptyState } from '../../components/common/EmptyState';

export const DealerDashboard = () => {
  const {
    currentUser,
    dealers = [],
    quoteRequests = [],
    quotations = [],
    quotationVersions = [],
    leads = [],
    variants = [],
    cars = [],
    groups = [],
    fetchDealerLeads,
    fetchGroups,
    fetchCars
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDealerLeads();
    fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [fetchDealerLeads, fetchGroups, fetchCars, cars.length]);

  // Find the dealer associated with currentUser
  const myDealerId = currentUser?.dealerId;
  const dealer = (dealers || []).find((d) => d.id === myDealerId) || {
    businessName: currentUser?.dealershipName || currentUser?.name || 'Authorized OEM Dealership',
    legalEntityName: currentUser?.dealershipName || 'Franchise Partner',
    brand: currentUser?.brand || 'Authorized',
    city: currentUser?.city || 'Pune',
    address: currentUser?.address || 'Official Dealership Regional Showroom'
  };

  // Scoped data for this dealer
  const explicitRequests = (quoteRequests || []).filter((r) => !dealer.id || r.dealerId === dealer.id);
  const existingGroupIds = new Set(explicitRequests.map((r) => r.groupId));
  const derivedRequests = (groups || [])
    .filter((g) => !existingGroupIds.has(g.id))
    .map((g) => ({
      id: `rfq-${g.id}`,
      groupId: g.id,
      dealerId: myDealerId,
      status: (quotations || []).some(
        (q) => q.groupId === g.id && (!myDealerId || q.dealerId === myDealerId || q.dealer?.id === myDealerId)
      ) ? 'RESPONDED' : 'OPEN',
      createdAt: g.createdAt || new Date().toISOString(),
      city: g.city || 'Pune',
      currentMembers: g.currentMembers || g.memberIds?.length || 1,
    }));
  const myQuoteRequests = [...explicitRequests, ...derivedRequests];
  const myQuotations = (quotations || []).filter((q) => !dealer.id || q.dealerId === dealer.id);
  const myPublishedVersions = (quotationVersions || []).filter(
    (v) => !dealer.id || (v.createdByDealerId === dealer.id && v.status === 'PUBLISHED')
  );

  // Scoped leads (DEALER ISOLATION)
  const myLeads = leads || [];
  const newLeads = myLeads.filter((l) => l.status === 'DEMO_DELIVERED');
  const testDrivesScheduled = myLeads.filter((l) => l.status === 'TEST_DRIVE_SCHEDULED');

  return (
    <div className="space-y-8 select-none">
      {/* 1. Dealership Executive Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] via-[#111315] to-[#090B0D] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#22C55E] bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Authorized OEM Franchise Dealership
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#A1A1AA] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                Verified Partner
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white">
              {dealer.businessName || dealer.dealershipName}
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              {dealer.legalEntityName} • {dealer.address || 'Pune Regional Hub'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dealer/quote-requests">
              <PrimaryButton size="md" className="font-bold px-6 py-3 shadow-lg shadow-dd-red/20">
                <FileSpreadsheet size={15} />
                <span>View Car Groups (Price Requests)</span>
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dealership KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Groups Awaiting Quotes"
          value={myQuoteRequests.filter((r) => r.status === 'OPEN').length}
          subtext="Buyer groups ready for bids"
          concept="dealerQuotation"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          onClick={() => navigate('/dealer/quote-requests')}
        />
        <StatCard
          label="My Active Quotes"
          value={myPublishedVersions.length}
          subtext="Quotes submitted by you"
          concept="quotationVersion"
          icon={<FileSpreadsheet className="w-5 h-5 text-blue-400" />}
          onClick={() => navigate('/dealer/offers')}
        />
        <StatCard
          label="Interested Buyers"
          value={newLeads.length}
          subtext="Buyers who accepted your quote"
          concept="leadSharing"
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          onClick={() => navigate('/dealer/leads')}
        />
        <StatCard
          label="Test Drives"
          value={testDrivesScheduled.length}
          subtext="Scheduled test drives"
          icon={<CheckCircle2 className="w-5 h-5 text-[#ED1725]" />}
          onClick={() => navigate('/dealer/leads')}
        />
      </div>

      {/* 3. Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Open Quote Requests (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-heading font-black text-white tracking-tight">
                  Car Groups Looking for Deals
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Local buyer groups awaiting your best on-road price quotes.
                </p>
              </div>
              <Link to="/dealer/quote-requests">
                <SecondaryButton size="sm">
                  <span>View All</span>
                  <ArrowRight size={13} />
                </SecondaryButton>
              </Link>
            </div>

            {myQuoteRequests.length === 0 ? (
              <EmptyState
                icon={FileSpreadsheet}
                title="No Open Requests Right Now"
                description="When buyer groups in your area form, they will appear here for you to quote."
              />
            ) : (
              <div className="space-y-3.5">
                {myQuoteRequests.slice(0, 3).map((req) => {
                  const group = (groups || []).find((g) => g.id === req.groupId);
                  const variant = (variants || []).find((v) => v.id === group?.variantId);
                  const car = (cars || []).find((c) => c.id === variant?.carId);
                  const existingQuote = myQuotations.find((q) => q.quoteRequestId === req.id && q.dealerId === dealer.id);

                  return (
                    <motion.div
                      key={req.id}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl border border-white/10 hover:border-white/20 bg-[#090B0D] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={req.status} />
                          <span className="text-xs text-[#71717A] font-mono">
                            Ref: #{req.id.slice(-6)}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-white">
                          {car?.brand} {car?.modelName || car?.model} — {variant?.name}
                        </h4>
                        <div className="text-xs text-[#A1A1AA] flex items-center gap-3">
                          <span>Group Demand: <strong className="text-white">{group?.currentMembers || 1} Buyers</strong></span>
                          <span>•</span>
                          <span>Deadline: {formatDate(req.deadline)}</span>
                        </div>
                      </div>

                      <Link to={`/dealer/quote-requests/${req.id}`}>
                        <PrimaryButton size="sm" className="font-bold">
                          {existingQuote ? 'Update Offer' : 'Submit Offer'}
                        </PrimaryButton>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assigned Customer Leads (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-heading font-black text-white tracking-tight">
                Interested Buyers (Contact Details)
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Buyers who approved your quote and agreed to receive your call.
              </p>
            </div>

            {myLeads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Interested Buyers Yet"
                description="Once a buyer accepts your quotation, their contact details will appear here."
              />
            ) : (
              <div className="space-y-3">
                {myLeads.map((lead) => {
                  const quote = (quotations || []).find((q) => q.id === lead.offerId);
                  const variant = (variants || []).find((v) => v.id === quote?.variantId);
                  const car = (cars || []).find((c) => c.id === variant?.carId);

                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl border border-white/10 bg-[#090B0D] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{lead.buyerName}</span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <div className="text-[#A1A1AA]">
                        {car?.brand} {car?.modelName} ({variant?.name})
                      </div>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono text-white font-bold flex items-center gap-1.5">
                          <Phone size={12} className="text-[#ED1725]" />
                          {lead.authorizedPhone}
                        </span>
                        <Link
                          to={`/dealer/leads/${lead.id}`}
                          className="font-bold text-[#ED1725] hover:underline"
                        >
                          Manage Lead →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
