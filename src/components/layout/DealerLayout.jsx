import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { useAppStore } from '../../store';
import { X, Clock, ShieldAlert } from 'lucide-react';

export const DealerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser } = useAppStore();
  const location = useLocation();

  const isVerified = currentUser?.dealerStatus === 'VERIFIED';
  const isOnboardingSubmitted = currentUser?.onboardingStatus === 'SUBMITTED' || isVerified;
  const isOnboardingRoute = location.pathname === '/dealer/onboarding';

  // If dealer has not submitted onboarding, strictly gate them to /dealer/onboarding
  if (!isOnboardingSubmitted && !isOnboardingRoute) {
    return <Navigate to="/dealer/onboarding" replace />;
  }

  // If on onboarding route, provide a streamlined onboarding shell
  if (isOnboardingRoute) {
    return (
      <div className="min-h-screen bg-[#090B0D] text-white flex flex-col overflow-x-hidden selection:bg-[#ED1725] selection:text-white antialiased">
        <TopHeader onMobileMenuToggle={() => {}} hideNavLinks={true} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0D] text-white flex overflow-x-hidden selection:bg-[#ED1725] selection:text-white antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar role="DEALER" />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#111315] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            <Sidebar role="DEALER" />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Pending Verification Notice Banner */}
        {currentUser?.dealerStatus === 'PENDING_VERIFICATION' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 sm:px-6">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-amber-300 font-medium">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Dealership Verification in Review:</strong> Your onboarding credentials are submitted for platform administrator verification. You can review vehicle demand in bulk below. Individual vehicle demand inspection and quotation submissions will unlock immediately upon verification.
                </span>
              </div>
              <span className="shrink-0 self-start sm:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Bulk View Only
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DealerLayout;
