import { apiClient } from './client';

export const leadsApi = {
  getDealerLeads: (status, page = 0, size = 20) => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    query.append('page', page);
    query.append('size', size);
    return apiClient(`/dealer/leads?${query.toString()}`);
  },

  getDealerLeadById: (id) =>
    apiClient(`/dealer/leads/${id}`),

  updateLeadStatus: (id, status, notes = '') =>
    apiClient(`/dealer/leads/${id}/status`, {
      method: 'PATCH',
      body: { status, note: notes || '' },
    }),
};
