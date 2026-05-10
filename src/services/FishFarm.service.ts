import type { IApiClient } from '../api/IApiClient';
import { getApiClient } from '../api/AxiosClient';
import type { ApiResponse } from '../types/api.types';
import type { FishFarm, CreateFishFarm, UpdateFishFarm, SearchFishFarmRequest } from '../types/fishfarm.types';
import type { AssignWorkers } from '../types/worker.types';

export class FishFarmService {
	private api: IApiClient;

	constructor(api: IApiClient) {
		this.api = api;
	}

	public async GetAllFishFarmsWithWorkers(): Promise<ApiResponse<FishFarm[]>> {
		return await this.api.get<FishFarm[]>(`/FishFarm`);
	}

	public async AddNewFishFarm(newFishFarm: CreateFishFarm): Promise<ApiResponse<FishFarm[]>> {
		return await this.api.post<FishFarm[]>(`/FishFarm`, newFishFarm);
	}

	public async GetFishFarmByIdWithWorkers(id: string): Promise<ApiResponse<FishFarm>> {
		return await this.api.get<FishFarm>(`/FishFarm/${id}`);
	}

	public async UpdateFishFarm(id: string, updateData: UpdateFishFarm): Promise<ApiResponse<FishFarm>> {
		return await this.api.put<FishFarm>(`/FishFarm/${id}`, updateData);
	}

	public async DeleteFishFarm(id: string): Promise<ApiResponse<null>> {
		return await this.api.delete<null>(`/FishFarm/${id}`);
	}

	public async AssignWorkersToFishFarm(data: AssignWorkers): Promise<ApiResponse<FishFarm>> {
		return await this.api.post<FishFarm>(`/FishFarm/assign-workers`, data);
	}

	public async SearchFishFarms(params: SearchFishFarmRequest): Promise<ApiResponse<FishFarm[]>> {
		return await this.api.get<FishFarm[]>(`/FishFarm/search`, { params });
	}
}

export const fishFarmService = new FishFarmService(getApiClient());
