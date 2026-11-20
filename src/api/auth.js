import { apiClient } from './client';

export const authApi = {
  sendOtp: (phone, mode = 'LOGIN') =>
    apiClient('/auth/otp/send', {
      method: 'POST',
      body: { phone, mode },
    }),

  verifyOtp: (phone, otp, profile = {}) =>
    apiClient('/auth/otp/verify', {
      method: 'POST',
      body: {
        phone,
        otp,
        name: profile.name,
        role: profile.role,
        city: profile.city,
        dealershipName: profile.dealershipName,
        brand: profile.brand,
      },
    }),

  getMe: () =>
    apiClient('/auth/me', {
      method: 'GET',
    }),
};
