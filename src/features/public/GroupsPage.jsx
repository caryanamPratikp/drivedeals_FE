import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  Plus,
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { formatDate } from '../../lib/dates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const GroupsPage = () => {
  const { groups = [], variants = [], cars = [], currentUser, fetchGroups, fetchCars } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (groups.length === 0) fetchGroups();
    if (cars.length === 0) fetchCars();
  }, [groups.length, cars.length, fetchGroups, fetchCars]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');

  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))), [cars]);
  const cities = useMemo(() => Array.from(new Set(groups.map((g) => g.city).filter(Boolean))), [groups]);

  // Model-accurate photography
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

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const variant = group.variant || variants.find((v) => v.id === group.variantId);
      const car = group.car || cars.find((c) => c.id === variant?.carId || c.id === group.carId);

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCar = car
          ? `${car.brand} ${car.modelName || car.model || ''}`.toLowerCase().includes(q)
          : false;
        const matchesVariant = variant ? variant.name.toLowerCase().includes(q) : false;
        const matchesCity = group.city ? group.city.toLowerCase().includes(q) : false;
        if (!matchesCar && !matchesVariant && !matchesCity) return false;
      }

      // Stage / Status
      const groupStage = group.stage || group.status;
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'FORMATION' && groupStage !== 'FORMATION' && groupStage !== 'COLLECTING_INTEREST') return false;
        if (selectedStatus === 'OPEN_FOR_QUOTES' && groupStage !== 'OPEN_FOR_QUOTES' && groupStage !== 'REQUESTING_QUOTES') return false;
        if (selectedStatus === 'UNDER_REVIEW' && groupStage !== 'UNDER_REVIEW' && groupStage !== 'OFFERS_AVAILABLE') return false;
        if (selectedStatus === 'CLOSED' && groupStage !== 'CLOSED') return false;
      }

      // Brand
      if (selectedBrand !== 'ALL' && car?.brand !== selectedBrand) {
        return false;
      }

      // City
      if (selectedCity !== 'ALL' && group.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [groups, variants, cars, searchQuery, selectedStatus, selectedBrand, selectedCity]);

  const hasActiveFilters = searchQuery || selectedStatus !== 'ALL' || selectedBrand !== 'ALL' || selectedCity !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedBrand('ALL');
    setSelectedCity('ALL');
  };

  const handleStartGroup = () => {
    if (currentUser?.role !== 'BUYER') {
      navigate('/login');
    } else {
      navigate('/cars');
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] to-[#111315] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
              <Sparkles size={13} className="text-[#ED1725]" />
              <span>Demand Aggregation Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
              Active Buyer Collectives
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Connect with verified private buyers interested in the identical car variant to unlock collective volume discounts from authorized regional dealerships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <PrimaryButton
              size="md"
              onClick={handleStartGroup}
              className="font-bold px-6 py-3"
            >
              <Plus size={16} />
              <span>Start New Collective</span>
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-[#17191D] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, variant or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status / Stage select */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ED1725] font-medium"
            >
              <option value="ALL">All Collective Stages</option>
              <option value="FORMATION">Building Group (Formation)</option>
              <option value="OPEN_FOR_QUOTES">Open for Quotations</option>
              <option value="UNDER_REVIEW">Offers Under Review</option>
              <option value="CLOSED">Concluded / Closed</option>
            </select>
          </div>

          {/* Brand select */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ED1725] font-medium"
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* City select */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ED1725] font-medium"
            >
              <option value="ALL">All Regional Hubs</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear filters row if active */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-2 border-t border-white/10">
            <button
              onClick={clearFilters}
              className="text-xs text-[#EF4444] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X size={12} /> Clear Filter Selection
            </button>
          </div>
        )}
      </div>

      {/* 3. Collective Cards Grid */}
      {filteredGroups.length === 0 ? (
        <EmptyState
          title="No Demand Collectives Active"
          description="Be the first buyer to form a group for your preferred vehicle variant and invite local buyers to unlock dealership group pricing."
          actionText="Start a Collective"
          onAction={handleStartGroup}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredGroups.map((group) => {
            const variant = group.variant || variants.find((v) => v.id === group.variantId);
            const car = group.car || cars.find((c) => c.id === variant?.carId || c.id === group.carId);
            const currentCount = group.currentMembers || group.memberIds?.length || 1;
            const targetCount = group.targetMembers || 5;
            const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

            return (
              <motion.div
                key={group.id}
                variants={staggerItem}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)' }}
                className="bg-[#17191D] rounded-3xl border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white/25 transition-all duration-300"
              >
                <div>
                  {/* Top Bar with car image and status */}
                  <div className="relative h-48 bg-[#090B0D] overflow-hidden">
                    <img
                      src={getCarImage(car)}
                      alt={car?.modelName || 'Vehicle'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191D] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={group.stage || group.status} showInfo={false} />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                        {car?.brand || 'Verified Vehicle'}
                      </div>
                      <div className="text-lg font-heading font-black tracking-tight truncate">
                        {car?.modelName || car?.model || 'Model'}
                      </div>
                      <div className="text-xs text-[#ED1725] font-semibold truncate">
                        {variant?.name || 'Standard Trim'}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Buyer Progress Bar */}
                    <div className="p-3 bg-[#090B0D] rounded-xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#A1A1AA] font-medium flex items-center gap-1.5">
                          <Users size={13} className="text-[#ED1725]" />
                          <span>Collective Strength</span>
                        </span>
                        <span className="font-heading font-black text-white">
                          {currentCount} / {targetCount} Buyers
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#17191D] rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-[#ED1725] rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="space-y-2 text-xs text-[#A1A1AA] border-t border-white/10 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-[#ED1725]" /> Region Hub:
                        </span>
                        <span className="font-bold text-white">{group.city || 'Regional'}</span>
                      </div>
                      {group.joinDeadline && (
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock size={13} className="text-[#71717A]" /> Closes:
                          </span>
                          <span className="font-mono text-white">{formatDate(group.joinDeadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link to={`/groups/${group.id}`} className="block w-full">
                    <PrimaryButton
                      size="sm"
                      className="w-full justify-center font-bold"
                    >
                      <span>View Collective & Quotes</span>
                      <ArrowRight size={14} />
                    </PrimaryButton>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
