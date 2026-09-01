import apiClient from './axios';

export async function getCart() {
  const response = await apiClient.get('/cart');
  return response.data.data;
}

export async function addCartItem(productId, quantity = 1) {
  const response = await apiClient.post('/cart/items', { productId, quantity });
  return response.data.data;
}