import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Plus, XIcon } from 'lucide-react';
import ViewToggle from '../components/ViewToggle';
import WorkerCard from '../components/WorkerCard';
import WorkerQuickView from '../components/WorkerQuickView';
import WorkerFormDrawer from '../components/WorkerFormDrawer';
import PageShellLayout from '../layouts/PageShellLayout';
import DataGridView from '../components/DataGridView';
import FilterRow from '../components/FilterRow';
import FilterItem from '../components/FilterItem';
import SearchInput from '../components/SearchInput';
import { WORKER_SORT_BY, CREW_ROLE_POSITION, type SearchWorker, type WorkerSortOrderType } from '../types/common.types';
import { workerService } from '../services/Worker.service';
import type { CrewWorker } from '../types/worker.types';

const DEFAULT_SEARCH_AND_FILTER: SearchWorker = {
	searchTerm: '',
	position: undefined,
	isAssigned: undefined,
	sortBy: WORKER_SORT_BY['Name (A-Z)'],
};

function Workers() {
	const navigate = useNavigate();

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [previewWorker, setPreviewWorker] = useState<CrewWorker | null>(null);
	const [searchInput, setSearchInput] = useState('');
	const [searchAndFilterActive, setSearchAndFilterActive] = useState(false);
	const [searchAndFilter, setSearchAndFilter] = useState<SearchWorker>(DEFAULT_SEARCH_AND_FILTER);
	const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

	const [workers, setWorkers] = useState<CrewWorker[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFiltersDisabled, setIsFiltersDisabled] = useState(false);

	// Data Fetching
	const fetchAllWorkers = async () => {
		setError(null);
		setLoading(true);
		const response = await workerService.GetAllWorkers();
		if (response.success && response.data) {
			setWorkers(response.data);
		} else {
			console.error('Get Workers Error:', response.message);
			setError(response.message);
		}
		setLoading(false);
	};

	const searchWorkers = async () => {
		setError(null);
		setLoading(true);
		const response = await workerService.SearchWorkers({
			searchTerm: searchAndFilter.searchTerm,
			position: searchAndFilter.position,
			isAssigned: searchAndFilter.isAssigned,
			sortBy: searchAndFilter.sortBy,
		});
		if (response.success && response.data) {
			setWorkers(response.data);
		} else {
			console.error('Search Workers Error:', response.message);
			setError(response.message);
		}
		setLoading(false);
	};

	// Effects
	useEffect(() => {
		fetchAllWorkers();
	}, []);

	useEffect(() => {
		if (searchAndFilterActive) {
			searchWorkers();
		}
	}, [searchAndFilter, searchAndFilterActive]);

	useEffect(() => {
		if (!loading && !error && workers.length > 0) setIsFiltersDisabled(false);
		else setIsFiltersDisabled(true);
	}, [loading, error, workers]);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchInput !== searchAndFilter.searchTerm) {
				handleFilterChange('searchTerm', searchInput);
			}
		}, 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	// Handlers
	const handleFilterChange = <K extends keyof SearchWorker>(key: K, value: SearchWorker[K]) => {
		setSearchAndFilterActive(true);
		setSearchAndFilter((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () => {
		setSearchInput('');
		setSearchAndFilter(DEFAULT_SEARCH_AND_FILTER);
		setSearchAndFilterActive(false);
		fetchAllWorkers();
	};

	const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
		if (newMode !== null) setViewMode(newMode);
	};

	const handlePreview = (id: string) => {
		setPreviewWorker(workers.find((w) => w.id === id) ?? null);
	};

	const handleWorkerSaved = () => {
		setIsAddDrawerOpen(false);
		if (searchAndFilterActive) searchWorkers();
		else fetchAllWorkers();
	};

	return (
		<>
			<PageShellLayout
				header={
					<>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Box>
								<Typography variant="h4" sx={{ fontWeight: 700 }}>
									Workers
								</Typography>
								<Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
									Manage your workforce, certifications, and assignments.
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<SearchInput value={searchInput} onChange={setSearchInput} disabled={isFiltersDisabled} placeholder="Search workers..." />
								<Button
									variant="contained"
									startIcon={<Plus size={20} />}
									sx={{ fontWeight: 600 }}
									onClick={() => setIsAddDrawerOpen(true)}
								>
									Add New
								</Button>
							</Box>
						</Box>

						<Divider sx={{ mb: 2 }} />

						<FilterRow
							filters={
								<>
									<FilterItem label="Role:">
										<Select
											disabled={isFiltersDisabled}
											size="small"
											value={searchAndFilter.position === undefined ? 'all' : searchAndFilter.position}
											onChange={(e) => {
												const val = e.target.value;
												handleFilterChange('position', val === 'all' ? undefined : (Number(val) as any));
											}}
											displayEmpty
											sx={{ minWidth: 140, '& legend': { display: 'none' } }}
										>
											<MenuItem value="all">All Roles</MenuItem>
											<MenuItem value={CREW_ROLE_POSITION.CEO}>CEO</MenuItem>
											<MenuItem value={CREW_ROLE_POSITION.Captain}>Captain</MenuItem>
											<MenuItem value={CREW_ROLE_POSITION.Worker}>Worker</MenuItem>
										</Select>
									</FilterItem>

									<FilterItem label="Assignment:">
										<Select
											disabled={isFiltersDisabled}
											size="small"
											value={searchAndFilter.isAssigned === undefined ? 'all' : searchAndFilter.isAssigned ? 'yes' : 'no'}
											onChange={(e) => {
												const val = e.target.value;
												handleFilterChange('isAssigned', val === 'all' ? undefined : val === 'yes');
											}}
											displayEmpty
											sx={{ minWidth: 130, '& legend': { display: 'none' } }}
										>
											<MenuItem value="all">All</MenuItem>
											<MenuItem value="yes">Assigned</MenuItem>
											<MenuItem value="no">Unassigned</MenuItem>
										</Select>
									</FilterItem>

									<FilterItem label="Sort by:">
										<Select
											disabled={isFiltersDisabled}
											size="small"
											value={searchAndFilter.sortBy || WORKER_SORT_BY['Name (A-Z)']}
											onChange={(e) => handleFilterChange('sortBy', e.target.value as WorkerSortOrderType)}
											sx={{ '& legend': { display: 'none' } }}
										>
											<MenuItem value={WORKER_SORT_BY['Name (A-Z)']}>Name (A-Z)</MenuItem>
											<MenuItem value={WORKER_SORT_BY['Name (Z-A)']}>Name (Z-A)</MenuItem>
											<MenuItem value={WORKER_SORT_BY['Age (High - Low)']}>Age (High-Low)</MenuItem>
											<MenuItem value={WORKER_SORT_BY['Age (Low - High)']}>Age (Low-High)</MenuItem>
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
				<DataGridView
					data={workers}
					loading={loading}
					error={error}
					viewMode={viewMode}
					noDataMessage="No workers found"
					getKey={(w) => w.id}
					renderItem={(w) => (
						<WorkerCard worker={w} viewMode={viewMode} onViewClick={(id) => navigate(`/workers/${id}`)} onPreview={handlePreview} />
					)}
				/>
			</PageShellLayout>

			<WorkerQuickView open={!!previewWorker} worker={previewWorker} onClose={() => setPreviewWorker(null)} />
			<WorkerFormDrawer open={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} onSaved={handleWorkerSaved} />
		</>
	);
}

export default Workers;
