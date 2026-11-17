import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { formatDate } from '../../lib/dates';
import { Building2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminDealersPage = () => {
  const { dealers = [], reviewDealerApplication } = useAppStore();
  const [selectedDealerId, setSelectedDealerId] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleActionClick = (dealerId, decision) => {
    setSelectedDealerId(dealerId);
    setPendingDecision(decision);
    setReasonInput('');
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = () => {
    if (selectedDealerId && pendingDecision) {
      reviewDealerApplication(
        selectedDealerId,
        pendingDecision,
        reasonInput.trim() || undefined
      );
      setShowConfirmModal(false);
      setSelectedDealerId(null);
      setPendingDecision(null);
    }
  };

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
          'Suspending a dealership immediately revokes access to submit new quotations and claim buyer leads.',
          'All verification decisions are appended to the immutable platform audit trail.',
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
            Review dealership applications, verify franchise credentials, and manage authorized dealer eligibility.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="bg-dd-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {dealers.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Dealerships Found"
            description="There are currently no dealership records in the verification queue or network directory."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dd-surface/80 text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">Dealership Entity</th>
                  <th className="p-4 font-bold">Location & Contact</th>
                  <th className="p-4 font-bold">Authorized Brands</th>
                  <th className="p-4 font-bold">Verification Status</th>
                  <th className="p-4 font-bold">Application Date</th>
                  <th className="p-4 font-bold text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dealers.map((dealer) => {
                  const isPending =
                    dealer.verificationStatus === 'PENDING_VERIFICATION' ||
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
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          GSTIN: {dealer.gstin || 'GST-NOT-PROVIDED'}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        <div className="font-medium text-white">{dealer.address || dealer.city || 'Regional Outlet'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {dealer.displayContactName || dealer.contactPerson || 'Dealership Mgr'} •{' '}
                          <span className="font-mono">{dealer.phone || dealer.mockPhone || '-'}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(dealer.authorizedBrands || [dealer.brand || 'Tata']).map(
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

                      <td className="p-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(dealer.createdAt || dealer.applicationDate || new Date())}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleActionClick(dealer.id, 'APPROVE')}
                                className="px-3.5 py-1.5 rounded-xl bg-dd-green text-white font-heading font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm"
                              >
                                Approve
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
                              className="px-3.5 py-1.5 rounded-xl bg-dd-elevated text-white border border-white/10 font-heading font-bold text-xs hover:bg-white/10 transition-colors"
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

      {/* Confirmation Modal */}
      {targetDealer && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title={`Confirm Dealership ${pendingDecision} Action`}
          description={`Are you sure you want to ${pendingDecision?.toLowerCase()} ${
            targetDealer.businessName || targetDealer.dealershipName
          }? This action updates network eligibility immediately and is logged to audit.`}
          confirmLabel={`Confirm ${pendingDecision}`}
          variant={pendingDecision === 'APPROVE' ? 'primary' : 'danger'}
          onConfirm={handleConfirmDecision}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="mt-3">
            <label className="block text-[11px] font-heading font-bold uppercase text-slate-400 mb-1.5">
              Audit Reason / Internal Notes (Optional)
            </label>
            <input
              type="text"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="e.g. Verified showroom registration and commercial GST credentials."
              className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors"
            />
          </div>
        </ConfirmationModal>
      )}
    </motion.div>
  );
};
