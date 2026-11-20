import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { formatDate } from '../../lib/dates';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminDealersPage = () => {
  const { dealers = [], fetchAdminDealers, reviewDealerApplication } = useAppStore();
  const [selectedDealerId, setSelectedDealerId] = useState(null);
  const [inspectingDealer, setInspectingDealer] = useState(null);
  const [statusTab, setStatusTab] = useState('ALL');

  useEffect(() => {
    fetchAdminDealers();
  }, [fetchAdminDealers]);

  const [pendingDecision, setPendingDecision] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleActionClick = (dealerId, decision) => {
    setSelectedDealerId(dealerId);
    setPendingDecision(decision);
    setReasonInput('');
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = async () => {
    if (selectedDealerId && pendingDecision) {
      await reviewDealerApplication(
        selectedDealerId,
        pendingDecision,
        reasonInput.trim() || undefined
      );
      setShowConfirmModal(false);
      setSelectedDealerId(null);
      setPendingDecision(null);
      if (inspectingDealer && inspectingDealer.id === selectedDealerId) {
        setInspectingDealer(null);
      }
    }
  };

  const pendingCount = dealers.filter(
    (d) =>
      d.status === 'PENDING_VERIFICATION' ||
      d.verificationStatus === 'PENDING_VERIFICATION' ||
      d.status === 'PENDING'
  ).length;

  const verifiedCount = dealers.filter(
    (d) => d.status === 'VERIFIED' || d.verificationStatus === 'VERIFIED'
  ).length;

  const filteredDealers = dealers.filter((d) => {
    const isPending =
      d.status === 'PENDING_VERIFICATION' ||
      d.verificationStatus === 'PENDING_VERIFICATION' ||
      d.status === 'PENDING';
    const isVerified = d.status === 'VERIFIED' || d.verificationStatus === 'VERIFIED';
    const isRejected = d.status === 'REJECTED' || d.verificationStatus === 'REJECTED';

    if (statusTab === 'PENDING') return isPending;
    if (statusTab === 'VERIFIED') return isVerified;
    if (statusTab === 'REJECTED') return isRejected;
    return true;
  });

  const targetDealer = dealers.find((d) => d.id === selectedDealerId);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-dealers-help"
        title="Dealership Verification Governance"
        tips={[
          'All dealership applications must undergo verification of franchise agreements, showroom location, and GSTIN.',
          'Approving a dealership immediately grants quotation permissions on matching brand buyer groups.',
          'Suspending a dealership immediately revokes access to submit new quotations and claim buyer leads.',
          'All verification decisions trigger real-time notifications to the dealer principal.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Governance & Network Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Dealership Network Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Review submitted onboarding documentation, verify GSTIN & OEM franchise credentials, and manage dealer eligibility.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#111315] rounded-2xl border border-white/10">
          <button
            onClick={() => setStatusTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              statusTab === 'ALL'
                ? 'bg-dd-red text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({dealers.length})
          </button>
          <button
            onClick={() => setStatusTab('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
              statusTab === 'PENDING'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/60 text-amber-200">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStatusTab('VERIFIED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              statusTab === 'VERIFIED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Verified ({verifiedCount})
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {filteredDealers.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Dealership Records Found"
            description="There are currently no dealerships matching the selected verification filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Dealership Entity</th>
                  <th className="p-4 font-bold">Tax & Franchise Codes</th>
                  <th className="p-4 font-bold">Location & Contact</th>
                  <th className="p-4 font-bold">Franchise Brand</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDealers.map((dealer) => {
                  const isPending =
                    dealer.verificationStatus === 'PENDING_VERIFICATION' ||
                    dealer.status === 'PENDING_VERIFICATION' ||
                    dealer.status === 'PENDING';
                  const isVerified =
                    dealer.verificationStatus === 'VERIFIED' ||
                    dealer.status === 'VERIFIED';
                  const isSuspended =
                    dealer.verificationStatus === 'SUSPENDED' ||
                    dealer.status === 'SUSPENDED';

                  return (
                    <tr
                      key={dealer.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-heading font-bold text-white text-sm">
                          {dealer.businessName || dealer.dealershipName}
                        </div>
                        {dealer.legalEntityName && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {dealer.legalEntityName}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {dealer.id}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-white font-mono font-medium">
                          GST: {dealer.gstin || 'NOT-SUBMITTED'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          PAN: {dealer.panNumber || (dealer.gstin ? dealer.gstin.substring(2, 12) : '-')}
                        </div>
                        {dealer.dealerCode && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            OEM Code: {dealer.dealerCode}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-slate-300">
                        <div className="font-medium text-white">
                          {dealer.city || 'Pune'}
                          {dealer.state ? `, ${dealer.state}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {dealer.contactPerson || dealer.ownerName || 'Authorized Principal'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {dealer.contactPhone || dealer.ownerPhone || dealer.phone || '-'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(dealer.authorizedBrands || [dealer.brand || 'Mahindra']).map(
                            (brand) => (
                              <span
                                key={brand}
                                className="px-2.5 py-0.5 rounded-lg bg-dd-surface text-slate-300 font-heading font-bold text-[10px] border border-white/10"
                              >
                                {brand}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <StatusBadge status={dealer.verificationStatus || dealer.status} />
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Inspect button */}
                          <button
                            onClick={() => setInspectingDealer(dealer)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                            title="Inspect Onboarding Details"
                          >
                            <Eye size={14} />
                          </button>

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleActionClick(dealer.id, 'APPROVE')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm flex items-center gap-1"
                              >
                                <CheckCircle2 size={13} />
                                <span>Verify</span>
                              </button>
                              <button
                                onClick={() => handleActionClick(dealer.id, 'REJECT')}
                                className="px-3 py-1.5 rounded-xl bg-dd-surface text-dd-red border border-red-500/30 font-heading font-bold text-xs hover:bg-red-500/10 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isVerified && (
                            <button
                              onClick={() => handleActionClick(dealer.id, 'SUSPEND')}
                              className="px-3 py-1.5 rounded-xl bg-dd-surface text-dd-red border border-red-500/30 font-heading font-bold text-xs hover:bg-red-500/10 transition-colors"
                            >
                              Suspend
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              onClick={() => handleActionClick(dealer.id, 'REINSTATE')}
                              className="px-3 py-1.5 rounded-xl bg-dd-elevated text-white border border-white/10 font-heading font-bold text-xs hover:bg-white/10 transition-colors"
                            >
                              Reinstate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Inspect Onboarding Drawer / Modal */}
      <AnimatePresence>
        {inspectingDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectingDealer(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl bg-[#17191D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-dd-red/10 text-dd-red text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Dealership Onboarding Dossier
                  </div>
                  <h3 className="text-xl font-heading font-black text-white">
                    {inspectingDealer.businessName || inspectingDealer.dealershipName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {inspectingDealer.legalEntityName || 'Registered Dealership Entity'}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingDealer(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tax & Franchise Registration
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="text-white font-mono font-bold">
                      {inspectingDealer.gstin || 'NOT-SUBMITTED'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAN Number:</span>
                    <span className="text-white font-mono font-bold">
                      {inspectingDealer.panNumber || (inspectingDealer.gstin ? inspectingDealer.gstin.substring(2, 12) : '-')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">OEM Dealer Code:</span>
                    <span className="text-white font-mono">
                      {inspectingDealer.dealerCode || 'OEM-PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authorized Brand:</span>
                    <span className="text-[#ED1725] font-bold">
                      {inspectingDealer.brand || 'Mahindra'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Showroom Facility & Location
                  </div>
                  <div className="text-white">
                    {inspectingDealer.address || 'Showroom Address Not Specified'}
                  </div>
                  <div className="text-slate-400">
                    {inspectingDealer.city || 'Pune'}{inspectingDealer.state ? `, ${inspectingDealer.state}` : ''} - {inspectingDealer.pincode || '411001'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 sm:col-span-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Authorized Dealership Representative
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Person:</span>
                      <span className="text-white font-medium">
                        {inspectingDealer.contactPerson || inspectingDealer.ownerName || 'Dealer Principal'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Business Email:</span>
                      <span className="text-white font-mono">
                        {inspectingDealer.contactEmail || inspectingDealer.ownerEmail || 'dealer@drivedeals.in'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Direct Phone:</span>
                      <span className="text-white font-mono">
                        {inspectingDealer.contactPhone || inspectingDealer.ownerPhone || inspectingDealer.phone || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons inside drawer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <SecondaryButton onClick={() => setInspectingDealer(null)} className="font-bold text-xs">
                  Close Dossier
                </SecondaryButton>
                {inspectingDealer.status !== 'VERIFIED' && (
                  <button
                    onClick={() => {
                      const id = inspectingDealer.id;
                      setInspectingDealer(null);
                      handleActionClick(id, 'APPROVE');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-heading font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Verify Dealership</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDecision}
        title={
          pendingDecision === 'APPROVE'
            ? 'Verify Dealership Application'
            : pendingDecision === 'REJECT'
            ? 'Reject Dealership Application'
            : pendingDecision === 'SUSPEND'
            ? 'Suspend Dealership Access'
            : 'Reinstate Dealership Access'
        }
        message={
          pendingDecision === 'APPROVE'
            ? `Are you sure you want to verify ${targetDealer?.businessName || targetDealer?.dealershipName || 'this dealership'}? This will grant full access to inspect buyer demands and publish binding quotations.`
            : `Are you sure you want to set the status of this dealership to ${pendingDecision}?`
        }
        confirmText={
          pendingDecision === 'APPROVE'
            ? 'Verify Dealership'
            : pendingDecision === 'REJECT'
            ? 'Reject Application'
            : pendingDecision
        }
        confirmVariant={pendingDecision === 'APPROVE' ? 'success' : 'danger'}
      />
    </motion.div>
  );
};

export default AdminDealersPage;
