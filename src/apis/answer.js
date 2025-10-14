import { api } from './config';

export const createAnswer = async ({
  text,
  is_correct,
  order,
  question_id,
}) => {
  const response = await api.post('/answer/register', {
    text,
    is_correct,
    order,
    question_id,
  });
  return response.data;
};
