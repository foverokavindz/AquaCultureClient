import Box from '@mui/material/Box';

interface PageShellLayoutProps {
	header: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

const PageShellLayout: React.FC<PageShellLayoutProps> = ({ header, children, footer }) => {
	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3, pb: 0 }}>
			<Box sx={{ flexShrink: 0 }}>{header}</Box>
			<Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 5, pr: 1 }}>{children}</Box>
			{footer && <Box sx={{ flexShrink: 0 }}>{footer}</Box>}
		</Box>
	);
};

export default PageShellLayout;
