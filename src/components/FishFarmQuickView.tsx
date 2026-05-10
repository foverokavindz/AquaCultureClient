import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Stack, Avatar, Chip } from '@mui/material';
import { X, Maximize2, MapPin, Grid, Ship } from 'lucide-react';
import type { FishFarm } from '../types/fishfarm.types';
const DRAWER_WIDTH = 700;

interface FishFarmQuickViewProps {
	open: boolean;
	farm: FishFarm | null;
	onClose: () => void;
	onExpand: (id: string) => void;
}

const FishFarmQuickView: React.FC<FishFarmQuickViewProps> = ({ open, farm, onClose, onExpand }) => {
	const getRoleDetails = (position: number) => {
		switch (position) {
			case 0:
				return { label: 'CEO', color: 'error' as const };
			case 1:
				return { label: 'Captain', color: 'primary' as const };
			case 2:
				return { label: 'Worker', color: 'success' as const };
			default:
				return { label: 'Not Assigned', color: 'default' as const };
		}
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
			{farm && (
				<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
					{/* Header Actions Overlay */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							display: 'flex',
							justifyContent: 'space-between',
							p: 2,
							zIndex: 10,
						}}
					>
						<IconButton
							onClick={() => onExpand(farm.id)}
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

					{/* Cover Image */}
					<Box
						sx={{
							height: 250,
							flexShrink: 0,
							backgroundImage: `url(${farm.pictureUrl})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							position: 'relative',
						}}
					>
						{/* Gradient to ensure text/buttons contrast if we had any */}
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: '40%',
								background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
							}}
						/>
					</Box>

					{/* Details Content */}
					<Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
						<Typography variant="h5" sx={{ fontWeight: 700, mb: 4, letterSpacing: '-0.01em' }}>
							{farm.name}
						</Typography>

						<Stack spacing={3}>
							{/* GPS */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
									<MapPin size={22} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										GPS Position
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
										{farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
									</Typography>
								</Box>
							</Box>

							<Divider />

							{/* Cages */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
									<Grid size={22} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										Capacity
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600 }}>
										{farm.noOfCages} Active Cages
									</Typography>
								</Box>
							</Box>

							<Divider />

							{/* Barge */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
									<Ship size={22} />
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
										Barge Availability
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 600 }}>
										{farm.hasBarge ? 'Barge Available' : 'No Barge'}
									</Typography>
								</Box>
							</Box>
						</Stack>

						<Divider sx={{ my: 4 }} />

						{/* Crew Section */}
						<Box>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
								Crew workers
							</Typography>
							<Stack spacing={2}>
								{farm.workers && farm.workers.length > 0 ? (
									farm.workers.map((worker) => {
										const role = getRoleDetails(worker.position as number);
										return (
											<Box key={worker.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<Avatar src={worker.profileImageUrl} alt={worker.name} sx={{ width: 40, height: 40 }} />
												<Box sx={{ flexGrow: 1 }}>
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														{worker.name}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{worker.email}
													</Typography>
												</Box>
												<Chip
													label={
														<Typography variant="caption" sx={{ fontWeight: 600 }}>
															{role.label}
														</Typography>
													}
													size="small"
													color={role.color}
													variant="outlined"
												/>
											</Box>
										);
									})
								) : (
									<Typography variant="body2" color="text.secondary">
										No crew assigned to this farm yet.
									</Typography>
								)}
							</Stack>
						</Box>
					</Box>
				</Box>
			)}
		</Drawer>
	);
};

export default FishFarmQuickView;
