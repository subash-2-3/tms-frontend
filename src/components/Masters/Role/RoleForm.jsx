import { TextInput, Textarea, Button, Stack, Card } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateRole, useUpdateRole } from '../../../hooks/useRole';
import { notifications } from '@mantine/notifications';

const RoleForm = ({ initialData = null, onSuccess }) => {
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const form = useForm({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Role name is too short' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      if (initialData?.id) {
        await updateRole.mutateAsync({ id: initialData.id, data: values });
      } else {
        await createRole.mutateAsync(values);
      }
      notifications.show({ title: 'Success', message: 'Role saved', color: 'green' });
      onSuccess?.();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Action failed', color: 'red' });
    }
  };

  return (
    <Card withBorder p="xl" radius="md" mw={500} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Role Name" placeholder="e.g. Manager" {...form.getInputProps('name')} required />
          <Textarea label="Description" placeholder="What can this role do?" {...form.getInputProps('description')} />
          <Button type="submit" loading={createRole.isPending || updateRole.isPending}>
            {initialData ? 'Update Role' : 'Create Role'}
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default RoleForm;