import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  LayoutDashboard,
  Users,
  Car,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Settings,
  FileText,
  Tag,
  Building2,
  AlertTriangle,
  FileCheck,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ role = 'BUYER' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navConfigs = {
    BUYER: {
      portalTitle: 'Buyer Portal',
      badgeColor: 'text-[#ED1725] bg-[#ED1725]/15 border-[#ED1725]/30',
      links: [
        { to: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/buyer/cars', label: 'Explore Cars', icon: Car },
        { to: '/buyer/groups', label: 'My Car Groups', icon: Users },
        { to: '/buyer/offers', label: 'Showroom Offers', icon: FileSpreadsheet },
        { to: '/buyer/leads', label: 'Test Drives & Visits', icon: CheckCircle2 },
        { to: '/buyer/consents', label: 'Privacy & Sharing', icon: ShieldCheck },
        { to: '/buyer/profile', label: 'My Profile', icon: Settings },
      ],
    },
    DEALER: {
      portalTitle: 'Dealer Operations',
      badgeColor: 'text-[#22C55E] bg-[#22C55E]/15 border-[#22C55E]/30',
      links: [
        { to: '/dealer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/dealer/quote-requests', label: 'Car Groups (RFQs)', icon: FileText },
        { to: '/dealer/offers', label: 'My Price Quotes', icon: Tag },
        { to: '/dealer/leads', label: 'Interested Buyers', icon: Users },
        { to: '/dealer/profile', label: 'Dealership Profile', icon: Building2 },
      ],
    },
    ADMIN: {
      portalTitle: 'Admin Console',
      badgeColor: 'text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30',
      links: [
        { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/admin/catalogue', label: 'Vehicle Catalogue', icon: Car },
        { to: '/admin/dealers', label: 'Dealer Approvals', icon: Building2 },
        { to: '/admin/groups', label: 'Group Management', icon: Users },
        { to: '/admin/moderation', label: 'Moderation Queue', icon: AlertTriangle },
        { to: '/admin/leads', label: 'Lead Audits', icon: FileCheck },
        { to: '/admin/audit', label: 'Audit Trail', icon: Shield },
      ],
    },
  };

  const config = navConfigs[role] || navConfigs.BUYER;

  return (
    <aside
      className={`relative z-30 shrink-0 bg-[#111315] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ED1725]" />
                </div>
              </div>
              <div className="truncate">
                <span className="font-heading font-black text-lg tracking-tight text-white block leading-none">
                  DRIVE<span className="text-[#ED1725]">DEALS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mt-1 block">
                  {config.portalTitle}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mx-auto shadow-inner">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ED1725]" />
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar collapse"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center border border-white/10 transition-colors shrink-0 cursor-pointer ml-1"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!collapsed && (
          <div className="px-5 pt-4 pb-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.badgeColor}`}>
              <Sparkles size={11} />
              <span>{role} ACCOUNT</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {config.links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.endsWith('/dashboard') || item.to.endsWith('/catalogue')}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative select-none ${
                    isActive
                      ? 'bg-[#ED1725] text-white shadow-lg shadow-[#ED1725]/30'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#71717A] group-hover:text-white'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {collapsed && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card & Sign Out */}
      <div className="p-3 border-t border-white/10">
        {!collapsed ? (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#17191D] to-[#202328] border border-white/15 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.name || 'Authorized User'}
                </p>
                <p className="text-[10px] text-[#71717A] truncate font-mono mt-0.5">
                  {currentUser?.phone || currentUser?.email || 'Active Session'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-[#ED1725]/15 border border-white/10 hover:border-[#ED1725]/30 text-xs font-bold text-[#A1A1AA] hover:text-[#ED1725] transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              title={currentUser?.name || 'User Profile'}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-xs"
            >
              {(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#ED1725]/15 border border-white/10 hover:border-[#ED1725]/30 text-[#A1A1AA] hover:text-[#ED1725] flex items-center justify-center transition-all cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
