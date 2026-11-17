import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Phone, ArrowRight, Inbox, Sparkles, User, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/Buttons';

export const DealerLeadsPage = () => {
  const { leads = [], quotations = [], variants = [], cars = [], currentUser, dealers = [], fetchDealerLeads } =
    useAppStore();

  useEffect(() => {
    fetchDealerLeads();
  }, [fetchDealerLeads]);

  const myDealerId = currentUser?.dealerId;
  const dealer = dealers.find((d) => d.id === myDealerId);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const myLeads = leads;
  const filteredLeads = myLeads.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 text-[#ED1725] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ED1725]/30">
            <Sparkles size={13} />
            <span>Interested Customers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Interested Buyers
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-normal">
            Buyers who chose your price quote and agreed to be contacted by{' '}
            <strong className="text-white font-bold">
              {dealer?.businessName || dealer?.dealershipName || 'Your Dealership'}
            </strong>{' '}
            for test drives and booking.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-xs font-bold rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
          >
            <option value="ALL">All Statuses ({myLeads.length})</option>
            <option value="DEMO_DELIVERED">
              New / Delivered ({myLeads.filter((l) => l.status === 'DEMO_DELIVERED').length})
            </option>
            <option value="CONTACTED">
              Contacted ({myLeads.filter((l) => l.status === 'CONTACTED').length})
            </option>
            <option value="TEST_DRIVE_SCHEDULED">
              Test Drive ({myLeads.filter((l) => l.status === 'TEST_DRIVE_SCHEDULED').length})
            </option>
            <option value="PURCHASED">
              Purchased ({myLeads.filter((l) => l.status === 'PURCHASED').length})
            </option>
            <option value="DISPUTED">
              Disputed ({myLeads.filter((l) => l.status === 'DISPUTED').length})
            </option>
          </select>
        </div>
      </div>

      {/* 2. Leads Cards */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Customer Leads in Pipeline"
          description="No customer leads currently match your selected status filter."
        />
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const quote = quotations.find((q) => q.id === lead.offerId);
            const variant = variants.find((v) => v.id === quote?.variantId);
            const car = cars.find((c) => c.id === variant?.carId);

            return (
              <motion.div
                key={lead.id}
                whileHover={{ y: -3 }}
                className="bg-[#17191D] rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs text-[#71717A] font-mono">
                      Lead ID: #{lead.id?.slice(-6)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">{lead.buyerName || 'Verified Buyer'}</h3>
                    <div className="text-xs font-semibold text-[#ED1725] mt-0.5">
                      {lead.carBrand || car?.brand || 'Vehicle'} {lead.carModel || car?.modelName || car?.model || ''} — {lead.variantName || variant?.name || 'Standard Trim'}
                    </div>
                  </div>

                  <div className="text-xs text-[#A1A1AA] flex flex-wrap items-center gap-4 pt-1 font-normal">
                    <span className="font-mono font-bold text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                      {lead.buyerPhone || lead.authorizedPhone || lead.phone || 'Authorized Contact'}
                    </span>
                    <span>•</span>
                    <span>Status: {lead.status?.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span className="font-mono">Handoff: {formatDate(lead.createdAt)}</span>
                  </div>
                </div>

                <Link
                  to={`/dealer/leads/${lead.id}`}
                  className="w-full sm:w-auto"
                >
                  <PrimaryButton size="sm" className="w-full sm:w-auto font-bold justify-center">
                    <span>Manage Lead & Milestones</span>
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
