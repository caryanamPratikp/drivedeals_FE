import { describe, it, expect, beforeEach } from 'vitest';

// Provide browser-like storage mocks for Node test environment
class StorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new StorageMock();
globalThis.sessionStorage = new StorageMock();
globalThis.window = {
  location: { pathname: '/buyer/groups' },
};

import {
  saveAuthSession,
  getStoredToken,
  getStoredUser,
  clearAuthSession,
  getRoleSession,
  GUEST_USER,
} from '../lib/authStorage';

describe('Tab-Isolated & Role-Aware Auth Storage Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = '/buyer/groups';
  });

  it('saves and isolates session per tab and per role', () => {
    const buyerUser = { id: 'u-buyer-1', role: 'BUYER', name: 'Buyer John', phone: '+919876543210' };
    const dealerUser = { id: 'u-dealer-1', role: 'DEALER', name: 'Dealer Auto', phone: '+919898989898' };

    // 1. Save Buyer session
    saveAuthSession('token-buyer-123', buyerUser);

    expect(sessionStorage.getItem('motorcircle_auth_token')).toBe('token-buyer-123');
    expect(localStorage.getItem('motorcircle_buyer_token')).toBe('token-buyer-123');
    expect(localStorage.getItem('motorcircle_user_9876543210')).toBeTruthy();

    // 2. Save Dealer session (simulating another tab login)
    saveAuthSession('token-dealer-456', dealerUser);

    expect(sessionStorage.getItem('motorcircle_auth_token')).toBe('token-dealer-456');
    expect(localStorage.getItem('motorcircle_dealer_token')).toBe('token-dealer-456');

    // Ensure Buyer session in localStorage was NOT destroyed by Dealer login
    expect(localStorage.getItem('motorcircle_buyer_token')).toBe('token-buyer-123');
    expect(getRoleSession('BUYER')?.user.name).toBe('Buyer John');
    expect(getRoleSession('DEALER')?.user.name).toBe('Dealer Auto');
  });

  it('tab isolation: active tab session is NEVER clobbered by another tab login in localStorage', () => {
    const buyer1 = { id: 'u-buyer-1', role: 'BUYER', name: 'Priya Sharma', phone: '+919876543210' };
    const buyer2 = { id: 'u-buyer-2', role: 'BUYER', name: 'Rahul Verma', phone: '+919876543211' };

    // Tab 1 logs in Priya
    saveAuthSession('token-priya', buyer1);
    expect(getStoredToken()).toBe('token-priya');
    expect(getStoredUser().name).toBe('Priya Sharma');

    // Tab 2 simulates logging in Rahul into localStorage (without touching Tab 1's sessionStorage)
    localStorage.setItem('motorcircle_buyer_token', 'token-rahul');
    localStorage.setItem('motorcircle_buyer_user', JSON.stringify(buyer2));

    // Tab 1 MUST still be Priya Sharma because Tab 1's sessionStorage is authoritative!
    expect(getStoredToken()).toBe('token-priya');
    expect(getStoredUser().name).toBe('Priya Sharma');
  });

  it('fresh tabs on public/login routes start clean as Guest without auto-inheriting other tabs', () => {
    // Other tabs have active sessions in localStorage
    localStorage.setItem('motorcircle_dealer_token', 'token-dealer-active');
    localStorage.setItem('motorcircle_dealer_user', JSON.stringify({ role: 'DEALER', name: 'Sahyadri' }));
    localStorage.setItem('motorcircle_buyer_token', 'token-buyer-active');
    localStorage.setItem('motorcircle_buyer_user', JSON.stringify({ role: 'BUYER', name: 'Priya' }));

    // Fresh tab opens at /login
    sessionStorage.clear();
    window.location.pathname = '/login';

    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toEqual(GUEST_USER);

    // Fresh tab opens at root /
    window.location.pathname = '/';
    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toEqual(GUEST_USER);
  });

  it('direct bookmarks to protected routes hydrate from role vault when tab session is empty', () => {
    localStorage.setItem('motorcircle_dealer_token', 'token-dealer-stored');
    localStorage.setItem('motorcircle_dealer_user', JSON.stringify({ role: 'DEALER', name: 'Sahyadri Dealer' }));

    sessionStorage.clear();
    window.location.pathname = '/dealer/quote-requests';

    expect(getStoredToken()).toBe('token-dealer-stored');
    expect(getStoredUser().name).toBe('Sahyadri Dealer');
    expect(sessionStorage.getItem('motorcircle_auth_token')).toBe('token-dealer-stored');
  });

  it('clearing session without role argument only clears current tab sessionStorage', () => {
    saveAuthSession('token-buyer-123', { id: 'u-buyer', role: 'BUYER', phone: '+919876543210' });

    clearAuthSession();

    expect(sessionStorage.getItem('motorcircle_auth_token')).toBeNull();
    expect(sessionStorage.getItem('motorcircle_user')).toBeNull();
    // Role vault in localStorage preserved for other tabs
    expect(localStorage.getItem('motorcircle_buyer_token')).toBe('token-buyer-123');
  });

  it('clearing specific role clears role vault while preserving other roles', () => {
    saveAuthSession('token-buyer-123', { id: 'u-buyer', role: 'BUYER', phone: '+919876543210' });
    saveAuthSession('token-dealer-456', { id: 'u-dealer', role: 'DEALER', phone: '+919898989898' });

    clearAuthSession('DEALER');

    expect(localStorage.getItem('motorcircle_dealer_token')).toBeNull();
    expect(localStorage.getItem('motorcircle_buyer_token')).toBe('token-buyer-123');
  });
});
