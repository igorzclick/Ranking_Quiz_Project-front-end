import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box, Button, Card, Center, HStack, Stack, Text } from '@chakra-ui/react';

export const GameResultView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const result = state?.result || {};

  const summary = result?.summary || [];
  const finalPoints = result?.final_points || 0;
  const correct = result?.correct || 0;
  const wrong = result?.wrong || 0;
  const total = result?.total_questions || summary.length;

  return (
    <Center w="100%" h="100vh">
      <Card.Root width="800px">
        <Card.Body gap="4">
          <HStack justifyContent="space-between">
            <Text fontWeight="bold">Resultados da Partida</Text>
            <Text>Pontos: {finalPoints}</Text>
          </HStack>

          <Text>Acertos: {correct} • Erros: {wrong} • Total: {total}</Text>

          <Stack gap="3">
            {summary.map((item) => (
              <Box key={item.question_id} p="3" borderWidth="1px" borderRadius="md">
                <Text fontWeight="medium">{item.question_text}</Text>
                <Text color={item.is_correct ? 'green.500' : 'red.500'}>
                  {item.is_correct ? 'Resposta correta' : 'Resposta errada'} • Pontos: {item.points_awarded}
                </Text>
              </Box>
            ))}
          </Stack>
        </Card.Body>
        <Card.Footer>
          <HStack justifyContent="flex-end" w="100%">
            <Button variant="subtle" onClick={() => navigate('/')}>Voltar ao início</Button>
          </HStack>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};