// FilterItem.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface FilterItemProps {
	label: string;
	children: ReactNode;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, children }) => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
				{label}
			</Typography>
			{children}
		</Box>
	);
};

export default FilterItem;
