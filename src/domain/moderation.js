export function moderateText(content) {
    if (!content || !content.trim()) {
        return { isApproved: true, status: 'APPROVED' };
    }
    const text = content.trim();
    if (text.length > 200) {
        return {
            isApproved: false,
            status: 'REJECTED',
            reason: 'Note exceeds the maximum limit of 200 characters.',
        };
    }
    // Check for exposed phone numbers (10 digits starting with 6,7,8,9)
    const phonePattern = /(?:^|[^\d])[6-9]\d{9}(?:[^\d]|$)/;
    if (phonePattern.test(text) || phonePattern.test(text.replace(/[\s-]/g, ''))) {
        return {
            isApproved: false,
            status: 'PENDING',
            reason: 'Contains phone number or personal contact details. Held for admin moderation.',
        };
    }
    // Check for external links
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    if (urlPattern.test(text)) {
        return {
            isApproved: false,
            status: 'PENDING',
            reason: 'External web links are not allowed in public notes.',
        };
    }
    // Obvious spam keywords
    const spamKeywords = ['crypto', 'loan offer', 'whatsapp me', 'telegram', 'win money', 'click here'];
    const hasSpam = spamKeywords.some((keyword) => text.toLowerCase().includes(keyword));
    if (hasSpam) {
        return {
            isApproved: false,
            status: 'REJECTED',
            reason: 'Identified as spam or unsolicited advertisement.',
        };
    }
    return { isApproved: true, status: 'APPROVED' };
}
