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
} from '@chakra-ui/react';
import { getRoom as getGame, playTurn, finishGame } from '../../apis/game';
import { toaster } from '../../components/ui/toaster';

export const GamePlayView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null); // { game, theme }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // question_id -> answer_id
  const [loading, setLoading] = useState(false);

  const questions = useMemo(() => gameData?.theme?.questions || [], [gameData]);
  const total = questions.length;
  const currentQuestion = questions[currentIndex];

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
      await playTurn({
        game_id: Number(gameId),
        question_id: currentQuestion.id,
        answer_id: answerId,
      });
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
      if (currentIndex + 1 < total) {
        setCurrentIndex((idx) => idx + 1);
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

  return (
    <Center w='100%' h='100vh'>
      <Card.Root width='720px'>
        <Card.Body gap='4'>
          <HStack justifyContent='space-between'>
            <Text fontWeight='bold'>{gameData?.game?.game_name}</Text>
            <Text>
              {currentIndex + 1}/{total}
            </Text>
          </HStack>

          {currentQuestion ? (
            <Stack gap='3'>
              <Text fontSize='lg' fontWeight='medium'>
                {currentQuestion.text}
              </Text>
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
