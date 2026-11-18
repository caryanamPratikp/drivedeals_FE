import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Menu,
  X,
  User,
  Shield,
  Briefcase,
  LogOut,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = currentUser?.role || 'PUBLIC';
  const isAuthenticated =
    userRole !== 'PUBLIC' && !!currentUser?.id && currentUser?.id !== 'guest';

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

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="navbar"
      className="fixed top-3 sm:top-4 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-6 pointer-events-none"
    >
      {/* Floating Pill Container with Circular Border */}
      <div className="w-full bg-[#111315]/90 backdrop-blur-xl border border-white/15 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between pointer-events-auto transition-all duration-300">
        
        {/* 1. Brand Logo */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 group select-none shrink-0"
        >
          <img
            src="/assets/logo/drivedeals-logo.png"
            alt="DriveDeals"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/cars"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isActive('/cars')
                ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            Explore Cars
          </Link>
          <Link
            to="/groups"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isActive('/groups')
                ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            Deal Groups
          </Link>
          <Link
            to="/how-it-works"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isActive('/how-it-works')
                ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            How It Works
          </Link>

          {/* Locked Target City Pill (Pune - No dropdown) */}
          <div className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-slate-200 select-none">
            <MapPin size={13} className="text-[#ED1725]" />
            <span>Pune</span>
            <span className="hidden xl:inline text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded-full font-medium">
              Pilot Hub
            </span>
          </div>
        </nav>

        {/* 3. Action Buttons & Profile Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold shadow-lg shadow-[#ED1725]/30 hover:shadow-[#ED1725]/50 transition-all duration-200 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to={getPortalPath()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all shadow-sm"
              >
                {userRole === 'BUYER' && <User size={13} className="text-[#ED1725]" />}
                {userRole === 'DEALER' && <Briefcase size={13} className="text-[#22C55E]" />}
                {userRole === 'ADMIN' && <Shield size={13} className="text-[#38BDF8]" />}
                <span>
                  {userRole === 'BUYER'
                    ? 'Buyer Dashboard'
                    : userRole === 'DEALER'
                    ? 'Dealer Desk'
                    : 'Admin Console'}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-full bg-white/5 hover:bg-[#ED1725]/15 border border-white/10 hover:border-[#ED1725]/30 text-[#A1A1AA] hover:text-[#ED1725] transition-all cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>

        {/* 4. Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Locked City badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-200">
            <MapPin size={11} className="text-[#ED1725]" />
            <span>Pune</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-3xl bg-[#17191D]/95 backdrop-blur-xl border border-white/15 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleHomeClick(e);
              }}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              to="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5"
            >
              Explore Cars
            </Link>
            <Link
              to="/groups"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5"
            >
              Deal Groups
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5"
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
                  className="w-full text-center py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#ED1725] text-white text-xs font-bold shadow-lg shadow-[#ED1725]/30 hover:bg-[#A30E18]"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getPortalPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#ED1725] text-white text-xs font-bold shadow-lg shadow-[#ED1725]/30"
                >
                  Go to {userRole === 'BUYER' ? 'Buyer Dashboard' : userRole === 'DEALER' ? 'Dealer Desk' : 'Admin Console'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#EF4444]"
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

export default Navbar;
