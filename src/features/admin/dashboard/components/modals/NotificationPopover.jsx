import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Building2, ShieldAlert, Sparkles, CheckCheck } from 'lucide-react';

export const NotificationPopover = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 sm:pt-20">
        {/* Invisible Backdrop */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Popover Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#17191D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden mt-12 sm:mt-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#ED1725]" />
              <h3 className="text-sm font-heading font-bold text-white">
                Platform Alerts & Events
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-[#A1A1AA] hover:text-white flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-lg hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-2 max-h-96 overflow-y-auto space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  n.read
                    ? 'bg-transparent border-transparent opacity-60'
                    : 'bg-white/[0.03] border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-heading font-bold text-white">
                    {n.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#A1A1AA] shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-xs text-[#A1A1AA]">
                No pending platform alerts.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-black/40 border-t border-white/5 text-center text-[11px] text-[#A1A1AA]">
            Automated Escrow & Deal Engine • Pune Node
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
