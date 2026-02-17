import { Container, Tabs, Title, Group, Button, Paper } from '@mantine/core';
import { IconPlus, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import ProjectTable from '../components/Masters/Project/ProjectTable';
import ProjectForm from '../components/Masters/Project/ProjectForm';

const ProjectPage = () => {
    // 'list' or 'form'
    const [activeTab, setActiveTab] = useState('list');
    // Stores the project object when editing
    const [editingProject, setEditingProject] = useState(null);

    const handleEdit = (project) => {
        setEditingProject(project);
        setActiveTab('form');
    };

    const handleCreateNew = () => {
        setEditingProject(null);
        setActiveTab('form');
    };

    const handleFormSuccess = () => {
        setEditingProject(null);
        setActiveTab('list');
    };

    return (
        <Container size="xl" py="md">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Projects</Title>
                {activeTab === 'list' && (
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={handleCreateNew}
                    >
                        Add New Project
                    </Button>
                )}
            </Group>

            <Paper withBorder radius="md">
                <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
                    <Tabs.List>
                        <Tabs.Tab value="list" leftSection={<IconList size={16} />}>
                            All Projects
                        </Tabs.Tab>
                        <Tabs.Tab value="form">
                            {editingProject ? 'Edit Project' : 'Create Project'}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="list" p="md">
                        <ProjectTable onEdit={handleEdit} />
                    </Tabs.Panel>

                    <Tabs.Panel value="form" p="md">
                        <ProjectForm
                            key={editingProject ? editingProject.id : 'create'}
                            initialData={editingProject}
                            onSuccess={handleFormSuccess}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Container>
    );
};

export default ProjectPage;
