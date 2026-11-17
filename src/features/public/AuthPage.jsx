import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { authApi } from '../../api';
import {
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  User,
  Briefcase,
  Building2,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { OtpInput } from '../../components/common/OtpInput';

export const AuthPage = ({ defaultTab = 'login' }) => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'register' ? 'register' : (defaultTab === 'register' ? 'register' : 'login');
  const [tab, setTab] = useState(initialTab);

  const { loginWithOtp } = useAppStore();
  const navigate = useNavigate();

  // Form states
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER'); // 'BUYER' | 'DEALER'
  const [dealershipName, setDealershipName] = useState('');
  const [dealerBrand, setDealerBrand] = useState('Mahindra');
  const [city, setCity] = useState('Pune');

  // OTP Verification states
  const [showOtpOverlay, setShowOtpOverlay] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const [devOtpHint, setDevOtpHint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Send OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (tab === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (role === 'DEALER' && !dealershipName.trim()) {
        setError('Please enter your authorized dealership name.');
        return;
      }
    }

    try {
      setLoading(true);
      const fullPhone = '+91' + cleanPhone;
      const mode = tab === 'login' ? 'LOGIN' : 'REGISTER';
      const res = await authApi.sendOtp(fullPhone, mode);

      const otpCode = cleanPhone.endsWith('9876543210') ? '123456' : (res.devOtp || '123456');
      setDevOtpHint(otpCode);
      setOtpValue(otpCode);
      setShowOtpOverlay(true);
    } catch (err) {
      setError(err.message || 'Unable to proceed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otpValue;
    setError(null);
    if (!code || code.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    try {
      setLoading(true);
      const cleanPhone = '+91' + phone.replace(/\D/g, '');
      const profile = tab === 'register' ? {
        name: name.trim(),
        role,
        city: city.trim(),
        dealershipName: role === 'DEALER' ? dealershipName.trim() : undefined,
        brand: role === 'DEALER' ? dealerBrand : undefined,
      } : {};

      const result = await loginWithOtp(cleanPhone, code, profile);

      if (result.success) {
        setIsUnlocking(true);
        setTimeout(() => {
          const userRole = result.user?.role;
          if (userRole === 'DEALER') {
            navigate('/dealer/dashboard');
          } else if (userRole === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/buyer/dashboard');
          }
        }, 1100);
      } else {
        setError(result.error || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      const cleanPhone = '+91' + phone.replace(/\D/g, '');
      const mode = tab === 'login' ? 'LOGIN' : 'REGISTER';
      const res = await authApi.sendOtp(cleanPhone, mode);
      const code = cleanPhone.endsWith('9876543210') ? '123456' : (res.devOtp || '123456');
      setDevOtpHint(code);
      setOtpValue(code);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  // 1-Click Demo Profile Authentication for This Tab Only
  const handleQuickPreset = async (quickPhone, quickProfile) => {
    setError(null);
    setLoading(true);
    try {
      const cleanPhone = quickPhone.replace(/\D/g, '');
      setPhone(cleanPhone);
      const res = await loginWithOtp(quickPhone, '123456', quickProfile);
      if (res.success) {
        setIsUnlocking(true);
        setTimeout(() => {
          if (res.user?.role === 'DEALER') {
            navigate('/dealer/dashboard');
          } else {
            navigate('/buyer/dashboard');
          }
        }, 800);
      } else {
        setTab('register');
        setName(quickProfile.name || '');
        setRole(quickProfile.role || 'BUYER');
        setCity(quickProfile.city || 'Pune');
        if (quickProfile.dealershipName) setDealershipName(quickProfile.dealershipName);
        if (quickProfile.brand) setDealerBrand(quickProfile.brand);
        setError('Please click "Register with us" to finish setting up this demo account.');
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B0D] text-white flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:p-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Hero / Brand Section */}
      <div className="relative z-10 w-full max-w-xl mb-10 lg:mb-0 lg:mr-16 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#A1A1AA] mb-6 w-fit backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#ED1725]" />
          <span>India&apos;s Group Car Buying Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white leading-tight sm:leading-none mb-6">
          BUY TOGETHER. <br />
          <span className="text-[#ED1725]">SAVE BIG ON ROAD.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-lg mb-8">
          Join forces with verified verified car buyers in your city to unlock transparent group pricing
          directly from authorized dealerships with 100% spam-free privacy protection.
        </p>

        {/* Blueprint Illustration */}
        <div className="relative w-full max-w-md h-36 rounded-2xl border border-white/10 bg-[#17191D]/50 backdrop-blur-md p-4 mb-8 hidden sm:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
          <svg className="w-full h-full text-white/30" viewBox="0 0 540 200" fill="none" stroke="currentColor">
            <rect x="20" y="30" width="120" height="70" rx="12" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="80" cy="65" r="16" strokeWidth="1.5" />
            <text x="80" y="69" fontSize="11" fill="currentColor" textAnchor="middle" fontWeight="bold">BUYER 1</text>

            <rect x="210" y="30" width="120" height="70" rx="12" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="270" cy="65" r="16" strokeWidth="1.5" />
            <text x="270" y="69" fontSize="11" fill="currentColor" textAnchor="middle" fontWeight="bold">BUYER 2</text>

            <rect x="400" y="30" width="120" height="70" rx="12" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="460" cy="65" r="16" strokeWidth="1.5" />
            <text x="460" y="69" fontSize="11" fill="currentColor" textAnchor="middle" fontWeight="bold">DEALER</text>

            <line x1="140" y1="65" x2="210" y2="65" stroke="#ED1725" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="330" y1="65" x2="400" y2="65" stroke="#22C55E" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="50" y1="140" x2="490" y2="140" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
          </svg>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3.5 max-w-xl">
          <div className="p-3.5 rounded-2xl bg-[#17191D] border border-white/10 backdrop-blur-md shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#ED1725]/15 flex items-center justify-center text-[#ED1725] mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white tracking-tight">Zero Haggling</div>
            <div className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">Guaranteed volume discounts locked upfront</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#17191D] border border-white/10 backdrop-blur-md shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white tracking-tight">Direct Group Pricing</div>
            <div className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">Verified dealers compete with transparent quotes</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#17191D] border border-white/10 backdrop-blur-md shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white tracking-tight">DPDP 2023 Shield</div>
            <div className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">Zero contact leaks until you approve consent</div>
          </div>
        </div>
      </div>

      {/* Right Side Form Card */}
      <div className="relative z-20 w-full max-w-md bg-[#17191D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
        {/* Brand Emblem */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090B0D] border border-white/10 flex items-center justify-center text-white shadow-md">
              <div className="w-4 h-4 rounded-full border-2 border-white/80 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ED1725]" />
              </div>
            </div>
            <span className="font-heading font-black text-lg tracking-tight text-white">
              DRIVE<span className="text-[#ED1725]">DEALS</span>
            </span>
          </Link>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#090B0D] text-[#A1A1AA] border border-white/10">
            Enterprise Security
          </span>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex p-1 bg-[#090B0D] border border-white/10 rounded-2xl mb-4 relative">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              tab === 'login'
                ? 'bg-[#17191D] text-white shadow-md border border-white/10'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              tab === 'register'
                ? 'bg-[#17191D] text-white shadow-md border border-white/10'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Register with us
          </button>
        </div>

        {/* Quick Demo Test Profiles (Tab-Isolated) */}
        <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ED1725]" />
              Quick Test Sign In (This Tab Only)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Multi-Tab Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleQuickPreset('+919876543210', {
                  name: 'Priya Sharma',
                  role: 'BUYER',
                  city: 'Pune',
                })
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group hover:border-[#ED1725]/40"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-[#ED1725] truncate">
                👤 Priya (Buyer 1)
              </div>
              <div className="text-[9px] text-[#71717A] font-mono mt-0.5">9876543210</div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleQuickPreset('+919876543211', {
                  name: 'Rahul Verma',
                  role: 'BUYER',
                  city: 'Pune',
                })
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group hover:border-[#ED1725]/40"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-[#ED1725] truncate">
                👤 Rahul (Buyer 2)
              </div>
              <div className="text-[9px] text-[#71717A] font-mono mt-0.5">9876543211</div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleQuickPreset('+919898989898', {
                  name: 'Sahyadri Mahindra Motors',
                  role: 'DEALER',
                  city: 'Pune',
                  dealershipName: 'Sahyadri Mahindra Motors Pvt Ltd',
                  brand: 'Mahindra',
                })
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group hover:border-emerald-500/40"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-emerald-400 truncate">
                🏢 Sahyadri Dealer
              </div>
              <div className="text-[9px] text-[#71717A] font-mono mt-0.5">9898989898</div>
            </button>
          </div>

          <p className="text-[10px] text-[#71717A] mt-2 text-center">
            💡 Tip: Open separate browser tabs to log in as Buyer and Dealer side-by-side!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium leading-relaxed">{error}</p>
              {error.includes('register with us') && tab === 'login' && (
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); }}
                  className="mt-1.5 text-xs font-bold text-[#EF4444] underline hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  Create an account now <ChevronRight className="w-3 h-3" />
                </button>
              )}
              {error.includes('already registered') && tab === 'register' && (
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); }}
                  className="mt-1.5 text-xs font-bold text-[#EF4444] underline hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  Switch to Login <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {tab === 'register' && (
            <>
              {/* Role Toggle */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#090B0D] border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('BUYER')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === 'BUYER'
                        ? 'bg-[#ED1725] text-white shadow-sm'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Individual Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DEALER')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === 'DEALER'
                        ? 'bg-[#202328] text-white shadow-sm border border-white/20'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Dealership
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B0D] border border-white/10 text-sm font-medium text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] transition-all"
                />
              </div>

              {/* Dealership Name if Dealer */}
              {role === 'DEALER' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Dealership Brand & Legal Entity
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune City Motors Pvt Ltd"
                        value={dealershipName}
                        onChange={(e) => setDealershipName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090B0D] border border-white/10 text-sm font-medium text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      Authorized OEM Franchise Brand
                    </label>
                    <select
                      value={dealerBrand}
                      onChange={(e) => setDealerBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090B0D] border border-white/10 text-sm font-medium text-white focus:outline-none focus:border-[#ED1725] transition-all"
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
            <div className="flex rounded-xl border border-white/10 overflow-hidden focus-within:border-[#ED1725] transition-all bg-[#090B0D]">
              <span className="px-3.5 py-2.5 bg-[#17191D] text-white text-sm font-bold border-r border-white/10 flex items-center gap-1.5 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-3.5 py-2.5 text-sm font-semibold tracking-wider text-white placeholder-[#71717A] focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-[11px] text-[#71717A] mt-1.5">
              {tab === 'login'
                ? 'We verify your account with a secure one-time passcode.'
                : 'Account activation code will be sent for instant authentication.'}
            </p>
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full font-bold justify-center mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Credentials...</span>
              </>
            ) : (
              <>
                <span>{tab === 'login' ? 'Login' : 'Register with us'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </PrimaryButton>
        </form>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#71717A]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#71717A]" /> 256-bit Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> DPDP Act 2023 Shield
          </span>
        </div>
      </div>

      {/* OTP Verification Modal Overlay */}
      {showOtpOverlay && (
        <div className="fixed inset-0 z-50 bg-[#090B0D]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#17191D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#090B0D] border border-white/10 flex items-center justify-center">
                {isUnlocking ? (
                  <Unlock className="w-5 h-5 text-[#22C55E] animate-bounce" />
                ) : (
                  <Lock className="w-5 h-5 text-[#ED1725]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => { setShowOtpOverlay(false); setError(null); }}
                className="text-xs font-bold text-[#A1A1AA] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#090B0D] border border-white/10 cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <div>
              <h3 className="text-xl font-heading font-black text-white tracking-tight">
                Enter Verification Passcode
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Enter 6-digit passcode generated for <span className="font-bold text-white">+91 {phone}</span>
              </p>
            </div>

            {/* Test OTP Hint Banner */}
            {devOtpHint && (
              <div className="p-3 rounded-xl bg-[#ED1725]/10 border border-[#ED1725]/30 flex items-center justify-between text-xs text-white">
                <span className="font-medium text-[#A1A1AA]">Auto-generated OTP:</span>
                <span className="font-mono font-bold tracking-widest text-sm bg-[#090B0D] px-2.5 py-0.5 rounded border border-[#ED1725]/40 text-[#ED1725]">
                  {devOtpHint}
                </span>
              </div>
            )}

            {/* Continuous 6-Digit OtpInput */}
            <OtpInput
              length={6}
              value={otpValue}
              onChange={setOtpValue}
              onComplete={handleVerifyOtp}
              error={error}
              disabled={loading || isUnlocking}
              onResend={handleResend}
            />

            {/* High-Tech Unlocking State */}
            {isUnlocking && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Credentials Authenticated
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    Unlocking portal access & syncing live database session...
                  </div>
                </div>
              </div>
            )}

            {/* Verification Button */}
            {!isUnlocking && (
              <PrimaryButton
                type="button"
                onClick={() => handleVerifyOtp(otpValue)}
                disabled={loading || otpValue.length !== 6}
                size="lg"
                className="w-full justify-center font-bold"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verify & Unlock Portal</span>
                  </>
                )}
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AuthPage;
