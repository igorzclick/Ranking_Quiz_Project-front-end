import {
  Box,
  Button,
  Checkbox,
  Field,
  HStack,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router';

const temas = [
  {
    id: 1,
    nome: 'História',
    descricao: 'Perguntas sobre eventos históricos',
    meuTema: true,
  },
  {
    id: 2,
    nome: 'Ciência',
    descricao: 'Perguntas sobre biologia, química e física',
    meuTema: false,
  },
  {
    id: 3,
    nome: 'Geografia',
    descricao: 'Perguntas sobre países, cidades e mapas',
    meuTema: true,
  },
  {
    id: 4,
    nome: 'Entretenimento',
    descricao: 'Filmes, séries e música',
    meuTema: false,
  },
];

export const ListThemesView = () => {
  const [mostrarMeusTemas, setMostrarMeusTemas] = useState(false);
  const navigate = useNavigate();

  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const cardText = useColorModeValue('white', 'whiteAlpha.900');

  const temasFiltrados = mostrarMeusTemas
    ? temas.filter((tema) => tema.meuTema)
    : temas;

  const handleCadastrarTema = () => {
    navigate('/themes/create');
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  return (
    <Box p={8} minH='100vh' bg='gray.900'>
      {/* Header */}
      <HStack justifyContent='space-between' mb={6}>
        <Button onClick={handleVoltar} variant='plain'>
          <IoIosArrowBack /> Voltar
        </Button>
        <Text fontSize='3xl' fontWeight='bold' color='whiteAlpha.900'>
          Lista de Temas
        </Text>
        <Button onClick={handleCadastrarTema}>
          <IoAddCircleOutline /> Cadastrar Novo Tema
        </Button>
      </HStack>

      <Field.Root mb={6}>
        <Switch.Root
          name='myThemes'
          checked={mostrarMeusTemas}
          onCheckedChange={({ checked }) => setMostrarMeusTemas(checked)}>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Mostrar apenas meus temas</Switch.Label>
        </Switch.Root>
      </Field.Root>

      {/* Listagem de temas */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
        {temasFiltrados.map((tema) => (
          <Box
            key={tema.id}
            bg={cardBg}
            borderRadius='md'
            shadow='md'
            p={5}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            _hover={{ shadow: 'lg' }}>
            <VStack align='start' spacing={3}>
              <Text fontSize='xl' fontWeight='bold' color={cardText}>
                {tema.nome}
              </Text>
              <Text fontSize='sm' color='gray.300'>
                {tema.descricao}
              </Text>
            </VStack>

            <HStack mt={4} spacing={2}>
              <Button colorScheme='teal'>Selecionar</Button>
              {tema.meuTema && <Button variant={'outline'}>Editar</Button>}
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
