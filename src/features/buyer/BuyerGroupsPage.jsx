import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  Plus,
  MapPin,
  ArrowRight,
  LogOut,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  Car,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { formatINR } from '../../lib/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { StepIndicator } from '../../components/common/StepIndicator';
import { EmptyState } from '../../components/common/EmptyState';
import { VehicleConfigurationForm } from '../../components/vehicle/VehicleConfigurationForm';

export const BuyerGroupsPage = () => {
  const {
    groups = [],
    variants = [],
    cars = [],
    currentUser,
    memberships = [],
    joinGroup,
    leaveGroup,
    createGroupWithMembership,
    fetchGroups,
    fetchCars
  } = useAppStore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [fetchGroups, fetchCars, cars.length]);

  const [activeTab, setActiveTab] = useState('MY_GROUPS');
  const [leaveGroupId, setLeaveGroupId] = useState(null);

  // Group creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Vehicle & Colour, 1: Preferences, 2: Review & Join
  const [city, setCity] = useState(currentUser?.city || 'Pune');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [vehicleConfig, setVehicleConfig] = useState(null);
  const [timeline, setTimeline] = useState('WITHIN_30_DAYS');
  const [priorities, setPriorities] = useState([
    'LOWEST_ON_ROAD',
    'INSURANCE_FLEXIBILITY',
  ]);
  const [createFeedback, setCreateFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfigurationChange = useCallback((cfg) => {
    if (!cfg) return;
    setVehicleConfig((prev) => {
      if (
        prev &&
        prev.brandId === cfg.brandId &&
        prev.modelId === cfg.modelId &&
        prev.variantId === cfg.variantId &&
        prev.colourId === cfg.colourId &&
        prev.imageUrl === cfg.imageUrl
      ) {
        return prev;
      }
      return cfg;
    });
    setSelectedVariantId((prev) => (prev === cfg.variantId ? prev : cfg.variantId));
    setSelectedCarId((prev) => (prev === cfg.modelId ? prev : cfg.modelId));
  }, []);

  const handleConfigurationContinue = useCallback((cfg) => {
    setVehicleConfig(cfg);
    setSelectedVariantId(cfg.variantId);
    setSelectedCarId(cfg.modelId);
    setCreateFeedback(null);
    setCurrentStep(1);
  }, []);

  // Auto-select first car when cars are available
  useEffect(() => {
    if (cars.length > 0) {
      if (!selectedCarId || !cars.some((c) => c.id === selectedCarId)) {
        setSelectedCarId(cars[0].id);
      }
    }
  }, [cars, selectedCarId]);

  // Model-accurate photography fallback
  const getCarImage = (car) => {
    if (!car) return '/cars/hyundai_creta.webp';
    const name = (car.modelName || car.model || '').toLowerCase();
    if (name.includes('nexon')) return '/cars/tata_nexon.webp';
    if (name.includes('creta')) return '/cars/hyundai_creta.webp';
    if (name.includes('xuv700')) return '/cars/mahindra_xuv700.webp';
    if (name.includes('seltos')) return '/cars/seltos.webp';
    if (name.includes('grand vitara') || name.includes('vitara')) return '/cars/grand_vitara.webp';
    if (name.includes('elevate')) return '/cars/elevate.webp';
    return car.imageUrl || '/cars/hyundai_creta.webp';
  };

  // Check URL params for direct modal opening
  useEffect(() => {
    if (searchParams.get('openCreate') === 'true') {
      setIsCreateOpen(true);
    }
    const createVarId = searchParams.get('createVariantId');
    if (createVarId && variants.length > 0) {
      const v = variants.find((item) => item.id === createVarId);
      if (v) {
        setSelectedVariantId(v.id);
        setSelectedCarId(v.carId);
        setCurrentStep(1);
        setIsCreateOpen(true);
      }
    }
    const createCarId = searchParams.get('carId');
    if (createCarId && cars.some((c) => c.id === createCarId)) {
      setSelectedCarId(createCarId);
      setIsCreateOpen(true);
    }
  }, [searchParams, variants, cars]);

  const availableCarVariants = variants.filter(
    (v) => (v.carId === selectedCarId || v.car_id === selectedCarId) && v.active !== false
  );

  // Auto-select first available variant for the selected car
  useEffect(() => {
    if (availableCarVariants.length > 0) {
      if (!selectedVariantId || !availableCarVariants.some((v) => v.id === selectedVariantId)) {
        setSelectedVariantId(availableCarVariants[0].id);
      }
    } else {
      setSelectedVariantId('');
    }
  }, [selectedCarId, availableCarVariants, selectedVariantId]);

  const myActiveMemberships = (memberships || []).filter(
    (m) => m.buyerId === currentUser?.id && m.status === 'ACTIVE'
  );
  const myGroupIds = myActiveMemberships.map((m) => m.groupId);
  const myGroups = (groups || []).filter(
    (g) =>
      g.isCurrentUserMember ||
      myGroupIds.includes(g.id) ||
      (g.memberIds && g.memberIds.includes(currentUser?.id))
  );
  const otherGroups = (groups || []).filter(
    (g) =>
      !g.isCurrentUserMember &&
      !myGroupIds.includes(g.id) &&
      !(g.memberIds && g.memberIds.includes(currentUser?.id)) &&
      g.status !== 'CLOSED'
  );

  const togglePriority = (p) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter((item) => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleCreateSubmit = async () => {
    const variantIdToSubmit = selectedVariantId || vehicleConfig?.variantId;
    if (!variantIdToSubmit) {
      setCreateFeedback('Please select a car variant to proceed.');
      return;
    }
    setIsSubmitting(true);
    setCreateFeedback(null);
    try {
      const res = await createGroupWithMembership(
        variantIdToSubmit,
        city,
        currentUser?.id || 'u-buyer-me',
        timeline,
        priorities,
        vehicleConfig
      );
      if (res && res.success) {
        setIsCreateOpen(false);
        navigate(`/buyer/groups/${res.groupId}`);
      } else {
        setCreateFeedback(res?.error || 'Failed to create collective. Please try again.');
      }
    } catch (err) {
      setCreateFeedback(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCar = cars.find((c) => c.id === selectedCarId);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const wizardSteps = [
    { id: 0, label: 'Vehicle & Colour', description: 'Configure model, trim & colour' },
    { id: 1, label: 'Preferences', description: 'Timeline & negotiation priorities' },
    { id: 2, label: 'Review & Launch', description: 'Confirm collective & bidding' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* 1. Page Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ED1725]">Buyer Workspace</span>
            <span className="text-xs text-[#71717A]">•</span>
            <span className="text-xs text-[#A1A1AA] font-medium">{currentUser?.city || 'Pune'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-1.5">
            Car Buying Groups
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl leading-relaxed">
            Join or start a group with buyers in your city looking for the same car. When groups grow, showrooms give bigger discounts! 100% free with zero booking fee.
          </p>
        </div>

        <PrimaryButton
          size="md"
          className="font-bold px-5 shadow-lg shadow-dd-red/20"
          onClick={() => {
            setCurrentStep(0);
            if (!selectedCarId && cars.length > 0) setSelectedCarId(cars[0].id);
            setIsCreateOpen(true);
          }}
        >
          <Plus size={15} />
          <span>Start a Car Group</span>
        </PrimaryButton>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('MY_GROUPS')}
          className={`relative pb-3 px-4 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'MY_GROUPS'
              ? 'text-white'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          <span>My Car Groups</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'MY_GROUPS'
                ? 'bg-[#ED1725] text-white'
                : 'bg-[#17191D] text-[#A1A1AA]'
            }`}
          >
            {myGroups.length}
          </span>
          {activeTab === 'MY_GROUPS' && (
            <motion.div
              layoutId="buyerGroupsActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ED1725]"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ALL_GROUPS')}
          className={`relative pb-3 px-4 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'ALL_GROUPS'
              ? 'text-white'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          <span>Find Other Car Groups</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ALL_GROUPS'
                ? 'bg-[#ED1725] text-white'
                : 'bg-[#17191D] text-[#A1A1AA]'
            }`}
          >
            {otherGroups.length}
          </span>
          {activeTab === 'ALL_GROUPS' && (
            <motion.div
              layoutId="buyerGroupsActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ED1725]"
            />
          )}
        </button>
      </div>

      {/* Tab 1: My Joined Groups */}
      {activeTab === 'MY_GROUPS' && (
        <>
          {myGroups.length === 0 ? (
            <EmptyState
              icon={Users}
              title="You Haven't Joined Any Collectives Yet"
              description="Join an active car demand group in your region or start a new group for your preferred vehicle variant to trigger dealer bidding."
              actionLabel="Explore Active Collectives"
              onAction={() => setActiveTab('ALL_GROUPS')}
              secondaryActionText="Start a New Collective"
              onSecondaryAction={() => {
                setCurrentStep(0);
                if (!selectedCarId && cars.length > 0) setSelectedCarId(cars[0].id);
                setIsCreateOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group) => {
                const variant = group.variant || variants.find((v) => v.id === group.variantId);
                const car = group.car || cars.find((c) => c.id === variant?.carId || c.id === group.carId);
                const currentCount = group.currentMembers || group.memberIds?.length || 1;
                const targetCount = group.targetMembers || 15;
                const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

                return (
                  <div
                    key={group.id}
                    className="bg-[#17191D] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#ED1725]/40 transition-all shadow-xl group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                          <MapPin size={13} className="text-[#ED1725]" />
                          <span>{group.city || 'Pune'}</span>
                        </div>
                        <StatusBadge status={group.stage || group.status} />
                      </div>

                      <div className="h-36 rounded-2xl bg-[#090B0D] overflow-hidden border border-white/5 relative">
                        <img
                          src={getCarImage(car)}
                          alt={car?.modelName || 'Vehicle'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ED1725]/90 text-white px-2 py-0.5 rounded-full">
                            {car?.brand}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading font-black text-lg text-white">
                          {car?.modelName || car?.model || 'Vehicle'}
                        </h3>
                        <p className="text-xs font-semibold text-[#ED1725] mt-0.5">
                          {variant?.name || 'Standard Trim'}
                        </p>
                        <div className="text-[11px] text-[#71717A] mt-1">
                          {variant?.fuelType} • {variant?.transmission}
                        </div>
                      </div>

                      <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#A1A1AA]">Demand Progress</span>
                          <span className="font-heading font-bold text-white">
                            {currentCount} / {targetCount} Buyers
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#ED1725] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-4">
                      <Link to={`/buyer/groups/${group.id}`} className="flex-1">
                        <PrimaryButton size="sm" className="w-full justify-center font-bold">
                          <span>Enter Collective</span>
                          <ArrowRight size={13} />
                        </PrimaryButton>
                      </Link>
                      <button
                        onClick={() => setLeaveGroupId(group.id)}
                        className="p-2 text-[#71717A] hover:text-[#EF4444] rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                        title="Leave Collective"
                      >
                        <LogOut size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Explore Other Groups */}
      {activeTab === 'ALL_GROUPS' && (
        <div className="space-y-6">
          {otherGroups.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Other Collectives Active"
              description="Be the initiator! Choose your desired vehicle model and trim to create the first demand collective in your city."
              actionLabel="Start a Collective"
              onAction={() => {
                setCurrentStep(0);
                if (!selectedCarId && cars.length > 0) setSelectedCarId(cars[0].id);
                setIsCreateOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherGroups.map((group) => {
                const variant = group.variant || variants.find((v) => v.id === group.variantId);
                const car = group.car || cars.find((c) => c.id === variant?.carId || c.id === group.carId);
                const currentCount = group.currentMembers || group.memberIds?.length || 1;
                const targetCount = group.targetMembers || 15;

                return (
                  <div
                    key={group.id}
                    className="bg-[#17191D] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#ED1725]/40 transition-all shadow-xl group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                          <MapPin size={13} className="text-[#ED1725]" />
                          <span>{group.city || 'Pune'}</span>
                        </div>
                        <StatusBadge status={group.stage || group.status} />
                      </div>

                      <div className="h-36 rounded-2xl bg-[#090B0D] overflow-hidden border border-white/5 relative">
                        <img
                          src={getCarImage(car)}
                          alt={car?.modelName || 'Vehicle'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ED1725]/90 text-white px-2 py-0.5 rounded-full">
                            {car?.brand}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading font-black text-lg text-white">
                          {car?.modelName || car?.model || 'Vehicle'}
                        </h3>
                        <p className="text-xs font-semibold text-[#ED1725] mt-0.5">
                          {variant?.name || 'Standard Trim'}
                        </p>
                        <div className="text-[11px] text-[#71717A] mt-1">
                          {variant?.fuelType} • {variant?.transmission}
                        </div>
                      </div>

                      <div className="p-4 bg-[#090B0D] rounded-2xl border border-white/10 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#71717A] block text-[10px] uppercase font-bold">Enrolled</span>
                          <span className="font-heading font-bold text-white text-sm">{currentCount} Buyers</span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block text-[10px] uppercase font-bold">Cutoff</span>
                          <span className="font-mono text-[#A1A1AA]">{formatDate(group.joinDeadline)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 mt-4">
                      <Link to={`/buyer/groups/${group.id}`} className="block w-full">
                        <PrimaryButton size="sm" className="w-full justify-center font-bold">
                          <span>View & Join Collective</span>
                          <ArrowRight size={13} />
                        </PrimaryButton>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Leaving Group */}
      <ConfirmationModal
        isOpen={Boolean(leaveGroupId)}
        title="Leave Buyer Collective?"
        description="Leaving the collective will remove your participation from aggregate dealer quote requests. You can rejoin before the join cutoff deadline if needed."
        confirmLabel="Leave Collective"
        variant="danger"
        onConfirm={() => {
          if (leaveGroupId) {
            leaveGroup(leaveGroupId, currentUser?.id);
            setLeaveGroupId(null);
          }
        }}
        onCancel={() => setLeaveGroupId(null)}
      />

      {/* 3-Step Group Creation Wizard Modal — 100% Dark Luxury Organized Flow */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#090B0D]/85 backdrop-blur-md transition-opacity"
                onClick={() => setIsCreateOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                className="relative transform overflow-hidden rounded-3xl bg-[#17191D] text-left shadow-2xl sm:my-6 sm:w-full sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl border border-white/10 p-5 sm:p-7 space-y-5 z-10 text-white max-h-[92vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-[11px] font-heading font-semibold uppercase tracking-wider mb-1">
                      Collective Demand Engine
                    </div>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Join or Start a Buyer Collective</h3>
                    <p className="text-xs text-slate-400">Step {currentStep + 1} of 3: {wizardSteps[currentStep].description}</p>
                  </div>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-dd-surface border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="shrink-0 px-2 py-1">
                  <StepIndicator
                    steps={wizardSteps}
                    currentStep={currentStep}
                    onStepClick={(idx) => {
                      if (idx === 1 && !selectedVariantId && !vehicleConfig?.variantId) return;
                      if (idx === 2 && ((!selectedVariantId && !vehicleConfig?.variantId) || !timeline)) return;
                      setCurrentStep(idx);
                    }}
                  />
                </div>

                {/* Scrollable Wizard Body */}
                <div className="overflow-y-auto pr-1 -mr-1 custom-scrollbar space-y-6 flex-1">
                  {createFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 text-dd-red p-3.5 rounded-2xl text-xs flex items-center gap-2.5 font-medium"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-dd-red" />
                      <span>{createFeedback}</span>
                    </motion.div>
                  )}

                  {/* STEP 0: Dynamic Vehicle Model, Trim & Exterior Colour Selection */}
                  {currentStep === 0 && (
                    <VehicleConfigurationForm
                      initialBrandId={vehicleConfig?.brandId || 'mahindra'}
                      initialModelId={vehicleConfig?.modelId || selectedCarId || 'xuv700'}
                      initialVariantId={vehicleConfig?.variantId || selectedVariantId}
                      initialColourId={vehicleConfig?.colourId}
                      onConfigurationChange={handleConfigurationChange}
                      onContinue={handleConfigurationContinue}
                    />
                  )}

                  {/* STEP 1: Buying Preferences */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      {/* Operating Regional Hub */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Delivery City / Dealership Hub
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-dd-red absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 text-xs sm:text-sm font-heading font-bold bg-[#090B0D] text-white focus:outline-none focus:border-dd-red transition-colors"
                          >
                            <option value="Pune" className="bg-dd-card text-white">Pune, Maharashtra</option>
                            <option value="Mumbai" className="bg-dd-card text-white">Mumbai, Maharashtra</option>
                            <option value="Bengaluru" className="bg-dd-card text-white">Bengaluru, Karnataka</option>
                            <option value="Delhi NCR" className="bg-dd-card text-white">Delhi NCR</option>
                            <option value="Hyderabad" className="bg-dd-card text-white">Hyderabad, Telangana</option>
                            <option value="Chennai" className="bg-dd-card text-white">Chennai, Tamil Nadu</option>
                            <option value="Ahmedabad" className="bg-dd-card text-white">Ahmedabad, Gujarat</option>
                          </select>
                        </div>
                      </div>

                      {/* Expected Purchase Timeline */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Expected Purchase Timeline
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { id: 'WITHIN_15_DAYS', label: 'Immediate (< 15 Days)', desc: 'Funds ready, ready to take delivery' },
                            { id: 'WITHIN_30_DAYS', label: 'This Month (30 Days)', desc: 'Booking within the ongoing month' },
                            { id: 'WITHIN_60_DAYS', label: 'Next Month (60 Days)', desc: 'Planning delivery in next 60 days' },
                            { id: 'EXPLORING', label: 'Exploring (90+ Days)', desc: 'Researching deals and group demand' },
                          ].map((t) => (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setTimeline(t.id)}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                timeline === t.id
                                  ? 'border-dd-red bg-dd-red/10 text-white ring-1 ring-dd-red'
                                  : 'border-white/5 hover:border-white/20 bg-[#090B0D] text-slate-400'
                              }`}
                            >
                              <div className="text-xs font-heading font-bold text-white flex items-center justify-between">
                                <span>{t.label}</span>
                                {timeline === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-dd-red shrink-0" />}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1 leading-snug">{t.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Negotiation Priorities */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Dealership Negotiation Priorities
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { id: 'LOWEST_ON_ROAD', label: 'Lowest On-Road Price', desc: 'Prioritize max cash/dealer discount' },
                            { id: 'INSURANCE_FLEXIBILITY', label: 'Self-Arranged Insurance', desc: 'Opt out of compulsory dealer quote' },
                            { id: 'ZERO_ACCESSORIES', label: 'No Mandatory Add-ons', desc: 'Exclude forced accessory packages' },
                            { id: 'FASTEST_DELIVERY', label: 'Fastest Showroom Delivery', desc: 'Ready inventory over custom wait' },
                          ].map((p) => {
                            const isChecked = priorities.includes(p.id);
                            return (
                              <button
                                type="button"
                                key={p.id}
                                onClick={() => togglePriority(p.id)}
                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                  isChecked
                                    ? 'border-white/30 bg-[#202328] text-white ring-1 ring-white/20'
                                    : 'border-white/5 bg-[#090B0D] text-slate-400 hover:border-white/10'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-heading font-bold text-white">{p.label}</span>
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-dd-red border-dd-red text-white' : 'border-white/20'}`}>
                                    {isChecked && <CheckCircle2 className="w-3 h-3" />}
                                  </div>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">{p.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <SecondaryButton size="md" onClick={() => setCurrentStep(0)}>
                          Back
                        </SecondaryButton>
                        <PrimaryButton
                          size="md"
                          onClick={() => {
                            setCreateFeedback(null);
                            setCurrentStep(2);
                          }}
                        >
                          <span>Review & Launch</span>
                          <ArrowRight size={14} />
                        </PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Review & Confirmation */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      {/* Summary Card with Live Colour Preview */}
                      <div className="p-5 bg-[#090B0D] rounded-2xl border border-white/10 space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
                            Selected Vehicle Configuration
                          </div>
                          {vehicleConfig?.colourName && (
                            <div className="flex items-center gap-2 bg-[#17191D] border border-white/10 px-3 py-1 rounded-full text-xs">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20 inline-block shrink-0 shadow-sm"
                                style={{ backgroundColor: vehicleConfig.colourHex || '#ffffff' }}
                              />
                              <span className="font-heading font-bold text-white">
                                {vehicleConfig.colourName}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Vehicle preview banner */}
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                          <div className="w-full sm:w-52 h-32 rounded-xl bg-[#111315] overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-2 relative">
                            <div
                              className="absolute inset-0 opacity-20 blur-xl pointer-events-none transition-colors duration-700"
                              style={{ backgroundColor: vehicleConfig?.colourHex || '#ED1725' }}
                            />
                            <img
                              src={vehicleConfig?.imageUrl || getCarImage(selectedCar)}
                              alt={vehicleConfig?.modelName || selectedCar?.modelName || 'Vehicle'}
                              className="max-h-full max-w-full object-contain relative z-10"
                            />
                          </div>

                          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                              <span>{vehicleConfig?.brandName || selectedCar?.brand}</span>
                              <span>•</span>
                              <span>{vehicleConfig?.bodyType || selectedCar?.bodyType || 'SUV'}</span>
                            </div>
                            <h4 className="text-xl font-heading font-black text-white truncate">
                              {vehicleConfig?.brandName || selectedCar?.brand}{' '}
                              {vehicleConfig?.modelName || selectedCar?.modelName || selectedCar?.model}
                            </h4>
                            <div className="text-xs font-heading font-bold text-dd-red">
                              {vehicleConfig?.variantName || selectedVariant?.name}
                              <span className="text-slate-400 font-normal ml-2">
                                ({vehicleConfig?.fuelType || selectedVariant?.fuelType || 'Petrol'} •{' '}
                                {vehicleConfig?.transmission || selectedVariant?.transmission || 'Manual'})
                              </span>
                            </div>
                            <div className="text-xs font-mono text-slate-400 pt-1">
                              Ex-Showroom Benchmark:{' '}
                              <span className="font-bold text-white text-sm">
                                {formatINR(vehicleConfig?.exShowroomPrice || selectedVariant?.exShowroomPrice || 900000)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Parameters Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 text-xs">
                          <div className="bg-[#111315] p-3 rounded-xl border border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-slate-500">Regional Hub</span>
                            <span className="font-bold text-white text-xs mt-0.5 block">{city}, Maharashtra</span>
                          </div>
                          <div className="bg-[#111315] p-3 rounded-xl border border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-slate-500">Timeline Target</span>
                            <span className="font-bold text-white text-xs mt-0.5 block">{timeline.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="bg-[#111315] p-3 rounded-xl border border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-slate-500">Collective Threshold</span>
                            <span className="font-bold text-dd-green text-xs mt-0.5 block">5 Verified Buyers</span>
                          </div>
                          <div className="bg-[#111315] p-3 rounded-xl border border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-slate-500">Priorities</span>
                            <span className="font-bold text-white text-xs mt-0.5 block">{priorities.length} Selected</span>
                          </div>
                        </div>
                      </div>

                      {/* DPDP Contact Shield Assurance */}
                      <div className="p-4 bg-dd-red/10 rounded-2xl border border-dd-red/20 text-xs space-y-1.5">
                        <div className="font-heading font-bold flex items-center gap-2 text-white">
                          <ShieldCheck size={16} className="text-dd-red" />
                          <span>Zero-Spam & DPDP Contact Shield Guarantee</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          You are initiating this collective completely anonymously. OEM-authorized franchise dealerships submit sealed wholesale price quotations. Your mobile number and personal details are strictly protected and never disclosed until you review and explicitly accept a quote.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <SecondaryButton size="md" onClick={() => setCurrentStep(1)} disabled={isSubmitting}>
                          Back
                        </SecondaryButton>
                        <PrimaryButton size="md" onClick={handleCreateSubmit} disabled={isSubmitting} className="font-heading font-bold px-6 shadow-lg shadow-dd-red/20">
                          {isSubmitting ? (
                            <span>Launching Collective...</span>
                          ) : (
                            <>
                              <span>Confirm & Launch Collective</span>
                              <Sparkles size={14} className="text-white" />
                            </>
                          )}
                        </PrimaryButton>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
