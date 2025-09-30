import { api } from './config';

export async function registerPlayer({ nickname, email, password }) {
  const response = await api.post('/player/register', {
    username: nickname,
    email,
    password,
  });
  return response.data;
}
