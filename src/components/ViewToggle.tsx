import React from 'react';
import { Stack, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

interface ViewToggleProps {
	viewMode: 'grid' | 'list';
	onChange: (event: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => void;
	disabled?: boolean;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange, disabled }) => {
	return (
		<Stack
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 1,
			}}
		>
			<Typography variant="body2" sx={{ fontWeight: 500 }}>
				View as :
			</Typography>
			<ToggleButtonGroup value={viewMode} exclusive onChange={onChange} size="small" disabled={disabled}>
				<ToggleButton value="grid" aria-label="grid view">
					<LayoutGrid size={18} />
				</ToggleButton>
				<ToggleButton value="list" aria-label="list view">
					<ListIcon size={18} />
				</ToggleButton>
			</ToggleButtonGroup>
		</Stack>
	);
};

export default ViewToggle;
