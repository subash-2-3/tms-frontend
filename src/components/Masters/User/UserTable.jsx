import { Table, ActionIcon, Group, Loader, Alert, Badge, Avatar, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useUsers, useDeleteUser } from '../../../hooks/useUser';
import { notifications } from '@mantine/notifications';

import { BASE_URL } from '../../../services/api';

const getImageUrl = (path) => {
  if (!path) return null;
  const strPath = String(path).trim();
  if (strPath.startsWith('data:')) {
    return strPath.replace(/\s/g, '');
  }
  if (strPath.startsWith('http') || strPath.startsWith('blob:')) return strPath;
  const relativePath = strPath.startsWith('/') ? strPath.slice(1) : strPath;
  return `${BASE_URL}/${relativePath}`;
};

const UserTable = ({ onEdit }) => {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deleteUser.mutateAsync(id);
        notifications.show({
          title: 'User Deactivated',
          message: 'The user has been soft-deleted successfully.',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: error.response?.data?.message || 'Delete failed',
          color: 'red',
        });
      }
    }
  };

  if (isLoading) return <Group justify="center" py="xl"><Loader size="md" /></Group>;
  if (error) return <Alert color="red" title="Error">Failed to load users list.</Alert>;

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th ta="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users?.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar src={getImageUrl(user.profile_image)} radius="xl" />
                  <Text size="sm" fw={500}>{user.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>
                <Badge variant="light" color="gray">{user.company || 'N/A'}</Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={user.role === 'Admin' ? 'red' : 'blue'} variant="outline">
                  {user.role}
                </Badge>
              </Table.Td>
              <Table.Td>
                {user.is_active ? (
                  <Badge color="green" variant="dot">Active</Badge>
                ) : (
                  <Badge color="red" variant="dot">Inactive</Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(user)}>
                    <IconEdit size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(user.id)}
                    loading={deleteUser.isPending}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default UserTable;