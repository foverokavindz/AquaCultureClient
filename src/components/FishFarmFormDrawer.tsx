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
import InputAdornment from '@mui/material/InputAdornment';
import { X, Save, Plus, Upload, Image as ImageIcon, Search, UserPlus, Trash2 } from 'lucide-react';
import { fishFarmService } from '../services/FishFarm.service';
import { workerService } from '../services/Worker.service';
import { fileUploaderService } from '../services/FileUploader.service';
import { CREW_ROLE_OPTIONS } from '../types/common.types';
import { extractCloudinaryPublicId } from '../utils/utils';
import type { CreateFishFarm, FishFarm, UpdateFishFarm } from '../types/fishfarm.types';
import type { CrewWorker } from '../types/worker.types';
import toast from 'react-hot-toast';

const DRAWER_WIDTH = 550;

const validateForm = (data: CreateFishFarm): FishFarmFormErrors => {
	const errs: FishFarmFormErrors = {};

	// Name
	if (!data.name || data.name.trim().length === 0) {
		errs.name = 'Farm name is required';
	} else if (data.name.trim().length > 200) {
		errs.name = 'Farm name cannot exceed 200 characters';
	}

	// Latitude
	if (data.latitude === null || data.latitude === undefined || data.latitude.toString() === '') {
		errs.latitude = 'Latitude is required';
	} else if (data.latitude < -90 || data.latitude > 90) {
		errs.latitude = 'Latitude must be between -90 and 90';
	} else {
		const parts = data.latitude.toString().split('.');
		if (parts[1] && parts[1].length > 4) errs.latitude = 'Latitude must have at most 4 decimal places';
	}

	// Longitude
	if (data.longitude === null || data.longitude === undefined || data.longitude.toString() === '') {
		errs.longitude = 'Longitude is required';
	} else if (data.longitude < -180 || data.longitude > 180) {
		errs.longitude = 'Longitude must be between -180 and 180';
	} else {
		const parts = data.longitude.toString().split('.');
		if (parts[1] && parts[1].length > 4) errs.longitude = 'Longitude must have at most 4 decimal places';
	}

	// No. of Cages
	if (data.noOfCages === null || data.noOfCages === undefined || data.noOfCages.toString() === '') {
		errs.noOfCages = 'Number of cages is required';
	} else if (data.noOfCages < 0) {
		errs.noOfCages = 'Number of cages cannot be negative';
	}

	// Has Barge
	if (data.hasBarge === null || data.hasBarge === undefined) {
		errs.hasBarge = 'Barge availability is required';
	}

	// Picture URL
	if (!data.pictureUrl || data.pictureUrl.trim().length === 0) {
		errs.pictureUrl = 'Cover image is required';
	}

	return errs;
};

const INITIAL_VALUES: CreateFishFarm = {
	name: null,
	latitude: null,
	longitude: null,
	noOfCages: null,
	hasBarge: null,
	pictureUrl: null,
	workers: null,
};

interface FishFarmFormDrawerProps {
	open: boolean;
	onClose: () => void;
	fishFarm?: FishFarm | null;
	onSaved?: () => void;
}

interface FishFarmFormErrors {
	name?: string;
	latitude?: string;
	longitude?: string;
	noOfCages?: string;
	hasBarge?: string;
	pictureUrl?: string;
}

