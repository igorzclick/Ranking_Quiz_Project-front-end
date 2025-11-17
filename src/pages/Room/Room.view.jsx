import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Card } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { getRoom, startGame, playTurn, finishGame } from '../../apis/game';

export const RoomView = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState();
  const [started, setStarted] = useState(false);
  const [answeredMap, setAnsweredMap] = useState({});
  const [result, setResult] = useState();

  const fetchGame = () => {
    getRoom(roomId).then((data) => {
      setRoom(data);
    });
  };

  useEffect(() => {
    fetchGame();
  }, []);

  return (
    <VStack align='stretch' spacing={6} p={4} w='100%'>
      <HStack justify='space-between'>
        <Text fontSize='2xl' fontWeight='bold'>
          Sala de Jogo
        </Text>
        <Button variant='outline' onClick={() => navigate('/themes')}>
          Trocar tema
        </Button>
      </HStack>

      {!room ? (
        <Box>
          <Text>Não encontramos informações da sala.</Text>
          <Button mt={3} onClick={() => navigate('/themes')}>
            Voltar para temas
          </Button>
        </Box>
      ) : (
        <Box p={4} borderRadius='md' bg='gray.700' shadow='md'>
          <VStack align='start' spacing={2}>
            <Text>
              <b>Título:</b> {room.game.game_name}
            </Text>
            <Text>
              <b>Tema:</b> {room.theme.name}
            </Text>
          </VStack>
          <HStack mt={4} spacing={3}>
            <Button
              colorScheme='purple'
              onClick={() => {
                startGame(room.game.id).then(() => setStarted(true));
              }}
              isDisabled={started || room.game.status === 'active' || room.game.status === 'completed'}
            >
              Iniciar jogo
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                finishGame(room.game.id)
                  .then((data) => {
                    setResult(data);
                    // refresh room to reflect completed status and points
                    fetchGame();
                  })
                  .catch(() => {});
              }}
              isDisabled={!started || room.game.status === 'completed'}
            >
              Finalizar partida
            </Button>
          </HStack>

          <Box my={4} borderTopWidth='1px' borderColor='gray.600' />

          <VStack align='stretch' spacing={3}>
            {room.theme.questions?.map((q) => (
              <Card.Root key={q.id} p={3}>
                <Text fontWeight='bold'>Pergunta: {q.text}</Text>
                <HStack wrap={'wrap'} spacing={2} mt={2}>
                  {q.answers.map((ans) => {
                    const answered = !!answeredMap[q.id];
                    return (
                      <Button
                        key={ans.id}
                        size='sm'
                        onClick={() => {
                          playTurn({
                            game_id: room.game.id,
                            question_id: q.id,
                            answer_id: ans.id,
                          })
                            .then((data) => {
                              setAnsweredMap((prev) => ({ ...prev, [q.id]: data }));
                              fetchGame();
                            })
                            .catch(() => {});
                        }}
                        isDisabled={!started || answered}
                        variant={answered ? 'outline' : 'solid'}
                      >
                        {ans.text}
                      </Button>
                    );
                  })}
                </HStack>
                {answeredMap[q.id] && (
                  <Text mt={2} color={answeredMap[q.id].answer.is_correct ? 'green.300' : 'red.300'}>
                    {answeredMap[q.id].answer.is_correct ? 'Acertou!' : 'Errou!'}
                    {' '}Pontos: {answeredMap[q.id].game_points}
                  </Text>
                )}
              </Card.Root>
            ))}
          </VStack>

          {result && (
            <Box mt={4} p={3} borderRadius='md' bg='gray.800'>
              <Text fontSize='lg' fontWeight='bold'>Resultado da Partida</Text>
              <Text>Acertos: {result.correct} | Erros: {result.wrong}</Text>
              <Text>Pontuação final: {result.final_points}</Text>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
};
