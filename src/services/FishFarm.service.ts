import type { IApiClient } from '../api/IApiClient';
import type {
	CreateFishFarmDto,
	FishFarmDto,
	UpdateFishFarmDto,
	AssignWorkersDto,
	SearchFishFarmRequestDto,
} from '../types/services.types';
import type { ApiResponse } from '../types/common.types';
import { getApiClient } from '../api/AxiosClient';

export class FishFarmService {
	private api: IApiClient;

	constructor(api: IApiClient) {
		this.api = api;
	}

	public async GetAllFishFarmsWithWorkers(): Promise<ApiResponse<FishFarmDto[]>> {
		return await this.api.get<FishFarmDto[]>(`/FishFarm`);
	}

	public async AddNewFishFarm(newFishFarm: CreateFishFarmDto): Promise<ApiResponse<FishFarmDto[]>> {
		return await this.api.post<FishFarmDto[]>(`/FishFarm`, newFishFarm);
	}

	public async GetFishFarmByIdWithWorkers(id: string): Promise<ApiResponse<FishFarmDto>> {
		return await this.api.get<FishFarmDto>(`/FishFarm/${id}`);
	}

	public async UpdateFishFarm(id: string, updateData: UpdateFishFarmDto): Promise<ApiResponse<FishFarmDto>> {
		return await this.api.put<FishFarmDto>(`/FishFarm/${id}`, updateData);
	}

	public async DeleteFishFarm(id: string): Promise<ApiResponse<null>> {
		return await this.api.delete<null>(`/FishFarm/${id}`);
	}

	public async AssignWorkersToFishFarm(data: AssignWorkersDto): Promise<ApiResponse<FishFarmDto>> {
		return await this.api.post<FishFarmDto>(`/FishFarm/assign-workers`, data);
	}

	public async SearchFishFarms(params: SearchFishFarmRequestDto): Promise<ApiResponse<FishFarmDto[]>> {
		return await this.api.get<FishFarmDto[]>(`/FishFarm/search`, { params });
	}
}

export const fishFarmService = new FishFarmService(getApiClient());
