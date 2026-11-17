/**
 * Formats a number to Indian Rupee (INR) currency style.
 * Example: 1162000 -> "₹11,62,000"
 */
export function formatINR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
/**
 * Converts a number to Lakhs notation for compact display.
 * Example: 1162000 -> "₹11.62 Lakh"
 */
export function formatINRLakhs(amount) {
    if (!amount)
        return '₹0';
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)} Lakh`;
}
