import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { authApi } from '../../api';
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  User,
  Briefcase,
  Building,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';

export const SignInPage = () => {
  const { loginWithOtp } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER'); // 'BUYER' | 'DEALER'
  const [city, setCity] = useState('Bengaluru');
  const [dealershipName, setDealershipName] = useState('');

  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if (step === 'OTP' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (role === 'DEALER' && !dealershipName.trim()) {
      setError('Please enter your authorized dealership name.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.sendOtp(`+91${cleanPhone}`);
      setDevOtpHint(res.devOtp || '123456');
      setOtp(res.devOtp || '123456');
      setStep('OTP');
      setCountdown(30);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      setLoading(true);
      const profile = {
        name: name.trim(),
        role: role,
        city: city.trim(),
        dealershipName: role === 'DEALER' ? dealershipName.trim() : null,
      };

      const res = await loginWithOtp(`+91${cleanPhone}`, otp.trim(), profile);
      if (!res.success) {
        setError(res.error || 'Invalid OTP code.');
        return;
      }

      const assignedRole = res.user?.role;
      if (assignedRole === 'BUYER') {
        navigate('/buyer/dashboard');
      } else if (assignedRole === 'DEALER') {
        navigate('/dealer/dashboard');
      } else if (assignedRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl border border-borderNeutral p-8 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center mx-auto mb-3 shadow-subtle">
            <ShieldCheck className="w-6 h-6 text-crimson" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">
            {step === 'PHONE' ? 'Sign In / Register' : 'Verify Mobile OTP'}
          </h1>
          <p className="text-xs text-textSecondary">
            {step === 'PHONE'
              ? 'Enter your mobile number and details to access or create your account in the database.'
              : `Enter the 6-digit verification code sent to +91 ${phone.replace(/\D/g, '')}`}
          </p>
        </div>

        {error && (
          <div className="bg-crimson/10 border border-crimson/20 rounded-2xl p-3 text-xs text-crimson flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-crimson shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'BUYER'
                      ? 'border-crimson bg-crimson/5 text-crimson font-bold shadow-subtle'
                      : 'border-borderNeutral bg-warm-50 text-textSecondary hover:border-textSecondary'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs">Car Buyer</div>
                    <div className="text-[10px] opacity-75 font-normal">Join group deals</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('DEALER')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'DEALER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-subtle'
                      : 'border-borderNeutral bg-warm-50 text-textSecondary hover:border-textSecondary'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs">Dealership</div>
                    <div className="text-[10px] opacity-75 font-normal">Submit quotes</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex rounded-xl border border-borderNeutral overflow-hidden focus-within:ring-1 focus-within:ring-crimson focus-within:border-crimson">
                <span className="inline-flex items-center px-3.5 bg-warm-100 text-charcoal text-xs sm:text-sm font-semibold border-r border-borderNeutral">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-warm-50 text-charcoal focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center rounded-xl border border-borderNeutral overflow-hidden bg-warm-50 focus-within:ring-1 focus-within:ring-crimson focus-within:border-crimson">
                <span className="pl-3.5 text-textSecondary">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-medium bg-transparent text-charcoal focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Dealership Name (if DEALER) */}
            {role === 'DEALER' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                  Authorized Dealership Name
                </label>
                <div className="relative flex items-center rounded-xl border border-borderNeutral overflow-hidden bg-warm-50 focus-within:ring-1 focus-within:ring-crimson focus-within:border-crimson">
                  <span className="pl-3.5 text-textSecondary">
                    <Building className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={dealershipName}
                    onChange={(e) => setDealershipName(e.target.value)}
                    placeholder="e.g. Trident Hyundai Indiranagar"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-medium bg-transparent text-charcoal focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                City / Region
              </label>
              <div className="relative flex items-center rounded-xl border border-borderNeutral overflow-hidden bg-warm-50 focus-within:ring-1 focus-within:ring-crimson focus-within:border-crimson">
                <span className="pl-3.5 text-textSecondary">
                  <MapPin className="w-4 h-4" />
                </span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-medium bg-transparent text-charcoal focus:outline-none cursor-pointer"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                size="md"
                className="w-full"
                disabled={loading}
                icon={<ArrowRight size={14} />}
                iconPosition="right"
              >
                {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
              </PrimaryButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Enter 6-Digit Verification Code
                </label>
                {devOtpHint && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 size={11} /> Dev OTP: {devOtpHint}
                  </span>
                )}
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full tracking-widest text-center py-3 text-xl font-bold font-mono rounded-xl border border-borderNeutral bg-warm-50 text-charcoal focus:outline-none focus:border-crimson"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-textSecondary pt-1">
              <span>Sent to +91 {phone.replace(/\D/g, '')}</span>
              {countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    setCountdown(30);
                    const res = await authApi.sendOtp(`+91${phone.replace(/\D/g, '')}`);
                    if (res?.devOtp) setDevOtpHint(res.devOtp);
                  }}
                  className="text-crimson font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <PrimaryButton
                type="submit"
                size="md"
                className="w-full"
                disabled={loading}
                icon={<ArrowRight size={14} />}
                iconPosition="right"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </PrimaryButton>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full py-2 text-xs font-semibold text-textSecondary hover:text-charcoal transition-colors"
              >
                ← Change Mobile Number or Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
