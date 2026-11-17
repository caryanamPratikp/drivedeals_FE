import { describe, it, expect } from 'vitest';
import { createNewQuotationVersion } from '../domain/quotationVersion';
describe('Quotation Version Immutability Rules', () => {
    it('creates immutable incremental versions without mutating previous version', () => {
        // Initial Version 1
        const v1 = createNewQuotationVersion({
            quotationId: 'Q-1001',
            exShowroomPrice: 1000000,
            registrationCharges: 100000,
            insuranceAmount: 85000,
            accessoriesAmount: 15000,
            otherCharges: 0,
            discountAmount: 20000,
            deliveryMinDays: 10,
            deliveryMaxDays: 15,
            validityDays: 7,
            stockStatus: 'IN_STOCK',
            note: 'Version 1 offer',
            conditions: ['Condition 1'],
            createdByDealerId: 'dealer-pune-auto',
            isInsuranceIncluded: true,
            insuranceFlexibilityAllowed: true,
        });
        expect(v1.versionNumber).toBe(1);
        expect(v1.calculatedOnRoadPrice).toBe(1180000);
        expect(v1.parentVersionId).toBeUndefined();
        // Revise to Version 2
        const v2 = createNewQuotationVersion({
            quotationId: 'Q-1001',
            previousVersion: v1,
            exShowroomPrice: 1000000,
            registrationCharges: 100000,
            insuranceAmount: 80000,
            accessoriesAmount: 12000,
            otherCharges: 0,
            discountAmount: 30000,
            deliveryMinDays: 7,
            deliveryMaxDays: 10,
            validityDays: 10,
            stockStatus: 'IN_STOCK',
            note: 'Version 2 improved offer',
            conditions: ['Condition 1', 'Condition 2'],
            createdByDealerId: 'dealer-pune-auto',
            isInsuranceIncluded: true,
            insuranceFlexibilityAllowed: true,
        });
        expect(v2.versionNumber).toBe(2);
        expect(v2.calculatedOnRoadPrice).toBe(1162000);
        expect(v2.parentVersionId).toBe(v1.id);
        // Verify V1 remains unchanged and intact
        expect(v1.versionNumber).toBe(1);
        expect(v1.calculatedOnRoadPrice).toBe(1180000);
        expect(v1.discountAmount).toBe(20000);
    });
});
