import { api } from './config';

export const deleteTheme = async (id) => {
  const response = await api.delete(`/theme/${id}`);
  return response.data;
};

export async function createTheme({ name, description, questions = [] }) {
  const response = await api.post('/theme/integrated', {
    name,
    description,
    is_active: true,
    questions,
  });
  return response.data;
}

export async function getThemes() {
  const response = await api.get('/themes');
  return response.data;
}

export async function getThemeById(id) {
  const response = await api.get(`/theme/integrated/${id}`);
  return response.data;
}

export async function updateTheme({ id, name, description, questions = [] }) {
  const response = await api.put(`/theme/integrated/${id}`, {
    name,
    description,
    questions,
    is_active: true,
  });
  return response.data;
}
