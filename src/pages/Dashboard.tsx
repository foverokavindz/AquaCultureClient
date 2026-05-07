import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Dashboard() {
	return (
		<Box sx={{ minHeight: '100vh', p: 4 }}>
			<Typography variant="h4" sx={{ fontWeight: 600 }}>
				Dashboard
			</Typography>
			<Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
				Welcome to AquaCulture Management System
			</Typography>
		</Box>
	);
}

export default Dashboard;
