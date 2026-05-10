// FilterRow.tsx
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface FilterRowProps {
	filters: ReactNode;
	actions: ReactNode;
}

const FilterRow: React.FC<FilterRowProps> = ({ filters, actions }) => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>{filters}</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{actions}</Box>
		</Box>
	);
};

export default FilterRow;
