import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ShieldCheck, ArrowLeft, CheckCircle2, Clock, Circle, Building2, Calendar, Car } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrimaryButton } from '../../components/common/Buttons';

export const BuyerLeadDetailPage = () => {
  const { leadId } = useParams();
  const {
    leads = [],
    dealers = [],
    groups = [],
    quotations = [],
    quotationVersions = [],
    variants = [],
    cars = [],
    fetchConsents
  } = useAppStore();

  useEffect(() => {
    if (typeof fetchConsents === 'function') {
      fetchConsents();
    }
  }, [fetchConsents]);

  const lead = leads.find((l) => l.id === leadId || l.consentId === leadId || `lead-${l.consentId}` === leadId);
  const dealer =
    dealers.find((d) => d.id === lead?.dealerId) ||
    dealers[0] || { businessName: 'Authorized Dealership', brand: 'Dealership' };
  const quote = quotations.find((q) => q.id === lead?.offerId);
  const version = quotationVersions.find((v) => v.id === lead?.offerVersionId);
  const group = groups.find((g) => g.id === lead?.groupId);
  const variant =
    variants.find((v) => v.id === quote?.variantId) ||
    group?.variant ||
    variants[0] || { name: 'Standard Trim' };
  const car =
    cars.find((c) => c.id === variant?.carId) ||
    group?.car ||
    cars[0] || { brand: 'Mahindra', modelName: 'XUV700' };

  if (!lead) {
    return (
      <div className="text-center py-20 space-y-4 select-none">
        <h2 className="text-xl font-heading font-black text-white">Appointment Record Not Found</h2>
        <Link to="/buyer/leads">
          <PrimaryButton size="sm">Back to Appointments</PrimaryButton>
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { status: 'DEMO_DELIVERED', label: 'Showroom Connected', desc: 'The dealer received your request and phone number.' },
    { status: 'CONTACTED', label: 'Showroom Called You', desc: 'Dealer sales advisor reached out to discuss your car.' },
    { status: 'TEST_DRIVE_SCHEDULED', label: 'Test Drive Booked', desc: 'Test drive booked at the showroom or your home.' },
    { status: 'BOOKED', label: 'Car Booked', desc: 'Booking confirmed and paperwork underway.' },
    { status: 'DELIVERED', label: 'Car Delivered 🎉', desc: 'Registration done and car handed over to you!' },
  ];

  const stepStatusOrder = ['DEMO_DELIVERED', 'CONTACTED', 'TEST_DRIVE_SCHEDULED', 'BOOKED', 'DELIVERED'];
  const normalizedStatus = lead.status === 'BOOKING_IN_PROGRESS'
    ? 'BOOKED'
    : (lead.status === 'PURCHASED' ? 'DELIVERED' : (lead.status === 'DEALER_ACKNOWLEDGED' ? 'CONTACTED' : lead.status));
  const currentStepIdx = stepStatusOrder.indexOf(normalizedStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <Link
          to="/buyer/leads"
          className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Showroom Visits
        </Link>
      </div>

      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ED1725]" />
              {dealer.businessName || dealer.dealershipName || 'Authorized Dealership'}
            </span>
            <span className="text-xs text-[#22C55E] bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Dealership
            </span>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div>
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">
            {car.brand} {car.modelName || car.model} — {variant.name}
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-mono">
            Booking Ref: #{lead.id.slice(-6)} • Connected {formatDate(lead.createdAt || new Date())}
          </p>
        </div>

        {/* Milestone Pipeline Tracker */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-heading font-bold text-sm text-white">Your Showroom Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timelineSteps.map((step, idx) => {
              const isPast = currentStepIdx >= 0 && idx < currentStepIdx;
              const isCurrent = currentStepIdx >= 0 && idx === currentStepIdx;
              const isUpcoming = currentStepIdx >= 0 ? idx > currentStepIdx : true;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-1 transition-all ${
                    isCurrent
                      ? 'bg-[#ED1725]/10 border-[#ED1725]/40 shadow-lg shadow-[#ED1725]/5'
                      : isPast
                      ? 'bg-[#090B0D] border-emerald-500/20'
                      : 'bg-[#090B0D]/50 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-[#ED1725] shrink-0 animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#71717A] shrink-0" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#ED1725]'
                          : isPast
                          ? 'text-white'
                          : 'text-[#71717A]'
                      }`}
                    >
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ED1725]/20 text-[#ED1725] border border-[#ED1725]/30">
                          Active Milestone
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] pl-6 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
