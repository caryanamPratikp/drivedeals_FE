import { apiClient } from './client';

export const groupsApi = {
  getGroups: (params = {}) => {
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.brand) query.append('brand', params.brand);
    if (params.stage) query.append('stage', params.stage);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);

    const queryString = query.toString();
    return apiClient(`/groups${queryString ? `?${queryString}` : ''}`);
  },

  getGroupById: (id) =>
    apiClient(`/groups/${id}`),

  createGroup: (payload) =>
    apiClient('/groups', {
      method: 'POST',
      body: payload,
    }),

  joinGroup: (groupId, payload = {}) =>
    apiClient(`/groups/${groupId}/memberships`, {
      method: 'POST',
      body: payload,
    }),

  leaveGroup: (groupId) =>
    apiClient(`/groups/${groupId}/memberships/me`, {
      method: 'DELETE',
    }),

  submitSignal: (groupId, payload) =>
    apiClient(`/groups/${groupId}/signals`, {
      method: 'POST',
      body: payload,
    }),
};
