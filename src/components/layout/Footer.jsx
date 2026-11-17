import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowRight, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#090B0D] text-[#A1A1AA] border-t border-white/10 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* 1. Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group select-none">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ED1725]" />
                </div>
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white">
                DRIVE<span className="text-[#ED1725]">DEALS</span>
              </span>
            </Link>

            <p className="text-white font-medium text-sm">“Buy Smarter, Together.”</p>

            <p className="text-xs text-[#71717A] max-w-md leading-relaxed">
              India’s premier group car-buying platform aggregating real buyer demand to unlock bulk dealership pricing. Transparent on-road quotations, verified OEM franchises, and DPDP Act compliant privacy.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#ED1725] shrink-0" />
              <span>Pilot Markets: Pune, Mumbai Metropolitan Region, Bengaluru, Delhi NCR</span>
            </div>
          </div>

          {/* 2. Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-heading font-bold uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/cars" className="hover:text-white transition-colors">
                  Vehicle Showroom
                </Link>
              </li>
              <li>
                <Link to="/groups" className="hover:text-white transition-colors">
                  Active Demand Groups
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Group Buying Works
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create an Account
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-heading font-bold uppercase tracking-wider">
              Trust & Privacy
            </h4>
            <div className="space-y-3 text-xs text-[#71717A] leading-relaxed">
              <div className="flex items-start gap-2 text-[#22C55E] font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>100% Authorized OEM Franchise Dealerships Only</span>
              </div>
              <p className="text-[11px]">
                Your personal details are never shared with dealerships without explicit DPDP Act 2023 consent upon quotation acceptance.
              </p>
              <div className="pt-2 flex items-center gap-4 text-[11px]">
                <Link to="/privacy" className="hover:text-white transition-colors underline">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors underline">
                  Terms of Protocol
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#71717A]">
          <div>
            &copy; {new Date().getFullYear()} DriveDeals Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="font-mono">
            Direct Fleet Collective • Production Release
          </div>
        </div>
      </div>
    </footer>
  );
};
