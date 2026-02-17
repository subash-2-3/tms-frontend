import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Card,
  Container,
  FileInput,
  Avatar,
  LoadingOverlay,
  Grid, // <--- Add this
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { useCreateUser, useUpdateUser, useUserById } from '../../../hooks/useUser';
import { useCompanies } from '../../../hooks/useCompany';
import { useRoles } from '../../../hooks/useRole';
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

const UserForm = ({ initialData = null, onSuccess }) => {
  const [imagePreview, setImagePreview] = useState(getImageUrl(initialData?.profile_image));

  // Fetch data for dropdowns
  const { data: companies, isLoading: loadingCompanies } = useCompanies();
  const { data: roles, isLoading: loadingRoles } = useRoles();

  // Fetch detailed user data if editing
  const { data: userDetails, isLoading: loadingUser } = useUserById(initialData?.id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Sync form with detailed user data when fetched
  useEffect(() => {
    if (userDetails) {
      form.setValues({
        company_id: userDetails.company_id?.toString() || '',
        role_id: userDetails.role_id?.toString() || '',
        name: userDetails.name || '',
        email: userDetails.email || '',
        profile_image: null, // Keep null as file input handles new files only
      });
      // Update image preview separately
      setImagePreview(getImageUrl(userDetails.profile_image));
    }
  }, [userDetails]);

  // Transform data for Mantine Select components
  const companyOptions = companies?.map((c) => ({ value: String(c.id), label: c.name })) || [];
  const roleOptions = roles?.map((r) => ({ value: String(r.id), label: r.name })) || [];

  const form = useForm({
    initialValues: {
      company_id: initialData?.company_id?.toString() || '',
      role_id: initialData?.role_id?.toString() || '',
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '', // Usually kept empty on edit unless changing
      profile_image: null,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      company_id: (value) => (!value ? 'Please select a company' : null),
      role_id: (value) => (!value ? 'Please select a role' : null),
      password: (value, values) =>
        (!initialData && !value ? 'Password is required for new users' : null),
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    // Append all text fields
    Object.keys(values).forEach(key => {
      if (key !== 'profile_image' && values[key]) {
        formData.append(key, values[key]);
      }
    });
    // Append image if selected
    if (values.profile_image) {
      formData.append('profile_image', values.profile_image);
    }

    try {
      if (initialData?.id) {
        await updateUser.mutateAsync({ id: initialData.id, data: formData });
        notifications.show({ title: 'Success', message: 'User updated', color: 'green' });
      } else {
        await createUser.mutateAsync(formData);
        notifications.show({ title: 'Success', message: 'User created', color: 'green' });
      }
      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Operation failed',
        color: 'red'
      });
    }
  };

  return (
    <Container size="sm">
      <Card withBorder shadow="md" p={30} radius="md" pos="relative">
        <LoadingOverlay visible={loadingCompanies || loadingRoles || loadingUser} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group justify="center" mb="md">
            <Avatar size={120} radius={120} src={imagePreview} />
          </Group>

          <FileInput
            label="Profile Image"
            placeholder="Upload photo"
            accept="image/*"
            {...form.getInputProps('profile_image')}
            onChange={(file) => {
              form.setFieldValue('profile_image', file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />

          <Grid grow gutter="md" mt="md">
            <Grid.Col span={6}>
              <Select
                label="Company"
                placeholder="Pick one"
                data={companyOptions}
                searchable
                {...form.getInputProps('company_id')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Role"
                placeholder="Pick one"
                data={roleOptions}
                {...form.getInputProps('role_id')}
              />
            </Grid.Col>
          </Grid>

          <TextInput label="Full Name" placeholder="John Doe" mt="md" {...form.getInputProps('name')} required />
          <TextInput label="Email" placeholder="john@example.com" mt="md" {...form.getInputProps('email')} required />

          <PasswordInput
            label="Password"
            placeholder={initialData ? "Leave blank to keep current" : "Secure password"}
            mt="md"
            {...form.getInputProps('password')}
          />

          <Button fullWidth mt="xl" type="submit" loading={createUser.isPending || updateUser.isPending}>
            {initialData ? 'Save Changes' : 'Create User'}
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default UserForm;