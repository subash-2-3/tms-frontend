import { TextInput, Textarea, Button, Group, Card, FileInput, Avatar, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { useCreateCompany, useUpdateCompany } from '../../../hooks/useCompany';
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

const CompanyForm = ({ initialData = null, onSuccess }) => {
  const [logoPreview, setLogoPreview] = useState(getImageUrl(initialData?.company_logo));
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const form = useForm({
    initialValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      company_logo: null,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone || '');
    formData.append('address', values.address || '');

    if (values.company_logo) {
      formData.append('company_logo', values.company_logo);
    }

    try {
      if (initialData?.id) {
        await updateCompany.mutateAsync({ id: initialData.id, data: formData });
        notifications.show({ title: 'Success', message: 'Company updated', color: 'green' });
      } else {
        await createCompany.mutateAsync(formData);
        notifications.show({ title: 'Success', message: 'Company created', color: 'green' });
      }
      onSuccess?.();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Operation failed', color: 'red' });
    }
  };

  return (
    <Card withBorder shadow="sm" p="xl" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group justify="center">
            <Avatar src={logoPreview} size={120} radius="md" />
          </Group>

          <FileInput
            label="Company Logo"
            placeholder="Upload logo"
            accept="image/*"
            onChange={(file) => {
              form.setFieldValue('company_logo', file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />

          <TextInput label="Company Name" placeholder="Acme Inc" required {...form.getInputProps('name')} />
          <TextInput label="Email" placeholder="contact@acme.com" required {...form.getInputProps('email')} />
          <TextInput label="Phone" placeholder="+1 234 567 890" {...form.getInputProps('phone')} />
          <Textarea label="Address" placeholder="Street, City, Country" {...form.getInputProps('address')} />

          <Button type="submit" loading={createCompany.isPending || updateCompany.isPending}>
            {initialData ? 'Update Company' : 'Create Company'}
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default CompanyForm;