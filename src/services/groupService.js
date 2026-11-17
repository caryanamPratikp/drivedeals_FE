import { apiClient } from './apiClient';

export const groupService = {
  getGroups: async (params = {}) => {
    const res = await apiClient.get('/groups', { params });
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getGroupById: async (id) => {
    const res = await apiClient.get(`/groups/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  createGroup: async (payload) => {
    const res = await apiClient.post('/groups', payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  joinGroup: async (groupId, payload = {}) => {
    const res = await apiClient.post(`/groups/${groupId}/memberships`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  leaveGroup: async (groupId) => {
    const res = await apiClient.delete(`/groups/${groupId}/memberships/me`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  submitSignal: async (groupId, payload) => {
    const res = await apiClient.post(`/groups/${groupId}/signals`, payload);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
