import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  Center,
  HStack,
  RadioGroup,
  Stack,
  Text,
  Dialog,
} from '@chakra-ui/react';
import { getRoom as getGame, playTurn, finishGame, getHint } from '../../apis/game';
import { toaster } from '../../components/ui/toaster';
import { Tooltip } from '../../components/ui/tooltip';
import { FiZap } from 'react-icons/fi';

// Valores padrão de custo de dica por dificuldade
const DEFAULT_HINT_COST = {
  easy: 5,
  medium: 10,
  hard: 20,
};

export const GamePlayView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null); // { game, theme }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // question_id -> answer_id
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState(
    () => JSON.parse(localStorage.getItem('player') || '{}')?.coins ?? 0
  );
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);

  const questions = useMemo(() => gameData?.theme?.questions || [], [gameData]);
  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  
  // Calcula o custo da dica (usa valor padrão se não tiver definido)
  const hintCost = useMemo(() => {
    if (!currentQuestion) return 0;
    return currentQuestion.hint_cost ?? DEFAULT_HINT_COST[currentQuestion.difficulty] ?? DEFAULT_HINT_COST.easy;
  }, [currentQuestion]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGame(Number(gameId));
        setGameData(data);
      } catch (err) {
        toaster.error({
          title: 'Erro ao carregar jogo',
          description: err?.response?.data?.message || 'Tente novamente',
        });
      }
    };

    if (!gameId) return;
    load();
  }, [gameId]);

  const handleAnswer = async (answerId) => {
    if (!currentQuestion) return;
    setLoading(true);
    try {
      const result = await playTurn({
        game_id: Number(gameId),
        question_id: currentQuestion.id,
        answer_id: answerId,
      });
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
      if (result?.player_coins != null) {
        setCoins(result.player_coins);
        const stored = JSON.parse(localStorage.getItem('player') || '{}');
        localStorage.setItem(
          'player',
          JSON.stringify({ ...stored, coins: result.player_coins })
        );
      }

      if (currentIndex + 1 < total) {
        setCurrentIndex((idx) => idx + 1);
        setHint(null);
      }

      if (currentIndex + 1 === total) {
        await handleFinish();
      }
    } catch (err) {
      toaster.error({
        title: 'Erro ao enviar resposta',
        description: err?.response?.data?.message || 'Tente novamente',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const result = await finishGame(Number(gameId));
      navigate(`/game/${gameId}/result`, { state: { result } });
    } catch (err) {
      toaster.error({
        title: 'Erro ao finalizar',
        description:
          err?.response?.data?.message || 'Responda todas as perguntas',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (!currentQuestion) return;
    setShowHintDialog(true);
  };

  const confirmHintPurchase = async () => {
    if (!currentQuestion) return;
    setShowHintDialog(false);
    setHintLoading(true);
    try {
      const data = await getHint({
        game_id: Number(gameId),
        question_id: currentQuestion.id,
      });
      setHint(data.hint);
      if (data?.remaining_coins != null) {
        setCoins(data.remaining_coins);
        const stored = JSON.parse(localStorage.getItem('player') || '{}');
        localStorage.setItem(
          'player',
          JSON.stringify({ ...stored, coins: data.remaining_coins })
        );
      }
      toaster.success({
        title: 'Dica liberada',
        description: `Você gastou ${data.cost} moedas para ver a dica.`,
      });
    } catch (err) {
      toaster.error({
        title: 'Não foi possível obter a dica',
        description:
          err?.response?.data?.message ||
          'Verifique seu saldo de moedas e tente novamente.',
      });
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <Center w='100%' h='100vh'>
      <Card.Root width='720px'>
        <Card.Body gap='4'>
          <HStack justifyContent='space-between'>
            <Stack spacing={0}>
              <Text fontWeight='bold'>{gameData?.game?.game_name}</Text>
              <Text fontSize='sm' color='gray.400'>
                Moedas: {coins}
              </Text>
            </Stack>
            <Text>
              {currentIndex + 1}/{total}
            </Text>
          </HStack>

          {currentQuestion ? (
            <Stack gap='3'>
              <Text fontSize='lg' fontWeight='medium'>
                {currentQuestion.text}
              </Text>

              {currentQuestion.hint && (
                <HStack justifyContent='flex-start' spacing={3}>
                  <Button
                    size='sm'
                    variant='ghost'
                    leftIcon={<FiZap />}
                    onClick={handleRequestHint}
                    isLoading={hintLoading}
                    disabled={hintLoading || coins < hintCost}>
                    Ver dica ({hintCost} moedas)
                  </Button>
                  {hint && (
                    <Box
                      px={3}
                      py={2}
                      borderRadius='md'
                      bg='gray.800'
                      fontSize='sm'>
                      {hint}
                    </Box>
                  )}
                </HStack>
              )}

              <Dialog.Root open={showHintDialog} onOpenChange={(e) => setShowHintDialog(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Confirmar compra de dica</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Stack spacing={3}>
                        <Text>
                          Esta dica custa <Text as='span' fontWeight='bold'>{hintCost} moedas</Text>.
                        </Text>
                        <Text>
                          Seu saldo atual: <Text as='span' fontWeight='bold'>{coins} moedas</Text>.
                        </Text>
                        {coins < hintCost && (
                          <Text color='red.400' fontSize='sm'>
                            Saldo insuficiente! Você precisa de {hintCost - coins} moedas a mais.
                          </Text>
                        )}
                      </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <HStack spacing={2}>
                        <Button
                          variant='ghost'
                          onClick={() => setShowHintDialog(false)}>
                          Cancelar
                        </Button>
                        <Button
                          colorScheme='blue'
                          onClick={confirmHintPurchase}
                          disabled={coins < hintCost}
                          isLoading={hintLoading}>
                          Confirmar compra
                        </Button>
                      </HStack>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Dialog.Root>

              <Stack gap='2'>
                {(currentQuestion.answers || []).map((ans) => (
                  <Button
                    key={ans.id}
                    onClick={() => handleAnswer(ans.id)}
                    variant={
                      answers[currentQuestion.id] === ans.id
                        ? 'surface'
                        : 'subtle'
                    }
                    isLoading={loading}
                    disabled={loading}>
                    {ans.text}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Text>Carregando pergunta...</Text>
          )}
        </Card.Body>
      </Card.Root>
    </Center>
  );
};
