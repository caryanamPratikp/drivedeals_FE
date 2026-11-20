import { apiClient } from './client.js';

export async function fetchCurrentDealer() {
  return apiClient('/dealers/me');
}

export async function submitDealerOnboarding(data) {
  return apiClient('/dealers/onboarding', {
    method: 'POST',
    body: data,
  });
}
