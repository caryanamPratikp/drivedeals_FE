import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { RefreshCw, LogOut, LogIn, Sparkles, User, Briefcase } from 'lucide-react';

export const DemoToolbar = () => {
  const { currentUser, logout, loginWithOtp, fetchCars, fetchGroups, isLoading } = useAppStore();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await fetchCars();
    await fetchGroups();
  };

  const handleQuickSwitch = async (phone, profile, targetRoute) => {
    const res = await loginWithOtp(phone, '123456', profile);
    if (res.success) {
      navigate(targetRoute);
    }
  };

  const isLoggedIn = currentUser && currentUser.role && currentUser.role !== 'PUBLIC';
  const role = currentUser?.role;

  return (
    <aside aria-label="Demo and quick test toolbar" className="bg-[#111315] text-[#A1A1AA] border-b border-white/10 text-xs py-1.5 px-3 sm:px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Tab Session Identity */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tab Isolated
          </div>

          {isLoggedIn ? (
            <div className="text-white text-[11px] font-semibold flex items-center gap-1.5 flex-wrap">
              <span className="text-[#71717A] hidden sm:inline">This Tab:</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  role === 'DEALER'
                    ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                    : 'bg-[#ED1725]/15 text-[#ED1725] border border-[#ED1725]/30'
                }`}
              >
                {role}
              </span>
              <strong className="text-white truncate max-w-[130px] sm:max-w-none">{currentUser.name}</strong>
              <span className="text-[#71717A] text-[10px] font-mono hidden md:inline">({currentUser.phone})</span>
            </div>
          ) : (
            <span className="text-[#71717A] text-[11px]">
              This Tab: <span className="text-white font-semibold">Guest</span> (Open another tab for multi-user test)
            </span>
          )}
        </div>

        {/* Right: Quick Switcher & Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[#71717A] uppercase mr-0.5 hidden xl:inline">
            Quick Tab Switch:
          </span>

          <button
            onClick={() =>
              handleQuickSwitch(
                '+919876543210',
                { name: 'Priya Sharma', role: 'BUYER', city: 'Pune' },
                '/buyer/dashboard'
              )
            }
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              currentUser?.phone === '+919876543210'
                ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
            title="Switch this tab to Buyer Priya Sharma (+919876543210)"
          >
            👤 Priya (Buyer 1)
          </button>

          <button
            onClick={() =>
              handleQuickSwitch(
                '+919876543211',
                { name: 'Rahul Verma', role: 'BUYER', city: 'Pune' },
                '/buyer/dashboard'
              )
            }
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              currentUser?.phone === '+919876543211'
                ? 'bg-[#ED1725] text-white border-[#ED1725] shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
            title="Switch this tab to Buyer Rahul Verma (+919876543211)"
          >
            👤 Rahul (Buyer 2)
          </button>

          <button
            onClick={() =>
              handleQuickSwitch(
                '+919898989898',
                {
                  name: 'Sahyadri Mahindra Motors',
                  role: 'DEALER',
                  city: 'Pune',
                  dealershipName: 'Sahyadri Mahindra Motors Pvt Ltd',
                  brand: 'Mahindra',
                },
                '/dealer/dashboard'
              )
            }
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              currentUser?.phone === '+919898989898'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
            title="Switch this tab to Dealer Sahyadri Mahindra Motors (+919898989898)"
          >
            🏢 Sahyadri (Dealer)
          </button>

          <div className="h-3 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 rounded-md text-[#A1A1AA] hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Sync Database Records"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-0.5 text-xs text-[#A1A1AA] hover:text-[#EF4444] hover:bg-white/10 rounded-md border border-white/10 transition-colors cursor-pointer"
              title="Sign Out in this Tab Only"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-2.5 py-0.5 bg-[#ED1725] hover:bg-[#A30E18] text-white font-bold rounded-md transition-colors text-[10px] shadow-sm"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};
export default DemoToolbar;
