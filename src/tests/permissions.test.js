import { describe, it, expect } from 'vitest';
import { isDealerEligible, canDealerAccessLead } from '../domain/permissions';
describe('Dealer Eligibility & Lead Isolation Security', () => {
    const verifiedDealer = {
        id: 'dealer-pune-auto',
        businessName: 'Pune Auto Motors',
        legalEntityName: 'Pune Auto Motors Pvt. Ltd.',
        city: 'Pune',
        address: 'Baner, Pune',
        verificationStatus: 'VERIFIED',
        status: 'ACTIVE',
        displayContactName: 'Rajesh',
        mockPhone: '9822011223',
        applicationDate: '2026-08-01',
        authorizedBrands: ['Tata'],
    };
    const suspendedDealer = {
        ...verifiedDealer,
        id: 'dealer-suspended',
        verificationStatus: 'SUSPENDED',
        status: 'SUSPENDED',
    };
    it('allows verified active dealers and blocks suspended or pending dealers', () => {
        expect(isDealerEligible(verifiedDealer)).toBe(true);
        expect(isDealerEligible(suspendedDealer)).toBe(false);
        expect(isDealerEligible(undefined)).toBe(false);
    });
    it('strictly isolates customer leads so dealer A cannot access dealer B leads', () => {
        const leadAssignedToPuneAuto = {
            id: 'lead-001',
            buyerId: 'user-priya',
            dealerId: 'dealer-pune-auto',
            groupId: 'grp-1',
            offerId: 'quote-1',
            offerVersionId: 'ver-1',
            consentId: 'cst-1',
            status: 'DEMO_DELIVERED',
            createdAt: '2026-10-25',
            updatedAt: '2026-10-25',
            authorizedPhone: '+91 98230 12345',
            buyerName: 'Priya Sharma',
            preferredTimeline: 'WITHIN_30_DAYS',
            notes: [],
        };
        const puneAutoUser = {
            id: 'u-1',
            name: 'Rajesh',
            role: 'DEALER',
            phone: '9822011223',
            city: 'Pune',
            status: 'ACTIVE',
            dealerId: 'dealer-pune-auto',
        };
        const deccanDealerUser = {
            id: 'u-2',
            name: 'Sameer',
            role: 'DEALER',
            phone: '9822044556',
            city: 'Pune',
            status: 'ACTIVE',
            dealerId: 'dealer-deccan',
        };
        const adminUser = {
            id: 'u-admin',
            name: 'Admin',
            role: 'ADMIN',
            phone: '9822000000',
            city: 'Pune',
            status: 'ACTIVE',
        };
        expect(canDealerAccessLead(puneAutoUser, leadAssignedToPuneAuto)).toBe(true);
        expect(canDealerAccessLead(deccanDealerUser, leadAssignedToPuneAuto)).toBe(false);
        expect(canDealerAccessLead(adminUser, leadAssignedToPuneAuto)).toBe(true);
    });
});
