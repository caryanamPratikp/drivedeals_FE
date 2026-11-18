import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, RefreshCw, Car, Home } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons';

export const NotFoundPage = () => {
  const error = useRouteError();

  const isRealException = error instanceof Error || (error && typeof error === 'object' && error.message);
  const errorMessage = error?.message || (typeof error === 'string' ? error : null);

  React.useEffect(() => {
    if (error) {
      console.error('[Route Boundary Error]:', error);
    }
  }, [error]);

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
          {isRealException ? (
            <AlertTriangle className="w-10 h-10 text-amber-400 animate-pulse" />
          ) : (
            <Compass className="w-10 h-10 animate-pulse" />
          )}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ED1725] border-2 border-[#17191D]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold tracking-widest text-[#ED1725] uppercase">
            {isRealException ? 'System Telemetry Notice' : 'Error 404 • Navigation Lost'}
          </div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">
            {isRealException ? 'Telemetry Refresh Required' : 'Off The Track'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            {isRealException
              ? 'An updated client bundle or schema change was detected. Refreshing will load the latest verified state.'
              : 'The page or vehicle collective you requested has navigated off course, expired, or been relocated in our system.'}
          </p>

          {isRealException && errorMessage && (
            <div className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-left overflow-x-auto max-h-24">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isRealException ? (
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              <PrimaryButton size="md" className="w-full justify-center font-bold">
                <RefreshCw size={15} />
                <span>Reload Page</span>
              </PrimaryButton>
            </button>
          ) : (
            <Link to="/" className="w-full sm:w-auto">
              <PrimaryButton size="md" className="w-full justify-center font-bold">
                <Home size={15} />
                <span>Back to Home</span>
              </PrimaryButton>
            </Link>
          )}

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
