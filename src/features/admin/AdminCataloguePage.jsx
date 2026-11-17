import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { Plus, Power, Car, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton, GhostButton } from '../../components/common/Buttons';
import { HelpPanel } from '../../components/common/HelpPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { formatINR } from '../../lib/currency';
import { staggerContainer, staggerItem } from '../../lib/animations';

export const AdminCataloguePage = () => {
  const { cars = [], variants = [], toggleCarActive, toggleVariantActive, addCatalogueCar } =
    useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [brand, setBrand] = useState('Tata');
  const [modelName, setModelName] = useState('');
  const [bodyType, setBodyType] = useState('Compact SUV');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('800000');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
  );

  // Variant form
  const [varName, setVarName] = useState('');
  const [fuelType, setFuelType] = useState('PETROL');
  const [trans, setTrans] = useState('MANUAL');
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!modelName.trim() || !varName.trim()) return;

    addCatalogueCar(
      {
        brand,
        modelName: modelName.trim(),
        image,
        description: description.trim() || `${brand} ${modelName} SUV model.`,
        illustrativeStartingPrice: parseInt(startPrice, 10) || 800000,
        bodyType,
        active: true,
      },
      {
        name: varName.trim(),
        fuelType,
        transmission: trans,
        modelYear: 2026,
        keyFeatures: [
          'Touchscreen Infotainment',
          'Reverse Parking Camera',
          'Dual Airbags',
        ],
        active: true,
      }
    );

    setSuccessMsg(`Successfully added ${brand} ${modelName.trim()} with trim ${varName.trim()} to catalogue.`);
    setTimeout(() => setSuccessMsg(null), 4000);

    setIsAddOpen(false);
    setModelName('');
    setVarName('');
    setDescription('');
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <HelpPanel
        id="admin-catalogue-help"
        title="Vehicle Master & Variant Governance"
        tips={[
          'Models and variants must map accurately to manufacturer showroom specifications.',
          'Deactivating a vehicle model hides it from new group creation while preserving quotation and consent histories.',
          'Always verify variant engine and transmission combinations before publishing.',
        ]}
      />

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dd-red/10 border border-dd-red/20 text-dd-red text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            Automotive Master Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Vehicle Catalogue Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Maintain car models and structured variants. Deactivate models to preserve historical quotation records.
          </p>
        </div>

        <PrimaryButton
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setIsAddOpen(!isAddOpen)}
        >
          {isAddOpen ? 'Close Form' : 'Add New Model'}
        </PrimaryButton>
      </motion.div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-dd-green/10 border border-dd-green/30 text-dd-green text-xs flex items-center gap-2.5 font-medium"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-dd-green" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Add New Vehicle Form Drawer */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-dd-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-dd-red" />
                  <span>Add New Vehicle & Initial Trim Variant</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Master Schema v2</span>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Brand / Make
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-dd-red transition-colors"
                    >
                      <option value="Tata" className="bg-dd-card text-white">Tata</option>
                      <option value="Hyundai" className="bg-dd-card text-white">Hyundai</option>
                      <option value="Mahindra" className="bg-dd-card text-white">Mahindra</option>
                      <option value="Maruti Suzuki" className="bg-dd-card text-white">Maruti Suzuki</option>
                      <option value="Kia" className="bg-dd-card text-white">Kia</option>
                      <option value="Honda" className="bg-dd-card text-white">Honda</option>
                      <option value="Toyota" className="bg-dd-card text-white">Toyota</option>
                      <option value="MG" className="bg-dd-card text-white">MG</option>
                      <option value="Volkswagen" className="bg-dd-card text-white">Volkswagen</option>
                      <option value="Skoda" className="bg-dd-card text-white">Skoda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Model Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Harrier, Punch, Creta"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Body Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Compact SUV, Midsize SUV"
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Indicative Ex-Showroom (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1100000"
                      value={startPrice}
                      onChange={(e) => setStartPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Image URL (Showroom Asset)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Initial Trim Variant
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Accomplished+ Dark"
                      value={varName}
                      onChange={(e) => setVarName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-dd-red transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Fuel Type
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-dd-red transition-colors"
                    >
                      <option value="PETROL" className="bg-dd-card text-white">Petrol</option>
                      <option value="DIESEL" className="bg-dd-card text-white">Diesel</option>
                      <option value="CNG" className="bg-dd-card text-white">CNG</option>
                      <option value="ELECTRIC" className="bg-dd-card text-white">Electric</option>
                      <option value="HYBRID" className="bg-dd-card text-white">Strong Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Transmission
                    </label>
                    <select
                      value={trans}
                      onChange={(e) => setTrans(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-dd-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-dd-red transition-colors"
                    >
                      <option value="MANUAL" className="bg-dd-card text-white">Manual</option>
                      <option value="AUTOMATIC" className="bg-dd-card text-white">Automatic</option>
                      <option value="DCT" className="bg-dd-card text-white">DCT</option>
                      <option value="AMT" className="bg-dd-card text-white">AMT</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <SecondaryButton size="sm" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton size="sm" type="submit">
                    Add Vehicle & Variant
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalogue List */}
      <motion.div variants={staggerItem} className="space-y-4">
        {cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title="Catalogue is Empty"
            description="No vehicle models currently registered. Add your first vehicle master record to accept buyer demand collectives."
            actionLabel="Add New Model"
            onAction={() => setIsAddOpen(true)}
          />
        ) : (
          cars.map((car) => {
            const carVariants = variants.filter((v) => v.carId === car.id);

            return (
              <div
                key={car.id}
                className={`bg-dd-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl transition-all ${
                  !car.active ? 'opacity-50 border-dashed bg-dd-surface/40' : 'hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-2xl bg-dd-surface overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={car.imageUrl || car.image}
                        alt={car.modelName || car.model}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-heading font-bold text-slate-500 uppercase tracking-widest">
                        {car.brand}
                      </div>
                      <h3 className="font-heading font-black text-lg text-white">
                        {car.modelName || car.model}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {car.bodyType || 'SUV'} • Starting from{' '}
                        <span className="font-heading font-bold text-white font-mono">
                          {formatINR(car.illustrativeStartingPrice || 800000)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCarActive(car.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-colors flex items-center gap-2 border ${
                        car.active
                          ? 'bg-dd-surface text-slate-300 border-white/10 hover:text-dd-red hover:border-dd-red/40'
                          : 'bg-emerald-500/10 text-dd-green border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Power size={13} className={car.active ? 'text-dd-red' : 'text-dd-green'} />
                      <span>{car.active ? 'Deactivate Model' : 'Activate Model'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 pt-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                      Structured Trims ({carVariants.length}):
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Click status pill to toggle trim availability
                    </span>
                  </div>

                  {carVariants.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-3 rounded-2xl bg-dd-surface/50 border border-white/5">
                      No variants registered under this model yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {carVariants.map((v) => (
                        <div
                          key={v.id}
                          className="p-3.5 bg-dd-surface/80 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="font-heading font-bold text-white text-xs truncate">
                              {v.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {v.fuelType} • {v.transmission}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleVariantActive(v.id)}
                            className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                              v.active
                                ? 'bg-emerald-500/10 text-dd-green border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'
                            }`}
                          >
                            {v.active ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
};
