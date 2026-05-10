import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowLeft, MapPin, Grid as GridIcon, Ship, Edit2 } from 'lucide-react';
import AssignedCrew from '../components/AssignedCrew';
import MapPreview from '../components/MapPreview';
import { fishFarmService } from '../services/FishFarm.service';
import FishFarmFormDrawer from '../components/FishFarmFormDrawer';
import NoDataImage from '../assets/noData.svg';
import type { FishFarm } from '../types/fishfarm.types';

function FishFarmDetails() {
	const [fishFarmData, setFishFarmData] = useState<FishFarm | null>(null);
	const [fishFarmDataLoading, setFishFarmDataLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	const fetchFishFarmsDataWithId = async (id: string) => {
		setError(null);
		setFishFarmDataLoading(true);

		const response = await fishFarmService.GetFishFarmByIdWithWorkers(id);

		if (response.success && response.data) {
			setFishFarmData(response.data);
		} else {
			console.error('Get FishFarms Error:', response.message);
			setError(response.message);
		}

		setFishFarmDataLoading(false);
	};

	useEffect(() => {
		if (id) {
			fetchFishFarmsDataWithId(id);
		}
	}, [id]);

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{/* Loading State */}
			{fishFarmDataLoading && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						p: 4,
					}}
				>
					<CircularProgress />
				</Box>
			)}

			{/* Error State */}
			{!fishFarmDataLoading && error && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						p: 4,
					}}
				>
					<Alert severity="error" variant="outlined" sx={{ width: '100%', maxWidth: 500 }}>
						{error}
					</Alert>
				</Box>
			)}

			{/* Empty State */}
			{!fishFarmDataLoading && !error && fishFarmData === null && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						width: '100%',
						p: 4,
					}}
				>
					<Stack
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 2,
						}}
					>
						<img src={NoDataImage} alt="No Data" width={150} height={150} />
						<Stack
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography variant="h6" color="textSecondary">
								No fish farm found
							</Typography>
							<Button variant="contained" startIcon={<ArrowLeft />} onClick={() => navigate('/fish-farms')} sx={{ borderRadius: 1 }}>
								Back to Fish Farms
							</Button>
						</Stack>
					</Stack>
				</Box>
			)}

			{/* Main Content */}
			{!fishFarmDataLoading && !error && fishFarmData && (
				<>
					{/* Fixed Header */}
					<Box
						sx={{
							p: { xs: 2, md: 3 },
							height: 72,
							flexShrink: 0,
							borderBottom: '1px solid',
							borderColor: 'divider',
							bgcolor: 'background.default',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Button
							startIcon={<ArrowLeft size={20} />}
							onClick={() => navigate('/fish-farms')}
							sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, px: 2 }}
						>
							Back to List
						</Button>

						<Button
							variant="contained"
							color="primary"
							startIcon={<Edit2 size={18} />}
							onClick={() => setIsEditDrawerOpen(true)}
							sx={{ borderRadius: 1, fontWeight: 600 }}
						>
							Edit Farm
						</Button>
					</Box>

					{/* Scrollable Content Area */}
					<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
						<Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
							{/* Cover Image */}
							<Box
								sx={{
									height: { xs: 200, md: 300 },
									borderRadius: 1,
									mb: 4,
									backgroundImage: `url(${fishFarmData.pictureUrl})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									position: 'relative',
									overflow: 'hidden',
								}}
							>
								{/* Gradient overlay */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										right: 0,
										height: '50%',
										background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
									}}
								/>
								{/* Farm name on cover */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										p: { xs: 2, md: 4 },
									}}
								>
									<Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
										{fishFarmData.name}
									</Typography>
									<Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
										Aquaculture Site Overview
									</Typography>
								</Box>
							</Box>

							{/* Stats Cards Row */}
							<Grid container spacing={2.5} sx={{ mb: 4 }}>
								{/* GPS */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper
										elevation={0}
										sx={{
											p: 2,
											display: 'flex',
											alignItems: 'center',
											gap: 2,
										}}
									>
										<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
											<MapPin size={25} />
										</Box>
										<Box>
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
												GPS Position
											</Typography>
											<Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
												{fishFarmData.latitude.toFixed(4)}, {fishFarmData.longitude.toFixed(4)}
											</Typography>
										</Box>
									</Paper>
								</Grid>

								{/* Cages */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper
										elevation={0}
										sx={{
											p: 2,

											display: 'flex',
											alignItems: 'center',
											gap: 2,
										}}
									>
										<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
											<GridIcon size={25} />
										</Box>
										<Box>
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
												Total Capacity
											</Typography>
											<Typography variant="body1" sx={{ fontWeight: 600 }}>
												{fishFarmData.noOfCages} Active Cages
											</Typography>
										</Box>
									</Paper>
								</Grid>

								{/* Barge */}
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper
										elevation={0}
										sx={{
											p: 2,

											display: 'flex',
											alignItems: 'center',
											gap: 2,
										}}
									>
										<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
											<Ship size={22} />
										</Box>
										<Box>
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
												Barge Availability
											</Typography>
											<Typography variant="body1" sx={{ fontWeight: 600 }}>
												{fishFarmData.hasBarge ? 'Barge On Site' : 'No Barge Installed'}
											</Typography>
										</Box>
									</Paper>
								</Grid>
							</Grid>

							{/* Map and Workers Row */}
							<Grid container spacing={2.5}>
								{/* Map Card */}
								<Grid size={{ xs: 12, md: 7 }}>
									<MapPreview latitude={fishFarmData.latitude} longitude={fishFarmData.longitude} label={fishFarmData.name} />
								</Grid>

								{/* Workers Card */}
								<Grid size={{ xs: 12, md: 5 }}>
									<AssignedCrew workers={fishFarmData.workers} />
								</Grid>
							</Grid>
						</Box>
					</Box>
				</>
			)}

			{/* Edit Drawer */}
			<FishFarmFormDrawer
				open={isEditDrawerOpen}
				onClose={() => setIsEditDrawerOpen(false)}
				fishFarm={fishFarmData}
				onSaved={() => fetchFishFarmsDataWithId(id as string)}
			/>
		</Box>
	);
}

export default FishFarmDetails;
