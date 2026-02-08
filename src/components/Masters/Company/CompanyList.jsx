import { Title, Group, Box } from '@mantine/core';
import CompanyTable from './CompanyTable';

const CompanyList = ({ onEdit }) => {
  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Title order={3}>All Registered Companies</Title>
      </Group>
      <CompanyTable onEdit={onEdit} />
    </Box>
  );
};

export default CompanyList;