import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function WorkerDetails() {
    return (
        <Box sx={{ minHeight: '100vh', p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Worker Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Manage your worker details
            </Typography>
        </Box>
    );
}

export default WorkerDetails;
