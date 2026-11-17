import { apiClient } from './client';

export const consentsApi = {
  grantConsent: (quotationId, payload = {}) =>
    apiClient(`/quotations/${quotationId}/consent`, {
      method: 'POST',
      body: payload,
    }),

  getMyConsents: () =>
    apiClient('/consents/me'),

  revokeConsent: (consentId, reason = '') =>
    apiClient(`/consents/${consentId}/revoke`, {
      method: 'POST',
      body: { reason },
    }),
};
