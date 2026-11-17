import { apiClient } from './client';

export const notificationsApi = {
  getNotifications: (unreadOnly = false) =>
    apiClient(`/notifications?unreadOnly=${unreadOnly}`),

  markAsRead: (id) =>
    apiClient(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
};
