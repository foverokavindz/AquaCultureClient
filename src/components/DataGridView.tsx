import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import NoDataImage from '../assets/noData.svg';

interface DataGridViewProps<T> {
	data: T[];
	loading: boolean;
	error: string | null;
	viewMode?: 'grid' | 'list';
	noDataMessage?: string;
	renderItem: (item: T) => React.ReactNode;
	getKey: (item: T) => string;
	gridSize?: {
		grid: { xs: number; sm?: number; lg?: number };
		list: { xs: number };
	};
}

function DataGridView<T>({
	data,
	loading,
	error,
	viewMode = 'grid',
	noDataMessage = 'No results found',
	renderItem,
	getKey,
	gridSize = {
		grid: { xs: 12, sm: 6, lg: 4 },
		list: { xs: 12 },
	},
}: DataGridViewProps<T>) {
	// Loading
	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	// Error
	if (error) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
				<Alert severity="error" variant="outlined" sx={{ width: '100%', maxWidth: 500 }}>
					{error}
				</Alert>
			</Box>
		);
	}

	// No data
	if (data.length === 0) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
				<Stack sx={{ alignItems: 'center', gap: 2 }}>
					<img src={NoDataImage} alt="No Data" width={150} height={150} />
					<Typography variant="h6" color="textSecondary">
						{noDataMessage}
					</Typography>
				</Stack>
			</Box>
		);
	}

	// Data
	return (
		<Grid container spacing={viewMode === 'list' ? 2 : 4}>
			{data.map((item) => (
				<Grid size={viewMode === 'list' ? gridSize.list : gridSize.grid} key={getKey(item)}>
					{renderItem(item)}
				</Grid>
			))}
		</Grid>
	);
}

export default DataGridView;