const FishFarmFormDrawer: React.FC<FishFarmFormDrawerProps> = ({ open, onClose, fishFarm, onSaved }) => {
	const isEditMode = !!fishFarm;

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [formData, setFormData] = useState<CreateFishFarm>({ ...INITIAL_VALUES });
	const [isDataUpdated, setIsDataUpdated] = useState(false);
	const [saving, setSaving] = useState(false);

	// Image upload states
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imagePublicId, setImagePublicId] = useState<string | null>(null);
	const [imageUploading, setImageUploading] = useState(false);

	// Worker search state
	const [searchWorkerInput, setSearchWorkerInput] = useState('');
	const [workerSearchResults, setWorkerSearchResults] = useState<CrewWorker[]>([]);
	const [workerSearchLoading, setWorkerSearchLoading] = useState(false);

	// Assigned workers list
	const [assignedWorkers, setAssignedWorkers] = useState<CrewWorker[]>([]);

	// Populate form for editing
	useEffect(() => {
		if (open) {
			if (fishFarm) {
				setFormData({
					name: fishFarm.name,
					latitude: fishFarm.latitude,
					longitude: fishFarm.longitude,
					noOfCages: fishFarm.noOfCages,
					hasBarge: fishFarm.hasBarge,
					pictureUrl: fishFarm.pictureUrl,
					workers: fishFarm.workers?.map((w: any) => ({ id: w.id, position: w.position })) || [],
				});
				const url = fishFarm.pictureUrl || null;
				setImagePreview(url);
				setImagePublicId(url ? extractCloudinaryPublicId(url) : null);
				setAssignedWorkers(fishFarm.workers?.map((w: any) => ({ ...w })) || []);
			} else {
				resetForm();
			}
		}
	}, [fishFarm, open]);

	// Sync assignedWorkers to formData.workers
	useEffect(() => {
		setFormData((prev: CreateFishFarm) => ({
			...prev,
			workers: assignedWorkers.map((w: CrewWorker) => ({ id: w.id, position: w.position as number })),
		}));
	}, [assignedWorkers]);

	// Debounced worker search
	useEffect(() => {
		if (!searchWorkerInput.trim()) {
			setWorkerSearchResults([]);
			return;
		}

		const handler = setTimeout(() => {
			searchWorkers(searchWorkerInput.trim());
		}, 500);

		return () => clearTimeout(handler);
	}, [searchWorkerInput]);

	const handleChange = <K extends keyof CreateFishFarm>(field: K, value: CreateFishFarm[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// handle Image Upload
	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const originalFile = e.target.files?.[0];

		if (!originalFile) return;

		const fileBuffer = await originalFile.arrayBuffer();
		const file = new File([fileBuffer], originalFile.name, { type: originalFile.type });

		setImageUploading(true);

		try {
			const response = await fileUploaderService.UploadImage(file);

			if (response.success && response.data) {
				setImagePreview(response.data.url);
				setImagePublicId(response.data.publicId);
				handleChange('pictureUrl', response.data.url);
			} else {
				console.error('Image Upload Error:', response);
			}
		} catch (error) {
			console.error('Image Upload Exception:', error);
		} finally {
			setImageUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	// handle Remove Image of the Fish farm
	const handleRemoveImage = async () => {
		if (imagePublicId) {
			setImageUploading(true);
			await fileUploaderService.DeleteImage(imagePublicId);
			setImageUploading(false);
		}

		setImagePreview(null);
		setImagePublicId(null);
		handleChange('pictureUrl', '');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// reset form to initial values
	const resetForm = () => {
		setFormData({ ...INITIAL_VALUES });
		setImagePreview(null);
		setImagePublicId(null);
		setAssignedWorkers([]);
		setSearchWorkerInput('');
		setWorkerSearchResults([]);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// handle close drawer
	const handleClose = () => {
		if (!isEditMode) resetForm();
		onClose();
	};

	// search worker
	const searchWorkers = async (keyword: string) => {
		setWorkerSearchLoading(true);
		const response = await workerService.SearchWorkers({
			searchTerm: keyword,
			isAssigned: false,
		});
		if (response.success && response.data) {
			// Filter already assigned workers in the list
			const assignedIds = new Set(assignedWorkers.map((w) => w.id));
			setWorkerSearchResults(response.data.filter((w) => !assignedIds.has(w.id)));
		} else {
			console.error('Search Workers Error:', response.message);
			setWorkerSearchResults([]);
		}
		setWorkerSearchLoading(false);
	};

	// Assign a worker to the fish farm
	const handleAssignWorker = (worker: CrewWorker) => {
		setAssignedWorkers((prev) => [...prev, worker]);
		setSearchWorkerInput('');
	};

	// remove assigned worker from the assigned workers list
	const handleRemoveAssignedWorker = (workerId: string) => {
		setAssignedWorkers((prev) => prev.filter((w) => w.id !== workerId));
	};

	// update the role of the assigned worker in the assigned workers list
	const handleRoleChange = (workerId: string, role: number) => {
		setAssignedWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, position: role } : w)));
	};

	// Runs whenever formData or assignedWorkers change
	useEffect(() => {
		if (!isEditMode || !fishFarm) {
			setIsDataUpdated(true); // always allow save on create
			return;
		}

		const fieldsChanged =
			formData.name !== fishFarm.name ||
			formData.latitude !== fishFarm.latitude ||
			formData.longitude !== fishFarm.longitude ||
			formData.noOfCages !== fishFarm.noOfCages ||
			formData.hasBarge !== fishFarm.hasBarge ||
			formData.pictureUrl !== fishFarm.pictureUrl;

		const prevWorkers = fishFarm.workers ?? [];

		if (prevWorkers.length !== assignedWorkers.length) {
			setIsDataUpdated(true);
			return;
		}

		// worker added or removed
		const originalIds = new Set(prevWorkers.map((w) => w.id));
		const hasNewOrRemovedWorker = assignedWorkers.some((w) => !originalIds.has(w.id));
		if (hasNewOrRemovedWorker) {
			setIsDataUpdated(true);
			return;
		}

		// worker's role changed
		const hasRoleChanged = assignedWorkers.some((w) => {
			const prevWorker = prevWorkers.find((o) => o.id === w.id);
			return prevWorker?.position !== w.position;
		});

		const workersChanged = hasNewOrRemovedWorker || hasRoleChanged;

		setIsDataUpdated(fieldsChanged || workersChanged);
	}, [formData, assignedWorkers]);

	const handleSubmit = async () => {
		setSaving(true);
		const toastId = toast.loading(isEditMode ? 'Saving changes...' : 'Creating fish farm...');

		if (isEditMode && fishFarm) {
			const response = await fishFarmService.UpdateFishFarm(fishFarm.id, formData as UpdateFishFarm);
			if (response.success && response.data) {
				onSaved?.();
				toast.success('Fish farm updated successfully!', { id: toastId });
				onClose();
			} else {
				toast.error(`Failed to update fish farm ${response.message}`, { id: toastId });
				console.error('Update FishFarm Error:', response.message);
			}
		} else {
			const response = await fishFarmService.AddNewFishFarm(formData);
			if (response.success && response.data) {
				onSaved?.();
				toast.success('Fish farm created successfully!', { id: toastId });
				resetForm();
				onClose();
			} else {
				toast.error(`Failed to create fish farm ${response.message}`, { id: toastId });
				console.error('Create FishFarm Error:', response.message);
			}
		}

		setSaving(false);
	};

	const [errors, setErrors] = useState<FishFarmFormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const touch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

	// validate on every formData change and only show errors for touched fields
	useEffect(() => {
		setErrors(validateForm(formData));
	}, [formData]);

	// clear errors when form resets
	useEffect(() => {
		if (open) setTouched({});
	}, [open]);

	const allErrors = validateForm(formData);
	const isFormValid = Object.keys(allErrors).length === 0;

	const fieldError = (field: keyof FishFarmFormErrors) => (touched[field] ? (allErrors[field] ?? null) : null);

	const requiredMark = <span style={{ color: 'tomato' }}> *</span>;

	console.log('Error :', errors);

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
				{/* Header */}
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
							{isEditMode ? 'Edit Farm' : 'Add New Farm'}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{isEditMode ? `Update the details for ${fishFarm?.name}` : 'Create a new aquaculture site'}
						</Typography>
					</Box>
					<IconButton onClick={handleClose} size="small">
						<X size={20} />
					</IconButton>
				</Box>

				{/* Scrollable Form */}
				<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
					<Stack spacing={3}>
						{/* Cover Image */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Cover Image{requiredMark}
							</Typography>
							<input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageSelect} />

							{imagePreview ? (
								<Box
									sx={{
										position: 'relative',
										height: 180,
										borderRadius: 1,
										overflow: 'hidden',
										border: '1px solid',
										borderColor: 'divider',
									}}
								>
									<Box component="img" src={imagePreview} alt="Cover preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
									<Box
										sx={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											right: 0,
											p: 1.5,
											display: 'flex',
											justifyContent: 'flex-end',
											gap: 1,
											background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
										}}
									>
										<Button
											size="small"
											variant="contained"
											onClick={() => fileInputRef.current?.click()}
											sx={{
												bgcolor: 'rgba(255,255,255,0.9)',
												color: 'text.primary',
												borderRadius: 1,
												textTransform: 'none',
												fontWeight: 600,
												fontSize: '0.75rem',
												'&:hover': { bgcolor: 'white' },
											}}
											startIcon={<Upload size={14} />}
										>
											Change
										</Button>
										<Button
											size="small"
											variant="contained"
											onClick={handleRemoveImage}
											sx={{
												bgcolor: 'rgba(255,255,255,0.9)',
												color: 'error.main',
												borderRadius: 1,
												textTransform: 'none',
												fontWeight: 600,
												fontSize: '0.75rem',
												'&:hover': { bgcolor: 'white' },
											}}
											startIcon={<X size={14} />}
										>
											Remove
										</Button>
									</Box>
								</Box>
							) : (
								<Box
									onClick={() => !imageUploading && fileInputRef.current?.click()}
									sx={{
										height: 180,
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
												Click to upload cover image
											</Typography>
											<Typography variant="caption" color="text.disabled">
												JPG, PNG or WebP (max 5MB)
											</Typography>
										</>
									)}
								</Box>
							)}
						</Box>
						{fieldError('pictureUrl') && (
							<Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, pl: 0.5 }}>
								{fieldError('pictureUrl')}
							</Typography>
						)}

						<Divider />

						{/* Fish Farm Name */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Fish Farm Name{requiredMark}
							</Typography>
							<TextField
								fullWidth
								placeholder="Enter farm name"
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

						{/* GPS */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								GPS Coordinates{requiredMark}
							</Typography>
							<Grid container spacing={2}>
								<Grid size={{ xs: 6 }}>
									<TextField
										fullWidth
										placeholder="Latitude"
										type="number"
										value={formData.latitude ?? ''}
										onChange={(e) => handleChange('latitude', e.target.value === '' ? null : parseFloat(e.target.value))}
										onBlur={() => touch('latitude')}
										variant="outlined"
										size="small"
										error={!!fieldError('latitude')}
										helperText={fieldError('latitude')}
										slotProps={{ htmlInput: { step: '0.0001', min: -90, max: 90 } }}
									/>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<TextField
										fullWidth
										placeholder="Longitude"
										type="number"
										value={formData.longitude ?? ''}
										onChange={(e) => handleChange('longitude', e.target.value === '' ? null : parseFloat(e.target.value))}
										onBlur={() => touch('longitude')}
										variant="outlined"
										size="small"
										error={!!fieldError('longitude')}
										helperText={fieldError('longitude')}
										slotProps={{ htmlInput: { step: '0.0001', min: -180, max: 180 } }}
									/>
								</Grid>
							</Grid>
						</Box>

						{/* Cage count */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Number of Cages{requiredMark}
							</Typography>
							<TextField
								fullWidth
								placeholder="Enter number of cages"
								type="number"
								value={formData.noOfCages ?? ''}
								onChange={(e) => handleChange('noOfCages', e.target.value === '' ? null : parseInt(e.target.value))}
								onBlur={() => touch('noOfCages')}
								variant="outlined"
								size="small"
								error={!!fieldError('noOfCages')}
								helperText={fieldError('noOfCages')}
								slotProps={{ htmlInput: { min: 0 } }}
							/>
						</Box>

						{/* Barge Availability */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Barge Availability{requiredMark}
							</Typography>
							<FormControl fullWidth size="small" error={!!fieldError('hasBarge')}>
								<Select
									value={formData.hasBarge === null ? '' : formData.hasBarge ? 'yes' : 'no'}
									onChange={(e) => {
										handleChange('hasBarge', e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null);
										touch('hasBarge');
									}}
									displayEmpty
								>
									<MenuItem value="" disabled>
										<em>Select availability</em>
									</MenuItem>
									<MenuItem value="yes">Barge On Site</MenuItem>
									<MenuItem value="no">No Barge</MenuItem>
								</Select>
								{fieldError('hasBarge') && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', pl: 1.5 }}>
										{fieldError('hasBarge')}
									</Typography>
								)}
							</FormControl>
						</Box>

						<Divider />

						{/* Assign Workers */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
								Assign Workers
							</Typography>

							{/* Search workers */}
							<Box sx={{ position: 'relative', mb: 2 }}>
								<TextField
									fullWidth
									placeholder="Search workers by name..."
									value={searchWorkerInput}
									onChange={(e) => setSearchWorkerInput(e.target.value)}
									variant="outlined"
									size="small"
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<Search size={16} />
												</InputAdornment>
											),
											endAdornment: workerSearchLoading ? (
												<InputAdornment position="end">
													<CircularProgress size={16} />
												</InputAdornment>
											) : searchWorkerInput ? (
												<InputAdornment position="end">
													<IconButton
														size="small"
														sx={{
															border: 0,
															mr: -1.5,
														}}
														onClick={() => setSearchWorkerInput('')}
													>
														<X size={16} />
													</IconButton>
												</InputAdornment>
											) : null,
										},
									}}
								/>

								{/* Search results dropdown */}
								{workerSearchResults.length > 0 && (
									<Box
										sx={{
											position: 'absolute',
											top: '100%',
											left: 0,
											right: 0,
											zIndex: 10,
											mt: 0.5,
											bgcolor: 'background.paper',
											border: '1px solid',
											borderColor: 'divider',
											borderRadius: 1,
											maxHeight: 200,
											overflowY: 'auto',
											boxShadow: 3,
										}}
									>
										{workerSearchResults.map((worker) => (
											<Box
												key={worker.id}
												onClick={() => handleAssignWorker(worker)}
												sx={{
													py: 1.5,
													px: 2,
													display: 'flex',
													alignItems: 'center',
													gap: 1.5,
													cursor: 'pointer',
													transition: 'all 0.15s ease',
													'&:hover': { bgcolor: 'action.hover' },
												}}
											>
												<Avatar src={worker.profileImageUrl} alt={worker.name} sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
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
												<UserPlus size={16} color="#9e9e9e" />
											</Box>
										))}
									</Box>
								)}
							</Box>

							{/* Assigned workers list */}
							{assignedWorkers.length > 0 ? (
								<Stack spacing={1}>
									{assignedWorkers.map((worker) => (
										<Box
											key={worker.id}
											sx={{
												p: 1.5,
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider',
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												transition: 'all 0.2s ease',
												'&:hover': { bgcolor: 'action.hover' },
											}}
										>
											<Avatar src={worker.profileImageUrl} alt={worker.name} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
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

											{/* Role dropdown */}
											<FormControl size="small" sx={{ minWidth: 120 }}>
												<Select
													value={worker.position}
													onChange={(e) => handleRoleChange(worker.id, e.target.value as number)}
													sx={{ fontSize: '0.8rem' }}
												>
													{CREW_ROLE_OPTIONS.map((opt) => (
														<MenuItem key={opt.value} value={opt.value}>
															{opt.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											{/* Remove button */}
											<IconButton size="small" onClick={() => handleRemoveAssignedWorker(worker.id)} sx={{ color: 'error.main' }}>
												<Trash2 size={16} />
											</IconButton>
										</Box>
									))}
								</Stack>
							) : (
								<Box
									sx={{
										p: 3,
										textAlign: 'center',
										border: '1px dashed',
										borderColor: 'divider',
										borderRadius: 1,
									}}
								>
									<Typography variant="body2" color="text.secondary">
										No workers assigned yet. Search above to add crew members.
									</Typography>
								</Box>
							)}
						</Box>
					</Stack>
				</Box>

				{/* Footer */}
				<Box
					sx={{
						p: 2.5,
						borderTop: '1px solid',
						borderColor: 'divider',
						display: 'flex',
						justifyContent: 'flex-end',
						gap: 1.5,
					}}
				>
					<Button
						variant="outlined"
						color="inherit"
						onClick={handleClose}
						disabled={saving}
						sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						disabled={!isFormValid || saving || (isEditMode && !isDataUpdated)}
						startIcon={saving ? <CircularProgress size={16} color="inherit" /> : isEditMode ? <Save size={16} /> : <Plus size={16} />}
						sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }}
					>
						{saving ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save Changes' : 'Create Farm'}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default FishFarmFormDrawer;
