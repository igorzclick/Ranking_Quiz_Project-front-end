import React from 'react';
import {
  Button,
  Center,
  Card,
  Text,
  Container,
  Box,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

export const HomeView = () => {
  const navigate = useNavigate();

  return (
    <Center h='100vh' w='100%' flexDirection='column'>
      <Center w='100%'>
        <Text fontSize={'3xl'}>Bem-vindo ao Think Fast</Text>
      </Center>
      <Center w='100%'>
        <Text fontSize={'medium'}>Escolha uma opção abaixo</Text>
      </Center>

      <Box
        // minH='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        p={4}
        gap={4}>
        <Button
          w='300px'
          h='150px'
          fontSize='xl'
          borderRadius='md'
          variant={'subtle'}>
          Jogar
        </Button>

        <Button
          w='300px'
          h='150px'
          fontSize='xl'
          borderRadius='md'
          variant={'subtle'}
          onClick={() => navigate('/themes')}>
          Temas
        </Button>
      </Box>
    </Center>
  );
};
