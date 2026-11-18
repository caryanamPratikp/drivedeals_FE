import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Minus, Compass, Navigation, Car } from 'lucide-react';

export const SpendingMapCard = ({ clusters = [], hideAmounts = false }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCluster, setActiveCluster] = useState(clusters[0] || null);
  const [hoveredCluster, setHoveredCluster] = useState(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const selectedOrHovered = hoveredCluster || activeCluster;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 255, 255, 0.16)' }}
      className="relative rounded-[28px] sm:rounded-3xl bg-gradient-to-b from-[#17191D] to-[#111315] p-5 sm:p-6 border border-white/10 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Compass className="w-5 h-5 text-[#ED1725]" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                Pune Automotive Demand & Spending Map
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                Regional Collective Buyer Clusters • Pilot Market Pune
              </p>
            </div>
          </div>

          {/* Interactive Zoom Controls */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors text-xs"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors text-xs"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-[10px] font-mono transition-colors"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>
        </div>

        {/* Map Canvas with SVG Overlay */}
        <div className="relative w-full h-64 sm:h-72 rounded-xl bg-[#090B0D] border border-white/5 overflow-hidden flex items-center justify-center">
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Scaled Map Container */}
          <motion.div
            animate={{ scale: zoomLevel }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative w-full h-full"
          >
            {/* SVG Roads & River Geometry for Pune */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Mula-Mutha River Ribbon */}
              <path
                d="M 10 90 Q 90 120 180 80 T 360 140 T 520 110"
                fill="none"
                stroke="#1E293B"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.5"
              />
              {/* Pune Expressway & Arterial Rings */}
              <path
                d="M 50 40 Q 140 100 240 130 T 450 160"
                fill="none"
                stroke="#ED1725"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <path
                d="M 120 20 L 220 220"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.25"
              />
            </svg>

            {/* Pulsing Interactive Cluster Markers */}
            {clusters.map((cluster) => {
              const isSelected = selectedOrHovered?.id === cluster.id;

              return (
                <div
                  key={cluster.id}
                  style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onClick={() => setActiveCluster(cluster)}
                  onMouseEnter={() => setHoveredCluster(cluster)}
                  onMouseLeave={() => setHoveredCluster(null)}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing radar ring */}
                    <div
                      className={`absolute rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'w-9 h-9 bg-[#ED1725]/30 animate-ping'
                          : 'w-6 h-6 bg-white/10 group-hover:bg-[#ED1725]/20'
                      }`}
                    />

                    {/* Core Pin */}
                    <motion.div
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-[#ED1725] border-white text-white shadow-[#ED1725]/50 scale-110'
                          : 'bg-[#17191D] border-white/20 text-[#A1A1AA] hover:border-[#ED1725]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </motion.div>

                    {/* Zone Badge */}
                    <div
                      className={`absolute top-full mt-1 px-2 py-0.5 rounded text-[9px] font-heading font-bold whitespace-nowrap backdrop-blur-md transition-all ${
                        isSelected
                          ? 'bg-[#ED1725] text-white shadow-md'
                          : 'bg-black/80 text-[#A1A1AA] border border-white/10'
                      }`}
                    >
                      {cluster.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Hover / Selected Cluster Detail Overlay Tooltip */}
          {selectedOrHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-[#111315]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl z-30 pointer-events-none"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-heading font-black text-white flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-[#ED1725]" />
                  {selectedOrHovered.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ED1725]/20 text-[#ED1725] font-bold">
                  {selectedOrHovered.zone}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-white/5">
                <div>
                  <div className="text-[#A1A1AA] text-[10px]">Active Demand</div>
                  <div className="text-white font-heading font-bold">
                    {hideAmounts ? '••••••' : selectedOrHovered.grossDemand} ({selectedOrHovered.buyers} buyers)
                  </div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-[10px]">Avg Concession</div>
                  <div className="text-emerald-400 font-mono font-bold">
                    {selectedOrHovered.avgConcession}
                  </div>
                </div>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[10px] text-slate-300 flex items-center gap-1">
                <Car className="w-3 h-3 text-[#ED1725]" />
                <span className="truncate">{selectedOrHovered.topModel}</span>
              </div>
            </motion.div>
          )}

          {clusters.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#A1A1AA] font-mono mb-1">
                0 Active Demand Clusters in DB
              </div>
              <p className="text-[11px] text-[#71717A]">
                Clusters appear as buyers join collectives in Pune
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#A1A1AA]">
        <span>{clusters.length > 0 ? `${clusters.length} Core Clusters Active in Pune Pilot` : '0 Active Clusters in DB'}</span>
        <span className="text-emerald-400 font-mono text-[11px]">Telemetry Sync: 100% Live</span>
      </div>
    </motion.div>
  );
};
