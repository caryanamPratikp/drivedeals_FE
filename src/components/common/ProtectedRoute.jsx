import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store';
import { getRoleSession } from '../../lib/authStorage';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { token, currentUser, hydrateRoleSession, logout } = useAppStore();
  const location = useLocation();
  const [triedHydrate, setTriedHydrate] = useState(false);

  const userRole = currentUser?.role || 'PUBLIC';
  const isAuthorized = allowedRoles.length === 0 || allowedRoles.includes(userRole);
  const targetRole = allowedRoles[0];

  // Only attempt hydration from localStorage if the current tab is unauthenticated
  useEffect(() => {
    if (!token && targetRole && !triedHydrate) {
      const existingSession = getRoleSession(targetRole);
      if (existingSession && hydrateRoleSession) {
        hydrateRoleSession(targetRole);
      }
      setTriedHydrate(true);
    }
  }, [token, targetRole, triedHydrate, hydrateRoleSession]);

  // 1. Unauthenticated check
  if (!token) {
    // If we haven't attempted to check stored role session yet, wait for effect
    if (targetRole && getRoleSession(targetRole) && !triedHydrate) {
      return null;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role authorization check
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#090B0D] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#17191D] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED1725]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-[#ED1725]/15 border border-[#ED1725]/30 text-[#ED1725] flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black tracking-tight text-white">Access Restricted</h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              This tab is signed in as <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10">{currentUser?.name || userRole} ({userRole})</span>.
              This section is reserved exclusively for <span className="font-bold text-[#ED1725]">{targetRole}</span> accounts.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                if (userRole === 'BUYER') window.location.href = '/buyer/dashboard';
                else if (userRole === 'DEALER') window.location.href = '/dealer/dashboard';
                else if (userRole === 'ADMIN') window.location.href = '/admin/dashboard';
                else window.location.href = '/';
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#ED1725] hover:bg-[#A30E18] text-white font-bold text-sm shadow-lg shadow-[#ED1725]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Return to My {userRole} Dashboard</span>
            </button>

            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#A1A1AA] hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={14} />
              <span>Switch Account in This Tab</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
export default ProtectedRoute;
