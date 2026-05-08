import type { FishFarmSortOrderType } from './common.types';

export interface WorkerDto {
	id: string;
	name: string;
	profileImageUrl: string;
	age: number;
	email: string;
	position: number;
	certifiedUntil: string;
	fishFarmId: string;
}

export interface FishFarmDto {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	noOfCages: number;
	hasBarge: boolean;
	pictureUrl: string;
	workers: WorkerDto[] | [] | null;
}

export interface CreateFishFarmDto {
	name: string;
	latitude: number;
	longitude: number;
	noOfCages: number;
	hasBarge: boolean;
	pictureUrl: string;
}

export interface UpdateFishFarmDto {
	name?: string;
	latitude?: number;
	longitude?: number;
	noOfCages?: number;
	hasBarge?: boolean;
	pictureUrl?: string;
}

export interface AssignWorkersDto {
	fishFarmId: string;
	workers: {
		workerId: string;
		roleId: string;
	}[];
}

export interface SearchFishFarmRequestDto {
	searchTerm?: string;
	hasBarge?: boolean;
	minAvailableCages?: number;
	maxAvailableCages?: number;
	sortBy?: FishFarmSortOrderType;
}
