import { api } from './config';

export async function createTheme({ name, description }) {
  const response = await api.post('/theme/register', {
    name,
    description,
  });
  return response.data;
}

export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}
export async function getThemes() {
  const response = await api.get('/themes');
  return response.data;
}
export async function getTheme(id) {
  const response = await api.get(`/theme/${id}`);
  return response.data;
}
export async function deleteTheme(id) {
  const response = await api.delete(`/theme/${id}`);
  return response.data;
}
export async function updateTheme({ id, name, description }) {
  const response = await api.put(`/theme/${id}`, {
    name,
    description,
  });
  return response.data;
}
