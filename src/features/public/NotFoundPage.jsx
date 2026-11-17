import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Car, Home } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-[#17191D] border border-white/10 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED1725]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-[#090B0D] border border-white/10 flex items-center justify-center mx-auto text-[#ED1725] shadow-inner relative">
          <Compass className="w-10 h-10 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ED1725] border-2 border-[#17191D]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold tracking-widest text-[#ED1725] uppercase">
            Error 404 • Navigation Lost
          </div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">
            Off The Track
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            The page or vehicle collective you requested has navigated off course, expired, or been relocated in our system.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <PrimaryButton size="md" className="w-full justify-center font-bold">
              <Home size={15} />
              <span>Back to Home</span>
            </PrimaryButton>
          </Link>
          <Link to="/cars" className="w-full sm:w-auto">
            <SecondaryButton size="md" className="w-full justify-center font-bold">
              <Car size={15} />
              <span>Explore Cars</span>
            </SecondaryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
