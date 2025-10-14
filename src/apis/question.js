import { api } from './config';

export async function createQuestion({
  text,
  difficulty,
  theme_id,
  explanation = '',
  time_limit = 30,
  points = 10,
}) {
  const response = await api.post('/question/register', {
    text,
    difficulty,
    theme_id,
    explanation,
    time_limit,
    points,
  });
  return response.data;
}

export async function deleteQuestion(id) {
  const response = await api.delete(`/question/${id}`);
  return response.data;
}

export async function updateQuestion({
  id,
  text,
  difficulty,
  theme_id,
  explanation,
  time_limit,
  points,
}) {
  const response = await api.put(`/question/${id}`, {
    text,
    difficulty,
    theme_id,
    explanation,
    time_limit,
    points,
  });
  return response.data;
}

export async function getQuestion(id) {
  const response = await api.get(`/question/${id}`);
  return response.data;
}

export async function getQuestions() {
  const response = await api.get('/questions');
  return response.data;
}
