import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { authApi } from '../../api';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';
import { AuthFormPanel } from '../../components/auth/AuthFormPanel';
import { AuthOtpModal } from '../../components/auth/AuthOtpModal';
import authBgImage from '../../assets/images/auth/drivedeals-auth-bg.webp';

export const AuthPage = ({ defaultTab = 'login' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab =
    searchParams.get('mode') === 'register'
      ? 'register'
      : defaultTab === 'register'
      ? 'register'
      : 'login';
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

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setError(null);
    setSearchParams(newTab === 'register' ? { mode: 'register' } : {});
  };

  // Submit Mobile Number -> Send OTP
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

      const otpCode = cleanPhone.endsWith('9876543210') ? '123456' : res.devOtp || '123456';
      setDevOtpHint(otpCode);
      setOtpValue(otpCode);
      setShowOtpOverlay(true);
    } catch (err) {
      setError(err.message || 'Unable to proceed. Please check your network or server.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP -> Authenticate & Redirect
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
      const profile =
        tab === 'register'
          ? {
              name: name.trim(),
              role,
              city: city.trim(),
              dealershipName: role === 'DEALER' ? dealershipName.trim() : undefined,
              brand: role === 'DEALER' ? dealerBrand : undefined,
            }
          : {};

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
        }, 1000);
      } else {
        setError(result.error || 'Verification failed. Please check the passcode.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    setError(null);
    try {
      const cleanPhone = '+91' + phone.replace(/\D/g, '');
      const mode = tab === 'login' ? 'LOGIN' : 'REGISTER';
      const res = await authApi.sendOtp(cleanPhone, mode);
      const code = cleanPhone.endsWith('9876543210') ? '123456' : res.devOtp || '123456';
      setDevOtpHint(code);
      setOtpValue(code);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090B0D] text-white flex flex-col justify-between selection:bg-[#ED1725] selection:text-white antialiased relative overflow-x-hidden">
      {/* Full-Page Background Automotive Scene */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={authBgImage}
          alt="DriveDeals Premium Automotive Scene"
          className="w-full h-full object-cover object-bottom sm:object-[center_70%] filter brightness-90 contrast-110"
        />

        {/* Black fade on the left, partially visible across center and under the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090B0D] via-[#090B0D]/80 to-[#090B0D]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090B0D]/85 via-transparent to-[#090B0D]/90" />

        {/* Dynamic Red Speed Slashes Accent */}
        <svg
          className="absolute -bottom-10 -left-10 w-72 h-72 text-[#ED1725] opacity-50"
          viewBox="0 0 200 200"
          fill="none"
        >
          <line x1="-20" y1="220" x2="160" y2="40" stroke="#ED1725" strokeWidth="6" strokeLinecap="round" />
          <line x1="10" y1="230" x2="190" y2="50" stroke="#ED1725" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <line x1="40" y1="240" x2="220" y2="60" stroke="#ED1725" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#ED1725]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Brand Logo Header (No Navbar as requested) */}
      <header className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-6 sm:py-8 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#ED1725] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#ED1725]/30 group-hover:scale-105 transition-transform">
            D
          </div>
          <div>
            <div className="font-heading font-black text-xl sm:text-2xl text-white tracking-wider flex items-center gap-1.5">
              <span>DRIVE</span>
              <span className="text-[#ED1725]">DEALS</span>
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-[#A1A1AA] uppercase">
              Buy Smarter, Together
            </div>
          </div>
        </Link>
      </header>

      {/* Main Content: Left Storytelling, Right Floating Glass Auth Card */}
      <main className="relative z-10 flex-1 w-full px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 my-auto">
        {/* Left Storytelling Section */}
        <div className="w-full lg:w-[54%] xl:w-[58%]">
          <AuthVisualPanel />
        </div>

        {/* Right Floating Overlay Auth Card */}
        <div className="w-full lg:w-[46%] xl:w-[42%] flex items-center justify-center lg:justify-end">
          <AuthFormPanel
            tab={tab}
            onTabChange={handleTabChange}
            phone={phone}
            onPhoneChange={setPhone}
            name={name}
            onNameChange={setName}
            role={role}
            onRoleChange={setRole}
            dealershipName={dealershipName}
            onDealershipNameChange={setDealershipName}
            dealerBrand={dealerBrand}
            onDealerBrandChange={setDealerBrand}
            city={city}
            onCityChange={setCity}
            loading={loading}
            error={error}
            onSubmit={handleSubmitForm}
          />
        </div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between text-[11px] text-[#71717A] border-t border-white/5">
        <span>&copy; {new Date().getFullYear()} DriveDeals Technologies Pvt. Ltd.</span>
        <span>100% Spam-Free Privacy Shield</span>
      </footer>

      {/* High-Tech OTP Verification Modal Overlay */}
      {showOtpOverlay && (
        <AuthOtpModal
          phone={phone}
          otpValue={otpValue}
          onOtpChange={setOtpValue}
          onVerify={handleVerifyOtp}
          onClose={() => {
            setShowOtpOverlay(false);
            setError(null);
          }}
          devOtpHint={devOtpHint}
          error={error}
          loading={loading}
          isUnlocking={isUnlocking}
          onResend={handleResend}
        />
      )}
    </div>
  );
};
export default AuthPage;
