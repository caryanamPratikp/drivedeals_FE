import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { CheckCircle2, Building2, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/Buttons';

export const BuyerLeadsPage = () => {
  const { leads = [], dealers = [], quotations = [], variants = [], cars = [], currentUser, fetchConsents } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof fetchConsents === 'function') {
      fetchConsents();
    }
  }, [fetchConsents]);

  const myLeads = leads.filter((l) => !l.buyerId || l.buyerId === currentUser?.id || l.buyerId === currentUser?.sub);

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ED1725]">
              Dealership Connections
            </span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs text-[#A1A1AA] font-medium">{currentUser?.city || 'Pune Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-1.5">
            My Authorized Dealer Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl leading-relaxed">
            Track the milestone progress of your showroom consultations, vehicle test-drives, and delivery allocations.
          </p>
        </div>
      </div>

      {/* 2. Leads List */}
      {myLeads.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No Active Showroom Connections"
          description="When you accept an offer and authorize contact sharing with an OEM dealership, your connection progress will appear here."
          actionText="Browse Active Offers"
          onAction={() => navigate('/buyer/offers')}
        />
      ) : (
        <div className="space-y-4">
          {myLeads.map((lead) => {
            const dealer = dealers.find((d) => d.id === lead.dealerId);
            const quote = quotations.find((q) => q.id === lead.offerId);
            const variant = variants.find((v) => v.id === quote?.variantId);
            const car = cars.find((c) => c.id === variant?.carId);

            return (
              <motion.div
                key={lead.id}
                whileHover={{ y: -3 }}
                className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs text-[#71717A] font-mono">
                      Ref: #{lead.id?.slice(-6)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#ED1725]" />
                      {dealer?.businessName || dealer?.dealershipName || 'Verified Showroom Outlet'}
                    </h3>
                    <div className="text-xs font-semibold text-[#ED1725] mt-0.5">
                      {car?.brand} {car?.modelName || car?.model} — {variant?.name}
                    </div>
                  </div>

                  <div className="text-xs text-[#A1A1AA] flex flex-wrap items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ED1725]" />
                      Consent Granted: {formatDate(lead.createdAt)}
                    </span>
                    <span>•</span>
                    <span>City: {lead.city || 'Regional Hub'}</span>
                    <span>•</span>
                    <span>Timeline: {lead.preferredTimeline?.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <Link to={`/buyer/leads/${lead.id}`}>
                  <PrimaryButton size="sm" className="font-bold">
                    <span>View Appointment Progress</span>
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
