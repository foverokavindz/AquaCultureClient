import type { AxiosRequestConfig } from 'axios';

export type ApiResponse<T = unknown> = {
	success: boolean;
	data: T | null;
	message: string | null;
	error: string | null;
	timestamp: string;
};

export interface ApiClientConfig {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export interface ClientTypeMap {
	axios: AxiosRequestConfig;
	// fetch: RequestInit;
}

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