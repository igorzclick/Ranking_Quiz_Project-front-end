import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { createTheme, getThemeById, updateTheme } from '../../apis/theme';

// Valores padrão por dificuldade
const DEFAULT_POINTS = {
  easy: 5,
  medium: 10,
  hard: 20,
};

const DEFAULT_HINT_COST = {
  easy: 5,
  medium: 10,
  hard: 20,
};

export const CreateAndUpdateThemeView = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState({
    descricao: '',
    alternativas: Array(5).fill({ texto: '', correta: false }),
    dificuldade: 'easy',
    dica: '',
    custoDica: DEFAULT_HINT_COST.easy,
    pontos: DEFAULT_POINTS.easy,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { themeId } = useParams();

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

  // Atualiza dificuldade e ajusta valores padrão
  const handleDificuldadeChange = (dificuldade) => {
    setNovaPergunta({
      ...novaPergunta,
      dificuldade,
      pontos: DEFAULT_POINTS[dificuldade],
      custoDica: DEFAULT_HINT_COST[dificuldade],
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
      dificuldade: 'easy',
      dica: '',
      custoDica: DEFAULT_HINT_COST.easy,
      pontos: DEFAULT_POINTS.easy,
    });
    toaster.success({ title: 'Pergunta adicionada!' });
  };

  const handleDeletePergunta = (index) => {
    setPerguntas((prev) => prev.filter((_, i) => i !== index));
  };

  // Submeter formulário
  const handleSubmit = async () => {
    setLoading(true);

    if (themeId) {
      updateTheme({
        id: themeId,
        name: titulo,
        description: descricao,
          questions: perguntas.map((pergunta) => ({
            text: pergunta.descricao,
            difficulty: pergunta.dificuldade,
            explanation: pergunta.dica || undefined,
            points: Number(pergunta.pontos) || DEFAULT_POINTS[pergunta.dificuldade] || DEFAULT_POINTS.easy,
            hint: pergunta.dica || undefined,
            hint_cost: pergunta.dica ? (Number(pergunta.custoDica) || DEFAULT_HINT_COST[pergunta.dificuldade] || DEFAULT_HINT_COST.easy) : undefined,
            answers: pergunta.alternativas.map((alternativa, index) => ({
              text: alternativa.texto,
              is_correct: alternativa.correta,
              order: index + 1,
            })),
          })),
      })
        .then(() => {
          setLoading(false);
          toaster.success({ title: 'Tema atualizado com sucesso!' });
        })
        .catch(() => {
          toaster.error({
            title: 'Erro ao atualizar tema',
            description: 'Tente novamente',
          });
        });
    } else {
      createTheme({
        name: titulo,
        description: descricao,
          questions: perguntas.map((pergunta) => ({
            text: pergunta.descricao,
            difficulty: pergunta.dificuldade,
            explanation: pergunta.dica || undefined,
            points: Number(pergunta.pontos) || DEFAULT_POINTS[pergunta.dificuldade] || DEFAULT_POINTS.easy,
            hint: pergunta.dica || undefined,
            hint_cost: pergunta.dica ? (Number(pergunta.custoDica) || DEFAULT_HINT_COST[pergunta.dificuldade] || DEFAULT_HINT_COST.easy) : undefined,
            answers: pergunta.alternativas.map((alternativa, index) => ({
              text: alternativa.texto,
              is_correct: alternativa.correta,
              order: index + 1,
            })),
          })),
      })
        .then(() => {
          setLoading(false);
          toaster.success({ title: 'Tema cadastrado com sucesso!' });
        })
        .catch(() => {
          toaster.error({
            title: 'Erro ao cadastrar tema',
            description: 'Tente novamente',
          });
        });
    }

    navigate('/themes');
  };

  useEffect(() => {
    if (themeId) {
      getThemeById(themeId)
        .then((response) => {
          setTitulo(response.name);
          setDescricao(response.description);
          setPerguntas(
            response.questions.map((pergunta) => ({
              descricao: pergunta.text,
              dificuldade: pergunta.difficulty,
              dica: pergunta.hint || pergunta.explanation || '',
              custoDica: pergunta.hint_cost ?? DEFAULT_HINT_COST[pergunta.difficulty] ?? DEFAULT_HINT_COST.easy,
              pontos: pergunta.points ?? DEFAULT_POINTS[pergunta.difficulty] ?? DEFAULT_POINTS.easy,
              alternativas: pergunta.answers.map((alternativa) => ({
                texto: alternativa.text,
                correta: alternativa.is_correct,
              })),
            }))
          );
        })
        .catch((error) => {
          toaster.error({
            title: 'Erro ao buscar tema',
            description: error.response?.data?.message || 'Tente novamente',
          });
        });
    }
  }, [themeId]);

  return (
    <Box p={8} width={'100%'}>
      <Button onClick={handleVoltar} variant='plain'>
        <IoIosArrowBack /> Voltar
      </Button>
      <Center width={'100%'}>
        <Text fontSize='3xl' fontWeight='bold'>
          {themeId ? 'Atualizar Tema' : 'Cadastrar Novo Tema'}
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
          
          <HStack mb={3} spacing={3}>
            <Box flex={1}>
              <Textarea
                placeholder='Dica da pergunta (opcional)'
                value={novaPergunta.dica}
                onChange={(e) =>
                  setNovaPergunta({ ...novaPergunta, dica: e.target.value })
                }
                maxLength={200}
              />
            </Box>
            <Box width='150px'>
              <Text fontSize='sm' mb={1} color='gray.400'>
                Custo da dica (moedas)
              </Text>
              <Input
                type='number'
                value={novaPergunta.custoDica}
                onChange={(e) =>
                  setNovaPergunta({
                    ...novaPergunta,
                    custoDica: Number(e.target.value) || 0,
                  })
                }
                min={0}
              />
            </Box>
          </HStack>

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
          <Text mt={4} fontWeight='medium' mb={2}>
            Dificuldade:
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={novaPergunta.dificuldade}
              onChange={(e) => handleDificuldadeChange(e.target.value)}>
              <option value='easy'>Fácil - 5 pontos</option>
              <option value='medium'>Médio - 10 pontos</option>
              <option value='hard'>Difícil - 20 pontos</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          
          <Box mt={2} p={2} bg='gray.800' borderRadius='md'>
            <Text fontSize='sm' color='gray.300'>
              Pontos da pergunta: <Text as='span' fontWeight='bold'>{novaPergunta.pontos}</Text> (padrão para {novaPergunta.dificuldade === 'easy' ? 'Fácil' : novaPergunta.dificuldade === 'medium' ? 'Médio' : 'Difícil'})
            </Text>
            {novaPergunta.dica && (
              <Text fontSize='sm' color='gray.300' mt={1}>
                Custo da dica: <Text as='span' fontWeight='bold'>{novaPergunta.custoDica}</Text> moedas (padrão para {novaPergunta.dificuldade === 'easy' ? 'Fácil' : novaPergunta.dificuldade === 'medium' ? 'Médio' : 'Difícil'})
              </Text>
            )}
          </Box>

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

export default CreateAndUpdateThemeView;
