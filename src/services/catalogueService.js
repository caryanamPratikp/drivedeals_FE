import { apiClient } from './apiClient';

export const catalogueService = {
  getCars: async () => {
    const res = await apiClient.get('/catalogue/cars');
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getCarById: async (id) => {
    const res = await apiClient.get(`/catalogue/cars/${id}`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },

  getVariantsForCar: async (carId) => {
    const res = await apiClient.get(`/catalogue/cars/${carId}/variants`);
    return res.data?.data !== undefined ? res.data.data : res.data;
  },
};
