import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { Mail, Calendar, Eye, AlertTriangle, Ship } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import type { CrewWorker } from '../types/worker.types';
import { grey } from '@mui/material/colors';
import { CREW_POSITION_LABELS } from '../types/common.types';
import { getPositionColor } from '../utils/utils';

// Position label lookup
interface WorkerCardProps {
	worker: CrewWorker;
	viewMode: 'grid' | 'list';
	onViewClick: (id: string) => void;
	onPreview?: (id: string) => void;
}

const isCertExpired = (dateStr: string): boolean => {
	return new Date(dateStr) < new Date();
};

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, viewMode, onViewClick, onPreview }) => {
	const theme = useTheme();
	const isList = viewMode === 'list';
	const expired = isCertExpired(worker.certifiedUntil);
	const positionLabel = CREW_POSITION_LABELS[worker.position ?? 2] ?? 'Worker';
	const farmName = worker.fishFarm?.name;

	if (isList) {
		return (
			<Card
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { sm: 'center' },
					height: '100%',
					borderRadius: '16px',
					overflow: 'hidden',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
					border: `1px solid ${theme.palette.divider}`,
					'&:hover': {
						transform: 'translateY(-2px)',
						boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
						borderColor: 'transparent',
					},
				}}
			>
				{/* Avatar + Info */}
				<Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2.5, flexGrow: 1 }}>
					<Avatar
						src={worker.profileImageUrl}
						alt={worker.name}
						sx={{
							width: 56,
							height: 56,
							border: '3px solid',
							borderColor: 'background.paper',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						}}
					/>
					<Box sx={{ flexGrow: 1, minWidth: 0 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
							<Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
								{worker.name}
							</Typography>
							<Chip label={positionLabel} color={getPositionColor(worker.position as number) as any} size="small" sx={{ fontWeight: 600 }} />
							{expired && (
								<Chip
									icon={<AlertTriangle size={12} />}
									label="Expired"
									size="small"
									color="warning"
									variant="outlined"
									sx={{ fontWeight: 600 }}
								/>
							)}
						</Box>

						<Stack spacing={0.3}>
							<Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
								<Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<Mail size={14} /> {worker.email}
								</Typography>
								<Typography variant="body2">•</Typography>
								<Typography variant="body2">{worker.age} yrs</Typography>
							</Stack>
							{farmName && (
								<Typography
									variant="caption"
									sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontWeight: 600 }}
								>
									<Ship size={12} /> {farmName}
								</Typography>
							)}
						</Stack>
					</Box>
				</Box>

				{/* Actions */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2.5, py: 1 }}>
					<Box sx={{ textAlign: 'right', minWidth: 110 }}>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Certified Until
						</Typography>
						<Typography
							variant="body2"
							sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', fontWeight: 600 }}
							color={expired ? 'error' : 'text.primary'}
						>
							<Calendar size={14} /> {worker.certifiedUntil}
						</Typography>
					</Box>
					<Button
						variant="contained"
						size="small"
						startIcon={<Eye size={16} />}
						onClick={() => onViewClick(worker.id)}
						sx={{ borderRadius: '10px', boxShadow: 'none', px: 3 }}
					>
						View
					</Button>
				</Box>
			</Card>
		);
	}

	// Grid mode
	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				borderRadius: '16px',
				overflow: 'hidden',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
				border: `1px solid ${theme.palette.divider}`,
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
					borderColor: 'transparent',
					'& .action-button': {
						opacity: 1,
						transform: 'translateY(0)',
					},
				},
			}}
		>
			{/* Floating preview button */}
			{onPreview && (
				<Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}>
					<IconButton
						className="action-button"
						onClick={(e) => {
							e.stopPropagation();
							onPreview(worker.id);
						}}
						sx={{
							bgcolor: 'rgba(255, 255, 255, 0.9)',
							backdropFilter: 'blur(4px)',
							opacity: 0,
							transform: 'translateY(-10px)',
							transition: 'all 0.2s ease',
							transitionDelay: '0.05s',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							'&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
						}}
						size="small"
					>
						<Eye size={18} />
					</IconButton>
				</Box>
			)}

			{/* Expired badge */}
			{expired && (
				<Chip
					icon={<AlertTriangle size={14} />}
					label="Cert Expired"
					size="small"
					sx={{
						position: 'absolute',
						top: 12,
						left: 12,
						bgcolor: 'rgba(255,255,255,0.9)',
						fontWeight: 600,
						color: 'warning.dark',
						zIndex: 5,
						'& .MuiChip-icon': { color: 'warning.dark' },
					}}
				/>
			)}

			<CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
				<Avatar
					src={worker.profileImageUrl}
					alt={worker.name}
					sx={{
						width: 80,
						height: 80,
						mb: 2,
						mt: 1,
						border: '4px solid',
						borderColor: 'background.paper',
						boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
					}}
				/>
				<Chip label={positionLabel} color={getPositionColor(worker.position as number) as any} size="small" sx={{ mb: 1.5, fontWeight: 600 }} />

				<Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
					{worker.name}
				</Typography>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: farmName ? 0.25 : 0.5 }}
					noWrap
				>
					<Mail size={14} /> {worker.email}
				</Typography>

				{farmName && (
					<Typography
						variant="body2"
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 0.5,
							color: 'primary.main',
							fontWeight: 600,
							mb: 0.5,
							px: 1,
							py: 0.5,
							backgroundColor: grey[200],
							borderRadius: 2,
						}}
					>
						<Ship size={12} /> {farmName}
					</Typography>
				)}

				<Divider sx={{ width: '100%', my: 2 }} />

				<Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between' }}>
					<Box sx={{ textAlign: 'left' }}>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Age
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{worker.age} yrs
						</Typography>
					</Box>
					<Box sx={{ textAlign: 'right' }}>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Certified Until
						</Typography>
						<Typography
							variant="body2"
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
								justifyContent: 'flex-end',
								fontWeight: 600,
								color: expired ? 'error' : 'text.primary',
							}}
						>
							<Calendar size={14} /> {worker.certifiedUntil}
						</Typography>
					</Box>
				</Stack>
			</CardContent>

			<CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
				<Button
					variant="contained"
					fullWidth
					startIcon={<Eye size={18} />}
					onClick={() => onViewClick(worker.id)}
					sx={{ borderRadius: '10px', boxShadow: 'none' }}
				>
					View Details
				</Button>
			</CardActions>
		</Card>
	);
};

export default WorkerCard;
