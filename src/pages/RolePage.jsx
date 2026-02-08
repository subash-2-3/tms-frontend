import { Container, Tabs, Title, Group, Button, Paper, Table, ActionIcon } from '@mantine/core';
import { IconShieldPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useRoles, useDeleteRole } from '../hooks/useRole';
import RoleForm from '../components/Masters/Role/RoleForm';

const RolePage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingRole, setEditingRole] = useState(null);
  const { data: roles, isLoading } = useRoles();
  const deleteRole = useDeleteRole();

  const handleEdit = (role) => {
    setEditingRole(role);
    setActiveTab('form');
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Role</Title>
        {activeTab === 'list' && (
          <Button leftSection={<IconShieldPlus size={18} />} onClick={() => { setEditingRole(null); setActiveTab('form'); }}>
            New Role
          </Button>
        )}
      </Group>

      <Paper withBorder radius="md">
        <Tabs value={activeTab} onChange={setActiveTab} p="md">
          <Tabs.List mb="md">
            <Tabs.Tab value="list">All Roles</Tabs.Tab>
            <Tabs.Tab value="form">{editingRole ? 'Edit Role' : 'Create Role'}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="list">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Role Name</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {roles?.map((role) => (
                  <Table.Tr key={role.id}>
                    <Table.Td fw={500}>{role.name}</Table.Td>
                    <Table.Td c="dimmed">{role.description || 'No description'}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(role)}><IconEdit size={16} /></ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => deleteRole.mutate(role.id)}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="form">
            <RoleForm initialData={editingRole} onSuccess={() => { setEditingRole(null); setActiveTab('list'); }} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default RolePage;