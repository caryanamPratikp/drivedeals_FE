import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  FileSpreadsheet,
  Activity,
  Search,
  AlertTriangle,
  RotateCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Inbox
} from 'lucide-react';

/**
 * 1. EmptyGroupsState — Section 3: Find Your Deal Group
 * When there are no active groups in the city.
 */
export const EmptyGroupsState = ({ onStartGroup, city = 'Pune' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl bg-gradient-to-b from-[#17191D] to-[#0F1115] border border-white/10 p-8 sm:p-12 text-center max-w-3xl mx-auto overflow-hidden shadow-2xl"
    >
      {/* Subtle red ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#ED1725]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Automotive Illustration Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shadow-lg shadow-[#ED1725]/20">
            <Users size={30} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ED1725] text-white flex items-center justify-center text-xs shadow-md">
            <Sparkles size={12} />
          </div>
        </div>

        {/* Section Heading & Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#ED1725]">
            Be an Early Pioneer
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Find Your Deal Group
          </h3>
          <p className="text-sm sm:text-base text-white/90 font-medium max-w-lg mx-auto">
            Looks like you're early! Be among the first to bring buyers together and unlock better car deals.
          </p>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto pt-1 leading-relaxed">
            Choose your dream car and create the first buying group in {city}. When 5 buyers unite, dealerships compete to offer bulk discounts.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            onClick={onStartGroup}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white font-heading font-bold text-sm shadow-xl shadow-[#ED1725]/30 hover:shadow-[#ED1725]/50 transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <Plus size={16} />
            <span>Start the First Group</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Trust Note */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#A1A1AA] pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#ED1725]" /> Verified Dealerships
          </span>
          <span>•</span>
          <span>Zero Obligation to Join</span>
          <span>•</span>
          <span>100% Privacy Shield</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 2. EmptyQuotesState — Rule C: No dealer quotations
 */
export const EmptyQuotesState = ({ className = '' }) => {
  return (
    <div
      className={`rounded-2xl bg-[#17191D]/70 border border-white/10 p-6 sm:p-8 text-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
        <FileSpreadsheet size={22} />
      </div>
      <div className="space-y-1">
        <h4 className="font-heading font-bold text-white text-sm sm:text-base">
          Awaiting Dealership Quotations
        </h4>
        <p className="text-xs text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
          Dealer offers will appear here once dealerships submit their quotations. Verified dealers in your region review demand requests as groups form.
        </p>
      </div>
    </div>
  );
};

/**
 * 3. EmptyActivityState — Rule F: No recent activity
 */
export const EmptyActivityState = ({ className = '' }) => {
  return (
    <div
      className={`rounded-2xl bg-[#17191D]/70 border border-white/10 p-6 text-center space-y-2.5 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
        <Activity size={20} />
      </div>
      <h4 className="font-heading font-bold text-white text-xs sm:text-sm">
        Community Activity Initializing
      </h4>
      <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
        No recent activity yet. As buyers join collectives and dealer quotes arrive, live updates will appear here.
      </p>
    </div>
  );
};

/**
 * 4. EmptySearchState — When search/filter returns 0 results
 */
export const EmptySearchState = ({ onReset, message = 'Adjust your search criteria or clear filters to view all available showroom models.' }) => {
  return (
    <div className="rounded-2xl bg-[#17191D] border border-white/10 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
        <Search size={22} />
      </div>
      <div className="space-y-1">
        <h4 className="font-heading font-bold text-white text-base">
          No Matching Models Found
        </h4>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          {message}
        </p>
      </div>
      {onReset && (
        <div>
          <button
            onClick={onReset}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * 5. EmptyCatalogueState — Rule G: When catalogue has 0 cars in DB
 */
export const EmptyCatalogueState = ({ onRetry, isAdmin = false, onAdminAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-[#17191D] border border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ED1725] mx-auto shadow-md">
        <Car size={26} />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading font-bold text-white text-lg sm:text-xl">
          Showroom Catalogue Updating
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
          No vehicles are currently published in the catalogue. Verified models and trims can be published directly via the Admin Console.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCw size={13} />
            <span>Refresh Catalogue</span>
          </button>
        )}
        {isAdmin && onAdminAction && (
          <button
            onClick={onAdminAction}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Vehicle via Admin Console</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * 6. LoadingState — Elegant automotive loading indicator
 */
export const LoadingState = ({ message = 'Connecting to verified dealership network...' }) => {
  return (
    <div className="py-16 text-center space-y-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#ED1725] animate-spin" />
        <Car size={16} className="absolute text-[#ED1725] opacity-80" />
      </div>
      <p className="text-xs font-medium text-[#A1A1AA] tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

/**
 * 7. ErrorState — Rule 5: Never interpret API failure as empty DB
 */
export const ErrorState = ({ message = 'Unable to reach the DriveDeals server. Please verify your connection.', onRetry }) => {
  return (
    <div className="rounded-2xl bg-[#17191D] border border-[#ED1725]/30 p-8 text-center space-y-4 max-w-lg mx-auto shadow-xl">
      <div className="w-12 h-12 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] mx-auto">
        <AlertTriangle size={24} />
      </div>
      <div className="space-y-1">
        <h4 className="font-heading font-bold text-white text-base">
          Connection Interrupted
        </h4>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <div className="pt-1">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <RotateCw size={13} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
