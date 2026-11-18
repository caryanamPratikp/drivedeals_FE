import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Building2, Car, ArrowRight, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'Dealers Verification Queue', icon: Building2, path: '/admin/dealers', cat: 'Operations' },
    { title: 'Active Demand Groups (Pune)', icon: Users, path: '/admin/groups', cat: 'Volume Groups' },
    { title: 'Vehicle Model Catalogue', icon: Car, path: '/admin/catalogue', cat: 'Inventory' },
    { title: 'Transmitted Lead Queue', icon: ArrowRight, path: '/admin/leads', cat: 'Transmission' },
  ];

  const filteredLinks = query.trim()
    ? quickLinks.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()) || l.cat.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative z-10 w-full max-w-xl bg-[#141619] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-[#ED1725] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dealers, groups, cars, telemetry, or commands..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Command List */}
          <div className="p-3 max-h-80 overflow-y-auto space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-wider">
              Quick Navigation
            </div>

            {filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => handleSelect(item.path)}
                  className="w-full p-3 rounded-xl hover:bg-white/5 text-left flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-[#ED1725]/10 flex items-center justify-center text-slate-300 group-hover:text-[#ED1725] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-heading font-bold text-white group-hover:text-[#ED1725] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#A1A1AA]">{item.cat}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}

            {filteredLinks.length === 0 && (
              <div className="p-6 text-center text-xs text-[#A1A1AA]">
                No matching telemetry or commands found for "{query}".
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A1A1AA] font-mono">
            <span>Navigation: Click or Enter</span>
            <span>Dismiss: ESC</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
