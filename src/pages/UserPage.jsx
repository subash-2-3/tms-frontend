import { Container, Tabs, Title, Group, Button, Paper } from '@mantine/core';
import { IconUserPlus, IconUsersGroup } from '@tabler/icons-react';
import { useState } from 'react';
import UserTable from '../components/Masters/User/UserTable';
import UserForm from '../components/Masters/User/UserForm';

const UserPage = () => {
  // Tabs can be 'list' or 'form'
  const [activeTab, setActiveTab] = useState('list');
  // Holds the user data when we click "Edit"
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
    setActiveTab('form');
  };

  const handleCreateNew = () => {
    setEditingUser(null); // Clear data for a fresh form
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    setEditingUser(null);
    setActiveTab('list'); // Go back to the table after saving
  };

  return (
    <Container size="xl" py="md">
      {/* Header Section */}
      <Group justify="space-between" mb="xl">
        <Title order={2}>User</Title>
        {activeTab === 'list' && (
          <Button
            leftSection={<IconUserPlus size={18} />}
            onClick={handleCreateNew}
          >
            Create New User
          </Button>
        )}
      </Group>

      {/* Main Content Area */}
      <Paper withBorder radius="md">
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
          <Tabs.List>
            <Tabs.Tab value="list" leftSection={<IconUsersGroup size={16} />}>
              All Users
            </Tabs.Tab>
            <Tabs.Tab value="form">
              {editingUser ? 'Edit User' : 'Create User'}
            </Tabs.Tab>
          </Tabs.List>

          {/* List View Panel */}
          <Tabs.Panel value="list" p="md">
            <UserTable onEdit={handleEdit} />
          </Tabs.Panel>

          {/* Create/Edit Form Panel */}
          <Tabs.Panel value="form" p="md">
            <UserForm
              key={editingUser ? editingUser.id : 'create'}
              initialData={editingUser}
              onSuccess={handleFormSuccess}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default UserPage;