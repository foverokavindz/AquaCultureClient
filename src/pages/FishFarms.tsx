import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Plus, XIcon } from 'lucide-react';
import FishFarmCard from '../components/FishFarmCard';
import ViewToggle from '../components/ViewToggle';
import FishFarmQuickView from '../components/FishFarmQuickView';
import { FISH_FARM_SORT_BY, type FishFarmSortOrderType, type SearchFishFarm } from '../types/common.types';
import { fishFarmService } from '../services/FishFarm.service';
import FishFarmFormDrawer from '../components/FishFarmFormDrawer';
import PageShellLayout from '../layouts/PageShellLayout';
import type { FishFarm } from '../types/fishfarm.types';
import DataGridView from '../components/DataGridView';
import FilterItem from '../components/FilterItem';
import FilterRow from '../components/FilterRow';
import SearchInput from '../components/SearchInput';

const DEFAULT_FISH_FARM_SEARCH_AND_FILTER: SearchFishFarm = {
	searchTerm: '',
	hasBarge: undefined,
	avialableCagesRange: {
		max: 100,
		min: 0,
	},
	sortBy: FISH_FARM_SORT_BY['Name (A-Z)'],
};

// export const DUMMY_DATA = [
// 	{
// 		id: 'farm-1',
// 		name: 'Nordic Sea Farm Alpha',
// 		latitude: 68.3245,
// 		longitude: 14.2341,
// 		cagesCount: 12,
// 		hasBarge: true,
// 		imageUrl: '/fish_farm_demo.png',
// 	},
// 	{
// 		id: 'farm-2',
// 		name: 'Trondheim Coastal Facility',
// 		latitude: 63.4305,
// 		longitude: 10.3951,
// 		cagesCount: 8,
// 		hasBarge: false,
// 		imageUrl: '/fish_farm_demo.png',
// 	},
// 	{
// 		id: 'farm-3',
// 		name: 'Bergen Deep Water Site',
// 		latitude: 60.3928,
// 		longitude: 5.3221,
// 		cagesCount: 24,
// 		hasBarge: true,
// 		imageUrl: '/fish_farm_demo.png',
// 	},
// ];

