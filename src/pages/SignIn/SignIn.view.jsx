import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Input,
  Stack,
  Center,
  Toast,
  Field,
  Text,
} from '@chakra-ui/react';
import { loginPlayer, isAuthenticated } from '../../apis/login';
import { Link, useNavigate } from 'react-router';
import { toaster } from '../../components/ui/toaster';
import { Link as ChakraLink } from '@chakra-ui/react';
import logo from '../../assets/logo.png';

export const SignInView = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    nickname: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // redireciona se tiver autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    let errors = {};
    if (!formData.nickname) {
      errors.nickname = 'Nickname é obrigatório';
    }
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await loginPlayer({ ...formData });
      localStorage.setItem('token', data.access_token);
      toaster.success({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });
      navigate('/');
    } catch (err) {
      toaster.error({
        title: 'Erro ao realizar login',
        description:
          err?.response?.data?.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center w='100%' h='100vh'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
        <Card.Root width='520px'>
          <Card.Body gap='4'>
            <Center w='100%'>
              <img src={logo} style={{ width: '100px', objectFit: 'cover' }} />
            </Center>

            <Card.Title>Login</Card.Title>

            <Stack gap='2'>
              <Field.Root invalid={!!errors.nickname}>
                <Field.Label>Nickname</Field.Label>
                <Input
                  placeholder='Insira seu nickname'
                  onChange={(e) => {
                    setErrors({ ...errors, nickname: '' });
                    setFormData({ ...formData, nickname: e.target.value });
                  }}
                />
                {errors.nickname && (
                  <Field.ErrorText>{errors.nickname}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Senha</Field.Label>
                <Input
                  placeholder='Insira sua senha'
                  type='password'
                  onChange={(e) => {
                    setErrors({ ...errors, password: '' });
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password}</Field.ErrorText>
                )}
              </Field.Root>
            </Stack>
            <Text>
              Ainda não possui uma conta?{' '}
              <ChakraLink asChild>
                <Link to='/register'>Crie uma conta aqui</Link>
              </ChakraLink>
            </Text>
          </Card.Body>

          <Card.Footer flex flexDirection={'column'} gap='2'>
            <Button
              type='submit'
              width={'100%'}
              isLoading={isLoading}
              disabled={isLoading}>
              Entrar
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </Center>
  );
};
