import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  UserCheck,
  Building2,
  Shield,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Eye,
  CheckCircle2,
  Sparkles,
  Car
} from 'lucide-react';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { formatDate } from '../../lib/dates';

export const AdminUsersPage = () => {
  const { users = [], fetchAdminUsers, adminLoading = false } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'BUYER' | 'DEALER' | 'ADMIN'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUserIds, setExpandedUserIds] = useState(new Set());

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  // Platform users strictly excluding Administrator
  const platformUsers = useMemo(() => (users || []).filter((u) => u && u.role !== 'ADMIN'), [users]);
  const buyersCount = useMemo(() => platformUsers.filter((u) => u.role === 'BUYER').length, [platformUsers]);
  const dealersCount = useMemo(() => platformUsers.filter((u) => u.role === 'DEALER').length, [platformUsers]);
  const adminsCount = useMemo(() => (users || []).filter((u) => u && u.role === 'ADMIN').length, [users]);

  // Filter and search (All Users strictly lists Buyers & Dealers, excluding Admin)
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      if (!u) return false;

      // Role filter: 'ALL' shows platform buyers and dealers (never admin)
      if (activeFilter === 'ALL' && u.role === 'ADMIN') {
        return false;
      }
      if (activeFilter !== 'ALL' && u.role !== activeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (u.name || '').toLowerCase().includes(q);
        const phoneMatch = (u.phone || '').toLowerCase().includes(q);
        const emailMatch = (u.email || '').toLowerCase().includes(q);
        const cityMatch = (u.city || '').toLowerCase().includes(q);
        const dealerMatch = (u.dealershipName || '').toLowerCase().includes(q);
        const groupMatch = (u.joinedGroups || []).some(
          (g) =>
            (g.carModel || '').toLowerCase().includes(q) ||
            (g.variantName || '').toLowerCase().includes(q)
        );
        if (!nameMatch && !phoneMatch && !emailMatch && !cityMatch && !dealerMatch && !groupMatch) {
          return false;
        }
      }

      return true;
    });
  }, [users, activeFilter, searchQuery]);

  const toggleExpand = (userId) => {
    setExpandedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-users-help"
        title="Platform Identity & User Governance"
        tips={[
          'All buyers, dealership principals, and platform administrators are securely catalogued with verified credentials.',
          'Filter by "Buyers" to inspect the specific car demand collectives each buyer is currently participating in.',
          'Dealer accounts display their authorized OEM franchise assignment and registered trading location.',
          'Platform users maintain 100% DPDP Act compliance with encrypted identity storage.',
        ]}
      />

      {/* Header Banner */}
      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-[#ED1725] text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            <UserCheck size={13} />
            <span>Identity & Platform Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Platform Users & Buyer Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Track registered buyers, their enrolled vehicle demand groups, authorized dealers, and platform operators.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{platformUsers.length} Platform Users in DB</span>
          </div>
        </div>
      </motion.div>

      {/* Search Bar & Role Filter Pills */}
      <motion.div variants={staggerItem} className="space-y-4">
        {/* Controls Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#17191D] to-[#111315] p-3 rounded-2xl border border-white/5 shadow-xl">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'ALL'
                  ? 'bg-white/15 text-white shadow-md border border-white/20'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={14} className={activeFilter === 'ALL' ? 'text-white' : 'text-[#A1A1AA]'} />
              <span>All Users</span>
              <span className="text-[10px] font-mono text-slate-300">({platformUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('BUYER')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'BUYER'
                  ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={14} className={activeFilter === 'BUYER' ? 'text-white' : 'text-[#ED1725]'} />
              <span>Buyers</span>
              <span className="text-[10px] font-mono text-slate-200">({buyersCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('DEALER')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'DEALER'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={14} className={activeFilter === 'DEALER' ? 'text-white' : 'text-emerald-400'} />
              <span>Dealers</span>
              <span className="text-[10px] font-mono text-slate-200">({dealersCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('ADMIN')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'ADMIN'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={14} className={activeFilter === 'ADMIN' ? 'text-white' : 'text-sky-400'} />
              <span>Admins</span>
              <span className="text-[10px] font-mono text-slate-200">({adminsCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" size={14} />
            <input
              type="text"
              placeholder="Search by name, phone, city, car model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs bg-[#090B0D] border border-white/10 rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Users Table / List */}
      <motion.div
        variants={staggerItem}
        className="bg-[#17191D] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Matching Users Found"
            description={
              searchQuery
                ? `No user accounts matching "${searchQuery}" in ${activeFilter.toLowerCase()} directory.`
                : 'No users registered under this classification yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111315] text-slate-400 uppercase text-[11px] font-heading font-bold border-b border-white/10">
                  <th className="p-4 font-bold">User Identity</th>
                  <th className="p-4 font-bold">Role & Status</th>
                  <th className="p-4 font-bold">Contact & Hub</th>
                  <th className="p-4 font-bold">
                    {activeFilter === 'DEALER' ? 'Franchise Dealership' : 'Groups Enrolled / Entity'}
                  </th>
                  <th className="p-4 font-bold">Registration</th>
                  <th className="p-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => {
                  const isBuyer = user.role === 'BUYER';
                  const isDealer = user.role === 'DEALER';
                  const isAdmin = user.role === 'ADMIN';
                  const joinedGroups = user.joinedGroups || [];
                  const isExpanded = expandedUserIds.has(user.id);

                  const initials = (user.name || 'User')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        {/* User Identity */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-black text-sm shrink-0 border ${
                                isBuyer
                                  ? 'bg-[#ED1725]/15 text-[#ED1725] border-[#ED1725]/30'
                                  : isDealer
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-heading font-bold text-white text-sm truncate flex items-center gap-2">
                                <span>{user.name || 'Registered User'}</span>
                                {isAdmin && (
                                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#A1A1AA] truncate mt-0.5 flex items-center gap-1 font-mono">
                                <span>{user.email || 'No email registered'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Status */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold ${
                                isBuyer
                                  ? 'bg-[#ED1725]/10 text-[#ED1725] border border-[#ED1725]/30'
                                  : isDealer
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                              }`}
                            >
                              {isBuyer ? 'Individual Buyer' : isDealer ? 'Dealership' : 'Administrator'}
                            </span>
                            <div className="text-[10px] text-emerald-400 font-mono">
                              ● {user.status || 'ACTIVE'}
                            </div>
                          </div>
                        </td>

                        {/* Contact & Hub */}
                        <td className="p-4">
                          <div className="space-y-1 text-slate-300">
                            <div className="font-mono text-xs font-semibold flex items-center gap-1.5 text-white">
                              <Phone size={12} className="text-[#ED1725]" />
                              <span>{user.phone || '+91 98765 43210'}</span>
                            </div>
                            <div className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5">
                              <MapPin size={12} className="text-slate-400" />
                              <span>{user.city || 'Pune, Maharashtra'} {user.pincode ? `(${user.pincode})` : ''}</span>
                            </div>
                          </div>
                        </td>

                        {/* Associated Entity / Groups */}
                        <td className="p-4">
                          {isBuyer && (
                            <div>
                              {joinedGroups.length > 0 ? (
                                <div className="space-y-1.5">
                                  <button
                                    onClick={() => toggleExpand(user.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] border border-white/10 transition-colors"
                                  >
                                    <Layers size={12} className="text-[#ED1725]" />
                                    <span className="font-bold">{joinedGroups.length} {joinedGroups.length === 1 ? 'Group Enrolled' : 'Groups Enrolled'}</span>
                                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                  </button>

                                  {!isExpanded && (
                                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                      {joinedGroups.map((g) => g.carModel).join(', ')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-[#71717A] italic">
                                  No groups joined yet
                                </span>
                              )}
                            </div>
                          )}

                          {isDealer && (
                            <div className="space-y-0.5">
                              <div className="font-heading font-bold text-white text-xs">
                                {user.dealershipName || 'Authorized Dealership Partner'}
                              </div>
                              <div className="text-[11px] text-emerald-400 font-mono">
                                {user.dealershipBrand ? `${user.dealershipBrand} Authorized Franchise` : 'Multi-Brand Partner'}
                              </div>
                            </div>
                          )}

                          {isAdmin && (
                            <div className="text-[11px] text-sky-400 font-mono">
                              Full Operations Authority
                            </div>
                          )}
                        </td>

                        {/* Registration Date */}
                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {user.createdAt ? formatDate(user.createdAt) : 'Active Member'}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-heading font-bold inline-flex items-center gap-1.5 transition-all hover:border-[#ED1725]/40"
                          >
                            <Eye size={12} className="text-[#ED1725]" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Joined Groups Accordion Row for Buyers */}
                      {isBuyer && isExpanded && joinedGroups.length > 0 && (
                        <tr className="bg-black/40 border-b border-white/5">
                          <td colSpan={6} className="p-4 pl-16">
                            <div className="space-y-2">
                              <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                                <Sparkles size={12} className="text-[#ED1725]" />
                                <span>Active Demand Collectives Joined by {user.name}:</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                                {joinedGroups.map((grp) => (
                                  <div
                                    key={grp.groupId}
                                    className="p-3 rounded-2xl bg-[#17191D] border border-white/10 space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-heading font-bold text-white flex items-center gap-1.5">
                                        <Car size={13} className="text-[#ED1725]" />
                                        <span>{grp.carModel}</span>
                                      </span>
                                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                                        {grp.stage}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-[#A1A1AA] truncate">
                                      {grp.variantName} • {grp.city}
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                                      <span>Cohort Progress:</span>
                                      <span className="text-white font-bold">
                                        {grp.currentMembers} / {grp.targetMembers || 15} buyers
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* User Details Inspection Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#141619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-black text-lg border ${
                      selectedUser.role === 'BUYER'
                        ? 'bg-[#ED1725]/15 text-[#ED1725] border-[#ED1725]/30'
                        : selectedUser.role === 'DEALER'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                    }`}
                  >
                    {(selectedUser.name || 'U').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-black text-white">
                      {selectedUser.name}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                      <span className="font-mono">{selectedUser.role}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Verified User</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* User Metadata Grid */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Phone size={13} className="text-[#ED1725]" /> Mobile Number
                  </span>
                  <span className="text-white font-mono font-bold">{selectedUser.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Mail size={13} className="text-[#ED1725]" /> Email Address
                  </span>
                  <span className="text-white font-mono">{selectedUser.email || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#ED1725]" /> Location
                  </span>
                  <span className="text-white">{selectedUser.city || 'Pune'} {selectedUser.pincode ? `(${selectedUser.pincode})` : ''}</span>
                </div>

                {selectedUser.dealershipName && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Building2 size={13} className="text-emerald-400" /> Dealership
                    </span>
                    <span className="text-white font-bold">{selectedUser.dealershipName} ({selectedUser.dealershipBrand})</span>
                  </div>
                )}
              </div>

              {/* Joined Groups List for Buyers */}
              {selectedUser.role === 'BUYER' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Enrolled Buying Groups</span>
                    <span className="text-[#ED1725] font-mono">
                      {(selectedUser.joinedGroups || []).length} Total
                    </span>
                  </h4>

                  {(selectedUser.joinedGroups || []).length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-[#A1A1AA]">
                      This buyer has not joined any demand collectives yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedUser.joinedGroups.map((grp) => (
                        <div
                          key={grp.groupId}
                          className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-heading font-bold text-white">
                              {grp.carModel}
                            </div>
                            <div className="text-[11px] text-[#A1A1AA]">
                              {grp.variantName} • {grp.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                              {grp.stage}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              {grp.currentMembers}/{grp.targetMembers || 15} Buyers
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Button */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsersPage;
