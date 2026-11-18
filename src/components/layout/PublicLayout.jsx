import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuth =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/signin' ||
    location.pathname === '/signup';

  // Smoothly scroll to top (navbar screen) on public route navigation
  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090B0D] text-white selection:bg-[#ED1725] selection:text-white antialiased">
      {!isAuth && <Navbar />}
      <main
        className={`flex-1 w-full ${
          isAuth
            ? 'p-0'
            : isLanding
            ? 'pt-20 sm:pt-24 pb-0'
            : 'pt-24 sm:pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        }`}
      >
        <Outlet />
      </main>
      {!isLanding && !isAuth && <Footer />}
    </div>
  );
};
export default PublicLayout;
