import { Title, Group, Box, Paper, Text } from '@mantine/core';
import UserTable from './UserTable';

const UserList = ({ onEdit }) => {
  return (
    <Box>
      <Box mb="md">
        <Title order={3}>System Users</Title>
        <Text size="sm" c="dimmed">
          Manage all administrative and staff accounts across different companies.
        </Text>
      </Box>
      
      <Paper withBorder radius="md">
        <UserTable onEdit={onEdit} />
      </Paper>
    </Box>
  );
};

export default UserList;