import { Container, Grid, Paper, Text, Group, Title, Loader, ThemeIcon } from '@mantine/core';
import { IconBuildingCommunity, IconUsers, IconUserShield, IconActivity } from '@tabler/icons-react';
import { useCompanies } from '../hooks/useCompany';
import { useUsers } from '../hooks/useUser';
import { useRoles } from '../hooks/useRole';

const StatsCard = ({ title, value, icon: Icon, color, loading }) => (
  <Paper withBorder p="md" radius="md" shadow="sm">
    <Group justify="space-between">
      <div>
        <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
          {title}
        </Text>
        <Text fw={700} fz="xl">
          {loading ? <Loader size="xs" /> : value}
        </Text>
      </div>
      <ThemeIcon color={color} variant="light" size="xl" radius="md">
        <Icon size="1.4rem" stroke={1.5} />
      </ThemeIcon>
    </Group>
  </Paper>
);

const Dashboard = () => {
  const { data: companies, isLoading: loadingCompanies } = useCompanies();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: roles, isLoading: loadingRoles } = useRoles();

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="xl">System Overview</Title>
      
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatsCard 
            title="Total Companies" 
            value={companies?.length || 0} 
            icon={IconBuildingCommunity} 
            color="blue"
            loading={loadingCompanies}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatsCard 
            title="Active Users" 
            value={users?.length || 0} 
            icon={IconUsers} 
            color="green"
            loading={loadingUsers}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatsCard 
            title="System Roles" 
            value={roles?.length || 0} 
            icon={IconUserShield} 
            color="orange"
            loading={loadingRoles}
          />
        </Grid.Col>

        {/* --- Welcome Section --- */}
        <Grid.Col span={12}>
          <Paper withBorder p="xl" radius="md" mt="md" bg="blue.0">
            <Group>
              <ThemeIcon size={60} radius={60} color="blue">
                <IconActivity size={35} />
              </ThemeIcon>
              <div>
                <Text fz="lg" fw={600}>Welcome to the TMS Control Panel</Text>
                <Text fz="sm" c="dimmed">
                  Use the sidebar to manage your company masters, update user permissions, and monitor system roles.
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Dashboard;