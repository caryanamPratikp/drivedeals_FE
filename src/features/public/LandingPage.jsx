import { Footer } from '../../components/layout/Footer';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Car,
  FileText,
  Handshake,
  Tag,
  Percent,
  PiggyBank,
  Eye,
  Zap,
  Star,
  Award,
  Sparkles,
  Lock,
  Building,
  TrendingDown,
  Info,
  RotateCw,
  FileSpreadsheet
} from 'lucide-react';
import { formatINR } from '../../lib/currency';
import {
  EmptyGroupsState,
  EmptyQuotesState,
  EmptyCatalogueState,
  LoadingState,
  ErrorState
} from '../../components/common/EmptyStates';

export const LandingPage = () => {
  const navigate = useNavigate();
  const {
    cars,
    groups,
    currentUser,
    fetchCars,
    fetchGroups,
    carsLoading,
    carsError,
    carsFetched,
    groupsLoading,
    groupsError,
    groupsFetched,
  } = useAppStore();

  // Platform & Modal State
  const selectedCity = 'Pune';
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Fetch real data on component mount
  useEffect(() => {
    fetchCars();
    fetchGroups();
  }, [fetchCars, fetchGroups]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Model-accurate photography mapping
  const getCarImage = (car) => {
    if (!car) return '/assets/cars/nexon.webp';
    const name = (car.modelName || car.model || '').toLowerCase();
    if (name.includes('nexon')) return '/assets/cars/nexon.webp';
    if (name.includes('creta')) return '/assets/cars/creta.webp';
    if (name.includes('brezza')) return '/assets/cars/brezza.webp';
    if (name.includes('verna')) return '/assets/cars/verna.webp';
    if (name.includes('xuv700')) return '/cars/mahindra_xuv700.webp';
    if (name.includes('seltos')) return '/cars/seltos.webp';
    if (name.includes('grand vitara') || name.includes('vitara')) return '/cars/grand_vitara.webp';
    if (name.includes('elevate')) return '/cars/elevate.webp';
    return car.imageUrl || car.image || '/assets/cars/nexon.webp';
  };

  // Popular Brands Data
  const popularBrands = [
    { name: 'Tata', logo: '/assets/brands/tata.png', query: 'Tata' },
    { name: 'Maruti Suzuki', logo: '/assets/brands/maruti.png', query: 'Maruti' },
    { name: 'Hyundai', logo: '/assets/brands/hyundai.png', query: 'Hyundai' },
    { name: 'Mahindra', logo: '/assets/brands/mahindra.png', query: 'Mahindra' },
    { name: 'Toyota', logo: '/assets/brands/toyota.png', query: 'Toyota' },
    { name: 'Kia', logo: '/assets/brands/kia.png', query: 'Kia' },
    { name: 'BMW', logo: '/assets/brands/bmw.png', query: 'BMW' },
    { name: 'Mercedes-Benz', logo: '/assets/brands/mercedes.png', query: 'Mercedes' },
    { name: 'Audi', logo: '/assets/brands/audi.png', query: 'Audi' },
  ];

  const activeGroups = (groups || []).filter((g) => g.status !== 'CLOSED');
  const liveCars = cars || [];

  // Verified real customer reviews (empty until collected from verified deliveries)
  const verifiedTestimonials = [];

  return (
    <div id="home" className="min-h-screen bg-[#090B0D] text-white font-sans antialiased selection:bg-[#ED1725] selection:text-white relative overflow-x-hidden">

      {/* ========================================================================= */}
      {/* SECTION B — CINEMATIC HERO SECTION                                        */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
        {/* Subtle Ambient Red Glow Effects */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#ED1725]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#ED1725]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 z-10 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold shadow-sm">
                <Users size={14} className="text-[#ED1725]" />
                <span>Group Car Buying Platform</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-white">
                  Buy Smarter, <br />
                  <span className="relative inline-block text-[#ED1725]">
                    Together.
                    {/* Decorative hand-drawn cursive swoop underline */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#ED1725]"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 9.5C50 2.5 150 2.5 198 9.5"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                Join a group, get better deals, and drive your dream car for less! Connect with fellow buyers in {selectedCity} for collective showroom discounts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/groups">
                  <button className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white font-bold text-sm shadow-xl shadow-[#ED1725]/30 hover:shadow-[#ED1725]/50 transition-all duration-200 cursor-pointer">
                    <span>Join a Deal Group</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white">
                    <Play size={12} fill="white" className="ml-0.5" />
                  </div>
                  <span>Watch How It Works</span>
                </button>
              </div>

              {/* Honest, Real Platform Value Pillars (Zero Fake Metrics) */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-heading font-black text-white">100% Direct</div>
                  <div className="text-[11px] text-[#A1A1AA]">Authorized Dealerships</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-heading font-black text-white">Zero Spam</div>
                  <div className="text-[11px] text-[#A1A1AA]">Privacy Shield Protected</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-heading font-black text-[#ED1725]">Volume Deals</div>
                  <div className="text-[11px] text-[#A1A1AA]">Direct Group Pricing</div>
                </div>
              </div>
            </div>

            {/* Right Automotive Scene Column */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              {/* Automotive Fleet with Shaniwar Wada & Pune Sunset */}
              <div className="relative w-full">
                {/* Red Atmospheric Backdrop */}
                <div className="absolute inset-0 bg-radial from-[#ED1725]/20 via-transparent to-transparent blur-2xl pointer-events-none" />

                {/* Hero Graphic Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img
                    src="/assets/cars/hero-automotive-scene.webp"
                    alt="DriveDeals Automotive Fleet in Pune"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  {/* Floating Group Buy Pill on Top Right */}
                  <div className="absolute top-4 right-4 bg-[#ED1725] text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 border border-white/20">
                    <Percent size={14} />
                    <span>Group Buy Save More!</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C — TRUST / BENEFIT STRIP                                         */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-6 relative z-20">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="bg-[#17191D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">

              {/* Block 1 */}
              <div className="flex items-center gap-4 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base">Join Demand Groups</h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Bring together interested buyers</p>
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6 lg:pl-8">
                <div className="w-12 h-12 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shrink-0">
                  <Handshake size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base">Get Dealer Quotes</h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Multiple dealers, better offers</p>
                </div>
              </div>

              {/* Block 3 */}
              <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6 lg:pl-8">
                <div className="w-12 h-12 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shrink-0">
                  <Tag size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base">Compare & Save</h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Choose the best deal</p>
                </div>
              </div>

              {/* Block 4 */}
              <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6 lg:pl-8">
                <div className="w-12 h-12 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725] shrink-0">
                  <Car size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base">Drive Your Dream</h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">With total confidence</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D — HOW IT WORKS (4-STEP CONNECTED PROTOCOL)                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 relative">
        <div className="w-full px-6 sm:px-10 lg:px-16 space-y-12">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1725]">
                <Sparkles size={14} /> The Group Buying Protocol
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
                How DriveDeals Works?
              </h2>
              <p className="text-sm text-[#A1A1AA] max-w-xl font-normal">
                A simple 4-step process to get the best car deal through collective bargaining.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/how-it-works">
                <button className="px-5 py-2.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
                  Learn More →
                </button>
              </Link>
              {/* Handwritten text */}
              <div className="hidden sm:block font-handwriting text-2xl text-slate-300 transform -rotate-3">
                Better Deals. Together.
              </div>
            </div>
          </div>

          {/* 4 Connected Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#17191D] border border-white/10 rounded-2xl p-6 relative hover:border-[#ED1725]/50 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-[#ED1725] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    1
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 01</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#ED1725] transition-colors">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">Choose Your Car</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    Select your favourite brand, model and variant from verified showroom models.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#17191D] border border-white/10 rounded-2xl p-6 relative hover:border-[#ED1725]/50 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-[#ED1725] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    2
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 02</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#ED1725] transition-colors">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">Join a Group</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    Add your interest to an active demand collective in {selectedCity} with identical trim specs.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#17191D] border border-white/10 rounded-2xl p-6 relative hover:border-[#ED1725]/50 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-[#ED1725] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    3
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 03</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#ED1725] transition-colors">
                  <Handshake size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">Compare Offers</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    Receive transparent itemized quotes directly from authorized franchise dealerships.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#17191D] border border-white/10 rounded-2xl p-6 relative hover:border-[#ED1725]/50 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-[#ED1725] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    4
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 04</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#ED1725] transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">Buy with Confidence</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    Select the winning offer, give consent, and take physical delivery from the showroom.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E — WHY CHOOSE DRIVEDEALS? + VERIFIED PROTOCOL GUARANTEE          */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#17191D]/40 border-y border-white/10 relative">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: 4 Key Value Pillars */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1725] mb-2">
                  <Award size={14} /> The Group Advantage
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
                  Why Choose DriveDeals?
                </h2>
                <p className="text-sm text-[#A1A1AA] mt-1">
                  Because together, you get more.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                    <PiggyBank size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Better Prices</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Group buying power unlocks bulk volume concessions never offered to individual walk-in buyers.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Trusted Dealers</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Verified franchise dealerships only. Full OEM manufacturer warranty and complete invoice integrity.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                    <Eye size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Transparent Process</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Itemized on-road breakdowns. Zero forced insurance bundles or mandatory dealer accessory markups.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ED1725]/15 border border-[#ED1725]/30 flex items-center justify-center text-[#ED1725]">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Faster Delivery</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Priority inventory allocation from authorized dealerships for grouped buyer batches.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Direct OEM Delivery Guarantee Card (Zero Fake Testimonials) */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-gradient-to-br from-[#1F2229] to-[#15171C] text-white rounded-3xl p-7 sm:p-8 shadow-2xl overflow-hidden border border-white/15 space-y-6">
                {/* Shaniwar Wada Fort Watermark in Bottom-Right */}
                <img
                  src="/assets/backgrounds/pune-fort-watermark.webp"
                  alt="Pune Landmark"
                  className="absolute bottom-0 right-0 w-36 h-auto opacity-10 pointer-events-none object-contain"
                />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ED1725]/20 border border-[#ED1725]/40 flex items-center justify-center text-[#ED1725]">
                      <Building size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm">Direct Showroom Delivery</h4>
                      <p className="text-[11px] text-[#A1A1AA]">Official OEM Franchise Network</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#ED1725] bg-[#ED1725]/10 px-2.5 py-1 rounded-full border border-[#ED1725]/25">
                    Pune Pilot Hub
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ED1725] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white">Full Manufacturer Warranty:</strong> Delivery is taken directly at the authorized dealership showroom with official OEM billing.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ED1725] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white">Contact Shield Protection:</strong> Your phone number is never shared with dealerships until you explicitly accept a quotation.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ED1725] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white">Fair Itemized Quotations:</strong> Quotes transparently itemize Ex-Showroom, Statutory RTO, and Insurance without inflated dealership add-ons.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Ready to form a buying group?</span>
                  <Link to="/cars">
                    <button className="px-4 py-2 rounded-xl bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5">
                      <span>Explore Cars</span>
                      <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION F — POPULAR CAR BRANDS                                            */}
      {/* ========================================================================= */}
      <section className="py-20 relative">
        <div className="w-full px-6 sm:px-10 lg:px-16 space-y-10">

          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Popular Brands
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl mx-auto">
              Explore vehicles from India's most trusted manufacturers eligible for group buying.
            </p>
          </div>

          {/* 9 Brand Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {popularBrands.map((brand) => (
              <div
                key={brand.name}
                onClick={() => navigate(`/cars?brand=${encodeURIComponent(brand.query)}`)}
                className="bg-[#17191D] border border-white/10 hover:border-[#ED1725] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#ED1725]/20 group"
              >
                <div className="h-12 w-full flex items-center justify-center p-1">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors text-center line-clamp-1">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      

      {/* ========================================================================= */}
      {/* SECTION H — TESTIMONIALS (RULE 4E: HIDDEN WHEN 0 REAL REVIEWS EXIST)      */}
      {/* ========================================================================= */}
      {verifiedTestimonials.length > 0 && (
        <section className="py-20 relative">
          <div className="w-full px-6 sm:px-10 lg:px-16 space-y-12">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1725]">
                <Star size={13} fill="currentColor" /> Verified Community Reviews
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
                What Our Buyers Say
              </h2>
              <p className="text-sm text-[#A1A1AA] max-w-xl mx-auto">
                Real stories from buyers who unlocked volume pricing by negotiating together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verifiedTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#17191D] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <img
                      src={t.avatar || '/assets/avatars/buyer-1.webp'}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="font-heading font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-[#A1A1AA] flex items-center gap-1">
                        <MapPin size={11} className="text-[#ED1725]" /> {t.city}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION I — FINAL CTA BANNER (WITH CITY SKYLINE SILHOUETTE)               */}
      {/* ========================================================================= */}
      <section className="py-12 relative overflow-hidden">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#A30E18] via-[#ED1725] to-[#17191D] p-8 sm:p-12 lg:p-14 overflow-hidden shadow-2xl border border-white/20">

            {/* City Skyline Silhouette Watermark in Background */}
            <img
              src="/assets/backgrounds/city-silhouette.webp"
              alt="City Skyline"
              className="absolute right-0 bottom-0 max-h-full w-auto opacity-20 pointer-events-none object-contain"
            />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                <Award size={26} />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight">
                Ready to Drive Smarter?
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                Join a demand group today and unlock better deals! Connect with fellow car buyers and verified dealerships offering group volume pricing in {selectedCity}.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-[#090B0D] font-heading font-bold text-sm sm:text-base shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer">
                    <span>Get Started</span>
                    <ArrowRight size={18} className="text-[#ED1725]" />
                  </button>
                </Link>

                <Link to="/how-it-works">
                  <button className="px-6 py-4 rounded-full bg-black/30 hover:bg-black/50 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer">
                    Read Our Guide
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION J — SHARED GLOBAL REUSABLE FOOTER                                */}
      {/* ========================================================================= */}
      <Footer id="about" />

      {/* ========================================================================= */}
      {/* INTERACTIVE VIDEO / WALKTHROUGH MODAL                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#17191D] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ED1725] text-white flex items-center justify-center">
                    <Play size={14} fill="white" className="ml-0.5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">How DriveDeals Works</h3>
                    <p className="text-xs text-slate-400">Interactive Protocol Overview</p>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ED1725] text-[10px] text-white flex items-center justify-center">1</span>
                    Demand Aggregation
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    Car buyers pool interest for the exact same vehicle variant in their regional hub.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ED1725] text-[10px] text-white flex items-center justify-center">2</span>
                    Authorized Dealership Quotations
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    Official dealerships submit itemized on-road quotes with guaranteed volume discounts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ED1725] text-[10px] text-white flex items-center justify-center">3</span>
                    Explicit Consent & Showroom Handover
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    Your contact is only shared when you accept the winning offer. Take delivery directly from the OEM dealer.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <Link to="/groups" onClick={() => setVideoModalOpen(false)}>
                  <button className="px-6 py-2.5 rounded-full bg-[#ED1725] hover:bg-[#A30E18] text-white text-xs font-bold shadow-md cursor-pointer">
                    Explore Active Groups →
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
