import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Phone } from 'lucide-react';

export const OtpInput = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error = '',
  disabled = false,
  resendCooldown = 30,
  onResend,
  onChangePhone,
  phone = '',
}) => {
  const [timer, setTimer] = useState(resendCooldown);
  const inputRefs = useRef([]);

  useEffect(() => {
    setTimer(resendCooldown);
  }, [resendCooldown]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !combined.includes('')) {
      onComplete?.(combined);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const nextIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className="space-y-4">
      {phone && (
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="flex items-center gap-1.5 font-medium">
            <Phone size={12} className="text-[#ED1725]" />
            <span>Code sent to <span className="font-bold text-white">{phone}</span></span>
          </span>
          {onChangePhone && (
            <button
              type="button"
              onClick={onChangePhone}
              className="text-[#ED1725] hover:underline font-bold text-xs cursor-pointer"
            >
              Change
            </button>
          )}
        </div>
      )}

      {/* 6 Individual Digit Boxes */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            disabled={disabled}
            value={digits[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-heading font-black rounded-2xl bg-[#17191D] border transition-all text-white focus:outline-none ${
              error
                ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/40'
                : digits[index]
                ? 'border-[#ED1725] ring-1 ring-[#ED1725]/30'
                : 'border-white/10 hover:border-white/20 focus:border-[#ED1725] focus:ring-2 focus:ring-[#ED1725]/30'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] font-medium text-center">{error}</p>
      )}

      {/* Resend Timer & Action */}
      <div className="flex items-center justify-between text-xs text-[#71717A] pt-1">
        <span>Didn't receive code?</span>
        {timer > 0 ? (
          <span className="font-mono text-[#A1A1AA]">
            Resend in <span className="font-bold text-white">{timer}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTimer(resendCooldown);
              onResend?.();
            }}
            className="flex items-center gap-1.5 font-bold text-[#ED1725] hover:underline cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Resend OTP</span>
          </button>
        )}
      </div>
    </div>
  );
};
