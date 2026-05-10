import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider, Paper, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowLeft, Mail, Ship, Edit2, Calendar, User, AlertTriangle, Briefcase } from 'lucide-react';
import WorkerFormDrawer from '../components/WorkerFormDrawer';
import { workerService } from '../services/Worker.service';
import type { CrewWorker } from '../types/worker.types';
import { CREW_POSITION_LABELS } from '../types/common.types';
import { getPositionColor, isCertExpired } from '../utils/utils';

function WorkerDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [worker, setWorker] = useState<CrewWorker | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

	//  Fetch
	const fetchWorker = async (workerId: string) => {
		setError(null);
		setLoading(true);
		const response = await workerService.GetWorkerById(workerId);
		if (response.success && response.data) {
			setWorker(response.data);
		} else {
			console.error('Get Worker Error:', response.message);
			setError(response.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (id) fetchWorker(id);
	}, [id]);

	const handleSaved = (savedWorker: CrewWorker) => {
		setWorker(savedWorker);
		setIsEditDrawerOpen(false);
	};

	//  Loading
	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	//  Error
	if (error) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2, p: 4 }}>
				<Alert severity="error" variant="outlined" sx={{ maxWidth: 500, width: '100%' }}>
					{error}
				</Alert>
				<Button variant="contained" startIcon={<ArrowLeft />} onClick={() => navigate('/workers')} sx={{ borderRadius: 1 }}>
					Back to Workers
				</Button>
			</Box>
		);
	}

	//  Not Found
	if (!worker) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
				<Typography variant="h6" color="textSecondary">
					Worker not found
				</Typography>
				<Button variant="contained" startIcon={<ArrowLeft />} onClick={() => navigate('/workers')} sx={{ borderRadius: 1 }}>
					Back to Workers
				</Button>
			</Box>
		);
	}

	const expired = isCertExpired(worker.certifiedUntil);
	const positionLabel = CREW_POSITION_LABELS[worker.position ?? 2] ?? 'Worker';
	const farmName = worker.fishFarm?.name;

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{/*  Fixed Header */}
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
					onClick={() => navigate('/workers')}
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
					Edit Worker
				</Button>
			</Box>

			{/*  Scrollable Content */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
				<Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
					{/*  Hero Banner */}
					<Box
						sx={{
							height: { xs: 200, md: 260 },
							borderRadius: 1,
							mb: 4,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: '60%',
								background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
							}}
						/>
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								p: { xs: 2, md: 4 },
								display: 'flex',
								alignItems: 'flex-end',
								gap: 3,
							}}
						>
							<Avatar
								src={worker.profileImageUrl}
								alt={worker.name}
								sx={{
									width: { xs: 80, md: 110 },
									height: { xs: 80, md: 110 },
									border: '4px solid white',
									boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
								}}
							>
								{worker.name?.charAt(0)?.toUpperCase()}
							</Avatar>
							<Box sx={{ pb: 0.5 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
									<Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
										{worker.name}
									</Typography>
									<Chip label={positionLabel} color={getPositionColor(worker.position as number) as any} size="small" sx={{ fontWeight: 600 }} />
									{expired && (
										<Chip icon={<AlertTriangle size={12} />} label="Cert Expired" size="small" color="warning" sx={{ fontWeight: 600 }} />
									)}
								</Box>
								<Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 1 }}>
									<Mail size={16} /> {worker.email}
								</Typography>
							</Box>
						</Box>
					</Box>

					{/*  Stats Cards Row  */}
					<Grid container spacing={2.5} sx={{ mb: 4 }}>
						{/* Age */}
						<Grid size={{ xs: 12, md: 4 }}>
							<Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
									<User size={25} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										Age
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600 }}>
										{worker.age} years old
									</Typography>
								</Box>
							</Paper>
						</Grid>

						{/* Role */}
						<Grid size={{ xs: 12, md: 4 }}>
							<Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
									<Briefcase size={25} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										Position / Role
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600 }}>
										{positionLabel}
									</Typography>
								</Box>
							</Paper>
						</Grid>

						{/* Certification */}
						<Grid size={{ xs: 12, md: 4 }}>
							<Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1, color: expired ? 'error.main' : 'text.secondary', display: 'flex' }}>
									<Calendar size={25} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										Certification Valid Until
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600 }} color={expired ? 'error' : 'text.primary'}>
										{worker.certifiedUntil}
										{expired && (
											<Typography component="span" variant="caption" color="error" sx={{ ml: 1, fontWeight: 600 }}>
												(Expired)
											</Typography>
										)}
									</Typography>
								</Box>
							</Paper>
						</Grid>
					</Grid>

					{/*  Assignment Section  */}
					<Grid container spacing={2.5}>
						<Grid size={{ xs: 12 }}>
							<Paper elevation={0} sx={{ borderRadius: 1, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
								<Box sx={{ p: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
											<Ship size={25} />
										</Box>
										<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
											Current Assignment
										</Typography>
									</Box>
									{worker.fishFarmId && <Chip label="Active" size="small" color="success" variant="outlined" sx={{ fontWeight: 500 }} />}
								</Box>

								<Divider />

								<Box sx={{ p: 2.5, flexGrow: 1 }}>
									{worker.fishFarmId ? (
										<Paper
											elevation={0}
											sx={{
												p: 2,
												borderRadius: 1,
												display: 'flex',
												alignItems: 'center',
												gap: 2,
												transition: 'all 0.2s ease',
												'&:hover': { bgcolor: 'action.hover' },
											}}
										>
											<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}>
												<Ship size={24} />
											</Box>
											<Box sx={{ flexGrow: 1, minWidth: 0 }}>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{farmName ?? 'Loading...'}
												</Typography>
												<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
													Farm ID: {worker.fishFarmId}
												</Typography>
											</Box>
											<Chip
												label={positionLabel}
												size="small"
												color={getPositionColor(worker.position as number) as any}
												variant="outlined"
												sx={{ fontWeight: 600, fontSize: '0.7rem' }}
											/>
										</Paper>
									) : (
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												height: '100%',
												py: 6,
												gap: 1,
											}}
										>
											<Ship size={40} strokeWidth={1} color="#9e9e9e" />
											<Typography variant="body2" color="text.secondary">
												This worker is not assigned to any farm yet.
											</Typography>
										</Box>
									)}
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Box>
			</Box>

			<WorkerFormDrawer open={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} worker={worker} onSaved={handleSaved} />
		</Box>
	);
}

export default WorkerDetails;
