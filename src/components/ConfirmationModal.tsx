import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { ReactNode } from 'react';

interface ConfirmationModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmColor?: 'error' | 'primary' | 'warning' | 'success';
	confirmIcon?: ReactNode;
	loading?: boolean;
	loadingLabel?: string;
}

function ConfirmationModal({
	open,
	onClose,
	onConfirm,
	title = 'Confirm',
	message = 'Are you sure you want to proceed?',
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	confirmColor = 'error',
	confirmIcon,
	loading = false,
	loadingLabel,
}: ConfirmationModalProps) {
	return (
		<Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
			<DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText component="div">{message}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose} disabled={loading} sx={{ borderRadius: 1 }}>
					{cancelLabel}
				</Button>
				<Button
					variant="contained"
					color={confirmColor}
					onClick={onConfirm}
					disabled={loading}
					startIcon={loading ? <CircularProgress size={16} color="inherit" /> : confirmIcon}
					sx={{ borderRadius: 1, fontWeight: 600 }}
				>
					{loading ? (loadingLabel ?? `${confirmLabel}...`) : confirmLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationModal;
