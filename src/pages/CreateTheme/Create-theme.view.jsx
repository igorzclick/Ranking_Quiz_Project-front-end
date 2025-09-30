import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  Text,
  HStack,
  NativeSelect,
  Card,
  Center,
  RadioGroup,
} from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import { useNavigate } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { createTheme } from '../../apis/theme';

export const CreateThemeView = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState({
    descricao: '',
    alternativas: Array(5).fill({ texto: '', correta: false }),
    dificuldade: 'facil',
  });
  const [loading, setLoading] = useState(false);

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

    setPerguntas([...perguntas, novaPergunta]);
    setNovaPergunta({
      descricao: '',
      alternativas: Array(5).fill({ texto: '', correta: false }),
      dificuldade: 'facil',
    });
    toaster.success({ title: 'Pergunta adicionada!' });
  };

  const handleDeletePergunta = (index) => {
    setPerguntas((prev) => prev.filter((_, i) => i !== index));
  };

  // Submeter formulário
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await createTheme({
        name: titulo,
        description: descricao,
        perguntas,
      });

      toaster.success({ title: 'Tema cadastrado com sucesso!' });
      console.log('Tema criado:', response);

      navigate('/themes');
    } catch (error) {
      toaster.error({
        title: 'Erro ao salvar tema',
        description: error.response?.data?.message || 'Tente novamente',
      });
    } finally {
      setLoading(false);
    }
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
          maxLength={50}
        />
        <Textarea
          placeholder='Descrição do tema'
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={255}
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
            maxLength={100}
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
                    maxLength={100}
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

        <Button onClick={handleSubmit} isLoading={loading} colorScheme='green'>
          {loading ? 'Salvando...' : 'Salvar Tema'}
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateThemeView;
