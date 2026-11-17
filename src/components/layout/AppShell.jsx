import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { pageTransitionVariants } from '../../lib/animations';

export const AppShell = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/signin' || location.pathname === '/signup';
  const { token, currentUser, fetchCars, fetchGroups, fetchNotifications, fetchDealerLeads, fetchConsents } = useAppStore();

  useEffect(() => {
    fetchCars();
    fetchGroups();
    if (token) {
      fetchNotifications();
      if (currentUser?.role === 'DEALER') {
        fetchDealerLeads();
      } else if (currentUser?.role === 'BUYER') {
        fetchConsents();
      }
    }
  }, [token, currentUser?.role]);

  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? 'bg-[#090B0D] text-white' : 'bg-palette-bg text-palette-primary'} selection:bg-[#ED1725] selection:text-white antialiased`}>
      {!isLanding && <Navbar />}
      <main className={`flex-1 w-full ${isLanding || isAuth ? 'p-0' : 'px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
};
