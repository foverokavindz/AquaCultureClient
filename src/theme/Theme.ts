import { createTheme } from '@mui/material/styles';

const FONT_PRIMARY = 'Inter, sans-serif';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
	interface Palette {
		border: Palette['primary'];
		// hover: {
		// 	primary: string;
		// 	secondary?: string;
		// };
	}
	interface PaletteOptions {
		border?: PaletteOptions['primary'];
		// hover?: {
		// 	primary?: string;
		// 	secondary?: string;
		// };
	}
}
export const theme = createTheme({
	palette: {
		mode: 'light',

		// Primary Main action color for buttons, CTAs
		primary: {
			main: '#212121',
			light: '#484848',
			dark: '#333333EE',
			contrastText: '#FFFFFF',
		},

		// Secondary actions, outlined buttons
		secondary: {
			main: '#F5F5F5',
			light: '#FAFAFA',
			dark: '#E0E0E0',
			contrastText: '#212121',
		},

		// Background colors
		background: {
			default: '#FFFFFF',
			paper: '#f9f9f9ff',
		},

		// Text colors
		text: {
			primary: '#212121',
			secondary: '#757575',
			disabled: '#BDBDBD',
		},

		// Semantic colors (status indicators)
		success: {
			main: '#4CAF50',
			light: '#81C784',
			dark: '#388E3C',
			contrastText: '#FFFFFF',
		},
		error: {
			main: '#F44336',
			light: '#E57373',
			dark: '#D32F2F',
			contrastText: '#FFFFFF',
		},
		warning: {
			main: '#FF9800',
			light: '#FFB74D',
			dark: '#F57C00',
			contrastText: '#000000',
		},
		info: {
			main: '#2196F3',
			light: '#64B5F6',
			dark: '#1976D2',
			contrastText: '#FFFFFF',
		},

		// Action states colors
		action: {
			active: '#212121',
			hover: '#EDEDEDCB',
			selected: '#E0E0E0',
			disabled: '#BDBDBD',
			disabledBackground: '#F5F5F5',
			focus: 'rgba(0, 0, 0, 0.12)',
			hoverOpacity: 0.08,
		},

		// Dividers and borders
		divider: '#E0E0E0',

		// Custom palette extensions
		border: {
			main: '#E0E0E0',
			light: '#F5F5F5',
			dark: '#BDBDBD',
		},
	},
	typography: {
		fontFamily: FONT_PRIMARY,
		fontWeightRegular: 400,
		fontWeightMedium: 600,
		fontWeightBold: 700,

		// Headings
		h1: {
			fontWeight: 700,
			lineHeight: 1.3,
		},
		h2: {
			fontWeight: 700,
			lineHeight: 1.3,
		},
		h3: {
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h4: {
			fontSize: '1.5rem',
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h5: {
			fontSize: '1.25rem',
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h6: {
			fontSize: '1.125rem',
			fontWeight: 600,
			lineHeight: 1.3,
		},

		subtitle1: {
			fontSize: '1.125rem',
			fontWeight: 500,
			lineHeight: 1.4,
		},
		subtitle2: {
			fontSize: '1rem',
			fontWeight: 500,
			lineHeight: 1.4,
		},

		body1: {
			fontSize: '1rem',
			lineHeight: 1.5,
		},
		body2: {
			fontSize: '0.875rem',
			lineHeight: 1.5,
		},

		caption: {
			fontSize: '0.75rem',
			lineHeight: 1.4,
		},
		overline: {
			fontSize: '0.65rem',
			fontWeight: 700,
			letterSpacing: '0.1em',
		},

		button: {
			fontWeight: 500,
			lineHeight: 1.57,
			textTransform: 'none',
		},
	},
	shape: {
		borderRadius: 22,
	},
	// Component-specific overrides
	components: {
		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					border: `1px solid ${theme.palette.divider}`,
					backgroundColor: theme.palette.background.paper,
				}),
			},
		},
		MuiCard: {
			styleOverrides: {
				root: ({ theme }) => ({
					border: `1px solid ${theme.palette.divider}`,
					backgroundColor: theme.palette.background.default,
					boxShadow: 'none',
				}),
			},
		},
		MuiButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					boxShadow: 'none',
					textTransform: 'none',
					'&.MuiButton-outlinedPrimary': {
						borderColor: theme.palette.divider,
					},
				}),
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }) => ({
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.palette.divider,
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.palette.divider,
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.palette.divider,
					},
				}),
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderColor: theme.palette.divider,
					color: theme.palette.text.primary,
					'&.Mui-selected': {
						backgroundColor: theme.palette.action.selected,
					},
				}),
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					boxShadow: 'none',
					color: theme.palette.text.primary,
					border: `1px solid ${theme.palette.divider}`,
					padding: '12px',
				}),
			},
		},
		MuiSelect: {
			defaultProps: {
				MenuProps: {
					slotProps: {
						paper: {
							sx: {
								bgcolor: 'background.default',
								'& .MuiList-padding': {
									p: 0,
								},
								'& .MuiMenuItem-root': {
									py: 1.2,
									px: 2,
									'&:hover': {
										bgcolor: 'action.hover',
									},
									'&.Mui-selected': {
										bgcolor: 'action.selected',
										'&:hover': {
											bgcolor: 'action.selected',
										},
									},
								},
							},
						},
					},
				},
			},
			styleOverrides: {
				// TODO not working
				root: {
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: 'divider',
					},
				},
			},
		},
	},
});
