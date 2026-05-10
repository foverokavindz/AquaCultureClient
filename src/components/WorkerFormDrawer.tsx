import React, { useState, useEffect, useRef } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import type { CrewWorker, CreateWorker } from '../types/worker.types';
import { workerService } from '../services/Worker.service';
import { fileUploaderService } from '../services/FileUploader.service';
import { CREW_ROLE_OPTIONS, CREW_ROLE_POSITION } from '../types/common.types';
import { extractCloudinaryPublicId } from '../utils/utils';

const DRAWER_WIDTH = 550;

interface WorkerFormDrawerProps {
	open: boolean;
	onClose: () => void;
	worker?: CrewWorker | null;
	onSaved?: (savedWorker: CrewWorker) => void;
}

interface WorkerFormErrors {
	name?: string;
	email?: string;
	age?: string;
	certifiedUntil?: string;
}

const INITIAL_VALUES: CreateWorker = {
	name: '',
	email: '',
	age: 0,
	position: CREW_ROLE_POSITION.Worker,
	certifiedUntil: '',
	profileImageUrl: '',
};

const validateForm = (data: CreateWorker): WorkerFormErrors => {
	const errs: WorkerFormErrors = {};

	// Name
	if (!data.name || data.name.trim().length === 0) {
		errs.name = 'Worker name is required';
	} else if (data.name.trim().length > 200) {
		errs.name = 'Name cannot exceed 200 characters';
	}

	// Email
	if (!data.email || data.email.trim().length === 0) {
		errs.email = 'Email address is required';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
		errs.email = 'Invalid email format';
	} else if (data.email.trim().length > 200) {
		errs.email = 'Email cannot exceed 200 characters';
	}

	// Age
	if (!data.age || data.age.toString() === '' || data.age === 0) {
		errs.age = 'Age is required';
	} else if (data.age < 18 || data.age > 100) {
		errs.age = 'Age must be between 18 and 100';
	}

	// Certified Until
	if (!data.certifiedUntil || data.certifiedUntil.trim().length === 0) {
		errs.certifiedUntil = 'Certification date is required';
	}

	return errs;
};

