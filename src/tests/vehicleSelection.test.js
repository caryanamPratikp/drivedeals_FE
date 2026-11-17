import { describe, it, expect } from 'vitest';
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
} from '../data/vehicleCatalogue';

describe('Vehicle Catalogue & Dynamic Powertrain Selection Suite', () => {
  // Scenario 1: Select Mahindra -> XUV700 -> Confirm only Petrol and Diesel appear
  it('Scenario 1: XUV700 strictly offers only PETROL and DIESEL, never ELECTRIC', () => {
    const powertrains = getPowertrains('xuv700', 2026);
    expect(powertrains).toContain('PETROL');
    expect(powertrains).toContain('DIESEL');
    expect(powertrains).not.toContain('ELECTRIC');
    expect(powertrains.length).toBe(2);
  });

  // Scenario 2: Select Mahindra -> XUV 3XO EV -> Confirm only Electric appears
  it('Scenario 2: XUV 3XO EV strictly offers only ELECTRIC', () => {
    const powertrains = getPowertrains('xuv-3xo-ev', 2026);
    expect(powertrains).toEqual(['ELECTRIC']);
    expect(powertrains).not.toContain('PETROL');
    expect(powertrains).not.toContain('DIESEL');
  });

  // Scenario 3: Select Mahindra -> XUV 3XO -> Confirm only verified ICE powertrains appear
  it('Scenario 3: XUV 3XO (ICE) strictly offers only verified PETROL and DIESEL powertrains', () => {
    const powertrains = getPowertrains('xuv-3xo', 2026);
    expect(powertrains).toContain('PETROL');
    expect(powertrains).toContain('DIESEL');
    expect(powertrains).not.toContain('ELECTRIC');
  });

  // Scenario 4: Select Mahindra -> XUV400 -> Confirm Electric only
  it('Scenario 4: XUV400 strictly offers only ELECTRIC', () => {
    const powertrains = getPowertrains('xuv400', 2026);
    expect(powertrains).toEqual(['ELECTRIC']);
    expect(powertrains).not.toContain('PETROL');
    expect(powertrains).not.toContain('DIESEL');
  });

  // Scenario 5: Select Mahindra -> BE 6 -> Confirm Electric only
  it('Scenario 5: BE 6 (Born Electric) strictly offers only ELECTRIC', () => {
    const powertrains = getPowertrains('be-6', 2026);
    expect(powertrains).toEqual(['ELECTRIC']);
    expect(powertrains).not.toContain('PETROL');
    expect(powertrains).not.toContain('DIESEL');
  });

  // Scenario 6: Multiple officially available colours for a model
  it('Scenario 6: Verified model returns all compatible official exterior colours', () => {
    const colours = getColours('xuv700');
    expect(colours.length).toBeGreaterThanOrEqual(5);

    const names = colours.map((c) => c.name);
    expect(names).toContain('Everest White');
    expect(names).toContain('Midnight Black');
    expect(names).toContain('Dazzling Silver');
    expect(names).toContain('Red Rage');
  });

  // Scenario 7: Change selected colour -> updates vehicle image and colour name
  it('Scenario 7: Colour selection resolves corresponding image asset immediately', () => {
    const whiteImage = getVehicleImage('xuv700', 'col-xuv700-white');
    expect(whiteImage.imageUrl).toBe('/cars/xuv700_white.webp');
    expect(whiteImage.colourName).toBe('Everest White');
    expect(whiteImage.isVerified).toBe(true);
  });

  // Scenario 8: Variant restrictions for colours (e.g. Dual-Tone finishes)
  it('Scenario 8: Variant-restricted colours (e.g. Dual Tone) are only returned for eligible trims', () => {
    // Base trim (MX Petrol) should NOT have access to AX7L-exclusive dual-tone roof
    const baseColours = getColours('xuv700', '3e2cfdd8-36a4-450a-9ddf-46bc2aa72b98');
    const hasDualToneOnBase = baseColours.some((c) => c.isDualTone);
    expect(hasDualToneOnBase).toBe(false);

    // Top trim (AX7 Luxury AWD) MUST have access to Everest White Dual-Tone
    const topColours = getColours('xuv700', '2b79c9d5-3941-4026-9453-5f5c3e8f54f5');
    const hasDualToneOnTop = topColours.some((c) => c.isDualTone);
    expect(hasDualToneOnTop).toBe(true);
  });

  // Scenario 9: Model Year changes filter configurations
  it('Scenario 9: Model year strictly limits available configurations to that production run', () => {
    // BE 6 is 2026 only
    const be6Years = getModelYears('be-6');
    expect(be6Years).toEqual([2026]);

    // XUV700 has 2024, 2025, 2026
    const xuv700Years = getModelYears('xuv700');
    expect(xuv700Years).toContain(2026);
    expect(xuv700Years).toContain(2025);
    expect(xuv700Years).toContain(2024);
  });

  // Scenario 10: Unverified representative fallback assets
  it('Scenario 10: Unverified colour assets return isVerified: false with honest representative fallback', () => {
    const imageInfo = getVehicleImage('xuv-3xo', 'col-3xo-stealth');
    expect(imageInfo.isVerified).toBe(false);
    expect(imageInfo.imageUrl).toBeTruthy();
    expect(imageInfo.colourName).toContain('Stealth Black');
  });

  // Scenario 13: Mahindra BE 6 renders its dedicated Born Electric Coupe SUV visual asset
  it('Scenario 13: Mahindra BE 6 renders dedicated coupe SUV asset instead of XUV700', () => {
    const be6Stealth = getVehicleImage('be-6', 'col-be6-stealth');
    expect(be6Stealth.imageUrl).toBe('/cars/be_6.webp');
    expect(be6Stealth.isVerified).toBe(true);
    expect(be6Stealth.imageUrl).not.toContain('xuv700');

    const be6Copper = getVehicleImage('be-6', 'col-be6-cyber-copper');
    expect(be6Copper.imageUrl).toBe('/cars/be_6_copper.webp');
    expect(be6Copper.isVerified).toBe(true);
    expect(be6Copper.imageUrl).not.toContain('xuv700');
  });

  // Scenario 11: Cross-brand validation (Tata, Hyundai, Kia, Maruti)
  it('Scenario 11: Cross-brand distinct product identity validation', () => {
    // Tata: Nexon (ICE + CNG) vs Nexon.ev (Electric only)
    const nexonPowertrains = getPowertrains('nexon', 2026);
    expect(nexonPowertrains).toContain('PETROL');
    expect(nexonPowertrains).toContain('DIESEL');
    expect(nexonPowertrains).toContain('CNG');
    expect(nexonPowertrains).not.toContain('ELECTRIC');

    const nexonEvPowertrains = getPowertrains('nexon-ev', 2026);
    expect(nexonEvPowertrains).toEqual(['ELECTRIC']);

    // Hyundai: Creta vs Creta EV
    const cretaPowertrains = getPowertrains('creta', 2026);
    expect(cretaPowertrains).not.toContain('ELECTRIC');
    const cretaEvPowertrains = getPowertrains('creta-ev', 2026);
    expect(cretaEvPowertrains).toEqual(['ELECTRIC']);

    // Maruti: Grand Vitara has Strong Hybrid and CNG
    const gvPowertrains = getPowertrains('grand-vitara', 2026);
    expect(gvPowertrains).toContain('HYBRID');
    expect(gvPowertrains).toContain('PETROL');
    expect(gvPowertrains).toContain('CNG');
    expect(gvPowertrains).not.toContain('ELECTRIC');
  });

  // Scenario 12: EV transmissions are strictly single-speed reduction gear
  it('Scenario 12: Electric vehicles strictly offer Single-Speed Reduction Gear', () => {
    const evTransmissions = getTransmissions(
      'xuv-3xo-ev',
      2026,
      'ELECTRIC',
      '34.5 kWh High-Density LFP (375 km)'
    );
    expect(evTransmissions).toEqual(['Single-Speed Reduction Gear (EV)']);
    expect(evTransmissions).not.toContain('Manual');
  });

  // Scenario 13: Kia authorized showroom lineup includes all 6 active models
  it('Scenario 13: Kia Pune showroom lineup features all 6 active showroom models with valid configurations and colours', () => {
    const kiaModels = getModelsByBrand('kia');
    const kiaModelIds = kiaModels.map((m) => m.id);
    expect(kiaModelIds).toContain('seltos');
    expect(kiaModelIds).toContain('sonet');
    expect(kiaModelIds).toContain('carens');
    expect(kiaModelIds).toContain('carnival');
    expect(kiaModelIds).toContain('ev6');
    expect(kiaModelIds).toContain('ev9');

    // Each Kia model has official colours available
    for (const model of kiaModels) {
      const colours = getColours(model.id);
      expect(colours.length).toBeGreaterThan(0);
      expect(colours[0].imageUrl).toBeTruthy();
    }
  });

  // Scenario 14: Colour switching changes the image preview dynamically
  it('Scenario 14: Colour switching dynamically changes image preview across different vehicle options', () => {
    // XUV700: Everest White vs Electric Blue
    const whiteAsset = getVehicleImage('xuv700', 'col-xuv700-white');
    const blueAsset = getVehicleImage('xuv700', 'col-xuv700-blue');
    expect(whiteAsset.imageUrl).not.toBe(blueAsset.imageUrl);
    expect(whiteAsset.imageUrl).toBe('/cars/xuv700_white.webp');
    expect(blueAsset.imageUrl).toBe('/cars/mahindra_xuv700.webp');

    // BE 6: Stealth Black vs Cyber Copper
    const be6Stealth = getVehicleImage('be-6', 'col-be6-stealth');
    const be6Copper = getVehicleImage('be-6', 'col-be6-cyber-copper');
    expect(be6Stealth.imageUrl).not.toBe(be6Copper.imageUrl);
    expect(be6Stealth.imageUrl).toBe('/cars/be_6.webp');
    expect(be6Copper.imageUrl).toBe('/cars/be_6_copper.webp');

    // Kia Sonet: Red Dual-Tone vs White
    const sonetRed = getVehicleImage('sonet', 'col-sonet-red-black-dt');
    const sonetWhite = getVehicleImage('sonet', 'col-sonet-glacier-white');
    expect(sonetRed.imageUrl).not.toBe(sonetWhite.imageUrl);
    expect(sonetRed.imageUrl).toBe('/cars/sonet.webp');
  });
});
