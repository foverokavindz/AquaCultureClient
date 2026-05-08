import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, XIcon } from 'lucide-react';
import FishFarmCard from '../components/FishFarmCard';
import { CircularProgress, Stack, Alert, IconButton } from '@mui/material';
import ViewToggle from '../components/ViewToggle';
import FishFarmQuickView from '../components/FishFarmQuickView';
import type { FishFarmDto } from '../types/services.types';
import { FISH_FARM_SORT_BY, type FishFarmSortOrderType, type SearchFishFarm } from '../types/common.types';
import { fishFarmService } from '../services/FishFarm.service';
import NoDataImage from '../assets/noData.svg';

export const DUMMY_DATA = [
	{
		id: 'farm-1',
		name: 'Nordic Sea Farm Alpha',
		latitude: 68.3245,
		longitude: 14.2341,
		cagesCount: 12,
		hasBarge: true,
		imageUrl: '/fish_farm_demo.png',
	},
	{
		id: 'farm-2',
		name: 'Trondheim Coastal Facility',
		latitude: 63.4305,
		longitude: 10.3951,
		cagesCount: 8,
		hasBarge: false,
		imageUrl: '/fish_farm_demo.png',
	},
	{
		id: 'farm-3',
		name: 'Bergen Deep Water Site',
		latitude: 60.3928,
		longitude: 5.3221,
		cagesCount: 24,
		hasBarge: true,
		imageUrl: '/fish_farm_demo.png',
	},
];

