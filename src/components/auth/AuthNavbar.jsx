import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

export const AuthNavbar = ({ currentTab = 'login', onSelectTab }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [cityOpen, setCityOpen] = useState(false);

  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];

  const handleSignInClick = (e) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab('login');
    else navigate('/login');
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab('register');
    else navigate('/register');
  };

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between border-b border-white/10 bg-[#090B0D]/80 backdrop-blur-md">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-full bg-[#ED1725] flex items-center justify-center p-0.5 shadow-lg shadow-[#ED1725]/30">
          <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#ED1725]" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-black text-lg tracking-tight text-white leading-none group-hover:text-white transition-colors">
            DRIVE<span className="text-[#ED1725]">DEALS</span>
          </span>
          <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#A1A1AA] uppercase mt-1 leading-none">
            BUY SMARTER, TOGETHER
          </span>
        </div>
      </Link>

      {/* Middle Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#A1A1AA]">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white font-bold relative py-1 hover:text-white transition-colors"
        >
          <Home size={14} className="text-[#ED1725]" />
          <span>Home</span>
          <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#ED1725] rounded-full" />
        </Link>
        <Link to="/cars" className="hover:text-white transition-colors">
          Explore Cars
        </Link>
        <Link to="/groups" className="hover:text-white transition-colors">
          Deal Groups
        </Link>
        <Link to="/how-it-works" className="hover:text-white transition-colors">
          How It Works
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* City Selector Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCityOpen(!cityOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <MapPin size={12} className="text-[#ED1725]" />
            <span>{selectedCity}</span>
            <ChevronDown size={11} className="text-[#71717A]" />
          </button>

          {cityOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-[#17191D] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCity(c);
                    setCityOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedCity === c
                      ? 'text-[#ED1725] font-bold bg-[#ED1725]/10'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign In text link */}
        <button
          type="button"
          onClick={handleSignInClick}
          className={`text-xs font-semibold px-2 py-1.5 transition-colors cursor-pointer ${
            currentTab === 'login' ? 'text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          Sign In
        </button>

        {/* Get Started red button */}
        <button
          type="button"
          onClick={handleGetStartedClick}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#ED1725] hover:bg-[#C4121E] active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-[#ED1725]/25 transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
};
export default AuthNavbar;
