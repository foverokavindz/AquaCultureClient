import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Workers() {
	return (
		<Box sx={{ minHeight: '100vh', p: 4 }}>
			<Typography variant="h4" sx={{ fontWeight: 600 }}>
				Workers
			</Typography>
			<Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
				Manage your workforce
			</Typography>
		</Box>
	);
}

export default Workers;
