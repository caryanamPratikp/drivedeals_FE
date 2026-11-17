import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Search,
  Users,
  ArrowRight,
  X,
  Sparkles,
  SlidersHorizontal,
  Fuel,
  Gauge,
  Plus
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { EmptyState } from '../../components/common/EmptyState';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const CarsPage = () => {
  const navigate = useNavigate();
  const { cars = [], variants = [], groups = [], currentUser, fetchCars, carsLoading } = useAppStore();

  useEffect(() => {
    if (cars.length === 0) {
      fetchCars();
    }
  }, [cars.length, fetchCars]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState('ALL');
  const [selectedBodyType, setSelectedBodyType] = useState('ALL');
  const [onlyWithActiveGroups, setOnlyWithActiveGroups] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Extract unique brands and body types
  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand))), [cars]);
  const bodyTypes = useMemo(() => Array.from(new Set(cars.map((c) => c.bodyType).filter(Boolean))), [cars]);

  // Model-accurate photography mapping
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

  // Filtered & sorted cars
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        if (!car.active) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            car.brand.toLowerCase().includes(q) ||
            (car.modelName || car.model || '').toLowerCase().includes(q);
          if (!match) return false;
        }

        // Brand
        if (selectedBrand !== 'ALL' && car.brand !== selectedBrand) return false;

        // Body type
        if (selectedBodyType !== 'ALL' && car.bodyType !== selectedBodyType) return false;

        // Associated variants
        const carVariants = variants.filter((v) => v.carId === car.id && v.active);

        // Fuel filter
        if (selectedFuel !== 'ALL') {
          const hasFuel = carVariants.some((v) => v.fuelType === selectedFuel);
          if (!hasFuel) return false;
        }

        // Transmission filter
        if (selectedTransmission !== 'ALL') {
          const hasTrans = carVariants.some((v) => v.transmission === selectedTransmission);
          if (!hasTrans) return false;
        }

        // Active groups filter
        if (onlyWithActiveGroups) {
          const hasActiveGroups = groups.some(
            (g) => g.status !== 'CLOSED' && g.stage !== 'CLOSED' && (g.carId === car.id || carVariants.some((v) => v.id === g.variantId))
          );
          if (!hasActiveGroups) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return `${a.brand} ${a.modelName || a.model}`.localeCompare(
            `${b.brand} ${b.modelName || b.model}`
          );
        }
        if (sortBy === 'price') {
          const pA = a.illustrativeStartingPrice || a.minPrice || 0;
          const pB = b.illustrativeStartingPrice || b.minPrice || 0;
          return pA - pB;
        }
        return 0;
      });
  }, [
    cars,
    variants,
    groups,
    searchQuery,
    selectedBrand,
    selectedFuel,
    selectedTransmission,
    selectedBodyType,
    onlyWithActiveGroups,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery ||
    selectedBrand !== 'ALL' ||
    selectedFuel !== 'ALL' ||
    selectedTransmission !== 'ALL' ||
    selectedBodyType !== 'ALL' ||
    onlyWithActiveGroups;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedFuel('ALL');
    setSelectedTransmission('ALL');
    setSelectedBodyType('ALL');
    setOnlyWithActiveGroups(false);
    setSortBy('name');
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] to-[#111315] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
            <Sparkles size={13} className="text-[#ED1725]" />
            <span>Official Vehicle Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
            Explore Cars
          </h1>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Find your perfect car and discover group buying opportunities. Join an existing demand collective or initiate a new group in your city.
          </p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-[#17191D] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search text */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" size={16} />
            <input
              type="text"
              placeholder="Search by brand or model (e.g. Creta, Nexon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED1725] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            )}
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

          {/* Fuel select */}
          <div>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ED1725] font-medium"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Transmission select */}
          <div>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#090B0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ED1725] font-medium"
            >
              <option value="ALL">All Transmissions</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>
        </div>

        {/* Secondary toggles and sort bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-white select-none font-semibold">
            <input
              type="checkbox"
              checked={onlyWithActiveGroups}
              onChange={(e) => setOnlyWithActiveGroups(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-[#090B0D] text-[#ED1725] focus:ring-[#ED1725]"
            />
            <span>Filter models with active buyer demand collectives</span>
          </label>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#71717A] font-medium">Sort Catalogue:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#090B0D] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="name">Model Name (A-Z)</option>
                <option value="price">Starting Price (Low to High)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#EF4444] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Responsive 3-Column / 4-Column Vehicle Grid */}
      {cars.length === 0 ? (
        <EmptyState
          title="Vehicle Catalogue Empty"
          description="All dummy data has been completely cleared. Live vehicles can be published dynamically via the Admin Console."
          actionText={currentUser?.role === 'ADMIN' ? 'Go to Admin Console' : undefined}
          onAction={currentUser?.role === 'ADMIN' ? () => navigate('/admin/catalogue') : undefined}
        />
      ) : filteredCars.length === 0 ? (
        <EmptyState
          title="No matching vehicles found in catalogue"
          description="Adjust your search filters or select 'All Brands' to view all available showroom models."
          actionText="Reset All Filters"
          onAction={clearFilters}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {filteredCars.map((car) => {
            const carVariants = variants.filter((v) => v.carId === car.id && v.active);
            const carGroups = groups.filter(
              (g) => g.status !== 'CLOSED' && g.stage !== 'CLOSED' && (g.carId === car.id || carVariants.some((v) => v.id === g.variantId))
            );
            const totalBuyers = carGroups.reduce(
              (acc, g) => acc + (g.currentMembers || g.memberIds?.length || 0),
              0
            );

            return (
              <motion.div
                key={car.id}
                variants={staggerItem}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)' }}
                className="bg-[#17191D] rounded-3xl border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white/25 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 bg-[#090B0D] overflow-hidden">
                    <img
                      src={getCarImage(car)}
                      alt={`${car.brand} ${car.modelName || car.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#090B0D]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/15 shadow-sm">
                      {car.brand}
                    </div>
                    {car.bodyType && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/15">
                        {car.bodyType}
                      </div>
                    )}
                    {carGroups.length > 0 && (
                      <div className="absolute bottom-3 left-3 bg-[#090B0D]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5 border border-[#ED1725]/40">
                        <Users size={12} className="text-[#ED1725]" />
                        <span>{totalBuyers} Buyers in Collective</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-heading font-black text-white group-hover:text-[#ED1725] transition-colors">
                        {car.brand} {car.modelName || car.model}
                      </h3>
                      <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                        {car.description || `Explore ${car.brand} ${car.modelName || car.model} trims and collective pricing.`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                      <span className="text-xs text-[#71717A] font-medium">Ex-Showroom from</span>
                      <span className="text-lg font-heading font-black text-white">
                        {formatINR(car.illustrativeStartingPrice || car.minPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  <Link to={`/cars/${car.id}`} className="flex-1">
                    <PrimaryButton size="md" className="w-full">
                      <span>View Details</span>
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
