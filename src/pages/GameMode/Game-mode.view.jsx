import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { IoMdPeople, IoIosArrowBack } from 'react-icons/io';
import { FaCrown } from 'react-icons/fa';
import{useColorModeValue} from '../../components/ui/color-mode';

const gameModes = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'Jogue sozinho',
    players: 1,
    icon: IoMdPeople,
  },
  {
    id: 'dupla',
    name: 'Dupla',
    description: '2 jogadores',
    players: 2,
    icon: IoMdPeople,
  },
  {
    id: 'trio',
    name: 'Trio',
    description: '3 jogadores',
    players: 3,
    icon: IoMdPeople,
  },
  {
    id: 'quarteto',
    name: 'Quarteto',
    description: '4 jogadores',
    players: 4,
    icon: IoMdPeople,
  },
];

export const GameModeView = () => {
  const [selectedMode, setSelectedMode] = useState('solo');
  const navigate = useNavigate();

  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const selectedCardBg = 'purple.600';
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');

  const selectedGameMode = gameModes.find((mode) => mode.id === selectedMode);
  
  // Get player info from localStorage
  const player = JSON.parse(localStorage.getItem('player'));
  const playerName = player?.username || 'Visitante';

  const handleStartGame = () => {
    // Store game mode in localStorage or pass as state
    localStorage.setItem('gameMode', JSON.stringify(selectedGameMode));
    navigate('/themes');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <VStack spacing={8} w='100%' py={8}>
      {/* Header Section */}
      <VStack spacing={2} w='100%'>
        <HStack spacing={2}>
          <FaCrown color='#FFD700' />
          <Text fontSize='2xl' fontWeight='bold'>
            Bem-vindo, {playerName}!
          </Text>
        </HStack>
        <Text fontSize='lg' color='gray.400'>
          Quantos jogadores participarão?
        </Text>
      </VStack>

      {/* Game Mode Options */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} w='100%' maxW='600px'>
        {gameModes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;

          return (
            <Box
              key={mode.id}
              as='button'
              bg={isSelected ? selectedCardBg : cardBg}
              borderRadius='md'
              p={6}
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap={3}
              cursor='pointer'
              onClick={() => setSelectedMode(mode.id)}
              _hover={{
                bg: isSelected ? selectedCardBg : cardHoverBg,
              }}
              transition='all 0.2s'>
              <Icon size={40} color='white' />
              <VStack spacing={1}>
                <Text fontSize='xl' fontWeight='bold' color='white'>
                  {mode.name}
                </Text>
                <Text fontSize='sm' color='gray.200'>
                  {mode.description}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Action Buttons */}
      <HStack spacing={4} w='100%' maxW='600px'>
        <Button
          flex={1}
          bg='gray.700'
          color='white'
          onClick={handleBack}
          _hover={{ bg: 'gray.600' }}>
          <IoIosArrowBack /> Voltar
        </Button>
        <Button
          flex={1}
          bg='purple.600'
          color='white'
          onClick={handleStartGame}
          _hover={{ bg: 'purple.700' }}>
          Iniciar Jogo ({selectedGameMode.players} jogador
          {selectedGameMode.players > 1 ? 'es' : ''})
        </Button>
      </HStack>
    </VStack>
  );
};
