import { apiClient } from './client.js';

export async function fetchAdminAnalytics() {
  return apiClient('/admin/analytics');
}

export async function fetchAdminDealers() {
  return apiClient('/admin/dealers');
}

export async function updateDealerStatus(dealerId, status, notes) {
  return apiClient(`/admin/dealers/${dealerId}/status`, {
    method: 'PATCH',
    body: { status, notes },
  });
}

export async function fetchAdminUsers() {
  return apiClient('/admin/users');
}

export async function fetchAdminGroups() {
  return apiClient('/admin/groups');
}

export async function fetchAdminLeads() {
  return apiClient('/admin/leads');
}

export async function fetchAdminAudit() {
  return apiClient('/admin/audit');
}
