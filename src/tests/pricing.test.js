import { describe, it, expect } from 'vitest';
import { calculateOnRoadPrice, validatePriceBreakdown } from '../domain/pricing';
describe('Pricing Calculation & Validation Rules', () => {
    it('correctly calculates the exact ₹11,62,000 spec demonstration on-road price', () => {
        // Spec breakdown:
        // Ex-showroom: ₹10,00,000
        // Registration: ₹1,00,000
        // Insurance: ₹80,000
        // Accessories: ₹12,000
        // Other: ₹0
        // Discount: ₹30,000
        // On-Road: ₹11,62,000
        const input = {
            exShowroomPrice: 1000000,
            registrationCharges: 100000,
            insuranceAmount: 80000,
            accessoriesAmount: 12000,
            otherCharges: 0,
            discountAmount: 30000,
        };
        const calculatedTotal = calculateOnRoadPrice(input);
        expect(calculatedTotal).toBe(1162000);
        const validation = validatePriceBreakdown(input);
        expect(validation.isValid).toBe(true);
        expect(validation.onRoadPrice).toBe(1162000);
    });
    it('correctly calculates the ₹13,62,000 sample quotation calculation', () => {
        // Ex-showroom: ₹12,00,000
        // Registration/RTO: ₹1,20,000
        // Insurance: ₹65,000
        // Accessories: ₹7,000
        // Other: ₹0
        // Discount: ₹30,000
        // Calculated on-road price: ₹13,62,000
        const input = {
            exShowroomPrice: 1200000,
            registrationCharges: 120000,
            insuranceAmount: 65000,
            accessoriesAmount: 7000,
            otherCharges: 0,
            discountAmount: 30000,
        };
        const calculatedTotal = calculateOnRoadPrice(input);
        expect(calculatedTotal).toBe(1362000);
        const validation = validatePriceBreakdown(input);
        expect(validation.isValid).toBe(true);
        expect(validation.onRoadPrice).toBe(1362000);
    });
    it('rejects negative line items and discounts exceeding total charges', () => {
        const invalidInput = {
            exShowroomPrice: 1000000,
            registrationCharges: -5000,
            insuranceAmount: 50000,
            accessoriesAmount: 10000,
            otherCharges: 0,
            discountAmount: 2000000, // Exceeds all charges
        };
        const validation = validatePriceBreakdown(invalidInput);
        expect(validation.isValid).toBe(false);
        expect(validation.errors.registrationCharges).toBeDefined();
        expect(validation.errors.discountAmount).toBeDefined();
    });
});
