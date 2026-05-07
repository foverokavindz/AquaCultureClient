import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FishSymbol, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

export const DRAWER_WIDTH = 280;
export const DRAWER_COLLAPSED_WIDTH = 78;

export interface NavItem {
	label: string;
	icon: React.ReactNode;
	path: string;
}

interface SidebarContentProps {
	routes: NavItem[];
}

function SideNavBar({ routes }: SidebarContentProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();

	const handleToggle = () => {
		setSidebarOpen((prev) => !prev);
	};

	const drawerWidth = sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

	return (
		<MuiDrawer
			variant="permanent"
			open={sidebarOpen}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'& .MuiDrawer-paper': {
					width: drawerWidth,
				},
			}}
		>
			{/* Drawer Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: sidebarOpen ? 'space-between' : 'center',
					px: sidebarOpen ? 2.5 : 1,
					py: 2.5,
					minHeight: 72,
					bgcolor: 'background.',
				}}
			>
				{sidebarOpen && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box
							sx={{
								width: 36,
								height: 36,
								borderRadius: '10px',
								// bgcolor: 'primary.main',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FishSymbol size={32} />
						</Box>
						<Typography
							variant="h5"
							sx={{
								fontWeight: 600,
							}}
						>
							Aqua Culture
						</Typography>
					</Box>
				)}
				<IconButton
					onClick={handleToggle}
					sx={{
						border: 'none',
						marginRight: sidebarOpen ? -2 : 0,
					}}
				>
					{sidebarOpen ? (
						<PanelRightOpen
							size={20}
							style={{
								color: theme.palette.text.secondary,
							}}
						/>
					) : (
						<PanelRightClose size={20} />
					)}
				</IconButton>
			</Box>

			<Divider />

			{/* Navigation Items */}
			<List sx={{ px: 1.5, py: 2, flex: 1 }}>
				{routes.map((item) => {
					const isActive = location.pathname === item.path;
					return (
						<ListItem key={item.label} disablePadding>
							<ListItemButton
								selected={isActive}
								onClick={() => navigate(item.path)}
								sx={{
									justifyContent: sidebarOpen ? 'center' : 'flex-start',
									borderRadius: '8px',
									alignItems: 'center',
									minHeight: 50,
								}}
							>
								<ListItemIcon
									sx={{
										mr: sidebarOpen ? 2 : 'auto',
										color: isActive ? 'text.primary' : undefined,
									}}
								>
									{item.icon}
								</ListItemIcon>
								{sidebarOpen && (
									<ListItemText
										primary={item.label}
										slotProps={{
											primary: {
												sx: {
													fontWeight: isActive ? 600 : 400,
													color: isActive ? 'text.primary' : undefined,
												},
											},
										}}
									/>
								)}
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</MuiDrawer>
	);
}

export default SideNavBar;
