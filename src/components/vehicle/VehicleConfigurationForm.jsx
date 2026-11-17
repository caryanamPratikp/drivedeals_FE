import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrandSelector } from './BrandSelector';
import { ModelSelector } from './ModelSelector';
import { ModelYearSelector } from './ModelYearSelector';
import { PowertrainSelector } from './PowertrainSelector';
import { EngineBatterySelector } from './EngineBatterySelector';
import { TransmissionSelector } from './TransmissionSelector';
import { VariantSelector } from './VariantSelector';
import { VehicleColourSelector } from './VehicleColourSelector';
import { VehicleImagePreview } from './VehicleImagePreview';
import { PrimaryButton } from '../common/Buttons';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  getBrands,
  getModelsByBrand,
  getModelYears,
  getPowertrains,
  getEngineBatteryConfigs,
  getTransmissions,
  getVariants,
  getColours,
  getVehicleImage,
} from '../../data/vehicleCatalogue';

export const VehicleConfigurationForm = ({
  initialBrandId,
  initialModelId,
  initialYear,
  initialPowertrain,
  initialEngineBattery,
  initialTransmission,
  initialVariantId,
  initialColourId,
  onConfigurationChange,
  onContinue,
  className = '',
}) => {
  const brands = useMemo(() => getBrands(), []);

  // 1. Brand State
  const [selectedBrandId, setSelectedBrandId] = useState(
    initialBrandId || (brands.length > 0 ? brands[0].id : 'mahindra')
  );

  // 2. Model State
  const availableModels = useMemo(
    () => getModelsByBrand(selectedBrandId),
    [selectedBrandId]
  );
  const [selectedModelId, setSelectedModelId] = useState(
    initialModelId && availableModels.some((m) => m.id === initialModelId)
      ? initialModelId
      : availableModels.length > 0
      ? availableModels[0].id
      : ''
  );

  // 3. Model Year State
  const availableYears = useMemo(
    () => getModelYears(selectedModelId),
    [selectedModelId]
  );
  const [selectedYear, setSelectedYear] = useState(
    initialYear && availableYears.includes(Number(initialYear))
      ? Number(initialYear)
      : availableYears.length > 0
      ? availableYears[0]
      : 2026
  );

  // 4. Powertrain State (Strictly Model-Driven!)
  const availablePowertrains = useMemo(
    () => getPowertrains(selectedModelId, selectedYear),
    [selectedModelId, selectedYear]
  );
  const [selectedPowertrain, setSelectedPowertrain] = useState(
    initialPowertrain && availablePowertrains.includes(initialPowertrain)
      ? initialPowertrain
      : availablePowertrains.length > 0
      ? availablePowertrains[0]
      : ''
  );

  // 5. Engine / Battery Configuration State
  const availableEngineBatteries = useMemo(
    () => getEngineBatteryConfigs(selectedModelId, selectedYear, selectedPowertrain),
    [selectedModelId, selectedYear, selectedPowertrain]
  );
  const [selectedEngineBattery, setSelectedEngineBattery] = useState(
    initialEngineBattery && availableEngineBatteries.includes(initialEngineBattery)
      ? initialEngineBattery
      : availableEngineBatteries.length > 0
      ? availableEngineBatteries[0]
      : ''
  );

  // 6. Transmission State
  const availableTransmissions = useMemo(
    () =>
      getTransmissions(
        selectedModelId,
        selectedYear,
        selectedPowertrain,
        selectedEngineBattery
      ),
    [selectedModelId, selectedYear, selectedPowertrain, selectedEngineBattery]
  );
  const [selectedTransmission, setSelectedTransmission] = useState(
    initialTransmission && availableTransmissions.includes(initialTransmission)
      ? initialTransmission
      : availableTransmissions.length > 0
      ? availableTransmissions[0]
      : ''
  );

  // 7. Variant State
  const availableVariants = useMemo(
    () =>
      getVariants(
        selectedModelId,
        selectedYear,
        selectedPowertrain,
        selectedEngineBattery,
        selectedTransmission
      ),
    [selectedModelId, selectedYear, selectedPowertrain, selectedEngineBattery, selectedTransmission]
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId && availableVariants.some((v) => v.id === initialVariantId)
      ? initialVariantId
      : availableVariants.length > 0
      ? availableVariants[0].id
      : ''
  );

  // 8. Exterior Colour State (Respects Variant-Specific Restrictions)
  const availableColours = useMemo(
    () => getColours(selectedModelId, selectedVariantId),
    [selectedModelId, selectedVariantId]
  );
  const [selectedColourId, setSelectedColourId] = useState(
    initialColourId && availableColours.some((c) => c.id === initialColourId)
      ? initialColourId
      : availableColours.length > 0
      ? availableColours[0].id
      : ''
  );

  // --------------------------------------------------------------------------
  // CASCADING DEPENDENT RESETS (Never show impossible combinations)
  // --------------------------------------------------------------------------

  // 1. When Brand Changes
  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
    const newModels = getModelsByBrand(brandId);
    const newModelId = newModels.length > 0 ? newModels[0].id : '';
    setSelectedModelId(newModelId);

    const newYears = getModelYears(newModelId);
    const newYear = newYears.length > 0 ? newYears[0] : 2026;
    setSelectedYear(newYear);

    const newPowertrains = getPowertrains(newModelId, newYear);
    const newPowertrain = newPowertrains.length > 0 ? newPowertrains[0] : '';
    setSelectedPowertrain(newPowertrain);

    const newEngines = getEngineBatteryConfigs(newModelId, newYear, newPowertrain);
    const newEngine = newEngines.length > 0 ? newEngines[0] : '';
    setSelectedEngineBattery(newEngine);

    const newTrans = getTransmissions(newModelId, newYear, newPowertrain, newEngine);
    const newTransmission = newTrans.length > 0 ? newTrans[0] : '';
    setSelectedTransmission(newTransmission);

    const newVars = getVariants(newModelId, newYear, newPowertrain, newEngine, newTransmission);
    const newVarId = newVars.length > 0 ? newVars[0].id : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(newModelId, newVarId);
    setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
  };

  // 2. When Model Changes
  const handleModelChange = (modelId) => {
    setSelectedModelId(modelId);

    const newYears = getModelYears(modelId);
    const newYear = newYears.length > 0 ? newYears[0] : 2026;
    setSelectedYear(newYear);

    const newPowertrains = getPowertrains(modelId, newYear);
    const newPowertrain = newPowertrains.length > 0 ? newPowertrains[0] : '';
    setSelectedPowertrain(newPowertrain);

    const newEngines = getEngineBatteryConfigs(modelId, newYear, newPowertrain);
    const newEngine = newEngines.length > 0 ? newEngines[0] : '';
    setSelectedEngineBattery(newEngine);

    const newTrans = getTransmissions(modelId, newYear, newPowertrain, newEngine);
    const newTransmission = newTrans.length > 0 ? newTrans[0] : '';
    setSelectedTransmission(newTransmission);

    const newVars = getVariants(modelId, newYear, newPowertrain, newEngine, newTransmission);
    const newVarId = newVars.length > 0 ? newVars[0].id : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(modelId, newVarId);
    setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
  };

  // 3. When Model Year Changes
  const handleYearChange = (year) => {
    setSelectedYear(year);

    const newPowertrains = getPowertrains(selectedModelId, year);
    const newPowertrain = newPowertrains.includes(selectedPowertrain)
      ? selectedPowertrain
      : newPowertrains.length > 0
      ? newPowertrains[0]
      : '';
    setSelectedPowertrain(newPowertrain);

    const newEngines = getEngineBatteryConfigs(selectedModelId, year, newPowertrain);
    const newEngine = newEngines.includes(selectedEngineBattery)
      ? selectedEngineBattery
      : newEngines.length > 0
      ? newEngines[0]
      : '';
    setSelectedEngineBattery(newEngine);

    const newTrans = getTransmissions(selectedModelId, year, newPowertrain, newEngine);
    const newTransmission = newTrans.includes(selectedTransmission)
      ? selectedTransmission
      : newTrans.length > 0
      ? newTrans[0]
      : '';
    setSelectedTransmission(newTransmission);

    const newVars = getVariants(selectedModelId, year, newPowertrain, newEngine, newTransmission);
    const newVarId = newVars.some((v) => v.id === selectedVariantId)
      ? selectedVariantId
      : newVars.length > 0
      ? newVars[0].id
      : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(selectedModelId, newVarId);
    if (!newCols.some((c) => c.id === selectedColourId)) {
      setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
    }
  };

  // 4. When Powertrain Changes
  const handlePowertrainChange = (powertrain) => {
    setSelectedPowertrain(powertrain);

    const newEngines = getEngineBatteryConfigs(selectedModelId, selectedYear, powertrain);
    const newEngine = newEngines.length > 0 ? newEngines[0] : '';
    setSelectedEngineBattery(newEngine);

    const newTrans = getTransmissions(selectedModelId, selectedYear, powertrain, newEngine);
    const newTransmission = newTrans.length > 0 ? newTrans[0] : '';
    setSelectedTransmission(newTransmission);

    const newVars = getVariants(selectedModelId, selectedYear, powertrain, newEngine, newTransmission);
    const newVarId = newVars.length > 0 ? newVars[0].id : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(selectedModelId, newVarId);
    if (!newCols.some((c) => c.id === selectedColourId)) {
      setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
    }
  };

  // 5. When Engine/Battery Changes
  const handleEngineBatteryChange = (engineBattery) => {
    setSelectedEngineBattery(engineBattery);

    const newTrans = getTransmissions(selectedModelId, selectedYear, selectedPowertrain, engineBattery);
    const newTransmission = newTrans.length > 0 ? newTrans[0] : '';
    setSelectedTransmission(newTransmission);

    const newVars = getVariants(selectedModelId, selectedYear, selectedPowertrain, engineBattery, newTransmission);
    const newVarId = newVars.length > 0 ? newVars[0].id : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(selectedModelId, newVarId);
    if (!newCols.some((c) => c.id === selectedColourId)) {
      setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
    }
  };

  // 6. When Transmission Changes
  const handleTransmissionChange = (transmission) => {
    setSelectedTransmission(transmission);

    const newVars = getVariants(
      selectedModelId,
      selectedYear,
      selectedPowertrain,
      selectedEngineBattery,
      transmission
    );
    const newVarId = newVars.length > 0 ? newVars[0].id : '';
    setSelectedVariantId(newVarId);

    const newCols = getColours(selectedModelId, newVarId);
    if (!newCols.some((c) => c.id === selectedColourId)) {
      setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
    }
  };

  // 7. When Variant Changes
  const handleVariantChange = (variantId) => {
    setSelectedVariantId(variantId);

    // Keep current colour if compatible with this variant, else select first eligible colour
    const newCols = getColours(selectedModelId, variantId);
    if (!newCols.some((c) => c.id === selectedColourId)) {
      setSelectedColourId(newCols.length > 0 ? newCols[0].id : '');
    }
  };

  // 8. When Colour Changes
  const handleColourChange = (colourId) => {
    setSelectedColourId(colourId);
  };

  // Resolved entities
  const selectedBrand = brands.find((b) => b.id === selectedBrandId);
  const selectedModel = availableModels.find((m) => m.id === selectedModelId);
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId);
  const selectedColour = availableColours.find((c) => c.id === selectedColourId);

  // Resolved live image asset and genuine verification status
  const imageResolution = useMemo(
    () => getVehicleImage(selectedModelId, selectedColourId, selectedVariantId),
    [selectedModelId, selectedColourId, selectedVariantId]
  );

  // Stable callback ref and deduplication key to eliminate infinite update loops
  const onConfigChangeRef = useRef(onConfigurationChange);
  useEffect(() => {
    onConfigChangeRef.current = onConfigurationChange;
  }, [onConfigurationChange]);

  const lastBroadcastKeyRef = useRef('');

  // Broadcast configuration to parent strictly when selections change
  useEffect(() => {
    if (!onConfigChangeRef.current || !selectedModel || !selectedVariant) return;

    const currentKey = `${selectedBrandId}|${selectedModelId}|${selectedYear}|${selectedPowertrain}|${selectedEngineBattery}|${selectedTransmission}|${selectedVariantId}|${selectedColourId}|${imageResolution.imageUrl}`;
    if (lastBroadcastKeyRef.current === currentKey) return;
    lastBroadcastKeyRef.current = currentKey;

    onConfigChangeRef.current({
      brandId: selectedBrandId,
      brandName: selectedBrand?.name,
      modelId: selectedModelId,
      modelName: selectedModel?.name,
      modelYear: selectedYear,
      powertrain: selectedPowertrain,
      engineBattery: selectedEngineBattery,
      transmission: selectedTransmission,
      variantId: selectedVariantId,
      variantName: selectedVariant?.variantName || selectedVariant?.name,
      exShowroomPrice: selectedVariant?.exShowroomPrice,
      colourId: selectedColourId,
      colourName: selectedColour?.name,
      colourHex: selectedColour?.hex,
      secondaryHex: selectedColour?.secondaryHex,
      isDualTone: Boolean(selectedColour?.isDualTone),
      imageUrl: imageResolution.imageUrl,
      isVerified: imageResolution.isVerified,
      bodyType: selectedModel?.bodyType,
    });
  }, [
    selectedBrandId,
    selectedModelId,
    selectedYear,
    selectedPowertrain,
    selectedEngineBattery,
    selectedTransmission,
    selectedVariantId,
    selectedColourId,
    selectedBrand?.name,
    selectedModel?.name,
    selectedModel?.bodyType,
    selectedVariant?.variantName,
    selectedVariant?.name,
    selectedVariant?.exShowroomPrice,
    selectedColour?.name,
    selectedColour?.hex,
    selectedColour?.secondaryHex,
    selectedColour?.isDualTone,
    imageResolution.imageUrl,
    imageResolution.isVerified,
  ]);

  const isValidConfiguration =
    Boolean(selectedBrandId) &&
    Boolean(selectedModelId) &&
    Boolean(selectedYear) &&
    Boolean(selectedPowertrain) &&
    Boolean(selectedEngineBattery) &&
    Boolean(selectedTransmission) &&
    Boolean(selectedVariantId) &&
    Boolean(selectedColourId);

  const handleContinue = () => {
    if (!isValidConfiguration) return;
    if (onContinue) {
      onContinue({
        brandId: selectedBrandId,
        brandName: selectedBrand?.name,
        modelId: selectedModelId,
        modelName: selectedModel?.name,
        modelYear: selectedYear,
        powertrain: selectedPowertrain,
        engineBattery: selectedEngineBattery,
        transmission: selectedTransmission,
        variantId: selectedVariantId,
        variantName: selectedVariant?.variantName || selectedVariant?.name,
        exShowroomPrice: selectedVariant?.exShowroomPrice,
        colourId: selectedColourId,
        colourName: selectedColour?.name,
        colourHex: selectedColour?.hex,
        secondaryHex: selectedColour?.secondaryHex,
        isDualTone: Boolean(selectedColour?.isDualTone),
        imageUrl: imageResolution.imageUrl,
        isVerified: imageResolution.isVerified,
        bodyType: selectedModel?.bodyType,
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 2-Column Responsive Grid on Desktop, Single Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 8 Cascading Selection Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Manufacturer / Brand */}
          <BrandSelector
            brands={brands}
            selectedBrandId={selectedBrandId}
            onSelectBrand={handleBrandChange}
          />

          {/* 2. Car Model (Distinct EV & ICE product identities) */}
          <ModelSelector
            models={availableModels}
            selectedModelId={selectedModelId}
            onSelectModel={handleModelChange}
          />

          {/* 3. Model Year */}
          {selectedModelId && (
            <ModelYearSelector
              modelYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={handleYearChange}
            />
          )}

          {/* 4. Powertrain / Fuel Type (Strictly derived from Model & Year) */}
          {selectedModelId && (
            <PowertrainSelector
              powertrains={availablePowertrains}
              selectedPowertrain={selectedPowertrain}
              onSelectPowertrain={handlePowertrainChange}
              modelName={selectedModel?.name}
            />
          )}

          {/* 5. Engine / Battery Architecture */}
          {selectedPowertrain && availableEngineBatteries.length > 0 && (
            <EngineBatterySelector
              configs={availableEngineBatteries}
              selectedConfig={selectedEngineBattery}
              onSelectConfig={handleEngineBatteryChange}
              isElectric={selectedPowertrain === 'ELECTRIC'}
            />
          )}

          {/* 6. Transmission / Gearbox */}
          {selectedEngineBattery && availableTransmissions.length > 0 && (
            <TransmissionSelector
              transmissions={availableTransmissions}
              selectedTransmission={selectedTransmission}
              onSelectTransmission={handleTransmissionChange}
            />
          )}

          {/* 7. Variant Trim */}
          {selectedTransmission && (
            <VariantSelector
              variants={availableVariants}
              selectedVariantId={selectedVariantId}
              onSelectVariant={handleVariantChange}
            />
          )}

          {/* 8. Official Exterior Colour (With Dual-Tone and Variant Restrictions) */}
          {selectedVariantId && (
            <VehicleColourSelector
              colours={availableColours}
              selectedColourId={selectedColourId}
              onSelectColour={handleColourChange}
            />
          )}
        </div>

        {/* Right Column: Live Car Studio Preview (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-4">
          <VehicleImagePreview
            brandName={selectedBrand?.name}
            modelName={selectedModel?.name}
            modelYear={selectedYear}
            powertrain={selectedPowertrain}
            variantName={selectedVariant?.variantName || selectedVariant?.name}
            colourName={selectedColour?.name}
            colourHex={selectedColour?.hex}
            secondaryHex={selectedColour?.secondaryHex}
            isDualTone={Boolean(selectedColour?.isDualTone)}
            imageUrl={imageResolution.imageUrl}
            isVerified={imageResolution.isVerified}
            startingPrice={selectedVariant?.exShowroomPrice || selectedModel?.startingPrice}
            bodyType={selectedModel?.bodyType}
          />

          {/* Mobile Validation Helper */}
          <div className="block lg:hidden mt-4">
            {!isValidConfiguration && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please complete all 8 vehicle configuration steps above.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {isValidConfiguration ? (
            <span className="text-white font-medium">
              Ready to configure:{' '}
              <span className="text-dd-red font-bold">
                {selectedBrand?.name} {selectedModel?.name} ({selectedYear}) {selectedVariant?.variantName || selectedVariant?.name}
              </span>{' '}
              in <span className="font-bold">{selectedColour?.name}</span>
            </span>
          ) : (
            <span>Complete all vehicle configuration steps above to proceed.</span>
          )}
        </div>

        <PrimaryButton
          size="md"
          disabled={!isValidConfiguration}
          onClick={handleContinue}
          className="w-full sm:w-auto font-heading font-bold px-6 shadow-lg shadow-dd-red/20"
        >
          <span>Continue to Preferences</span>
          <ArrowRight size={14} />
        </PrimaryButton>
      </div>
    </div>
  );
};
