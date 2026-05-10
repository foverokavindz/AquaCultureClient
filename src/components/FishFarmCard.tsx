import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box, IconButton, Chip, Stack } from '@mui/material';
import { MapPin, Grid, Ship, Eye } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

interface FishFarmCardProps {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	cagesCount: number;
	hasBarge: boolean;
	imageUrl: string;
	onView?: (id: string) => void;
	onPreview?: (id: string) => void;
	viewMode?: 'grid' | 'list';
}

const FishFarmCard: React.FC<FishFarmCardProps> = ({
	id,
	name,
	latitude,
	longitude,
	cagesCount,
	hasBarge,
	imageUrl,
	onView,
	onPreview,
	viewMode = 'grid',
}) => {
	const theme = useTheme();

	const isList = viewMode === 'list';

	const formatGPS = (val: number) => val.toFixed(4);

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: isList ? { xs: 'column', sm: 'row' } : 'column',
				height: '100%',
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
			{/* Image Area */}
			<Box
				sx={{
					position: 'relative',
					width: isList ? { xs: '100%', sm: '320px' } : '100%',
					flexShrink: 0,
				}}
			>
				<CardMedia
					component="img"
					image={imageUrl}
					alt={name}
					sx={{
						height: isList ? { xs: 200, sm: '100%' } : 200,
						objectFit: 'cover',
					}}
				/>
				{/* Gradient Overlay */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.6) 100%)',
					}}
				/>

				{/* Floating Action Buttons */}
				<Box
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						display: 'flex',
						gap: 1,
					}}
				>
					{onPreview && (
						<IconButton
							className="action-button"
							onClick={(e) => {
								e.stopPropagation();
								onPreview(id);
							}}
							sx={{
								bgcolor: 'rgba(255, 255, 255, 0.9)',
								backdropFilter: 'blur(4px)',
								opacity: 0,
								transform: 'translateY(-10px)',
								transition: 'all 0.2s ease',
								transitionDelay: '0.05s',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
								'&:hover': {
									bgcolor: 'primary.main',
									color: 'primary.contrastText',
								},
							}}
							size="small"
						>
							<Eye size={18} />
						</IconButton>
					)}
				</Box>

				{/* Barge Status  */}
				{hasBarge && (
					<Chip
						icon={<Ship size={14} />}
						label="Barge Available"
						size="small"
						sx={{
							position: 'absolute',
							top: 12,
							left: 12,
							bgcolor: 'rgba(255,255,255,0.9)',
							// backdropFilter: 'blur(4px)',
							fontWeight: 600,
							color: 'text.primary',
							'& .MuiChip-icon': {
								color: 'text.primary',
							},
						}}
					/>
				)}
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
				{/* Content Area */}
				<CardContent sx={{ p: 3, flexGrow: 1 }}>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							mb: 2,
						}}
					>
						{name}
					</Typography>

					<Stack spacing={2}>
						{/* GPS Coordinates */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<Box
								sx={{
									p: 1,
									borderRadius: '8px',
									bgcolor: 'action.hover',
									display: 'flex',
									color: 'text.secondary',
								}}
							>
								<MapPin size={18} />
							</Box>
							<Box>
								<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.2 }}>
									GPS Position
								</Typography>
								<Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
									{formatGPS(latitude)}, {formatGPS(longitude)}
								</Typography>
							</Box>
						</Box>

						{/* Number of Cages */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<Box
								sx={{
									p: 1,
									borderRadius: '8px',
									bgcolor: 'action.hover',
									display: 'flex',
									color: 'text.secondary',
								}}
							>
								<Grid size={18} />
							</Box>
							<Box>
								<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.2 }}>
									Capacity
								</Typography>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									{cagesCount} Active Cages
								</Typography>
							</Box>
						</Box>
					</Stack>
				</CardContent>

				{/* Action Buttons */}
				<CardActions sx={{ px: 3, pb: 3, pt: 0, gap: 1, justifyContent: isList ? 'flex-end' : 'flex-start' }}>
					<Button
						variant="contained"
						startIcon={<Eye size={18} />}
						onClick={(e) => {
							e.stopPropagation();
							if (onView) onView(id);
						}}
						sx={{
							borderRadius: '10px',
							// textTransform: 'none',
							// fontWeight: 600,
							boxShadow: 'none',
							width: isList ? 'auto' : '100%',
							px: isList ? 4 : undefined,
						}}
					>
						View
					</Button>
				</CardActions>
			</Box>
		</Card>
	);
};

export default FishFarmCard;
