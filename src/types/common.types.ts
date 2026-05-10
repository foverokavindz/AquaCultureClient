export const FISH_FARM_SORT_BY = {
	'Name (A-Z)': 'name_asc',
	'Name (Z-A)': 'name_desc',
	'Cages (High - Low)': 'cages_desc',
	'Cages (Low - High)': 'cages_asc',
} as const;

export type FishFarmSortOrderType = (typeof FISH_FARM_SORT_BY)[keyof typeof FISH_FARM_SORT_BY];

export interface SearchFishFarm {
	searchTerm?: string;
	hasBarge?: boolean;
	avialableCagesRange?: {
		max: number;
		min: number;
	};
	sortBy?: FishFarmSortOrderType;
}

export const WORKER_SORT_BY = {
	'Name (A-Z)': 'name_asc',
	'Name (Z-A)': 'name_desc',
	'Age (High - Low)': 'age_desc',
	'Age (Low - High)': 'age_asc',
} as const;

export type WorkerSortOrderType = (typeof WORKER_SORT_BY)[keyof typeof WORKER_SORT_BY];

export const CREW_ROLE_POSITION = {
	CEO: 0,
	Captain: 1,
	Worker: 2,
	'Not Assigned': 3,
} as const;

export type CrewRolePositionType = (typeof CREW_ROLE_POSITION)[keyof typeof CREW_ROLE_POSITION];

export interface SearchWorker {
	searchTerm?: string;
	position?: CrewRolePositionType;
	sortBy?: WorkerSortOrderType;
	isAssigned?: boolean;
}

export const CREW_POSITION_LABELS: Record<number, string> = {
	0: 'CEO',
	1: 'Captain',
	2: 'Worker',
	3: 'Not Assigned',
};

export const CREW_ROLE_OPTIONS = Object.entries(CREW_ROLE_POSITION).map(([label, value]) => ({
	label,
	value,
}));
