import React, { useMemo } from 'react';
import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';

export const RoomView = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const room = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('currentRoom'));
      if (stored && stored.id === roomId) return stored;
    } catch {}
    return null;
  }, [roomId]);

  return (
    <VStack align='stretch' spacing={6} p={4} w='100%'>
      <HStack justify='space-between'>
        <Text fontSize='2xl' fontWeight='bold'>Sala de Jogo</Text>
        <Button variant='outline' onClick={() => navigate('/themes')}>Trocar tema</Button>
      </HStack>

      {!room ? (
        <Box>
          <Text>Não encontramos informações da sala.</Text>
          <Button mt={3} onClick={() => navigate('/themes')}>Voltar para temas</Button>
        </Box>
      ) : (
        <Box p={4} borderRadius='md' bg='gray.700' shadow='md'>
          <VStack align='start' spacing={2}>
            <Text><b>Título:</b> {room.title}</Text>
            <Text><b>Tema:</b> {room.themeName}</Text>
            <Text><b>Criada em:</b> {new Date(room.createdAt).toLocaleString()}</Text>
          </VStack>
          <HStack mt={4}>
            <Button colorScheme='purple' onClick={() => navigate('/')}>Iniciar (placeholder)</Button>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};


