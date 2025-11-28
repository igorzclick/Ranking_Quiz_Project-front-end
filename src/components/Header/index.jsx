import { Box, Button, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const Header = () => {
  const player = JSON.parse(localStorage.getItem('player') || '{}');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('player');
    window.location.reload();
  };
  return (
    <Box
      width={'100%'}
      display={'flex'}
      justifyContent={'space-between'}
      my={4}
      alignItems={'center'}>
      <HStack spacing={4}>
        <Text>{player.username}</Text>
        <Text fontWeight='medium'>Moedas: {player.coins ?? 0}</Text>
      </HStack>
      <Button onClick={handleLogout} variant={'plain'}>
        Sair
      </Button>
    </Box>
  );
};
