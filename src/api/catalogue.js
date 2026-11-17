import { apiClient } from './client';

export const catalogueApi = {
  getCars: (params = {}) => {
    const query = new URLSearchParams();
    if (params.brand) query.append('brand', params.brand);
    if (params.bodyType) query.append('bodyType', params.bodyType);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const queryString = query.toString();
    return apiClient(`/catalogue/cars${queryString ? `?${queryString}` : ''}`);
  },

  getCarById: (id) =>
    apiClient(`/catalogue/cars/${id}`),

  createCar: (carData) =>
    apiClient('/catalogue/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    }),
};
