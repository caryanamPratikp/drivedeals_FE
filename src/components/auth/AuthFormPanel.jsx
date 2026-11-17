import React from 'react';
import {
  User,
  Edit3,
  Smartphone,
  Building2,
  Briefcase,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export const AuthFormPanel = ({
  tab = 'login',
  onTabChange,
  phone,
  onPhoneChange,
  name,
  onNameChange,
  role,
  onRoleChange,
  dealershipName,
  onDealershipNameChange,
  dealerBrand,
  onDealerBrandChange,
  city,
  onCityChange,
  loading = false,
  error = null,
  onSubmit,
}) => {
  return (
    <div className="relative w-full max-w-[440px] bg-[#121417]/95 border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-[0_0_60px_rgba(237,23,37,0.12)] backdrop-blur-xl overflow-hidden">
      {/* Subtle Top-Right Red Racing Slash Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden">
        <svg className="w-full h-full text-[#ED1725] opacity-25" viewBox="0 0 100 100" fill="none">
          <line x1="40" y1="-10" x2="110" y2="60" stroke="#ED1725" strokeWidth="8" strokeLinecap="round" />
          <line x1="60" y1="-10" x2="130" y2="60" stroke="#ED1725" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="-10" x2="150" y2="60" stroke="#ED1725" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top Tab Switcher */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          type="button"
          onClick={() => onTabChange('login')}
          className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
            tab === 'login' ? 'text-white' : 'text-[#71717A] hover:text-[#A1A1AA]'
          }`}
        >
          <User size={15} className={tab === 'login' ? 'text-[#ED1725]' : 'text-[#71717A]'} />
          <span>Login</span>
          {tab === 'login' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ED1725] rounded-full shadow-[0_0_8px_#ED1725]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('register')}
          className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
            tab === 'register' ? 'text-white' : 'text-[#71717A] hover:text-[#A1A1AA]'
          }`}
        >
          <Edit3 size={15} className={tab === 'register' ? 'text-[#ED1725]' : 'text-[#71717A]'} />
          <span>Register</span>
          {tab === 'register' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ED1725] rounded-full shadow-[0_0_8px_#ED1725]" />
          )}
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-1 mb-6 text-left">
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
          {tab === 'login' ? 'Welcome Back!' : 'Create your DriveDeals account'}
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          {tab === 'login'
            ? 'Sign in to continue your car buying journey'
            : 'Start your journey towards a smarter car purchase.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium leading-relaxed">{error}</p>
            {error.includes('register with us') && tab === 'login' && (
              <button
                type="button"
                onClick={() => onTabChange('register')}
                className="mt-1 text-xs font-bold text-[#EF4444] underline hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                Create an account now <ChevronRight className="w-3 h-3" />
              </button>
            )}
            {error.includes('already registered') && tab === 'register' && (
              <button
                type="button"
                onClick={() => onTabChange('login')}
                className="mt-1 text-xs font-bold text-[#EF4444] underline hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                Switch to Login <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {tab === 'register' && (
          <>
            {/* Role Switcher */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#090B0D] border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => onRoleChange('BUYER')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === 'BUYER'
                      ? 'bg-[#ED1725] text-white shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <User size={13} /> Individual Buyer
                </button>
                <button
                  type="button"
                  onClick={() => onRoleChange('DEALER')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === 'DEALER'
                      ? 'bg-[#202328] text-white shadow-sm border border-white/20'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Briefcase size={13} /> Dealership
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3.5 text-[#71717A]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0B0D0F] border border-white/10 text-sm font-medium text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] focus:ring-1 focus:ring-[#ED1725] transition-all"
                />
              </div>
            </div>

            {/* Dealership Details if Dealer */}
            {role === 'DEALER' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Dealership Brand & Legal Entity
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-3.5 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune City Motors Pvt Ltd"
                      value={dealershipName}
                      onChange={(e) => onDealershipNameChange(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0B0D0F] border border-white/10 text-sm font-medium text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] focus:ring-1 focus:ring-[#ED1725] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Authorized OEM Brand
                  </label>
                  <select
                    value={dealerBrand}
                    onChange={(e) => onDealerBrandChange(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0B0D0F] border border-white/10 text-sm font-medium text-white focus:outline-none focus:border-[#ED1725] focus:ring-1 focus:ring-[#ED1725] transition-all"
                  >
                    <option value="Mahindra">Mahindra Authorized Dealer</option>
                    <option value="Kia">Kia Authorized Dealer</option>
                    <option value="Tata Motors">Tata Motors Authorized Dealer</option>
                    <option value="Hyundai">Hyundai Authorized Dealer</option>
                    <option value="Maruti Suzuki">Maruti Suzuki Authorized Dealer</option>
                    <option value="Toyota">Toyota Authorized Dealer</option>
                    <option value="ALL">Multi-Brand Partner (All Brands)</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* Mobile Number Field */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
            Mobile Number
          </label>
          <div className="flex rounded-xl border border-white/10 overflow-hidden focus-within:border-[#ED1725] focus-within:ring-1 focus-within:ring-[#ED1725] transition-all bg-[#0B0D0F]">
            <span className="px-3.5 py-3 bg-[#17191D] text-white text-sm font-bold border-r border-white/10 flex items-center gap-1.5 select-none text-[#A1A1AA]">
              <Smartphone size={14} className="text-[#ED1725]" />
              <span className="text-white">+91</span>
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full px-3.5 py-3 text-sm font-semibold tracking-wider text-white placeholder-[#71717A] focus:outline-none bg-transparent"
            />
          </div>
          <p className="text-[11px] text-[#71717A] mt-1.5">
            {tab === 'login'
              ? 'We verify your account with a secure one-time passcode.'
              : 'Account activation passcode will be generated for instant verification.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#ED1725] hover:bg-[#C4121E] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-[#ED1725]/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Checking Credentials...</span>
            </>
          ) : (
            <>
              <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
export default AuthFormPanel;
