import { AppShell, Burger, Group, NavLink, Text, Button, Stack, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconDashboard, 
  IconBuildingCommunity, 
  IconUsers, 
  IconUserShield, 
  IconLogout 
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const MainLayout = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Navigation items configuration
  const navData = [
    { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: IconBuildingCommunity, label: 'Companies', path: '/companies' },
    { icon: IconUsers, label: 'Users', path: '/users' },
    { icon: IconUserShield, label: 'Roles', path: '/roles' },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* --- Header Section --- */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" fw={700} variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              TMS Admin
            </Text>
          </Group>
          
          <Button 
            variant="light" 
            color="red" 
            leftSection={<IconLogout size={16} />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      </AppShell.Header>

      {/* --- Sidebar Section --- */}
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navData.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={<item.icon size={20} stroke={1.5} />}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (opened) toggle(); // Close sidebar on mobile after clicking
              }}
              variant="filled"
              rounded="md"
            />
          ))}
        </Stack>
        
        {/* Footer area of Sidebar */}
        <Box mt="auto" pt="md" style={{ borderTop: '1px solid #eee' }}>
          <Text size="xs" c="dimmed" textAlign="center">
            TMS v1.0.0 © 2026
          </Text>
        </Box>
      </AppShell.Navbar>

      {/* --- Main Content Section --- */}
      <AppShell.Main bg="gray.0">
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;