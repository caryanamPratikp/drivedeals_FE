import React, { useEffect, useState } from 'react';

/**
 * AnimatedCounter component for smooth counting transitions
 * Respects sensitivity masking when `masked` is true
 */
export const AnimatedCounter = ({
  value = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  masked = false,
  maskPlaceholder = '••••••••',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (masked) return;

    let start = 0;
    const end = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(end);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration, masked]);

  if (masked) {
    return <span className={`tracking-widest ${className}`}>{maskPlaceholder}</span>;
  }

  const formatted = decimals > 0
    ? displayValue.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