function FishFarms() {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [previewFarmId, setPreviewFarmId] = useState<string | null>(null);
	const [searchAndFilterActive, setSearchAndFilterActive] = useState(false);
	const [fishFarmData, setFishFarmData] = useState<FishFarmDto[]>([]);
	const [fishFarmDataLoading, setFishFarmDataLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFiltersDisabled, setIsFiltersDisabled] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [searchAndFilter, setSearchAndFilter] = useState<SearchFishFarm>({
		searchTerm: '',
		hasBarge: undefined,
		avialableCagesRange: {
			max: 100,
			min: 0
		},
		sortBy: FISH_FARM_SORT_BY['Name (A-Z)'],
	});

	const fetchFishFarmsData = async () => {
		setError(null);
		setFishFarmDataLoading(true);

		const response = await fishFarmService.GetAllFishFarmsWithWorkers();

		if (response.success && response.data) {
			setFishFarmData(response.data);
		} else {
			console.error('Get FishFarms Error:', response.message);
			setError(response.message);
		}

		setFishFarmDataLoading(false);
	};

	const searchFishFarms = async () => {
		setError(null);
		setFishFarmDataLoading(true);

		const response = await fishFarmService.SearchFishFarms({
			searchTerm: searchAndFilter.searchTerm,
			hasBarge: searchAndFilter.hasBarge,
			maxAvailableCages: searchAndFilter.avialableCagesRange.max,
			minAvailableCages: searchAndFilter.avialableCagesRange.min,
			sortBy: searchAndFilter.sortBy,
		});

		if (response.success && response.data) {
			setFishFarmData(response.data);
		} else {
			console.error('Search FishFarms Error:', response.message);
			setError(response.message);
		}

		setFishFarmDataLoading(false);
	};

	const handleFilterChange = <K extends keyof SearchFishFarm>(key: K, value: SearchFishFarm[K]) => {
		setSearchAndFilterActive(true)
		setSearchAndFilter((prev) => ({
			...prev,
			[key]: value
		}));
	};

	const resetFilters = () => {
		setSearchInput('');
		setSearchAndFilter({
			searchTerm: '',
			hasBarge: undefined,
			avialableCagesRange: {
				max: 100,
				min: 0
			},
			sortBy: FISH_FARM_SORT_BY['Name (A-Z)'],
		});
		setSearchAndFilterActive(false);
		fetchFishFarmsData();
	};

	const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
		setViewMode(newMode);
	};

	const selectedFarm = fishFarmData?.find((f) => f.id === previewFarmId) || null;

	useEffect(() => {
		fetchFishFarmsData();
	}, []);

	// call search api handler when searchAndFilter changes
	useEffect(() => {
		if (searchAndFilterActive) {
			searchFishFarms();
		}
	}, [searchAndFilter, searchAndFilterActive]);

	useEffect(() => {
		if (!fishFarmDataLoading && !error && fishFarmData.length > 0) setIsFiltersDisabled(false)
		else setIsFiltersDisabled(true)
	}, [fishFarmDataLoading, error, fishFarmData])

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchInput !== searchAndFilter.searchTerm) {
				handleFilterChange('searchTerm', searchInput);
			}
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchInput]);

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3, pb: 0 }}>
			<Box sx={{ flexShrink: 0 }}>
				{/* Heading area*/}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					{/* heading */}
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							Fish Farms
						</Typography>
						<Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
							Manage your active aquaculture sites
						</Typography>
					</Box>

					{/* actions */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{/* search bar */}
						<TextField
							disabled={isFiltersDisabled}
							placeholder="Search fish farms..."
							variant="outlined"
							size="small"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<Search size={20} />
										</InputAdornment>
									),
									placeholder: 'Search fish farms...',
									endAdornment: (
										<InputAdornment position='end'>
											{
												searchInput && (
													<IconButton sx={{
														border: 0,
														p: 1,
														mr: -1.5

													}}
														onClick={() => setSearchInput('')}
													>
														<XIcon size={20} />
													</IconButton>
												)
											}
										</InputAdornment>
									)
								},
							}}
						/>

						{/* Add New Button */}
						<Button variant="contained" startIcon={<Plus size={20} />} sx={{ fontWeight: 600 }}>
							Add New
						</Button>
					</Box>
				</Box>

				<Divider sx={{ mb: 2 }} />

				{/* Filters */}

				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						{/* Has Barge Dropdown */}
						<FormControl size="small" sx={{ minWidth: 130 }}>
							<Stack
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									Barge Avilability:
								</Typography>
								<Select
									disabled={isFiltersDisabled}
									labelId="has-barge-label"
									label="Has Barge"
									defaultValue="all"
									value={searchAndFilter.hasBarge === undefined ? 'all' : searchAndFilter.hasBarge ? 'yes' : 'no'}
									onChange={(e) => {
										const val = e.target.value;
										handleFilterChange('hasBarge', val === 'all' ? undefined : val === 'yes' ? true : false);
									}}
									displayEmpty
									sx={{
										'& legend': {
											display: 'none',
										},
									}}
								>
									<MenuItem value="all">All</MenuItem>
									<MenuItem value="yes">With Barge</MenuItem>
									<MenuItem value="no">Without Barge</MenuItem>
								</Select>
							</Stack>
						</FormControl>

						{/* Cages Range */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 250 }}>
							<Stack
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
									Cage Capacity:
								</Typography>
								<Slider
									disabled={isFiltersDisabled}
									value={[searchAndFilter.avialableCagesRange?.min ?? 0, searchAndFilter.avialableCagesRange?.max ?? 100]}
									onChange={(_, newValue) => {
										const [min, max] = newValue as number[];
										handleFilterChange('avialableCagesRange', { min, max });
									}}
									valueLabelDisplay="auto"
									min={0}
									max={100}
									size="small"
									sx={{
										minWidth: 100,
									}}
								/>
							</Stack>
						</Box>

						{/* Sort By */}
						<FormControl size="small" sx={{ minWidth: 150 }}>
							<Stack
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
									Sort by:{' '}
								</Typography>

								<Select
									disabled={isFiltersDisabled}
									labelId="sort-by-label"
									label="Sort By"
									defaultValue={FISH_FARM_SORT_BY['Name (A-Z)']}
									value={searchAndFilter.sortBy || FISH_FARM_SORT_BY['Name (A-Z)']}
									onChange={(e) => handleFilterChange('sortBy', e.target.value as FishFarmSortOrderType)}
									sx={{
										'& legend': {
											display: 'none',
										},
									}}
								>
									<MenuItem value={FISH_FARM_SORT_BY['Name (A-Z)']}>Name (A-Z)</MenuItem>
									<MenuItem value={FISH_FARM_SORT_BY['Name (Z-A)']}>Name (Z-A)</MenuItem>
									<MenuItem value={FISH_FARM_SORT_BY['Cages (High - Low)']}>Cages (High - Low)</MenuItem>
									<MenuItem value={FISH_FARM_SORT_BY['Cages (Low - High)']}>Cages (Low - High)</MenuItem>
								</Select>
							</Stack>
						</FormControl>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{searchAndFilterActive && (
							<Button size="medium" variant='outlined' onClick={resetFilters} sx={{ textTransform: 'none', gap: 0.5 }}>
								<XIcon size={18} />
								Clear Filters
							</Button>
						)}
						{/* View Toggle */}
						<ViewToggle viewMode={viewMode} onChange={handleViewModeChange} disabled={isFiltersDisabled} />
					</Box>
				</Box>

			</Box>

			{/* content area */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', pb: { xs: 3, md: 5 }, pr: 1 }}>
				{fishFarmDataLoading && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
							p: 4,
						}}
					>
						<CircularProgress />
					</Box>
				)}
				{!fishFarmDataLoading && error && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
							p: 4,
						}}
					>
						<Alert severity="error" variant="outlined" sx={{ width: '100%', maxWidth: 500 }}>
							{error}
						</Alert>
					</Box>
				)}
				{!fishFarmDataLoading && !error && fishFarmData.length === 0 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
							width: '100%',
							p: 4,
						}}
					>
						<Stack
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 2,
							}}
						>
							<img src={NoDataImage} alt="No Data" width={150} height={150} />

							<Stack
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 0.5,
								}}
							>
								<Typography variant="h6" color="textSecondary">
									No results found
								</Typography>
								{/* <Typography variant="body2" color="textSecondary">
									We can't find any item matching your search.{' '}
								</Typography> */}
							</Stack>
						</Stack>
					</Box>
				)}
				{!fishFarmDataLoading && !error && fishFarmData.length > 0 && (
					<Grid container spacing={viewMode === 'list' ? 2 : 4}>
						{fishFarmData.map((farm) => (
							<Grid size={viewMode === 'list' ? { xs: 12 } : { xs: 12, sm: 6, lg: 4 }} key={farm.id}>
								<FishFarmCard
									id={farm.id}
									name={farm.name}
									latitude={farm.latitude}
									longitude={farm.longitude}
									cagesCount={farm.noOfCages}
									hasBarge={farm.hasBarge}
									imageUrl={farm.pictureUrl}
									viewMode={viewMode}
									onView={() => navigate(`/fish-farms/${farm.id}`)}
									onPreview={() => setPreviewFarmId(farm.id)}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</Box>

			{/* Quick View Drawer */}
			<FishFarmQuickView
				open={!!previewFarmId}
				farm={selectedFarm}
				onClose={() => setPreviewFarmId(null)}
				onExpand={(id) => navigate(`/fish-farms/${id}`)}
			/>
		</Box>
	);
}

export default FishFarms;
