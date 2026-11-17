import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { ShieldCheck, Building2, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { SecondaryButton, DangerButton } from '../../components/common/Buttons';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const BuyerConsentsPage = () => {
  const { consents = [], dealers = [], leads = [], currentUser, withdrawConsent, fetchConsents } = useAppStore();

  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  const [withdrawConsentId, setWithdrawConsentId] = useState(null);
  const myConsents = consents;

  return (
    <div className="space-y-8 select-none">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">Privacy & Security</span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs text-[#A1A1AA] font-medium">Showroom Permissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-1.5">
            Who Can Contact You
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl leading-relaxed">
            See which authorized showrooms have permission to call you. You can turn off permission anytime with one click.
          </p>
        </div>
      </div>

      {/* 2. Privacy Rights Banner */}
      <div className="bg-[#17191D] border border-white/10 rounded-3xl p-6 text-xs text-white flex items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-2xl bg-[#090B0D] border border-white/10 flex items-center justify-center shrink-0 text-[#22C55E]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="font-heading font-bold text-white text-sm">🔒 100% Spam-Free Guarantee</span>
          <p className="leading-relaxed text-[#A1A1AA] text-xs">
            Your phone number is completely private. Showrooms can only contact you when you accept their price quote. If you change your mind, click 'Stop Permission' below, and the dealer can no longer reach out.
          </p>
        </div>
      </div>

      {/* 3. Consents List */}
      {myConsents.length === 0 ? (
        <div className="bg-[#17191D] rounded-3xl border border-dashed border-white/10 p-12 text-center text-xs text-[#A1A1AA]">
          You have not granted contact sharing consent to any dealerships yet. When you accept an offer, active disclosure logs appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {myConsents.map((consent) => {
            const dealer = dealers.find((d) => d.id === consent.dealerId);
            const associatedLead = leads.find((l) => l.consentId === consent.id);

            return (
              <div
                key={consent.id}
                className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#ED1725]" />
                    <span className="font-heading font-bold text-base text-white">
                      {dealer?.businessName || dealer?.dealershipName || 'Authorized Dealership'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        consent.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#090B0D] text-[#71717A] border-white/10'
                      }`}
                    >
                      {consent.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#71717A] flex items-center gap-1 font-mono">
                    Consent Ref: #{consent.id.slice(-6)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="text-[#71717A] block font-bold uppercase text-[10px]">
                      Purpose of Disclosure:
                    </span>
                    <p className="text-[#A1A1AA] leading-relaxed">{consent.purpose}</p>

                    <div className="pt-2">
                      <span className="text-[#71717A] block font-bold uppercase text-[10px]">
                        Granted Timestamp:
                      </span>
                      <span className="text-white font-mono">{formatDate(consent.grantedAt)}</span>
                    </div>

                    {consent.withdrawnAt && (
                      <div className="text-[#EF4444] font-medium pt-1 font-mono">
                        Revoked on: {formatDate(consent.withdrawnAt)}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[#71717A] block font-bold uppercase text-[10px] mb-1.5">
                      Disclosed Profile Attributes:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#A1A1AA] bg-[#090B0D] p-3.5 rounded-2xl border border-white/10">
                      {(consent.dataFields || []).map((field, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                          <span>{field}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-white/10">
                  {associatedLead ? (
                    <Link
                      to={`/buyer/leads/${associatedLead.id}`}
                      className="text-xs font-semibold text-[#22C55E] hover:underline flex items-center gap-1"
                    >
                      <span>View Showroom Appointment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-[#71717A]">No active appointment link</span>
                  )}

                  {consent.status === 'ACTIVE' && (
                    <SecondaryButton
                      size="sm"
                      onClick={() => setWithdrawConsentId(consent.id)}
                      className="text-[#EF4444] hover:text-red-400 border-[#EF4444]/30 hover:border-[#EF4444]"
                    >
                      Stop Permission
                    </SecondaryButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(withdrawConsentId)}
        title="Stop Showroom Calls?"
        message="Are you sure? This showroom will no longer be able to contact you about this car quote. You can always reconnect later."
        confirmLabel="Yes, Stop Permission"
        isDestructive={true}
        onConfirm={() => {
          if (withdrawConsentId) {
            withdrawConsent(withdrawConsentId);
            setWithdrawConsentId(null);
          }
        }}
        onCancel={() => setWithdrawConsentId(null)}
      />
    </div>
  );
};
