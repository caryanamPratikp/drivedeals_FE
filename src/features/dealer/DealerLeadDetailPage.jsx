import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Phone, ArrowLeft, CheckCircle2, AlertTriangle, Building2, Calendar, Clock, Car, History, User } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const DealerLeadDetailPage = () => {
  const { leadId } = useParams();
  const {
    leads = [],
    quotations = [],
    quotationVersions = [],
    variants = [],
    cars = [],
    dealers = [],
    currentUser,
    updateLeadStatus,
    submitLeadDispute,
    fetchDealerLeads,
  } = useAppStore();

  useEffect(() => {
    fetchDealerLeads();
  }, [fetchDealerLeads]);

  const lead = leads.find((l) => l.id === leadId);

  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('INVALID_CONTACT_INFO');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!lead) {
    return (
      <div className="text-center py-20 space-y-4 select-none">
        <h2 className="text-xl font-heading font-black text-white">Lead Record Not Found</h2>
        <Link to="/dealer/leads">
          <PrimaryButton size="sm">Back to Leads</PrimaryButton>
        </Link>
      </div>
    );
  }

  const quote = quotations.find((q) => q.id === lead.offerId || q.id === lead.quotationId);
  const version = quotationVersions.find((v) => v.id === lead.offerVersionId || v.id === lead.quotationVersionId);
  const variant = variants.find((v) => v.id === quote?.variantId) || { name: lead.variantName || 'Standard Trim' };
  const car = cars.find((c) => c.id === variant?.carId) || { brand: lead.carBrand || 'Vehicle', modelName: lead.carModel || 'Model' };

  const buyerMobile = lead.buyerPhone || lead.authorizedPhone || lead.phone || 'Authorized Contact';

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setActionFeedback(null);
    if (!newStatus) return;
    if (newStatus === 'LOST' && !lostReason.trim()) {
      setActionFeedback({ type: 'error', message: 'Please provide a reason when marking a lead as Lost.' });
      return;
    }

    try {
      setIsUpdating(true);
      const noteToSend = statusNote.trim() || (newStatus === 'LOST' ? lostReason.trim() : '');
      const res = await updateLeadStatus(lead.id, newStatus, noteToSend);
      if (res && res.success) {
        setActionFeedback({
          type: 'success',
          message: `Lead milestone updated to ${newStatus.replace(/_/g, ' ')}.`,
        });
        setNewStatus('');
        setStatusNote('');
        setLostReason('');
        await fetchDealerLeads();
      } else {
        setActionFeedback({
          type: 'error',
          message: res?.error || 'Failed to update lead status.',
        });
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update lead status.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    setActionFeedback(null);
    if (!disputeDesc.trim()) {
      setActionFeedback({ type: 'error', message: 'Please provide details explaining the dispute reason.' });
      return;
    }
    try {
      setIsUpdating(true);
      const res = await submitLeadDispute(lead.id, disputeReason, disputeDesc.trim());
      if (res && res.success) {
        setActionFeedback({
          type: 'success',
          message: 'Lead dispute registered with platform administrator.',
        });
        setIsDisputeOpen(false);
        setDisputeDesc('');
        await fetchDealerLeads();
      } else {
        setActionFeedback({
          type: 'error',
          message: res?.error || 'Failed to register dispute.',
        });
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to register dispute.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <Link
          to="/dealer/leads"
          className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Leads
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <span className="text-xs text-[#71717A] font-mono">
              Lead ID: #{lead.id?.slice(-6)}
            </span>
          </div>
          <span className="text-xs text-[#A1A1AA] font-mono">
            Consent Authorized: {formatDate(lead.createdAt)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            {lead.buyerName || 'Verified Buyer'}
          </h1>
          <div className="text-xs font-semibold text-[#ED1725] mt-1">
            {lead.carBrand || car.brand} {lead.carModel || car.modelName || car.model} — {lead.variantName || variant.name}
          </div>
        </div>

        <div className="p-5 bg-[#090B0D] rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#22C55E]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#71717A] uppercase font-bold block">
                Authorized Buyer Mobile
              </span>
              <span className="text-base font-mono font-bold text-white tracking-wider">
                {buyerMobile}
              </span>
            </div>
          </div>
          {buyerMobile.startsWith('+') && (
            <a
              href={`tel:${buyerMobile}`}
              className="px-5 py-2.5 bg-[#ED1725] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Buyer</span>
            </a>
          )}
        </div>

        {actionFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/15 border border-red-500/30 text-red-400'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {/* Update Status Form */}
        <form onSubmit={handleStatusUpdate} className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Update Customer Milestone</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Click a quick status chip or choose from the dropdown to keep the buyer updated:
            </p>
          </div>

          {/* Quick status action chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'CONTACTED', label: '📞 Called Customer' },
              { id: 'TEST_DRIVE_SCHEDULED', label: '🚗 Test Drive Booked' },
              { id: 'BOOKED', label: '📝 Car Booked' },
              { id: 'DELIVERED', label: '🎉 Car Delivered' },
              { id: 'LOST', label: '❌ Lost Deal' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setNewStatus(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  newStatus === chip.id
                    ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-md shadow-[#ED1725]/30'
                    : 'bg-[#090B0D] text-[#A1A1AA] border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase mb-1.5">
                Milestone Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725]"
              >
                <option value="">Select Milestone Status...</option>
                <option value="CONTACTED">Called Customer</option>
                <option value="TEST_DRIVE_SCHEDULED">Test Drive Booked</option>
                <option value="BOOKED">Car Booking Confirmed</option>
                <option value="DELIVERED">Car Delivered to Customer 🎉</option>
                <option value="LOST">Lost Opportunity</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase mb-1.5">
                Note to Customer (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Test drive booked for Saturday at 11:00 AM."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-[#090B0D] text-white focus:outline-none focus:border-[#ED1725] placeholder-[#71717A]"
              />
            </div>
          </div>

          {newStatus === 'LOST' && (
            <div>
              <label className="block text-[11px] font-bold text-[#EF4444] uppercase mb-1.5">
                Lost Reason *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Customer decided on another model / timeline postponed."
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-red-500/40 bg-[#090B0D] text-white focus:outline-none focus:border-red-500 placeholder-[#71717A]"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setIsDisputeOpen(!isDisputeOpen)}
              className="text-xs font-bold text-[#EF4444] hover:underline cursor-pointer"
            >
              Report Contact Issue
            </button>
            <PrimaryButton size="sm" type="submit" disabled={!newStatus || isUpdating} className="font-bold px-6 shadow-lg shadow-dd-red/20">
              {isUpdating ? 'Saving...' : 'Update Milestone'}
            </PrimaryButton>
          </div>
        </form>

        {/* Dispute Drawer */}
        {isDisputeOpen && (
          <form
            onSubmit={handleDisputeSubmit}
            className="p-5 bg-[#090B0D] rounded-2xl border border-white/10 space-y-3"
          >
            <h4 className="font-heading font-bold text-xs text-white">File Lead Authenticity Dispute</h4>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725]"
            >
              <option value="INVALID_CONTACT_INFO">Invalid / Wrong Phone Number</option>
              <option value="UNRESPONSIVE_CUSTOMER">Customer Unresponsive After Multiple Attempts</option>
              <option value="DIFFERENT_VEHICLE_INTEREST">Customer Enquiring for Unrelated Vehicle</option>
            </select>
            <textarea
              rows={2}
              placeholder="Describe call attempts or reason for disputing this lead..."
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-[#17191D] text-white focus:outline-none focus:border-[#ED1725] placeholder-[#71717A]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <SecondaryButton size="sm" onClick={() => setIsDisputeOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton size="sm" type="submit" disabled={isUpdating} className="font-bold">
                {isUpdating ? 'Submitting Dispute...' : 'Submit Dispute to Admin'}
              </PrimaryButton>
            </div>
          </form>
        )}

        {/* Audit Milestone History */}
        {Array.isArray(lead.events) && lead.events.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="font-heading font-bold text-xs text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-[#ED1725]" />
              <span>Milestone Audit Log ({lead.events.length} Entries)</span>
            </h4>
            <div className="space-y-2.5">
              {lead.events.map((ev) => (
                <div
                  key={ev.id || ev.createdAt}
                  className="p-3 bg-[#090B0D] rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{ev.description}</span>
                    <span className="text-[11px] text-[#71717A] flex items-center gap-1.5">
                      <User size={11} /> {ev.actorName || 'System'} • {ev.eventType}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#71717A] font-mono shrink-0">
                    {formatDate(ev.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
