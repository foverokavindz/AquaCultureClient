import type { CrewRolePositionType, WorkerSortOrderType } from './common.types';
import type { FishFarmSummary } from './fishfarm.types';

export interface CrewWorker {
	id: string;
	name: string;
	profileImageUrl?: string;
	age: number;
	email: string;
	position?: number;
	certifiedUntil: string;
	fishFarmId?: string;
	fishFarm?: FishFarmSummary;
}

export interface AssignWorkers {
	fishFarmId: string;
	workers: {
		workerId: string;
		roleId: string;
	}[];
}

export interface SearchWorkerRequest {
	searchTerm?: string;
	position?: CrewRolePositionType;
	sortBy?: WorkerSortOrderType;
	isAssigned?: boolean;
}

export interface CreateWorker {
	name: string;
	email: string;
	age: number;
	position: number;
	certifiedUntil: string;
	profileImageUrl?: string;
}

export interface UpdateWorker {
	name?: string;
	email?: string;
	age?: number;
	position?: number;
	certifiedUntil?: string;
	profileImageUrl?: string;
}
