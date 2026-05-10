import type { IApiClient } from '../api/IApiClient';
import { getApiClient } from '../api/AxiosClient';
import type { ApiResponse } from '../types/api.types';
import type { CrewWorker, SearchWorkerRequest, CreateWorker, UpdateWorker } from '../types/worker.types';

export class WorkerService {
	private api: IApiClient;

	constructor(api: IApiClient) {
		this.api = api;
	}

	public async GetAllWorkers(): Promise<ApiResponse<CrewWorker[]>> {
		return await this.api.get<CrewWorker[]>(`/Worker`);
	}

	public async GetWorkerById(id: string): Promise<ApiResponse<CrewWorker>> {
		return await this.api.get<CrewWorker>(`/Worker/${id}`);
	}

	public async GetWorkersByFarmId(farmId: string): Promise<ApiResponse<CrewWorker[]>> {
		return await this.api.get<CrewWorker[]>(`/Worker/farm/${farmId}`);
	}

	public async SearchWorkers(params: SearchWorkerRequest): Promise<ApiResponse<CrewWorker[]>> {
		return await this.api.get<CrewWorker[]>(`/Worker/search`, { params });
	}

	public async CreateWorker(dto: CreateWorker): Promise<ApiResponse<CrewWorker>> {
		return await this.api.post<CrewWorker>(`/Worker`, dto);
	}

	public async UpdateWorker(id: string, dto: UpdateWorker): Promise<ApiResponse<CrewWorker>> {
		return await this.api.put<CrewWorker>(`/Worker/${id}`, dto);
	}

	public async DeleteWorker(id: string): Promise<ApiResponse<boolean>> {
		return await this.api.delete<boolean>(`/Worker/${id}`);
	}
}

export const workerService = new WorkerService(getApiClient());
