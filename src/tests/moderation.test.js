import { describe, it, expect } from 'vitest';
import { moderateText } from '../domain/moderation';
describe('Structured Text Moderation Rules', () => {
    it('approves compliant notes within 200 characters', () => {
        const res = moderateText('Looking for prompt delivery before Diwali and zero mandatory accessories.');
        expect(res.isApproved).toBe(true);
        expect(res.status).toBe('APPROVED');
    });
    it('rejects notes exceeding 200 characters', () => {
        const longNote = 'A'.repeat(201);
        const res = moderateText(longNote);
        expect(res.isApproved).toBe(false);
        expect(res.status).toBe('REJECTED');
    });
    it('flags phone numbers embedded in public notes for admin moderation', () => {
        const res = moderateText('Call me on 9823012345 for private deal discussion.');
        expect(res.isApproved).toBe(false);
        expect(res.status).toBe('PENDING');
    });
    it('rejects unsolicited spam keywords', () => {
        const res = moderateText('Get 100% win money and crypto loans at cheap rates!');
        expect(res.isApproved).toBe(false);
        expect(res.status).toBe('REJECTED');
    });
});
