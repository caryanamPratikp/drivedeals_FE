/**
 * Checks if a dealer is verified and active to submit quotes or receive leads
 */
export function isDealerEligible(dealer) {
    if (!dealer)
        return false;
    return dealer.verificationStatus === 'VERIFIED' && dealer.status === 'ACTIVE';
}
/**
 * Ensures lead isolation: A dealer can only view or manage leads explicitly assigned to them
 */
export function canDealerAccessLead(user, lead) {
    if (user.role === 'ADMIN')
        return true;
    if (user.role === 'DEALER') {
        return user.dealerId === lead.dealerId;
    }
    if (user.role === 'BUYER') {
        return user.id === lead.buyerId;
    }
    return false;
}
/**
 * Allowed status transitions for dealer leads
 */
export const PERMITTED_LEAD_TRANSITIONS = {
    CREATED: ['DEMO_DELIVERED', 'LOST'],
    DEMO_DELIVERED: ['DEALER_ACKNOWLEDGED', 'CONTACT_ATTEMPTED', 'CONTACTED', 'LOST', 'DISPUTED'],
    DEALER_ACKNOWLEDGED: ['CONTACT_ATTEMPTED', 'CONTACTED', 'LOST', 'DISPUTED'],
    CONTACT_ATTEMPTED: ['CONTACTED', 'LOST', 'DISPUTED'],
    CONTACTED: ['TEST_DRIVE_SCHEDULED', 'BOOKING_IN_PROGRESS', 'LOST', 'DISPUTED'],
    TEST_DRIVE_SCHEDULED: ['TEST_DRIVE_COMPLETED', 'BOOKING_IN_PROGRESS', 'LOST', 'DISPUTED'],
    TEST_DRIVE_COMPLETED: ['BOOKING_IN_PROGRESS', 'PURCHASED', 'LOST', 'DISPUTED'],
    BOOKING_IN_PROGRESS: ['PURCHASED', 'LOST', 'DISPUTED'],
    PURCHASED: [], // Terminal
    LOST: [], // Terminal
    DISPUTED: ['DEMO_DELIVERED', 'LOST'], // Can be reset after dispute resolution
};
