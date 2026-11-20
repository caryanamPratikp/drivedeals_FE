import { apiClient } from './apiClient';

export const authService = {
  sendOtp: async (phone, mode = 'LOGIN') => {
    const res = await apiClient.post('/auth/otp/send', { phone, mode });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  verifyOtp: async (phone, otp, profile = {}) => {
    const res = await apiClient.post('/auth/otp/verify', {
      phone,
      otp,
      name: profile.name,
      role: profile.role,
      city: profile.city,
      dealershipName: profile.dealershipName,
      brand: profile.brand,
    });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  logout: () => {
    localStorage.removeItem('motorcircle_auth_token');
    localStorage.removeItem('motorcircle_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },
};
