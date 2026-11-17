import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Bell,
  Menu,
  X,
  User,
  Shield,
  Briefcase,
  LogOut,
  MapPin,
  ChevronDown,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { formatDateTime } from '../../lib/dates';

export const Navbar = () => {
  const { currentUser, notifications = [], markNotificationRead, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || 'Pune');

  const userRole = currentUser?.role || 'PUBLIC';
  const isAuthenticated = userRole !== 'PUBLIC' && !!currentUser?.id && currentUser?.id !== 'guest';

  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];

  const userNotifications = notifications.filter(
    (n) =>
      !n.recipientRole ||
      n.recipientRole === userRole ||
      n.recipientId === currentUser?.id ||
      n.recipientId === currentUser?.dealerId
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const getPortalPath = () => {
    if (userRole === 'BUYER') return '/buyer/dashboard';
    if (userRole === 'DEALER') return '/dealer/dashboard';
    if (userRole === 'ADMIN') return '/admin/dashboard';
    return '/buyer/dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090B0D]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* 1. Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ED1725]" />
              </div>
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tight text-white block leading-none">
                DRIVE<span className="text-[#ED1725]">DEALS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mt-1 block">
                Buy Smarter, Together
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/cars"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/cars')
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              Explore Cars
            </Link>
            <Link
              to="/groups"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/groups')
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              Deal Groups
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/how-it-works')
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              How It Works
            </Link>

            {/* City Selector Pill */}
            <div className="relative ml-2">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <MapPin size={13} className="text-[#ED1725]" />
                <span>{selectedCity}</span>
                <ChevronDown size={12} className="text-[#71717A]" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 rounded-xl bg-[#17191D] border border-white/15 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        selectedCity === city
                          ? 'bg-[#ED1725] text-white'
                          : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* 3. Action Buttons & Profile Controls */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold shadow-lg shadow-[#ED1725]/30 hover:shadow-[#ED1725]/50 transition-all duration-200 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Direct Link to User's Role Portal */}
                <Link
                  to={getPortalPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {userRole === 'BUYER' && <User size={13} className="text-[#ED1725]" />}
                  {userRole === 'DEALER' && <Briefcase size={13} className="text-[#22C55E]" />}
                  {userRole === 'ADMIN' && <Shield size={13} className="text-[#38BDF8]" />}
                  <span>Go to {userRole === 'BUYER' ? 'Buyer Dashboard' : userRole === 'DEALER' ? 'Dealer Desk' : 'Admin Console'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#ED1725]/15 border border-white/10 hover:border-[#ED1725]/30 text-[#A1A1AA] hover:text-[#ED1725] transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* 4. Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090B0D] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              to="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5"
            >
              Explore Cars
            </Link>
            <Link
              to="/groups"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5"
            >
              Deal Groups
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5"
            >
              How It Works
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-[#ED1725] text-white text-sm font-bold shadow-lg shadow-[#ED1725]/30"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getPortalPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-[#ED1725] text-white text-sm font-bold shadow-lg shadow-[#ED1725]/30"
                >
                  Go to {userRole === 'BUYER' ? 'Buyer Dashboard' : userRole === 'DEALER' ? 'Dealer Desk' : 'Admin Console'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#EF4444]"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
