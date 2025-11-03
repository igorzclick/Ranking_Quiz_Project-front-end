import { api } from './config';

export const createRoom = async ({
  theme_id,
  game_name,
  player_id,
  points = 0,
}) => {
  const response = await api.post('/game/create', {
    theme_id,
    game_name,
    player_id,
    points,
  });

  return response.data;
};

export const getRoom = async (game_id) => {
  const response = await api.get(`/game/${game_id}`);

  return response.data;
};