function FishFarms() {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [previewFarmId, setPreviewFarmId] = useState<string | null>(null);
	const [searchAndFilterActive, setSearchAndFilterActive] = useState(false);
	const [fishFarmData, setFishFarmData] = useState<FishFarm[]>([]);
	const [fishFarmDataLoading, setFishFarmDataLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFiltersDisabled, setIsFiltersDisabled] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
	const [searchAndFilter, setSearchAndFilter] = useState<SearchFishFarm>(DEFAULT_FISH_FARM_SEARCH_AND_FILTER);
	const selectedFarm = fishFarmData?.find((f) => f.id === previewFarmId) || null;

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
			searchTerm: searchAndFilter?.searchTerm,
			hasBarge: searchAndFilter?.hasBarge,
			maxAvailableCages: searchAndFilter?.avialableCagesRange?.max,
			minAvailableCages: searchAndFilter?.avialableCagesRange?.min,
			sortBy: searchAndFilter?.sortBy,
		});

		if (response.success && response.data) {
			setFishFarmData(response.data);
		} else {
			console.error('Search FishFarms Error:', response.message);
			setError(response.message);
		}

		setFishFarmDataLoading(false);
	};

	// handle filter change
	const handleFilterChange = <K extends keyof SearchFishFarm>(key: K, value: SearchFishFarm[K]) => {
		setSearchAndFilterActive(true);
		setSearchAndFilter((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	// handle view mode change
	const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
		setViewMode(newMode);
	};

	// reset filters
	const resetFilters = () => {
		setSearchInput('');
		setSearchAndFilter(DEFAULT_FISH_FARM_SEARCH_AND_FILTER);
		setSearchAndFilterActive(false);
		fetchFishFarmsData();
	};

	// fetch all fish farms on mount
	useEffect(() => {
		fetchFishFarmsData();
	}, []);

	// call search api handler when searchAndFilter changes
	useEffect(() => {
		if (searchAndFilterActive) {
			searchFishFarms();
		}
	}, [searchAndFilter, searchAndFilterActive]);

	// disable filters when loading or error or no data
	useEffect(() => {
		if (!fishFarmDataLoading && !error && fishFarmData.length > 0) setIsFiltersDisabled(false);
		else setIsFiltersDisabled(true);
	}, [fishFarmDataLoading, error, fishFarmData]);

	// debounce for search input
	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchInput !== searchAndFilter.searchTerm) handleFilterChange('searchTerm', searchInput);
		}, 500);

		return () => clearTimeout(handler);
	}, [searchInput]);

	return (
		<>
			<PageShellLayout
				header={
					<>
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
								<SearchInput
									value={searchInput}
									onChange={setSearchInput}
									disabled={isFiltersDisabled}
									placeholder="Search fish farms..."
								/>

								{/* Add New Button */}
								<Button
									variant="contained"
									startIcon={<Plus size={20} />}
									sx={{ fontWeight: 600 }}
									onClick={() => setIsAddDrawerOpen(true)}
								>
									{' '}
									Add New
								</Button>
							</Box>
						</Box>

						<Divider sx={{ mb: 2 }} />

						{/* Filters */}
						<FilterRow
							filters={
								<>
									<FilterItem label="Barge Availability:">
										<Select
											disabled={isFiltersDisabled}
											value={searchAndFilter.hasBarge === undefined ? 'all' : searchAndFilter.hasBarge ? 'yes' : 'no'}
											onChange={(e) => {
												const val = e.target.value;
												handleFilterChange('hasBarge', val === 'all' ? undefined : val === 'yes');
											}}
											sx={{ minWidth: 130, '& legend': { display: 'none' } }}
										>
											<MenuItem value="all">All</MenuItem>
											<MenuItem value="yes">With Barge</MenuItem>
											<MenuItem value="no">Without Barge</MenuItem>
										</Select>
									</FilterItem>

									<FilterItem label="Cage Capacity:">
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
											sx={{ minWidth: 100 }}
										/>
									</FilterItem>

									<FilterItem label="Sort by:">
										<Select
											disabled={isFiltersDisabled}
											value={searchAndFilter.sortBy || FISH_FARM_SORT_BY['Name (A-Z)']}
											onChange={(e) => handleFilterChange('sortBy', e.target.value as FishFarmSortOrderType)}
											sx={{ '& legend': { display: 'none' } }}
										>
											<MenuItem value={FISH_FARM_SORT_BY['Name (A-Z)']}>Name (A-Z)</MenuItem>
											<MenuItem value={FISH_FARM_SORT_BY['Name (Z-A)']}>Name (Z-A)</MenuItem>
											<MenuItem value={FISH_FARM_SORT_BY['Cages (High - Low)']}>Cages (High - Low)</MenuItem>
											<MenuItem value={FISH_FARM_SORT_BY['Cages (Low - High)']}>Cages (Low - High)</MenuItem>
										</Select>
									</FilterItem>
								</>
							}
							actions={
								<>
									{searchAndFilterActive && (
										<Button variant="outlined" onClick={resetFilters} sx={{ textTransform: 'none', gap: 0.5 }}>
											<XIcon size={18} /> Clear Filters
										</Button>
									)}
									<ViewToggle viewMode={viewMode} onChange={handleViewModeChange} disabled={isFiltersDisabled} />
								</>
							}
						/>
					</>
				}
			>
				{/* content */}
				<DataGridView
					data={fishFarmData}
					loading={fishFarmDataLoading}
					error={error}
					viewMode={viewMode}
					noDataMessage="No fish farms found"
					getKey={(farm) => farm.id}
					renderItem={(farm) => (
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
					)}
				/>
			</PageShellLayout>

			{/* Quick View Drawer */}
			<FishFarmQuickView
				open={!!previewFarmId}
				farm={selectedFarm}
				onClose={() => setPreviewFarmId(null)}
				onExpand={(id) => navigate(`/fish-farms/${id}`)}
			/>

			{/* Add New Farm Drawer */}
			<FishFarmFormDrawer open={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} onSaved={() => fetchFishFarmsData()} />
		</>
	);
}

export default FishFarms;
