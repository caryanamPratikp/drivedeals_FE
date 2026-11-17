/**
 * Generates unique identifiers with semantic prefixes
 */
export function generateId(prefix = 'id') {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString().slice(-4);
    const cleanPrefix = prefix ? prefix.replace(/-+$/, '') : 'id';
    return `${cleanPrefix}-${timestampPart}${randomPart}`;
}
