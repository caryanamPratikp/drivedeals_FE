import { apiClient } from './apiClient';

export const quotationService = {
  getQuotationsForGroup: async (groupId) => {
    const res = await apiClient.get(`/groups/${groupId}/quotations`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getQuotationById: async (id) => {
    const res = await apiClient.get(`/quotations/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  submitQuotation: async (groupId, payload) => {
    const res = await apiClient.post(`/groups/${groupId}/quotations`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  reviseQuotation: async (quotationId, payload) => {
    const res = await apiClient.post(`/quotations/${quotationId}/versions`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
