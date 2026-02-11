import { TextInput, PasswordInput, Button, Card, Title, Text, Container, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import apiClient from '../../services/api';
import useAuthStore from '../../store/authStore';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', values);
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Save to Zustand store (and localStorage via middleware)
      setAuth(user || { email: values.email }, accessToken, refreshToken);
      
      notifications.show({
        title: 'Login Successful',
        message: 'Welcome back to the TMS Admin panel',
        color: 'green',
      });
      
      navigate('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid credentials. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email Address"
          placeholder="admin@test.com"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Sign In
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;