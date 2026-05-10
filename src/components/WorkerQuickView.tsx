import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { X, Maximize2, Mail, Calendar, User, Ship, AlertTriangle } from 'lucide-react';
import type { CrewWorker } from '../types/worker.types';
import { useNavigate } from 'react-router-dom';

const POSITION_LABELS: Record<number, string> = {
	0: 'CEO',
	1: 'Captain',
	2: 'Worker',
	3: 'Not Assigned',
};

const DRAWER_WIDTH = 700;

interface WorkerQuickViewProps {
	open: boolean;
	worker: CrewWorker | null;
	onClose: () => void;
}

const getPositionColor = (position?: number) => {
	switch (position) {
		case 0:
			return 'error';
		case 1:
			return 'primary';
		case 2:
			return 'success';
		default:
			return 'default';
	}
};

const isCertExpired = (dateStr: string): boolean => {
	return new Date(dateStr) < new Date();
};

const WorkerQuickView: React.FC<WorkerQuickViewProps> = ({ open, worker, onClose }) => {
	const navigate = useNavigate();

	if (!worker) return null;

	const expired = isCertExpired(worker.certifiedUntil);
	const positionLabel = POSITION_LABELS[worker.position ?? 2] ?? 'Worker';
	const farmName = worker.fishFarm?.name;

	const handleExpand = () => {
		onClose();
		navigate(`/workers/${worker.id}`);
	};

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiDrawer-paper': {
					width: { xs: '100%', sm: DRAWER_WIDTH },
					p: 0,
					overflow: 'hidden',
				},
			}}
		>
			<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
				{/* Header Actions Overlay */}
				<Box
					sx={{
						p: 2,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						zIndex: 10,
					}}
				>
					<IconButton
						onClick={handleExpand}
						sx={{
							bgcolor: 'rgba(255,255,255,0.9)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							'&:hover': { bgcolor: 'white', transform: 'scale(1.05)' },
							transition: 'all 0.2s ease',
						}}
						size="small"
					>
						<Maximize2 size={18} />
					</IconButton>
					<IconButton
						onClick={onClose}
						sx={{
							bgcolor: 'rgba(255,255,255,0.9)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							'&:hover': { bgcolor: 'white', transform: 'scale(1.05)' },
							transition: 'all 0.2s ease',
						}}
						size="small"
					>
						<X size={18} />
					</IconButton>
				</Box>

				{/* Profile Header */}
				<Box sx={{ px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
					<Avatar
						src={worker.profileImageUrl}
						alt={worker.name}
						sx={{
							width: 120,
							height: 120,
							mb: 2.5,
							border: '4px solid white',
							boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
						}}
					/>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
						<Chip label={positionLabel} color={getPositionColor(worker.position) as any} size="small" sx={{ fontWeight: 600 }} />
						{expired && (
							<Chip
								icon={<AlertTriangle size={12} />}
								label="Cert Expired"
								size="small"
								color="warning"
								variant="outlined"
								sx={{ fontWeight: 600 }}
							/>
						)}
					</Box>
					<Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'center' }}>
						{worker.name}
					</Typography>
				</Box>

				{/* Details Content */}
				<Box sx={{ p: 3, pt: 0, flexGrow: 1, overflowY: 'auto' }}>
					<Divider sx={{ mb: 3 }} />

					<Stack spacing={3}>
						{/* Email */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
								<Mail size={22} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
									Email Address
								</Typography>
								<Typography variant="body1" sx={{ fontWeight: 600 }}>
									{worker.email}
								</Typography>
							</Box>
						</Box>

						<Divider />

						{/* Age */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
								<User size={22} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
									Age
								</Typography>
								<Typography variant="body1" sx={{ fontWeight: 600 }}>
									{worker.age} years old
								</Typography>
							</Box>
						</Box>

						<Divider />

						{/* Certified Until */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: expired ? 'error.50' : 'action.hover',
									color: expired ? 'error.main' : 'text.secondary',
									display: 'flex',
								}}
							>
								<Calendar size={22} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
									Certification Valid Until
								</Typography>
								<Typography variant="body1" sx={{ fontWeight: 600 }} color={expired ? 'error' : 'text.primary'}>
									{worker.certifiedUntil}
									{expired && (
										<Typography component="span" variant="body2" color="error" sx={{ ml: 1, fontWeight: 600 }}>
											(Expired)
										</Typography>
									)}
								</Typography>
							</Box>
						</Box>

						<Divider />

						{/* Assignment */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: farmName ? 'primary.50' : 'action.hover',
									color: farmName ? 'primary.main' : 'text.secondary',
									display: 'flex',
								}}
							>
								<Ship size={22} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
									Current Assignment
								</Typography>
								<Typography variant="body1" sx={{ fontWeight: 600 }} color={farmName ? 'primary.dark' : 'text.secondary'}>
									{farmName || 'No active assignment'}
								</Typography>
							</Box>
						</Box>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
};

export default WorkerQuickView;
