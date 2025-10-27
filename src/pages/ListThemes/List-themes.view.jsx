import {
  Box,
  Button,
  Center,
  Field,
  HStack,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import { deleteTheme, getThemes } from '../../apis/theme';

export const ListThemesView = () => {
  const [mostrarMeusTemas, setMostrarMeusTemas] = useState(false);
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState(null);

  const navigate = useNavigate();
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const cardText = useColorModeValue('white', 'whiteAlpha.900');

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const data = await getThemes();
      setTemas(data.themes || []);
    } catch (error) {
      toaster.error({
        title: 'Erro ao buscar temas',
        description: error.response?.data?.message || 'Tente novamente',
      });
      setTemas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar apenas meus temas
  const userId = JSON.parse(localStorage.getItem('player')).id;
  const temasFiltrados = mostrarMeusTemas
    ? temas.filter((t) => t.created_by === userId)
    : temas;

  const handleCadastrarTema = () => navigate('/themes/create');
  const handleVoltar = () => navigate(-1);

  const handleDeleteTheme = async (id) => {
    deleteTheme(id)
      .then(() => {
        toaster.success({ title: 'Tema deletado com sucesso!' });
        fetchThemes();
      })
      .catch((error) => {
        toaster.error({
          title: 'Erro ao deletar tema',
          description: error.response?.data?.message || 'Tente novamente',
        });
      });
  };

  useEffect(() => {
    fetchThemes();
    // Retrieve game mode from localStorage
    const storedGameMode = localStorage.getItem('gameMode');
    if (storedGameMode) {
      setGameMode(JSON.parse(storedGameMode));
    }
  }, []);

  if (loading) return <Text>Carregando temas...</Text>;

  return (
    <Box>
      <Box
        justifyContent='space-between'
        mb={6}
        css={{
          display: { base: 'block', sm: 'flex' },
        }}>
        <Button onClick={handleVoltar} variant='plain'>
          <IoIosArrowBack /> Voltar
        </Button>
        <VStack spacing={1}>
          <Text fontSize='3xl' fontWeight='bold'>
            Lista de Temas
          </Text>
          {gameMode && (
            <Text fontSize='sm' color='gray.400'>
              Modo de jogo: {gameMode.name} ({gameMode.players} jogador
              {gameMode.players > 1 ? 'es' : ''})
            </Text>
          )}
        </VStack>
        <Button onClick={handleCadastrarTema}>
          <IoAddCircleOutline /> Cadastrar Novo Tema
        </Button>
      </Box>

      <Field.Root mb={6}>
        <Switch.Root
          name='myThemes'
          checked={mostrarMeusTemas}
          onCheckedChange={({ checked }) => setMostrarMeusTemas(checked)}>
          <Switch.HiddenInput />
          Mostrar apenas meus Temas
          <Switch.Control />
        </Switch.Root>
      </Field.Root>

      {temasFiltrados.length === 0 && (
        <Center width={'100%'}>
          <Text fontSize='xl' fontWeight='bold'>
            Nenhum tema encontrado
          </Text>
        </Center>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
        {temasFiltrados.map((tema) => (
          <Box
            key={tema.id}
            bg={cardBg}
            borderRadius='md'
            shadow='md'
            p={2}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            _hover={{ shadow: 'lg' }}>
            <VStack align='start' spacing={3}>
              <Text fontSize='xl' fontWeight='bold' color={cardText}>
                {tema.name}
              </Text>
              <Text fontSize='sm' color='gray.300'>
                {tema.description}
              </Text>
              <Text fontSize='sm' color='gray.300'>
                Criado por: {tema.creator}
              </Text>
            </VStack>

            <HStack mt={4} spacing={2}>
              <Button colorScheme='teal'>Jogar</Button>
              {/* {tema.created_by === userId && (
                <Button
                  onClick={() => navigate(`/themes/${tema.id}`)}
                  variant='outline'>
                  Editar
                </Button>
              )} */}

              {/* {tema.created_by === userId && (
                <Button
                  onClick={() => handleDeleteTheme(tema.id)}
                  variant='outline'
                  colorScheme='red'>
                  Excluir
                </Button>
              )} */}
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
