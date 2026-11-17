import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';
describe('Explicit Consent & Lead Creation Store Operations', () => {
    beforeEach(() => {
        useAppStore.setState({
            consents: [
                {
                    id: 'cst-priya',
                    buyerId: 'user-priya',
                    dealerId: 'dealer-pune-auto',
                    groupId: 'grp-nexon-offers-demo',
                    status: 'ACTIVE',
                },
            ],
            leads: [
                {
                    id: 'lead_seed_active',
                    buyerId: 'user-priya',
                    dealerId: 'dealer-pune-auto',
                    groupId: 'grp-nexon-offers-demo',
                    status: 'CONTACTED',
                },
            ],
            dealers: [
                { id: 'dealer-pune-auto', status: 'VERIFIED' },
                { id: 'dealer-western-wheels', status: 'SUSPENDED' },
            ],
            quotationVersions: [
                { id: 'ver-nexon-pune-v2', status: 'PUBLISHED' },
            ],
        });
    });
    it('creates an authorized lead with DEMO_DELIVERED status upon explicit consent', () => {
        const store = useAppStore.getState();
        const result = store.grantConsentAndCreateLead({
            buyerId: 'user-priya',
            dealerId: 'dealer-pune-auto',
            groupId: 'grp-nexon-offers-demo',
            offerId: 'quote-nexon-pune-auto',
            offerVersionId: 'ver-nexon-pune-v2',
            purpose: 'Direct showroom test drive coordination and quote finalization.',
            dataFields: ['Full Name: Priya Sharma', 'Verified Phone: +91 98230 12345'],
            buyerName: 'Priya Sharma',
            authorizedPhone: '+91 98230 12345',
            preferredTimeline: 'WITHIN_30_DAYS',
        });
        // The seed already contains one active lead for this buyer+dealer+group combo, so a duplicate is prevented
        expect(result.success).toBe(false);
        expect(result.error).toContain('already have an active lead');
        // Now test with another buyer (Rahul) and verified dealer
        const rahulResult = store.grantConsentAndCreateLead({
            buyerId: 'user-aditi',
            dealerId: 'dealer-pune-auto',
            groupId: 'grp-nexon-offers-demo',
            offerId: 'quote-nexon-pune-auto',
            offerVersionId: 'ver-nexon-pune-v2',
            purpose: 'Test drive booking',
            dataFields: ['Name: Aditi', 'Phone: +91 98229 67890'],
            buyerName: 'Aditi Kulkarni',
            authorizedPhone: '+91 98229 67890',
            preferredTimeline: 'WITHIN_7_DAYS',
        });
        expect(rahulResult.success).toBe(true);
        expect(rahulResult.leadId).toBeDefined();
        const createdLead = useAppStore.getState().leads.find((l) => l.id === rahulResult.leadId);
        expect(createdLead?.status).toBe('DEMO_DELIVERED');
        expect(createdLead?.dealerId).toBe('dealer-pune-auto');
    });
    it('prevents lead creation if dealership is suspended', () => {
        const store = useAppStore.getState();
        const result = store.grantConsentAndCreateLead({
            buyerId: 'user-aditi',
            dealerId: 'dealer-western-wheels', // Suspended dealer
            groupId: 'grp-nexon-offers-demo',
            offerId: 'quote-nexon-pune-auto',
            offerVersionId: 'ver-nexon-pune-v2',
            purpose: 'Test drive',
            dataFields: ['Name', 'Phone'],
            buyerName: 'Aditi Kulkarni',
            authorizedPhone: '+91 98229 67890',
            preferredTimeline: 'WITHIN_30_DAYS',
        });
        expect(result.success).toBe(false);
        expect(result.error).toContain('not eligible to receive leads');
    });
    it('allows consent withdrawal and updates consent status to WITHDRAWN', () => {
        const store = useAppStore.getState();
        const existingConsent = store.consents[0];
        expect(existingConsent.status).toBe('ACTIVE');
        const result = store.withdrawConsent(existingConsent.id);
        expect(result.success).toBe(true);
        const updatedConsent = useAppStore.getState().consents.find((c) => c.id === existingConsent.id);
        expect(updatedConsent?.status).toBe('WITHDRAWN');
        expect(updatedConsent?.withdrawnAt).toBeDefined();
    });
});
