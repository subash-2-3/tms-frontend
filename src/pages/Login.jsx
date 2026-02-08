import { Container, Title, Text, Center, Box } from '@mantine/core';
import LoginForm from '../components/Auth/LoginForm';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is already logged in, don't show the login page, go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box 
      style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center' 
      }}
    >
      <Container size={420} my={40}>
        <Title
          textAlign="center"
          style={{ fontFamily: 'Greycliff CF, sans-serif', fontWeight: 900 }}
        >
          Welcome Back!
        </Title>
        <Text c="dimmed" size="sm" textAlign="center" mt={5}>
          Task Management System Admin
        </Text>

        <LoginForm />
      </Container>
    </Box>
  );
};

export default Login;