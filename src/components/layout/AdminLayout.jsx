import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { X } from 'lucide-react';

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090B0D] text-white flex overflow-x-hidden selection:bg-[#ED1725] selection:text-white antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar role="ADMIN" />
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
            <Sidebar role="ADMIN" />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
