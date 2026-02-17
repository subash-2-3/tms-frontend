import { TextInput, Textarea, Button, Group, Card, Stack, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useCreateProject, useUpdateProject } from '../../../hooks/useProject';
import { notifications } from '@mantine/notifications';

import { z } from 'zod';
import dayjs from 'dayjs';
import '@mantine/dates/styles.css';

const schema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    description: z.string().optional(),
    start_date: z.coerce.date({ required_error: "Start date is required" }),
    end_date: z.coerce.date().nullable().optional(),
    status: z.string().optional(),
}).refine((data) => {
    if (data.end_date && data.start_date) {
        return data.end_date > data.start_date;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["end_date"],
});

const ProjectForm = ({ initialData = null, onSuccess }) => {
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const form = useForm({
        initialValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            start_date: initialData?.start_date ? new Date(initialData.start_date) : null,
            end_date: initialData?.end_date ? new Date(initialData.end_date) : null,
            status: initialData?.status || 'Active',
        },
        validate: (values) => {
            const result = schema.safeParse(values);
            if (result.success) return {};
            return result.error.issues.reduce((acc, issue) => {
                acc[issue.path.join('.')] = issue.message;
                return acc;
            }, {});
        },
    });

    const handleSubmit = async (values) => {
        try {
            // Create payload object
            const payload = {
                ...values,
                // Ensure dates are sent in ISO format
                start_date: new Date(values.start_date).toISOString(),
                end_date: values.end_date ? new Date(values.end_date).toISOString() : null,
            };

            if (initialData?.id) {
                await updateProject.mutateAsync({ id: initialData.id, data: payload });
                notifications.show({ title: 'Success', message: 'Project updated', color: 'green' });
            } else {
                // Remove status for new projects if backend sets default, 
                // or keep if user can fetch it. Ideally, status is for updates.
                // We'll send it if form includes it, but UI hides it.
                const { status, ...createPayload } = payload;
                await createProject.mutateAsync(createPayload);
                notifications.show({ title: 'Success', message: 'Project created', color: 'green' });
            }
            onSuccess?.();
        } catch (error) {
            console.error("Project submit error:", error);
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || error.message || 'Operation failed',
                color: 'red'
            });
        }
    };

    return (
        <Card withBorder shadow="sm" p="xl" radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        label="Project Name"
                        placeholder="Enter project name"
                        withAsterisk
                        {...form.getInputProps('name')}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter project description"
                        {...form.getInputProps('description')}
                    />

                    <Group grow>
                        <DateInput
                            label="Start Date"
                            placeholder="Select start date"
                            withAsterisk
                            {...form.getInputProps('start_date')}
                        />
                        <DateInput
                            label="End Date"
                            placeholder="Select end date"
                            {...form.getInputProps('end_date')}
                        />
                    </Group>

                    {initialData && (
                        <Select
                            label="Status"
                            placeholder="Select status"
                            data={['Active', 'On Hold', 'Completed']}
                            {...form.getInputProps('status')}
                        />
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={onSuccess}>Cancel</Button>
                        <Button type="submit" loading={createProject.isPending || updateProject.isPending}>
                            {initialData ? 'Update Project' : 'Create Project'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Card>
    );
};

export default ProjectForm;
