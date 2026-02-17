import { Table, ActionIcon, Group, Text, Badge, Loader, Center } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useProjects, useDeleteProject } from '../../../hooks/useProject';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';

const ProjectList = ({ onEdit }) => {
    const { data: rawData, isLoading, isError } = useProjects();
    const deleteProject = useDeleteProject();

    // Ensure projects is an array, handling { data: [...] } or direct [...] response
    const projects = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject.mutateAsync(id);
                notifications.show({ title: 'Deleted', message: 'Project removed', color: 'blue' });
            } catch (e) {
                notifications.show({ title: 'Error', message: 'Could not delete project', color: 'red' });
            }
        }
    };

    if (isLoading) return <Center h={200}><Loader /></Center>;
    if (isError) return <Text c="red" ta="center">Failed to load projects.</Text>;

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Start Date</Table.Th>
                        <Table.Th>End Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {projects?.map((project) => (
                        <Table.Tr key={project.id}>
                            <Table.Td>
                                <Text size="sm" fw={500}>{project.name}</Text>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" lineClamp={1}>{project.description || '-'}</Text>
                            </Table.Td>
                            <Table.Td>{dayjs(project.start_date).format('DD/MM/YYYY')}</Table.Td>
                            <Table.Td>
                                {project.end_date ? dayjs(project.end_date).format('DD/MM/YYYY') : '-'}
                            </Table.Td>
                            <Table.Td>
                                <Badge
                                    color={
                                        project.status === 'Active' ? 'green' :
                                            project.status === 'On Hold' ? 'yellow' :
                                                project.status === 'Completed' ? 'blue' : 'gray'
                                    }
                                >
                                    {project.status || 'Active'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4}>
                                    <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(project)}>
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => handleDelete(project.id)}
                                        loading={deleteProject.isPending}
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

export default ProjectList;
