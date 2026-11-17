import { apiClient } from './client';

export const quotationsApi = {
  getQuotationsForGroup: (groupId) =>
    apiClient(`/groups/${groupId}/quotations`),

  getQuotationById: (id) =>
    apiClient(`/quotations/${id}`),

  submitQuotation: (groupId, payload) =>
    apiClient(`/groups/${groupId}/quotations`, {
      method: 'POST',
      body: payload,
    }),

  reviseQuotation: (quotationId, payload) =>
    apiClient(`/quotations/${quotationId}/versions`, {
      method: 'POST',
      body: payload,
    }),
};
