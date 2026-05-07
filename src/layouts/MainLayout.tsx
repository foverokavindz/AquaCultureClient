import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface MainLayoutProps {
	sidebar: ReactNode;
}

function MainLayout({ sidebar }: MainLayoutProps) {
	return (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			{sidebar}

			{/* Main Content Area */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					minWidth: 0,
					minHeight: '100vh',
					transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
}

export default MainLayout;
