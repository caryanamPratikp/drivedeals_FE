/**
 * Calculates on-road price according to the official formula:
 * onRoadPrice = exShowroomPrice + registrationCharges + insuranceAmount + accessoriesAmount + otherCharges - discountAmount
 */
export function calculateOnRoadPrice(input) {
    const ex = Math.max(0, Math.round(input.exShowroomPrice || 0));
    const reg = Math.max(0, Math.round(input.registrationCharges || 0));
    const ins = Math.max(0, Math.round(input.insuranceAmount || 0));
    const acc = Math.max(0, Math.round(input.accessoriesAmount || 0));
    const oth = Math.max(0, Math.round(input.otherCharges || 0));
    const disc = Math.max(0, Math.round(input.discountAmount || 0));
    return ex + reg + ins + acc + oth - disc;
}
/**
 * Validates the price breakdown according to business rules:
 * 1. Ex-showroom must be greater than 0
 * 2. All items must be non-negative integers
 * 3. Discount cannot exceed the sum of all charges
 * 4. Calculated on-road price cannot be negative
 */
export function validatePriceBreakdown(input) {
    const errors = {};
    if (!input.exShowroomPrice || input.exShowroomPrice <= 0) {
        errors.exShowroomPrice = 'Ex-showroom price must be greater than zero.';
    }
    if (input.registrationCharges < 0) {
        errors.registrationCharges = 'Registration/RTO charges cannot be negative.';
    }
    if (input.insuranceAmount < 0) {
        errors.insuranceAmount = 'Insurance amount cannot be negative.';
    }
    if (input.accessoriesAmount < 0) {
        errors.accessoriesAmount = 'Accessories amount cannot be negative.';
    }
    if (input.otherCharges < 0) {
        errors.otherCharges = 'Other charges cannot be negative.';
    }
    if (input.discountAmount < 0) {
        errors.discountAmount = 'Discount cannot be negative.';
    }
    const grossCharges = (input.exShowroomPrice || 0) +
        (input.registrationCharges || 0) +
        (input.insuranceAmount || 0) +
        (input.accessoriesAmount || 0) +
        (input.otherCharges || 0);
    if (input.discountAmount > grossCharges) {
        errors.discountAmount = 'Discount amount cannot exceed total vehicle charges.';
    }
    const onRoadPrice = calculateOnRoadPrice(input);
    if (onRoadPrice <= 0 && !errors.exShowroomPrice) {
        errors.onRoadPrice = 'Calculated on-road price must be greater than zero.';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        onRoadPrice,
        errors,
    };
}
