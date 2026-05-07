import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function FishFarmDetails() {
    return (
        <Box sx={{ minHeight: '100vh', p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Fish Farm Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Manage your fish farm details
            </Typography>
        </Box>
    );
}

export default FishFarmDetails;
