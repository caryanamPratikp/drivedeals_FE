import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store';
import { authApi } from '../../api';
import { AuthNavbar } from '../../components/auth/AuthNavbar';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';
import { AuthFormPanel } from '../../components/auth/AuthFormPanel';
import { AuthOtpModal } from '../../components/auth/AuthOtpModal';

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
    <div className="min-h-screen bg-[#090B0D] text-white flex flex-col selection:bg-[#ED1725] selection:text-white antialiased">
      {/* Top Navigation Bar matching reference image */}
      <AuthNavbar currentTab={tab} onSelectTab={handleTabChange} />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-hidden">
        {/* Left Visual Storytelling Panel (55–60%) */}
        <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col">
          <AuthVisualPanel />
        </div>

        {/* Right Authentication Form Panel (40–45%) */}
        <div className="w-full lg:w-[42%] xl:w-[40%] flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14 relative z-20">
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
