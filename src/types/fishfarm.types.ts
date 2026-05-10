import type { FishFarmSortOrderType } from './common.types';
import type { CrewWorker } from './worker.types';

export interface FishFarmSummary {
	id: string;
	name: string;
	pictureUrl?: string;
}

export interface FishFarm {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	noOfCages: number;
	hasBarge: boolean;
	pictureUrl: string;
	workers: CrewWorker[] | [] | null;
}

export interface CreateFishFarm {
	name: string | null;
	latitude: number | null;
	longitude: number | null;
	noOfCages: number | null;
	hasBarge: boolean | null;
	pictureUrl: string | null;
	workers:
		| {
				id: string;
				position: number;
		  }[]
		| null;
}

export interface UpdateFishFarm {
	name?: string;
	latitude?: number;
	longitude?: number;
	noOfCages?: number;
	hasBarge?: boolean;
	pictureUrl?: string;
	workers?: {
		id: string;
		position: number;
	}[];
}

export interface SearchFishFarmRequest {
	searchTerm?: string;
	hasBarge?: boolean;
	minAvailableCages?: number;
	maxAvailableCages?: number;
	sortBy?: FishFarmSortOrderType;
}
