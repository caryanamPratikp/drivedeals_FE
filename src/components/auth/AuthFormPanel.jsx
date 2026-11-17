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
  ShieldCheck,
  Lock,
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

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative px-3 bg-[#121417] text-xs font-semibold text-[#71717A] uppercase">
          or
        </span>
      </div>

      {/* Social / Fast Options (Matching Reference Image) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Google Option */}
        <button
          type="button"
          onClick={() => {
            alert('Google Fast Sign-In is configured for production domain. Please use Mobile OTP verification.');
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0B0D0F] hover:bg-white/5 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="truncate">Google</span>
        </button>

        {/* WhatsApp Option */}
        <button
          type="button"
          onClick={() => {
            alert('WhatsApp OTP notification will be delivered to your registered mobile number.');
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0B0D0F] hover:bg-white/5 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.079.529 4.117 1.544 5.934L0 24l6.23-1.635a11.9 11.9 0 005.801 1.622h.005c6.632 0 12-5.367 12-11.987A11.95 11.95 0 0012.031 0zm0 21.972h-.004a9.92 9.92 0 01-5.059-1.385l-.363-.215-3.754.984.999-3.662-.236-.376a9.96 9.96 0 01-1.526-5.331c0-5.503 4.477-9.98 9.98-9.98a9.93 9.93 0 017.067 2.929 9.94 9.94 0 012.924 7.062c0 5.504-4.477 9.978-9.979 9.978z" />
          </svg>
          <span className="truncate">WhatsApp</span>
        </button>
      </div>

      {/* Footer Toggle Link */}
      <div className="text-center text-xs text-[#A1A1AA]">
        {tab === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => onTabChange('register')}
              className="text-[#ED1725] font-bold hover:underline cursor-pointer"
            >
              Register now
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onTabChange('login')}
              className="text-[#ED1725] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        )}
      </div>

      {/* Compliance Guarantee */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-[#71717A]">
        <span className="flex items-center gap-1">
          <Lock size={12} /> 256-bit Encrypted
        </span>
        <span className="flex items-center gap-1 text-[#22C55E]">
          <ShieldCheck size={12} /> DPDP 2023 Shield
        </span>
      </div>
    </div>
  );
};
export default AuthFormPanel;
