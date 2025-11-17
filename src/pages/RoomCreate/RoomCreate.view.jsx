import React, { useEffect, useState } from 'react';
import { Box, Card, Center, Button, Field, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import { getThemes } from '../../apis/theme';
import { createRoom as createGame, startGame, getRoom as getGame } from '../../apis/game';

export const RoomCreateView = () => {
  const [title, setTitle] = useState('');
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [createdGame, setCreatedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const data = await getThemes();
        setThemes(data.themes || []);
        if ((data.themes || []).length > 0) {
          setSelectedThemeId(String(data.themes[0].id));
        }
      } catch (err) {
        toaster.error({ title: 'Erro ao carregar temas', description: err?.response?.data?.message || 'Tente novamente' });
      }
    };
    loadThemes();
  }, []);

  const handleCreateRoom = async () => {
    const player = JSON.parse(localStorage.getItem('player') || '{}');
    if (!title || !selectedThemeId) {
      toaster.error({ title: 'Preencha os campos', description: 'Informe o título e selecione um tema.' });
      return;
    }
    if (!player?.id) {
      toaster.error({ title: 'Usuário não autenticado', description: 'Faça login novamente.' });
      return;
    }
    setLoading(true);
    try {
      const data = await createGame({
        theme_id: Number(selectedThemeId),
        game_name: title,
        player_id: player.id,
        points: 0,
      });
      const game = data.game || data?.game;
      setCreatedGame(game);
      toaster.success({ title: 'Sala criada', description: 'Você pode iniciar o jogo agora.' });
    } catch (err) {
      toaster.error({ title: 'Erro ao criar sala', description: err?.response?.data?.message || 'Tente novamente' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!createdGame?.id) return;
    setLoading(true);
    try {
      await startGame(createdGame.id);
      // Opcional: buscar game para garantir dados atualizados
      await getGame(createdGame.id);
      navigate(`/game/${createdGame.id}/play`);
    } catch (err) {
      toaster.error({ title: 'Não foi possível iniciar o jogo', description: err?.response?.data?.message || 'Tente novamente' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center w="100%" h="100vh">
      <Card.Root width="640px">
        <Card.Body gap="4">
          <Card.Title>Criar Sala</Card.Title>
          <Card.Description>Defina um título e escolha o tema.</Card.Description>
          <Stack gap="3">
            <Field.Root>
              <Field.Label>Título da sala</Field.Label>
              <Input placeholder="Ex: Sala do João" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field.Root>
            <Field.Root>
              <Field.Label>Tema</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field value={selectedThemeId} onChange={(e) => setSelectedThemeId(e.target.value)}>
                  {(themes || []).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer flex gap="3">
          <Button onClick={handleCreateRoom} isLoading={loading} disabled={loading}>Criar sala</Button>
          <Button onClick={handleStartGame} variant="subtle" disabled={!createdGame?.id || loading}>Iniciar jogo</Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};