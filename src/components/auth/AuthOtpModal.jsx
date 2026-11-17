import React from 'react';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { OtpInput } from '../common/OtpInput';
import { PrimaryButton } from '../common/Buttons';

export const AuthOtpModal = ({
  phone,
  otpValue,
  onOtpChange,
  onVerify,
  onClose,
  devOtpHint,
  error,
  loading,
  isUnlocking,
  onResend,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#090B0D]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#17191D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden space-y-6">
        {/* Top Header */}
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
            onClick={onClose}
            className="text-xs font-bold text-[#A1A1AA] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#090B0D] border border-white/10 cursor-pointer transition-colors"
          >
            Change Number
          </button>
        </div>

        {/* Title */}
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
          onChange={onOtpChange}
          onComplete={onVerify}
          error={error}
          disabled={loading || isUnlocking}
          onResend={onResend}
        />

        {/* High-Tech Unlocking State */}
        {isUnlocking && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Credentials Authenticated</div>
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
            onClick={() => onVerify(otpValue)}
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
  );
};
export default AuthOtpModal;
