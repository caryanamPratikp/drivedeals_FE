import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Building, ArrowUpRight, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export const AccountDetailsCard = ({
  accountDetails,
  hideAmounts = false,
  onOpenRecipientModal,
  onOpenQuickTransfer,
}) => {
  const { accountHolder, accountNumber, accountType, status, clearingHouse, lastRecipient } = accountDetails;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.14)' }}
      className="relative rounded-2xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Building className="w-4 h-4 text-[#ED1725]" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                Account & Escrow Details
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">{accountType}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>{status}</span>
          </span>
        </div>

        {/* Account Meta Grid */}
        <div className="bg-black/30 rounded-xl p-3.5 border border-white/5 space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA]">Escrow Entity</span>
            <span className="text-white font-medium">{accountHolder}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA]">Escrow Node ID</span>
            <span className="text-white font-mono">{accountNumber}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA]">Clearing Partner</span>
            <span className="text-slate-300 font-mono text-[11px]">{clearingHouse}</span>
          </div>
        </div>

        {/* Last Recipient Subsection */}
        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-medium text-[#A1A1AA] uppercase tracking-wider">
              Last Settled Recipient
            </span>
            {lastRecipient && (
              <button
                onClick={() => onOpenRecipientModal && onOpenRecipientModal(lastRecipient)}
                className="text-[11px] text-[#ED1725] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View Audit</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {lastRecipient ? (
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              onClick={() => onOpenRecipientModal && onOpenRecipientModal(lastRecipient)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-center font-heading font-black text-sm text-[#ED1725]">
                  {lastRecipient.initials || 'DP'}
                </div>
                <div>
                  <div className="text-xs font-heading font-bold text-white hover:text-[#ED1725] transition-colors">
                    {lastRecipient.name}
                  </div>
                  <div className="text-[11px] text-[#A1A1AA]">{lastRecipient.units}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-heading font-black text-white">
                  {hideAmounts ? '••••••' : lastRecipient.formattedAmount}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {lastRecipient.status} • {lastRecipient.date}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-center text-xs text-[#A1A1AA]">
              No dealership franchise settlements recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="pt-5 mt-4 border-t border-white/5 flex gap-2">
        <button
          onClick={onOpenQuickTransfer}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all hover:border-[#ED1725]/50 group"
        >
          <span>Quick Settlement Disburse</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#ED1725] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
