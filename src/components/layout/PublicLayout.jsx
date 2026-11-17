import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DemoToolbar } from './DemoToolbar';

export const PublicLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuth =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/signin' ||
    location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-[#090B0D] text-white selection:bg-[#ED1725] selection:text-white antialiased">
      <DemoToolbar />
      {!isLanding && <Navbar />}
      <main className={`flex-1 w-full ${isLanding || isAuth ? 'p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
        <Outlet />
      </main>
      {!isLanding && <Footer />}
    </div>
  );
};
export default PublicLayout;
