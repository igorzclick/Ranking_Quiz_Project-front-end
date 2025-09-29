import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  Text,
  Select,
  HStack,
  RadioGroup,
  Toast,
  NativeSelect,
  Card,
  Center,
} from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import { useNavigate } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

export const CreateThemeView = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState({
    descricao: '',
    alternativas: Array(5).fill({ texto: '', correta: false }),
    dificuldade: 'facil',
  });

  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate(-1);
  };

  // Atualiza texto da alternativa
  const handleAlternativaChange = (index, value) => {
    setNovaPergunta((prev) => {
      const alternativas = [...prev.alternativas];
      alternativas[index] = { ...alternativas[index], texto: value };
      return { ...prev, alternativas };
    });
  };

  // Define qual alternativa é correta
  const handleAlternativaCorreta = (index) => {
    setNovaPergunta((prev) => {
      const alternativas = prev.alternativas.map((alt, i) => ({
        ...alt,
        correta: i === index,
      }));
      return { ...prev, alternativas };
    });
  };

  // Adiciona pergunta à lista
  const adicionarPergunta = () => {
    if (!novaPergunta.descricao.trim()) {
      toaster.error({ title: 'Descrição obrigatória' });
      return;
    }
    if (!novaPergunta.alternativas.every((a) => a.texto.trim())) {
      toaster.error({ title: 'Preencha todas as alternativas' });
      return;
    }
    if (!novaPergunta.alternativas.some((a) => a.correta)) {
      toaster.error({ title: 'Selecione a alternativa correta' });
      return;
    }
    const dificuldade = novaPergunta.dificuldade;
    const perguntasFiltradas = perguntas.filter(
      (p) => p.dificuldade === dificuldade
    );

    if (perguntasFiltradas.length >= 8) {
      toaster.error({
        title: 'Limite de perguntas atingido para essa dificuldade',
      });
      return;
    }

    setPerguntas([...perguntas, novaPergunta]);
    setNovaPergunta({
      descricao: '',
      alternativas: Array(5).fill({ texto: '' }),
      dificuldade: 'facil',
    });
    toaster.success({ title: 'Pergunta adicionada!' });
  };

  const handleDeletePergunta = (index) => {
    setPerguntas((prev) => prev.filter((_, i) => i !== index));
  };

  // Validação das quantidades
  const validarQuantidade = () => {
    const faceis = perguntas.filter((p) => p.dificuldade === 'facil').length;
    const medias = perguntas.filter((p) => p.dificuldade === 'media').length;
    const dificeis = perguntas.filter(
      (p) => p.dificuldade === 'dificil'
    ).length;

    return faceis === 8 && medias === 8 && dificeis === 4;
  };

  // Submeter formulário
  const handleSubmit = () => {
    if (!validarQuantidade()) {
      toaster.error({
        title: 'Distribuição inválida',
        description: 'Necessário 8 fáceis, 8 médias e 4 difíceis',
      });
      return;
    }

    console.log({
      titulo,
      descricao,
      perguntas,
    });

    toaster.success({ title: 'Tema cadastrado com sucesso!' });
  };

  return (
    <Box p={8} width={'100%'}>
      <Button onClick={handleVoltar} variant='plain'>
        <IoIosArrowBack /> Voltar
      </Button>
      <Center width={'100%'}>
        <Text fontSize='3xl' fontWeight='bold'>
          Cadastrar Novo Tema
        </Text>
      </Center>
      <VStack spacing={6} align='stretch' maxW='800px' mx='auto' mt={4}>
        {/* Campos do tema */}
        <Input
          placeholder='Título do tema'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <Textarea
          placeholder='Descrição do tema'
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        {/* Cadastro de perguntas */}
        <Card.Root p={4}>
          <Text fontSize='lg' mb={3} fontWeight='semibold'>
            Nova Pergunta
          </Text>
          <Textarea
            placeholder='Descrição da pergunta'
            value={novaPergunta.descricao}
            onChange={(e) =>
              setNovaPergunta({ ...novaPergunta, descricao: e.target.value })
            }
            mb={3}
          />

          <Text fontWeight='medium' mb={2}>
            Alternativas:
          </Text>
          <RadioGroup.Root
            value={novaPergunta.alternativas.findIndex((a) => a.correta)}
            onValueChange={(e) => handleAlternativaCorreta(e.value)}>
            <VStack align='stretch'>
              {novaPergunta.alternativas.map((alt, i) => (
                <HStack key={i}>
                  <RadioGroup.Item value={i} isChecked={alt.correta} key={i}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Correta</RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <Input
                    placeholder={`Alternativa ${i + 1}`}
                    value={alt.texto}
                    onChange={(e) => handleAlternativaChange(i, e.target.value)}
                  />
                </HStack>
              ))}
            </VStack>
          </RadioGroup.Root>

          <Text mt={4} fontWeight='medium'>
            Dificuldade:
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={novaPergunta.dificuldade}
              onChange={(e) =>
                setNovaPergunta({
                  ...novaPergunta,
                  dificuldade: e.target.value,
                })
              }>
              <option value='facil'>Fácil</option>
              <option value='media'>Média</option>
              <option value='dificil'>Difícil</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Button mt={4} colorScheme='teal' onClick={adicionarPergunta}>
            Adicionar Pergunta
          </Button>
        </Card.Root>

        {/* Listagem de perguntas adicionadas */}
        <Box>
          <Text fontSize='lg' mb={3} fontWeight='semibold'>
            Perguntas adicionadas: {perguntas.length}
          </Text>
          {perguntas.map((p, idx) => (
            <Box
              key={idx}
              p={3}
              bg='gray.800'
              borderRadius='md'
              mb={2}
              display={'flex'}
              alignItems={'center'}>
              <Text fontWeight='bold'>
                {idx + 1}. {p.descricao} ({p.dificuldade})
              </Text>
              <Button
                onClick={() => handleDeletePergunta(idx)}
                variant={'plain'}>
                Remover
              </Button>
            </Box>
          ))}
        </Box>

        <Button onClick={handleSubmit} isDisabled={perguntas.length !== 20}>
          Salvar Tema
        </Button>
      </VStack>
    </Box>
  );
};
