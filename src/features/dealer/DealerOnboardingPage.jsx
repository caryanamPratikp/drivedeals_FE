import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Building2,
  FileCheck2,
  MapPin,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { StepIndicator } from '../../components/common/StepIndicator';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

const STEPS = [
  { id: 'step-entity', name: 'Franchise & Entity', description: 'Brand and legal identity' },
  { id: 'step-tax', name: 'GST & Compliance', description: 'Tax registration & PAN' },
  { id: 'step-facility', name: 'Showroom Facility', description: 'Address and jurisdiction' },
  { id: 'step-contact', name: 'Authorized Officer', description: 'Contact & final submission' },
];

const BRAND_OPTIONS = [
  'Mahindra',
  'Hyundai',
  'Tata',
  'Maruti Suzuki',
  'Kia',
  'Toyota',
  'Honda',
  'Multi-Brand Network',
];

const DEALERSHIP_TYPES = [
  'Authorized 3S Facility (Sales, Service, Spares)',
  'Authorized 1S Showroom Outlet (Sales)',
  'Certified Multi-Brand Dealership Hub',
  'Tier-1 Direct OEM Franchise',
];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const DealerOnboardingPage = () => {
  const { currentUser, submitDealerOnboarding, fetchCurrentDealer } = useAppStore();
  const navigate = useNavigate();

  const draftKey = `drivedeals_onboarding_draft_${currentUser?.id || currentUser?.dealerId || 'dealer'}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [draftNotice, setDraftNotice] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    dealershipName: currentUser?.dealershipName || currentUser?.name || '',
    legalEntityName: '',
    brand: currentUser?.brand || 'Mahindra',
    dealershipType: DEALERSHIP_TYPES[0],
    dealerCode: '',
    gstin: '',
    panNumber: '',
    address: currentUser?.address || '',
    city: currentUser?.city || 'Pune',
    state: 'Maharashtra',
    pincode: currentUser?.pincode || '411045',
    contactPerson: currentUser?.name || '',
    designation: 'Dealer Principal',
    contactEmail: currentUser?.email || '',
    contactPhone: currentUser?.phone || '',
  });

  // 1. Resume saved draft from localStorage or backend on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.data) {
          setFormData((prev) => ({ ...prev, ...parsed.data }));
          if (typeof parsed.step === 'number') {
            setCurrentStep(parsed.step);
          }
          setDraftNotice('Continuing your dealership onboarding from your saved progress.');
        }
      } else {
        // Attempt fetch from backend
        fetchCurrentDealer().then((dealer) => {
          if (dealer) {
            setFormData((prev) => ({
              ...prev,
              dealershipName: dealer.dealershipName || prev.dealershipName,
              legalEntityName: dealer.legalEntityName || prev.legalEntityName,
              brand: dealer.brand || prev.brand,
              dealershipType: dealer.dealershipType || prev.dealershipType,
              dealerCode: dealer.dealerCode || prev.dealerCode,
              gstin: dealer.gstin || prev.gstin,
              panNumber: dealer.panNumber || prev.panNumber,
              address: dealer.address || prev.address,
              city: dealer.city || prev.city,
              state: dealer.state || prev.state,
              pincode: dealer.pincode || prev.pincode,
              contactPerson: dealer.contactPerson || prev.contactPerson,
              contactEmail: dealer.contactEmail || prev.contactEmail,
              contactPhone: dealer.contactPhone || prev.contactPhone,
            }));
          }
        });
      }
    } catch (e) {
      console.warn('Failed to parse draft from localStorage:', e);
    }
  }, [draftKey, fetchCurrentDealer]);

  // 2. Auto-save keystrokes and current step to localStorage draft
  const persistDraftLocally = (updatedData, step = currentStep) => {
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          data: updatedData,
          step,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('LocalStorage save draft failed:', e);
    }
  };

  const handleChange = (field, value) => {
    let cleanVal = value;
    if (field === 'gstin' || field === 'panNumber' || field === 'dealerCode') {
      cleanVal = cleanVal.toUpperCase();
    }

    setFormData((prev) => {
      const next = { ...prev, [field]: cleanVal };

      // Auto-extract PAN from GSTIN if 15 chars (chars 2 to 12)
      if (field === 'gstin' && cleanVal.length === 15 && GSTIN_REGEX.test(cleanVal)) {
        const derivedPan = cleanVal.substring(2, 12);
        if (!prev.panNumber || prev.panNumber.length !== 10) {
          next.panNumber = derivedPan;
        }
      }

      persistDraftLocally(next, currentStep);
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (stepIdx) => {
    const errs = {};
    if (stepIdx === 0) {
      if (!formData.dealershipName.trim()) errs.dealershipName = 'Dealership trade name is required';
      if (!formData.legalEntityName.trim()) errs.legalEntityName = 'Registered legal entity name is required';
      if (!formData.brand) errs.brand = 'Please select authorized franchise brand';
      if (!formData.dealerCode.trim()) errs.dealerCode = 'OEM Dealer authorization code is required';
    } else if (stepIdx === 1) {
      if (!formData.gstin.trim()) {
        errs.gstin = '15-character GSTIN is required';
      } else if (!GSTIN_REGEX.test(formData.gstin.trim())) {
        errs.gstin = 'Invalid GSTIN format (e.g. 27AAACT2519F1Z5)';
      }
      if (!formData.panNumber.trim()) {
        errs.panNumber = '10-character PAN number is required';
      } else if (!PAN_REGEX.test(formData.panNumber.trim())) {
        errs.panNumber = 'Invalid PAN format (e.g. AAACT2519F)';
      }
    } else if (stepIdx === 2) {
      if (!formData.address.trim()) errs.address = 'Showroom facility address is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.state.trim()) errs.state = 'State is required';
      if (!formData.pincode.trim() || formData.pincode.trim().length !== 6) {
        errs.pincode = 'Valid 6-digit PIN code is required';
      }
    } else if (stepIdx === 3) {
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Authorized contact name is required';
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
        errs.contactEmail = 'Valid business email is required';
      }
      if (!formData.contactPhone.trim() || formData.contactPhone.replace(/\D/g, '').length < 10) {
        errs.contactPhone = 'Valid 10-digit mobile number is required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      persistDraftLocally(formData, nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    const prevStep = Math.max(0, currentStep - 1);
    setCurrentStep(prevStep);
    persistDraftLocally(formData, prevStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true);
      persistDraftLocally(formData, currentStep);
      await submitDealerOnboarding(formData, true);
      setDraftNotice('Draft saved successfully! You can resume from this point at any time.');
      setTimeout(() => setDraftNotice(null), 4000);
    } catch (e) {
      console.warn('Failed to save draft to backend:', e);
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    // Validate all steps
    for (let i = 0; i <= 3; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const res = await submitDealerOnboarding(formData, false);
      if (res.success) {
        // Clear local draft upon successful final submission
        localStorage.removeItem(draftKey);
        navigate('/dealer/dashboard', {
          state: { onboardingSubmitted: true },
          replace: true,
        });
      }
    } catch (err) {
      console.error('Final submission error:', err);
      setErrors({ submit: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Brand Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ED1725]/10 border border-[#ED1725]/30 text-[#ED1725] text-xs font-heading font-bold uppercase tracking-wider mb-3">
          <ShieldCheck size={14} />
          <span>OEM Franchise Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
          Dealership Onboarding & KYC
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Complete mandatory business and tax identification to activate authorized dealer quoting privileges across buyer group collectives.
        </p>
      </div>

      {/* Auto-Draft Notification */}
      {draftNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300 text-xs sm:text-sm font-medium"
        >
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-amber-400 shrink-0" />
            <span>{draftNotice}</span>
          </div>
          <button
            onClick={() => setDraftNotice(null)}
            className="text-amber-400/80 hover:text-amber-300 text-xs font-bold underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Wizard Progress Indicator */}
      <div className="bg-[#111315] rounded-3xl border border-white/10 p-6 sm:p-8 mb-8 shadow-2xl">
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(idx) => {
            if (idx <= currentStep || validateStep(currentStep)) {
              setCurrentStep(idx);
              persistDraftLocally(formData, idx);
            }
          }}
        />
      </div>

      {/* Form Content Card */}
      <div className="bg-[#17191D] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Franchise & Legal Identity */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <Building2 className="text-[#ED1725]" size={20} />
                    Franchise & Legal Identity
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the authorized trade details and registered corporate name of your dealership entity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Dealership Trade Name <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dealershipName}
                      onChange={(e) => handleChange('dealershipName', e.target.value)}
                      placeholder="e.g. Mehta Motors Baner"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.dealershipName ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.dealershipName && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.dealershipName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Registered Legal Entity Name <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.legalEntityName}
                      onChange={(e) => handleChange('legalEntityName', e.target.value)}
                      placeholder="e.g. Mehta Automotive Sales Pvt. Ltd."
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.legalEntityName ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.legalEntityName && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.legalEntityName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Authorized OEM Brand Franchise <span className="text-[#ED1725]">*</span>
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#111315] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors"
                    >
                      {BRAND_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Only groups matching this brand will be routed to your dealership quotation dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      OEM Dealership Authorization Code <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dealerCode}
                      onChange={(e) => handleChange('dealerCode', e.target.value)}
                      placeholder="e.g. MHD-PUN-0429"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.dealerCode ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm font-mono focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.dealerCode && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.dealerCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Dealership Classification / Facility Type
                  </label>
                  <select
                    value={formData.dealershipType}
                    onChange={(e) => handleChange('dealershipType', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#111315] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors"
                  >
                    {DEALERSHIP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 1: GST & Tax Compliance */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="text-[#ED1725]" size={20} />
                    Tax & Business Identification
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Provide verified GSTIN and PAN details for statutory compliance and invoicing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Under Indian motor vehicle sales regulations, quotations must be issued by a GST-registered authorized OEM dealer in the state of vehicle registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Goods & Services Tax ID (GSTIN) <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.gstin}
                      onChange={(e) => handleChange('gstin', e.target.value)}
                      placeholder="e.g. 27AAACT2519F1Z5"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.gstin ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.gstin ? (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.gstin}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">
                        15 characters alphanumeric format.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Permanent Account Number (PAN) <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={(e) => handleChange('panNumber', e.target.value)}
                      placeholder="e.g. AAACT2519F"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.panNumber ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.panNumber ? (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.panNumber}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">
                        10 characters alphanumeric format (auto-derived from GSTIN).
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111315] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Statutory Verification Guarantee</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By submitting these tax identifiers, you confirm that your dealership holds an active GST registration in good standing with the State Tax Department.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Showroom Facility Location */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <MapPin className="text-[#ED1725]" size={20} />
                    Showroom Facility Location
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Provide the geographic address of your customer delivery showroom and delivery facility.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Complete Showroom Address <span className="text-[#ED1725]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. Survey No. 42, Mumbai-Bangalore Highway, Baner, Pune"
                    className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                      errors.address ? 'border-red-500' : 'border-white/10'
                    } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      City <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="e.g. Pune"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.city ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      State <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.state ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.state && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      PIN Code <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      placeholder="e.g. 411045"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.pincode ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm font-mono focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.pincode && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Authorized Officer & Review */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <UserCheck className="text-[#ED1725]" size={20} />
                    Authorized Representative & Final Review
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Designate the key dealership executive responsible for approving group quotation commitments.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Primary Contact Person <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      placeholder="e.g. Rajesh Mehta"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.contactPerson ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.contactPerson && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      placeholder="e.g. Dealer Principal / General Manager"
                      className="w-full px-4 py-3 rounded-2xl bg-[#111315] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Official Email ID <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      placeholder="e.g. sales@mehtamotors.in"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.contactEmail ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.contactEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Direct Mobile Number <span className="text-[#ED1725]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      placeholder="e.g. +91 98220 12345"
                      className={`w-full px-4 py-3 rounded-2xl bg-[#111315] border ${
                        errors.contactPhone ? 'border-red-500' : 'border-white/10'
                      } text-white text-sm font-mono focus:outline-none focus:border-[#ED1725] transition-colors`}
                    />
                    {errors.contactPhone && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.contactPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary Review Card */}
                <div className="mt-6 p-5 rounded-3xl bg-[#111315] border border-white/10 space-y-3">
                  <div className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">
                    Submission Summary for Platform Administrator
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Dealership:</span>
                      <span className="text-white font-medium">{formData.dealershipName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Brand:</span>
                      <span className="text-[#ED1725] font-bold">{formData.brand || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">GSTIN:</span>
                      <span className="text-white font-mono">{formData.gstin || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PAN:</span>
                      <span className="text-white font-mono">{formData.panNumber || '-'}</span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errors.submit}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentStep > 0 && (
                <SecondaryButton
                  type="button"
                  onClick={handlePrevStep}
                  className="font-bold flex items-center gap-1.5 px-4 py-2.5 text-xs"
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </SecondaryButton>
              )}

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isDraftSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors"
              >
                <Save size={14} />
                <span>{isDraftSaving ? 'Saving Draft...' : 'Save Draft & Exit'}</span>
              </button>
            </div>

            <div className="w-full sm:w-auto">
              {currentStep < STEPS.length - 1 ? (
                <PrimaryButton
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto font-bold flex items-center justify-center gap-2 px-6 py-3 text-xs"
                >
                  <span>Continue to {STEPS[currentStep + 1].name}</span>
                  <ArrowRight size={14} />
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto font-bold flex items-center justify-center gap-2 px-8 py-3 text-xs shadow-lg shadow-[#ED1725]/20"
                >
                  <ShieldCheck size={16} />
                  <span>{isSubmitting ? 'Submitting for Verification...' : 'Final Submit for Admin Verification'}</span>
                </PrimaryButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealerOnboardingPage;
