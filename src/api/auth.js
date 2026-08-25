import apiClient from './axios';

export async function registerRequest(formData) {
  const response = await apiClient.post('/auth/register', formData);
  return response.data.data;
}

export async function loginRequest(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
}

export async function meRequest() {
  const response = await apiClient.get('/me');
  return response.data.data;
}