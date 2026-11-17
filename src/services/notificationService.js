import { apiClient } from './apiClient';

export const notificationService = {
  getNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  markRead: async (id) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  grantConsent: async (quotationId, versionId) => {
    const res = await apiClient.post('/consents', { quotationId, quotationVersionId: versionId });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getMyConsents: async () => {
    const res = await apiClient.get('/consents/me');
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
