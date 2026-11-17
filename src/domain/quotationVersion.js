import { calculateOnRoadPrice } from './pricing';
import { generateId } from '../lib/ids';
/**
 * Pure function that creates a new immutable QuotationVersion.
 * Never mutates previous versions.
 * Increments version number from previous version or starts at 1.
 */
export function createNewQuotationVersion(input, publishImmediately = true) {
    const versionNumber = input.previousVersion ? input.previousVersion.versionNumber + 1 : 1;
    const onRoadPrice = calculateOnRoadPrice(input);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + input.validityDays * 24 * 60 * 60 * 1000).toISOString();
    const newVersion = {
        id: generateId(`QV-${input.quotationId}-V${versionNumber}`),
        quotationId: input.quotationId,
        versionNumber,
        exShowroomPrice: input.exShowroomPrice,
        registrationCharges: input.registrationCharges,
        insuranceAmount: input.insuranceAmount,
        accessoriesAmount: input.accessoriesAmount,
        otherCharges: input.otherCharges,
        discountAmount: input.discountAmount,
        calculatedOnRoadPrice: onRoadPrice,
        deliveryMinDays: input.deliveryMinDays,
        deliveryMaxDays: input.deliveryMaxDays,
        validityDays: input.validityDays,
        publishedAt: publishImmediately ? now.toISOString() : undefined,
        expiresAt,
        stockStatus: input.stockStatus,
        note: input.note?.trim(),
        conditions: [...input.conditions],
        createdByDealerId: input.createdByDealerId,
        publishedByUserId: input.publishedByUserId,
        status: publishImmediately ? 'PUBLISHED' : 'DRAFT',
        parentVersionId: input.previousVersion?.id,
        isInsuranceIncluded: input.isInsuranceIncluded,
        insuranceFlexibilityAllowed: input.insuranceFlexibilityAllowed,
    };
    return Object.freeze(newVersion);
}
/**
 * Checks whether an offer/version is currently active and not expired
 */
export function isQuotationActive(version) {
    if (version.status !== 'PUBLISHED')
        return false;
    const expiry = new Date(version.expiresAt).getTime();
    return expiry > Date.now();
}
