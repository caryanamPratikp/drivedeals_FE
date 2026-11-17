/**
 * DriveDeals Shared Framer Motion Variants & Transitions
 * Reference-inspired smooth, purposeful animations (400-700ms duration, smooth ease-out)
 */

export const easeOutCubic = [0.215, 0.61, 0.355, 1];
export const easeOutQuart = [0.165, 0.84, 0.44, 1];
export const easeInOutQuint = [0.86, 0, 0.07, 1];
export const luxuryEase = [0.16, 1, 0.3, 1];

// Page entrance & exit transition
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: luxuryEase,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: easeOutCubic,
    },
  },
};

// Staggered Container for sequential section/card reveals
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

// Staggered Child Item (Cards, Rows, Grid items)
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: luxuryEase,
    },
  },
};

// Subtle Card Hover & Elevation
export const cardHoverProps = {
  whileHover: {
    y: -3,
    boxShadow: '0 10px 28px rgba(23, 26, 25, 0.06), 0 2px 6px rgba(23, 26, 25, 0.03)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  whileTap: {
    y: -1,
    transition: { duration: 0.1 },
  },
};

// Button Interaction States
export const buttonTapProps = {
  whileHover: {
    scale: 1.015,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Modal Backdrop & Content Transitions
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOutQuart },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Popover / Dropdown Menu Variants
export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: easeOutQuart },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};
