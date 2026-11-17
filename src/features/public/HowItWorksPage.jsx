import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Users,
  Lock,
  Award,
  Sparkles,
  FileCheck2,
  Car,
  Scale,
  Handshake
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const HowItWorksPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Car & Variant',
      subtitle: 'Pick the exact model and trim you love',
      description:
        'Car prices and taxes depend on the exact variant, fuel type, and transmission. DriveDeals groups buyers looking for identical cars so dealerships can give the best group volume pricing.',
      icon: Car,
      action: { text: 'Explore Cars', href: '/cars' }
    },
    {
      step: '02',
      title: 'Join a Local Car Group',
      subtitle: 'Team up with other buyers in your city',
      description:
        'Join an existing group or start a new one for your favorite car. Joining is 100% free with no deposit or commitment. The bigger the group, the bigger the dealer discounts!',
      icon: Users,
      action: { text: 'Browse Car Groups', href: '/groups' }
    },
    {
      step: '03',
      title: 'Local Showrooms Submit Quotes',
      subtitle: 'Special wholesale group discount prices',
      description:
        'Authorized OEM franchise showrooms submit competitive bids with crystal-clear breakdowns: ex-showroom price, RTO road taxes, insurance, optional accessories, and direct group savings.',
      icon: FileCheck2
    },
    {
      step: '04',
      title: 'Compare Prices Side-by-Side',
      subtitle: 'Zero hidden charges — every rupee explained',
      description:
        'Review transparent price breakdowns across local dealerships. Compare final on-road prices, delivery times, and color availability without any pressure or annoying salesperson calls.',
      icon: Scale
    },
    {
      step: '05',
      title: 'Pick the Best Deal & Test Drive',
      subtitle: 'Zero spam guarantee — you stay in control',
      description:
        'Your phone number remains completely hidden until you choose to accept an offer. Only the single winning dealership receives your contact to schedule your test drive and coordinate booking.',
      icon: Handshake
    }
  ];

  const guarantees = [
    {
      icon: Lock,
      title: 'Zero Spam Guarantee',
      desc: 'Your mobile number is never given to multiple dealerships or annoying telemarketers.'
    },
    {
      icon: ShieldCheck,
      title: '100% Private & Safe',
      desc: 'You decide when to connect. Revoke permission with one click anytime in your portal.'
    },
    {
      icon: Award,
      title: 'Verified Showrooms Only',
      desc: 'Strictly OEM-authorized franchise dealerships with verified showrooms and GST registration.'
    },
    {
      icon: TrendingDown,
      title: '100% Free for Car Buyers',
      desc: 'Buyers never pay any platform fees or booking charges to join groups. Savings go straight to you.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 select-none">
      {/* 1. Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17191D] to-[#111315] border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ED1725]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ED1725]/15 border border-[#ED1725]/30 text-white text-xs font-bold">
            <Sparkles size={13} className="text-[#ED1725]" />
            <span>Simple 5-Step Process</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white">
            How DriveDeals Works
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            Team up with car buyers in your city, unlock group discount prices, and test drive your new car with zero spam.
          </p>
        </div>
      </div>

      {/* 2. Step-by-Step Flow */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              variants={staggerItem}
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-[#17191D] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row gap-6 items-start transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#090B0D] border border-white/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-mono font-bold text-[#ED1725]">STEP</span>
                <span className="text-lg font-heading font-black text-white">{item.step}</span>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-heading font-black text-white">
                      {item.title}
                    </h2>
                    <Icon size={18} className="text-[#ED1725]" />
                  </div>
                  <div className="text-xs text-[#ED1725] font-semibold mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>

                {item.action && (
                  <div className="pt-2">
                    <Link to={item.action.href}>
                      <SecondaryButton size="sm">
                        <span>{item.action.text}</span>
                        <ArrowRight size={13} />
                      </SecondaryButton>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 3. Guarantees & Pillars */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Built on Uncompromising Trust & Privacy
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl mx-auto">
            Traditional car buying leads result in annoying calls from dozens of brokers. DriveDeals eliminates spam permanently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className="bg-[#17191D] p-5 rounded-2xl border border-white/10 space-y-3 shadow-lg hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#090B0D] border border-white/10 flex items-center justify-center text-[#ED1725]">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-heading font-bold text-white">{g.title}</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Call to Action */}
      <div className="rounded-3xl bg-gradient-to-br from-[#17191D] via-[#111315] to-[#090B0D] border border-white/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
          Ready to Buy Your Next Vehicle Smarter?
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl mx-auto">
          Explore current models, check active buyer demand collectives, or create a group in your city today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/cars">
            <PrimaryButton size="md" className="font-bold px-7">
              <span>Explore Car Catalogue</span>
              <ArrowRight size={15} />
            </PrimaryButton>
          </Link>
          <Link to="/groups">
            <SecondaryButton size="md" className="font-bold px-7">
              <span>View Active Collectives</span>
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
