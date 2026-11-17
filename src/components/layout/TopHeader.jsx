import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Bell,
  User,
  ChevronRight,
  LogOut,
  Shield,
  Briefcase,
  Check,
  Menu,
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { formatDateTime } from '../../lib/dates';

export const TopHeader = ({ onMobileMenuToggle }) => {
  const { currentUser, notifications = [], fetchNotifications, markNotificationRead, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (currentUser && typeof fetchNotifications === 'function') {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUser?.id, fetchNotifications]);

  const userRole = currentUser?.role || 'BUYER';

  // Compute breadcrumbs
  const pathnames = location.pathname.split('/').filter((x) => x);
  const formatBreadcrumb = (name) => {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Filter relevant notifications
  const userNotifications = notifications.filter(
    (n) =>
      !n.recipientRole ||
      n.recipientRole === userRole ||
      n.recipientId === currentUser?.id ||
      n.recipientId === currentUser?.dealerId
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notif) => {
    if (!notif.read && typeof markNotificationRead === 'function') {
      await markNotificationRead(notif.id);
    }
    setNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-[#090B0D]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            aria-label="Open navigation menu"
            className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Menu size={18} />
          </button>
        )}

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <Link to="/" className="text-[#71717A] hover:text-white transition-colors">
            DriveDeals
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return (
              <React.Fragment key={to}>
                <ChevronRight size={12} className="text-[#71717A]" />
                {isLast ? (
                  <span className="text-white font-bold">{formatBreadcrumb(value)}</span>
                ) : (
                  <Link to={to} className="text-[#A1A1AA] hover:text-white transition-colors">
                    {formatBreadcrumb(value)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Notification Bell & Avatar Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="Open notifications"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ED1725] text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-[#ED1725]/50 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#17191D] border border-white/15 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ED1725]/15 text-[#ED1725] border border-[#ED1725]/30">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-[#71717A] hover:text-white text-xs"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#71717A]">
                    No new activity notifications.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer group ${
                        notif.read
                          ? 'bg-white/[0.02] border-white/5 text-[#A1A1AA] hover:bg-white/[0.05]'
                          : 'bg-white/[0.06] border-[#ED1725]/30 text-white shadow-sm hover:border-[#ED1725]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold flex items-center gap-1.5">
                          {notif.title || 'Platform Alert'}
                          {notif.link && (
                            <ArrowRight size={12} className="text-[#ED1725] opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#ED1725] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                        {notif.message || notif.content}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[#71717A] font-mono">
                          {formatDateTime(notif.createdAt || new Date())}
                        </span>
                        {notif.link && (
                          <span className="text-[10px] text-[#ED1725] font-semibold flex items-center gap-0.5">
                            View details
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ED1725] text-white flex items-center justify-center font-bold text-xs shadow-md">
              {(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {(currentUser?.name || 'User').split(' ')[0]}
              </span>
              <span className="text-[10px] font-bold text-[#ED1725] uppercase tracking-wider block">
                {userRole}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#17191D] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-[#71717A] truncate font-mono mt-0.5">
                  {currentUser?.phone || currentUser?.email || 'Logged in'}
                </p>
              </div>

              <div className="p-1 space-y-1">
                {userRole === 'BUYER' && (
                  <Link
                    to="/buyer/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={14} /> Profile & Settings
                  </Link>
                )}
                {userRole === 'DEALER' && (
                  <Link
                    to="/dealer/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Briefcase size={14} /> Dealership Profile
                  </Link>
                )}

                <Link
                  to="/"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink size={14} /> Public Website
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
