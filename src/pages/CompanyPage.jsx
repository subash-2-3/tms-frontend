import { Container, Tabs, Title, Group, Button, Paper } from '@mantine/core';
import { IconPlus, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import CompanyTable from '../components/Masters/Company/CompanyTable';
import CompanyForm from '../components/Masters/Company/CompanyForm';

const CompanyPage = () => {
  // 'list' or 'form'
  const [activeTab, setActiveTab] = useState('list');
  // Stores the company object when editing
  const [editingCompany, setEditingCompany] = useState(null);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setActiveTab('form');
  };

  const handleCreateNew = () => {
    setEditingCompany(null);
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    setEditingCompany(null);
    setActiveTab('list');
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Company</Title>
        {activeTab === 'list' && (
          <Button 
            leftSection={<IconPlus size={18} />} 
            onClick={handleCreateNew}
          >
            Add New Company
          </Button>
        )}
      </Group>

      <Paper withBorder radius="md">
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
          <Tabs.List>
            <Tabs.Tab value="list" leftSection={<IconList size={16} />}>
              All Companies
            </Tabs.Tab>
            <Tabs.Tab value="form">
              {editingCompany ? 'Edit Company' : 'Create Company'}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="list" p="md">
            <CompanyTable onEdit={handleEdit} />
          </Tabs.Panel>

          <Tabs.Panel value="form" p="md">
            <CompanyForm
              initialData={editingCompany}
              onSuccess={handleFormSuccess}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default CompanyPage;