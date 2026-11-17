import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  FileSpreadsheet,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Users,
  MapPin,
  Car
} from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { QuotationComposer } from './QuotationComposer';
import { PrimaryButton } from '../../components/common/Buttons';

export const DealerQuoteRequestDetailPage = () => {
  const { requestId } = useParams();
  const {
    quoteRequests = [],
    groups = [],
    variants = [],
    cars = [],
    quotations = [],
    quotationVersions = [],
    currentUser,
    fetchGroups,
    fetchCars,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [fetchGroups, fetchCars, cars.length]);

  const explicitReq = quoteRequests.find((r) => r.id === requestId);
  const targetGroupId = explicitReq?.groupId || (requestId?.startsWith('rfq-') ? requestId.replace(/^rfq-/, '') : requestId);
  const group = groups.find((g) => g.id === targetGroupId || g.id === explicitReq?.groupId);

  const req = explicitReq || (group ? {
    id: `rfq-${group.id}`,
    groupId: group.id,
    dealerId: currentUser?.dealerId,
    status: (quotations || []).some(
      (q) => q.groupId === group.id && (!currentUser?.dealerId || q.dealerId === currentUser.dealerId)
    ) ? 'RESPONDED' : 'OPEN',
    createdAt: group.createdAt || new Date().toISOString(),
  } : null);
  const variant =
    group?.variant || variants.find((v) => v.id === group?.variantId) || {
      name: 'Standard Trim',
    };
  const car =
    group?.car ||
    cars.find((c) => c.id === variant?.carId || c.id === group?.carId) || {
      brand: 'Vehicle',
      modelName: 'Model',
    };

  if (!req || !group) {
    return (
      <div className="text-center py-20 space-y-4 select-none">
        <h2 className="text-xl font-heading font-black text-white">Quote Request Not Found</h2>
        <Link to="/dealer/quote-requests">
          <PrimaryButton size="sm">Back to Quote Requests</PrimaryButton>
        </Link>
      </div>
    );
  }

  const existingQuote = quotations.find(
    (q) => q.quoteRequestId === req.id && q.dealerId === req.dealerId
  );
  const existingLatestVersion = existingQuote
    ? quotationVersions
        .filter((v) => v.quotationId === existingQuote.id)
        .sort((a, b) => b.versionNumber - a.versionNumber)[0]
    : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <Link
          to="/dealer/quote-requests"
          className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quote Requests
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
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
              Request Ref: #{req.id?.slice(-6)}
            </span>
          </div>

          <span className="text-xs text-[#A1A1AA] font-mono">
            Received {formatDate(req.createdAt)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            {car.brand} {car.modelName || car.model} — {variant.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA] mt-1 font-normal">
            <span className="flex items-center gap-1 font-bold text-white">
              <Users size={13} className="text-[#ED1725]" />
              {group.currentMembers || 1} Verified Buyers in Collective
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-[#71717A]" />
              Region: {group.city || 'Regional Hub'}
            </span>
          </div>
        </div>
      </div>

      {/* Composer Section */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-heading font-black text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#ED1725]" />
            Submit Competitive Group Quotation
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1 font-normal">
            Submit itemized ex-showroom and on-road pricing with volume group incentives.
          </p>
        </div>

        <QuotationComposer
          groupId={group.id}
          quoteRequestId={req.id}
          existingQuotationId={existingQuote?.id}
          previousVersion={existingLatestVersion}
          onSuccess={() => navigate('/dealer/offers')}
          onCancel={() => navigate('/dealer/quote-requests')}
        />
      </div>
    </div>
  );
};
