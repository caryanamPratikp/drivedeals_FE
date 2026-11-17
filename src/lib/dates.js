import { format, parseISO, isValid, differenceInDays } from 'date-fns';
/**
 * Format date string into human readable Indian format
 * Example: "2026-10-25" -> "25 October 2026"
 */
export function formatDate(isoDate) {
    if (!isoDate)
        return 'N/A';
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    if (!isValid(date))
        return 'Invalid date';
    return format(date, 'd MMMM yyyy');
}
/**
 * Format date and time
 * Example: "25 Oct 2026, 02:30 PM"
 */
export function formatDateTime(isoDate) {
    if (!isoDate)
        return 'N/A';
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    if (!isValid(date))
        return 'Invalid date';
    return format(date, 'd MMM yyyy, hh:mm a');
}
/**
 * Return remaining days from now until date
 */
export function getDaysRemaining(targetIsoDate) {
    const target = parseISO(targetIsoDate);
    if (!isValid(target))
        return 0;
    return differenceInDays(target, new Date());
}