const WorkerFormDrawer: React.FC<WorkerFormDrawerProps> = ({ open, onClose, worker, onSaved }) => {
	const isEditMode = !!worker;

	const [formData, setFormData] = useState<CreateWorker>({ ...INITIAL_VALUES });
	const [errors, setErrors] = useState<WorkerFormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imagePublicId, setImagePublicId] = useState<string | null>(null);
	const [imageUploading, setImageUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			if (worker) {
				setFormData({
					name: worker.name,
					email: worker.email,
					age: worker.age,
					position: worker.position ?? CREW_ROLE_POSITION.Worker,
					certifiedUntil: worker.certifiedUntil,
					profileImageUrl: worker.profileImageUrl || '',
				});
				const url = worker.profileImageUrl || null;
				setImagePreview(url);
				setImagePublicId(url ? extractCloudinaryPublicId(url) : null);
			} else {
				resetForm();
			}
			setTouched({});
		}
	}, [worker, open]);

	// validate whenever formData changes
	useEffect(() => {
		setErrors(validateForm(formData));
	}, [formData]);

	const handleChange = <K extends keyof CreateWorker>(field: K, value: CreateWorker[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const touch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

	const fieldError = (field: keyof WorkerFormErrors): string | null => (touched[field] ? (errors[field] ?? null) : null);

	// Image Handling
	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageUploading(true);
		const response = await fileUploaderService.UploadImage(file);

		if (response.success && response.data) {
			setImagePreview(response.data.url);
			setImagePublicId(response.data.publicId);
			handleChange('profileImageUrl', response.data.url);
		} else {
			console.error('Image Upload Error:', response);
		}

		setImageUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleRemoveImage = async () => {
		if (imagePublicId) {
			setImageUploading(true);
			await fileUploaderService.DeleteImage(imagePublicId);
			setImageUploading(false);
		}
		setImagePreview(null);
		setImagePublicId(null);
		handleChange('profileImageUrl', '');
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const resetForm = () => {
		setFormData({ ...INITIAL_VALUES });
		setErrors({});
		setTouched({});
		setImagePreview(null);
		setImagePublicId(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleClose = () => {
		if (!isEditMode) resetForm();
		onClose();
	};

	// Submit
	const handleSubmit = async () => {
		setTouched({ name: true, email: true, age: true, certifiedUntil: true });
		const allErrors = validateForm(formData);
		if (Object.keys(allErrors).length > 0) return;

		setSaving(true);

		if (isEditMode && worker) {
			const response = await workerService.UpdateWorker(worker.id, formData);
			if (response.success && response.data) {
				onSaved?.(response.data);
				onClose();
			} else {
				console.error('Update Worker Error:', response.message);
			}
		} else {
			const response = await workerService.CreateWorker(formData);
			if (response.success && response.data) {
				onSaved?.(response.data);
				resetForm();
				onClose();
			} else {
				console.error('Create Worker Error:', response.message);
			}
		}

		setSaving(false);
	};

	const allErrors = validateForm(formData);
	const isFormValid = Object.keys(allErrors).length === 0;

	const requiredMark = <span style={{ color: 'tomato' }}>*</span>;

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={handleClose}
			sx={{
				'& .MuiDrawer-paper': {
					width: { xs: '100%', md: DRAWER_WIDTH },
					bgcolor: 'background.default',
				},
			}}
		>
			<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/*  Header*/}
				<Box
					sx={{
						p: 2.5,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderBottom: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							{isEditMode ? 'Edit Worker' : 'Add New Worker'}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{isEditMode ? `Update details for ${worker?.name}` : 'Create a new worker profile'}
						</Typography>
					</Box>
					<IconButton onClick={handleClose} size="small">
						<X size={20} />
					</IconButton>
				</Box>

				{/* Scrollable Form  */}
				<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
					<Stack spacing={3}>
						{/* Profile Image */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Profile Image
							</Typography>
							<input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageSelect} />

							{imagePreview ? (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										p: 2,
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
									}}
								>
									<Avatar src={imagePreview} alt="Profile" sx={{ width: 80, height: 80, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
									<Stack spacing={1}>
										<Button
											size="small"
											variant="outlined"
											onClick={() => fileInputRef.current?.click()}
											startIcon={<Upload size={14} />}
											sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
										>
											Change
										</Button>
										<Button
											size="small"
											variant="outlined"
											color="error"
											onClick={handleRemoveImage}
											startIcon={<X size={14} />}
											sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
										>
											Remove
										</Button>
									</Stack>
								</Box>
							) : (
								<Box
									onClick={() => !imageUploading && fileInputRef.current?.click()}
									sx={{
										height: 120,
										borderRadius: 1,
										border: '2px dashed',
										borderColor: 'divider',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
										cursor: imageUploading ? 'default' : 'pointer',
										transition: 'all 0.2s ease',
										'&:hover': {
											borderColor: imageUploading ? 'divider' : 'primary.main',
											bgcolor: imageUploading ? 'transparent' : 'action.hover',
										},
									}}
								>
									{imageUploading ? (
										<CircularProgress size={32} thickness={4} />
									) : (
										<>
											<ImageIcon size={32} strokeWidth={1.5} color="#9e9e9e" />
											<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
												Click to upload profile image
											</Typography>
											<Typography variant="caption" color="text.disabled">
												JPG, PNG or WebP (max 5MB)
											</Typography>
										</>
									)}
								</Box>
							)}
						</Box>

						<Divider />

						{/* Full Name */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Full Name{requiredMark}
							</Typography>
							<TextField
								fullWidth
								placeholder="Enter full name"
								value={formData.name || ''}
								onChange={(e) => handleChange('name', e.target.value)}
								onBlur={() => touch('name')}
								variant="outlined"
								size="small"
								error={!!fieldError('name')}
								helperText={fieldError('name')}
								slotProps={{ htmlInput: { maxLength: 200 } }}
							/>
						</Box>

						{/* Email */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Email Address{requiredMark}
							</Typography>
							<TextField
								fullWidth
								placeholder="Enter email address"
								type="email"
								value={formData.email || ''}
								onChange={(e) => handleChange('email', e.target.value)}
								onBlur={() => touch('email')}
								variant="outlined"
								size="small"
								error={!!fieldError('email')}
								helperText={fieldError('email')}
								slotProps={{ htmlInput: { maxLength: 200 } }}
							/>
						</Box>

						{/* Age & Position */}
						<Box>
							<Grid container spacing={2}>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
										Age{requiredMark}
									</Typography>
									<TextField
										fullWidth
										placeholder="Age"
										type="number"
										value={formData.age || ''}
										onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
										onBlur={() => touch('age')}
										variant="outlined"
										size="small"
										error={!!fieldError('age')}
										helperText={fieldError('age')}
										slotProps={{
											htmlInput: { min: 18, max: 100 },
										}}
									/>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
										Position{requiredMark}
									</Typography>
									<FormControl fullWidth size="small">
										<Select value={formData.position} onChange={(e) => handleChange('position', Number(e.target.value))}>
											{CREW_ROLE_OPTIONS.map((opt) => (
												<MenuItem key={opt.value} value={opt.value}>
													{opt.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Box>

						{/* Certified Until */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Certification Valid Until{requiredMark}
							</Typography>
							<TextField
								fullWidth
								type="date"
								value={formData.certifiedUntil || ''}
								onChange={(e) => handleChange('certifiedUntil', e.target.value)}
								onBlur={() => touch('certifiedUntil')}
								variant="outlined"
								size="small"
								error={!!fieldError('certifiedUntil')}
								helperText={fieldError('certifiedUntil')}
								slotProps={{ inputLabel: { shrink: true } }}
							/>
						</Box>
					</Stack>
				</Box>

				{/* Footer */}
				<Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
					<Stack direction="row" sx={{ spacing: 2, justifyContent: 'flex-end' }}>
						<Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 1, px: 3, textTransform: 'none', fontWeight: 600 }}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							variant="contained"
							disabled={!isFormValid || saving}
							startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={18} />}
							sx={{
								borderRadius: 1,
								px: 4,
								fontWeight: 600,
								textTransform: 'none',
								ml: 2,
							}}
						>
							{saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Worker'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
};

export default WorkerFormDrawer;
