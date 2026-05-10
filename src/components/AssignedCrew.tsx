import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Users } from 'lucide-react';
import type { CrewWorker } from '../types/worker.types';

//  Role helpers
const getRoleDetails = (position?: number) => {
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

interface AssignedCrewProps {
	workers: CrewWorker[] | [] | null;
	minHeight?: number;
	maxHeight?: number;
}

const AssignedCrew: React.FC<AssignedCrewProps> = ({ workers, minHeight = 400, maxHeight = 500 }) => {
	const hasWorkers = workers && workers.length > 0;

	return (
		<Paper
			elevation={0}
			sx={{
				borderRadius: 1,
				minHeight,
				maxHeight,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Header */}
			<Box sx={{ p: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Box sx={{ p: 1, color: 'text.secondary', display: 'flex' }}>
						<Users size={25} />
					</Box>
					<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
						Assigned Crew
					</Typography>
				</Box>
				{hasWorkers && (
					<Chip
						label={`${workers.length} member${workers.length !== 1 ? 's' : ''}`}
						size="small"
						variant="outlined"
						sx={{ fontWeight: 500 }}
					/>
				)}
			</Box>

			<Divider />

			{/* Body */}
			<Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
				{hasWorkers ? (
					<Stack spacing={1}>
						{(workers as CrewWorker[]).map((worker) => {
							const role = getRoleDetails(worker.position);
							return (
								<Paper
									key={worker.id}
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
									<Avatar src={worker.profileImageUrl} alt={worker.name} sx={{ width: 45, height: 45 }}>
										{worker.name?.charAt(0)?.toUpperCase()}
									</Avatar>
									<Box sx={{ flexGrow: 1, minWidth: 0 }}>
										<Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
											{worker.name}
										</Typography>
										<Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
											{worker.email}
										</Typography>
									</Box>
									<Chip
										label={role.label}
										size="small"
										color={role.color}
										variant="outlined"
										sx={{ fontWeight: 600, fontSize: '0.7rem' }}
									/>
								</Paper>
							);
						})}
					</Stack>
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
						<Users size={40} strokeWidth={1} color="#9e9e9e" />
						<Typography variant="body2" color="text.secondary">
							No crew assigned to this farm yet.
						</Typography>
					</Box>
				)}
			</Box>
		</Paper>
	);
};

export default AssignedCrew;
