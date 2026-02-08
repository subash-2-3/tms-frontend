import { Table, ActionIcon, Group, Avatar, Text, Badge, Loader, Center } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useCompanies, useDeleteCompany } from '../../../hooks/useCompany';
import { notifications } from '@mantine/notifications';

const CompanyTable = ({ onEdit }) => {
  const { data: companies, isLoading, isError } = useCompanies();
  const deleteCompany = useDeleteCompany();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany.mutateAsync(id);
        notifications.show({ title: 'Deleted', message: 'Company removed', color: 'blue' });
      } catch (e) {
        notifications.show({ title: 'Error', message: 'Could not delete', color: 'red' });
      }
    }
  };

  if (isLoading) return <Center h={200}><Loader /></Center>;
  if (isError) return <Text c="red" textAlign="center">Failed to load companies.</Text>;

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Company</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {companies?.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar src={item.company_logo} size={40} radius="md" />
                  <Text size="sm" fw={500}>{item.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{item.email}</Table.Td>
              <Table.Td>{item.phone || 'N/A'}</Table.Td>
              <Table.Td>
                <Badge color={item.is_active ? 'green' : 'red'}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(item)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon 
                    variant="subtle" 
                    color="red" 
                    onClick={() => handleDelete(item.id)}
                    loading={deleteCompany.isPending}
                  >
                    <IconTrash size={16} />
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

export default CompanyTable;