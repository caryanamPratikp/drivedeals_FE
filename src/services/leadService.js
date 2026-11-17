import { apiClient } from './apiClient';

export const leadService = {
  getDealerLeads: async (params = {}) => {
    const res = await apiClient.get('/dealer/leads', { params });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getDealerLeadById: async (id) => {
    const res = await apiClient.get(`/dealer/leads/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  updateLeadStatus: async (id, status, notes = '') => {
    const res = await apiClient.patch(`/dealer/leads/${id}/status`, { status, notes });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
