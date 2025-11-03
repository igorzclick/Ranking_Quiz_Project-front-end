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
  Input,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import { deleteTheme, getThemes } from '../../apis/theme';
import { createRoom } from '../../apis/game';

export const ListThemesView = () => {
  const [mostrarMeusTemas, setMostrarMeusTemas] = useState(false);
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [roomTitle, setRoomTitle] = useState('');

  const navigate = useNavigate();
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const cardText = useColorModeValue('white', 'whiteAlpha.900');

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const data = await getThemes();
      setTemas(data?.themes || []);
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
  const userId = JSON.parse(localStorage.getItem('player'))?.id;
  const temasFiltrados = mostrarMeusTemas
    ? temas?.filter((t) => t.created_by === userId)
    : temas;

  const handleCadastrarTema = () => navigate('/themes/create');
  const handleVoltar = () => {
    navigate('/');
  };

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

  const handleStartGame = (tema) => {
    setSelectedTheme(tema);
  };

  const handleCreateRoom = () => {
    if (!roomTitle.trim()) {
      toaster.error({ title: 'Informe o título da sala' });
      return;
    }
    const room = {
      theme_id: selectedTheme.id,
      game_name: roomTitle.trim(),
      player_id: userId,
      points: 0,
    };

    createRoom(room).then((data) => {
      navigate(`/room/${data.game.id}`);
    });
  };

  useEffect(() => {
    fetchThemes();
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
        </VStack>
        <Button onClick={handleCadastrarTema}>
          <IoAddCircleOutline /> Cadastrar Novo Tema
        </Button>
      </Box>

      {selectedTheme && (
        <Box mb={6} p={4} borderRadius='md' bg={cardBg} shadow='md'>
          <VStack align='stretch' spacing={3}>
            <Text fontWeight='bold'>Criar sala para: {selectedTheme.name}</Text>
            <Input
              placeholder='Título da sala'
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
            />
            <HStack>
              <Button onClick={() => setSelectedTheme(null)} variant='outline'>
                Cancelar
              </Button>
              <Button colorScheme='purple' onClick={handleCreateRoom}>
                Criar sala
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

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

            <HStack mt={4} spacing={2} wrap={'wrap'}>
              <Button colorScheme='teal' onClick={() => handleStartGame(tema)}>
                Jogar
              </Button>
              {tema.created_by === userId && (
                <Button
                  onClick={() => navigate(`/themes/update/${tema.id}`)}
                  variant='outline'>
                  Editar
                </Button>
              )}

              {tema.created_by === userId && (
                <Button
                  onClick={() => handleDeleteTheme(tema.id)}
                  variant='outline'
                  colorScheme='red'>
                  Excluir
                </Button>
              )}
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
