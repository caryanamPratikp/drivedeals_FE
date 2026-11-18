import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Sparkles,
  Fuel,
  Gauge,
  Plus,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { SignInRequiredModal } from '../../components/common/SignInRequiredModal';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const CarDetailPage = () => {
  const { carId } = useParams();
  const { cars = [], variants = [], groups = [], currentUser, fetchCars, createGroup } = useAppStore();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedTargetGroup, setSelectedTargetGroup] = useState(null);

  const isAuthenticated = Boolean(
    currentUser?.id &&
    currentUser?.id !== 'guest' &&
    currentUser?.role &&
    currentUser?.role !== 'PUBLIC'
  );

  useEffect(() => {
    if (cars.length === 0) {
      fetchCars();
    }
  }, [cars.length, fetchCars]);

  const car = cars.find((c) => c.id === carId);
  const carVariants = variants.filter((v) => v.carId === carId && v.active);

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || 'Pune');
  const [isStartingGroup, setIsStartingGroup] = useState(false);

  const getCarImage = (c) => {
    if (!c) return '/cars/hyundai_creta.webp';
    const name = (c.modelName || c.model || '').toLowerCase();
    if (name.includes('nexon')) return '/cars/tata_nexon.webp';
    if (name.includes('creta')) return '/cars/hyundai_creta.webp';
    if (name.includes('xuv700')) return '/cars/mahindra_xuv700.webp';
    if (name.includes('seltos')) return '/cars/seltos.webp';
    if (name.includes('grand vitara') || name.includes('vitara')) return '/cars/grand_vitara.webp';
    if (name.includes('elevate')) return '/cars/elevate.webp';
    return c.imageUrl || '/cars/hyundai_creta.webp';
  };

  useEffect(() => {
    if (carVariants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(carVariants[0].id);
    }
  }, [carVariants, selectedVariantId]);

  const selectedVariant = carVariants.find((v) => v.id === selectedVariantId) || carVariants[0];

  // Active groups for this model
  const activeCarGroups = groups.filter(
    (g) => g.status !== 'CLOSED' && g.stage !== 'CLOSED' && (g.carId === carId || carVariants.some((v) => v.id === g.variantId))
  );

  const handleStartGroup = () => {
    if (!isAuthenticated) {
      setSelectedTargetGroup(null);
      setAuthModalOpen(true);
      return;
    }
    if (!selectedVariant) return;
    navigate(`/buyer/groups?openCreate=true&carId=${carId}&createVariantId=${selectedVariant.id}`);
  };

  const handleViewGroup = (group) => {
    if (!isAuthenticated) {
      setSelectedTargetGroup(group);
      setAuthModalOpen(true);
    } else {
      navigate(`/groups/${group.id}`);
    }
  };

  if (!car) {
    return (
      <div className="text-center py-24 space-y-6">
        <h2 className="text-2xl font-heading font-black text-white">Vehicle Not Found</h2>
        <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
          The requested vehicle model does not exist in the live catalogue or has been deactivated.
        </p>
        <Link to="/cars">
          <PrimaryButton size="md">
            <ChevronLeft size={16} />
            <span>Return to Showroom</span>
          </PrimaryButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      {/* Back button */}
      <Link
        to="/cars"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#A1A1AA] hover:text-white transition-colors"
      >
        <ChevronLeft size={14} />
        <span>Back to All Vehicles</span>
      </Link>

      {/* 1. Cinematic Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#17191D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Vehicle Image Container */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl bg-[#090B0D] overflow-hidden border border-white/10 shadow-inner group">
          <img
            src={getCarImage(car)}
            alt={`${car.brand} ${car.modelName || car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-[#090B0D]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/15">
            {car.brand} Official
          </div>
          {car.bodyType && (
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/15">
              {car.bodyType}
            </div>
          )}
        </div>

        {/* Car Details & Price Readout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
              <Sparkles size={13} className="text-[#ED1725]" />
              <span>Collective Group Discounts Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
              {car.brand} {car.modelName || car.model}
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              {car.description || `Discover group buying power on the ${car.brand} ${car.modelName || car.model}. Unite with 5 buyers in your city to unlock fleet showroom pricing.`}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">Starting Ex-Showroom</span>
            <span className="text-2xl sm:text-3xl font-heading font-black text-white">
              {formatINR(car.illustrativeStartingPrice || car.minPrice || selectedVariant?.exShowroomPrice || 0)}
            </span>
          </div>

          {/* Quick city selector */}
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
            <MapPin size={14} className="text-[#ED1725]" />
            <span>Target City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#090B0D] border border-white/10 rounded-lg px-2.5 py-1 text-white font-bold focus:outline-none"
            >
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          <div className="pt-2">
            <PrimaryButton
              size="lg"
              onClick={handleStartGroup}
              loading={isStartingGroup}
              className="w-full"
            >
              <Plus size={16} />
              <span>Start a Buying Group in {selectedCity}</span>
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* 2. Trims & Variant Selector */}
      {carVariants.length > 0 && (
        <div className="bg-[#17191D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-heading font-black text-white">Available Trims & Variants</h3>
              <p className="text-xs text-[#71717A] mt-0.5">Select a variant to view specifications and benchmark ex-showroom pricing.</p>
            </div>
            <span className="text-xs font-bold text-[#A1A1AA]">{carVariants.length} Variants Available</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {carVariants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  (selectedVariant?.id === v.id)
                    ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-lg shadow-[#ED1725]/25'
                    : 'bg-[#090B0D] text-[#A1A1AA] hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>

          {selectedVariant && (
            <div className="p-5 rounded-2xl bg-[#090B0D] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ED1725]">
                  <Fuel size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#71717A] uppercase font-bold block">Fuel Type</span>
                  <span className="text-xs font-bold text-white">{selectedVariant.fuelType || 'Petrol'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ED1725]">
                  <Gauge size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#71717A] uppercase font-bold block">Transmission</span>
                  <span className="text-xs font-bold text-white">{selectedVariant.transmission || 'Manual'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22C55E]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#71717A] uppercase font-bold block">Ex-Showroom Price</span>
                  <span className="text-xs font-bold text-white">{formatINR(selectedVariant.exShowroomPrice)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Active Groups for this car */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-black text-white">Active Buyer Groups for this Model</h3>
        {activeCarGroups.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#17191D] border border-white/10 text-center space-y-3 shadow-lg">
            <Users size={32} className="mx-auto text-[#71717A]" />
            <h4 className="text-base font-bold text-white">No Active Groups Yet</h4>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
              Be the first to start a buying collective for the {car.brand} {car.modelName || car.model} in {selectedCity}!
            </p>
            <PrimaryButton size="sm" onClick={handleStartGroup} loading={isStartingGroup}>
              <Plus size={14} /> Start the First Group
            </PrimaryButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCarGroups.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-[#17191D] border border-white/10 space-y-4 hover:border-white/25 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={g.stage || g.status} />
                    <span className="text-xs font-bold text-white">{g.city}</span>
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm">{g.variant?.name || 'Selected Variant'}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                    <Users size={13} className="text-[#ED1725]" />
                    <span>{g.currentMembers || 1} / {g.targetMembers || 5} Buyers Joined</span>
                  </div>
                </div>

                <SecondaryButton
                  size="sm"
                  onClick={() => handleViewGroup(g)}
                  className="w-full"
                >
                  <span>View Group</span>
                  <ArrowRight size={13} />
                </SecondaryButton>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign In Required Overlay Popup Modal */}
      <SignInRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Sign In Required to View Quotes"
        message="Dealership quotations, itemized on-road discounts, and collective member bids are exclusive to registered members to protect dealer pricing and buyer privacy."
        redirectPath={selectedTargetGroup ? `/groups/${selectedTargetGroup.id}` : `/cars/${carId}`}
        groupTitle={
          selectedTargetGroup
            ? `${car.brand} ${car.modelName || car.model || ''} (${selectedTargetGroup.variant?.name || 'Selected Trim'})`
            : `${car.brand} ${car.modelName || car.model || ''}`
        }
      />
    </div>
  );
};
