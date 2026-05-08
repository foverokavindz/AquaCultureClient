import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { IApiClient } from './IApiClient';
import type { ApiClientConfig, ApiResponse, ClientTypeMap } from '../types/common.types';
import { apiConfig } from '../configs/api.config';

export class AxiosClient implements IApiClient {
	private static instance: AxiosClient | null = null;
	private axiosInstance: AxiosInstance;

	private constructor(config: ApiClientConfig) {
		this.axiosInstance = axios.create({
			baseURL: config.baseURL,
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json',
				...config.headers,
			},
		});

		this.setupInterceptors();
	}

	public static create(config: ApiClientConfig): IApiClient {
		if (this.instance) return this.instance;

		this.instance = new AxiosClient(config);
		return this.instance;
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.request.use(
			(config) => {
				// if (process.env.NODE_ENV === 'development') {
				// 	console.log('Request:', config.method?.toUpperCase(), config.url);
				// }

				return config;
			},
			async (error: AxiosError) => {
				return this.handleError(error);
			}
		);

		// Response interceptor - handle errors globally
		this.axiosInstance.interceptors.response.use(
			(response) => {
				// if (process.env.NODE_ENV === 'development') {
				// 	console.log('Response:', response.status, response.config.url);
				// }
				return response;
			},
			async (error: AxiosError) => {
				return this.handleError(error);
			}
		);
	}

	private async handleError(error: AxiosError): Promise<ApiResponse<null>> {
		if (error.response) {
			// Server responded with error
			const response = error.response.data as ApiResponse<null>;

			return response;
		} else if (error.request) {
			// Request made but no response
			return {
				success: false,
				data: null,
				message: 'No response from server',
				error: 'Unable to reach the server. Please check your connection.',

				timestamp: new Date().toISOString(),
			};
		} else {
			// Something else happened
			return {
				success: false,
				data: null,
				message: 'Request failed',
				error: error.message,
				timestamp: new Date().toISOString(),
			};
		}
	}

	public async get<T>(url: string, config?: ClientTypeMap['axios']): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
			return response.data;
		} catch (error) {
			return this.handleError(error as AxiosError) as Promise<ApiResponse<T>>;
		}
	}

	public async post<T>(url: string, data?: unknown, config?: ClientTypeMap['axios']): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
			return response.data;
		} catch (error) {
			return this.handleError(error as AxiosError) as Promise<ApiResponse<T>>;
		}
	}

	public async put<T>(url: string, data?: unknown, config?: ClientTypeMap['axios']): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
			return response.data;
		} catch (error) {
			return this.handleError(error as AxiosError) as Promise<ApiResponse<T>>;
		}
	}

	public async delete<T>(url: string, config?: ClientTypeMap['axios']): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
			return response.data;
		} catch (error) {
			return this.handleError(error as AxiosError) as Promise<ApiResponse<T>>;
		}
	}

	public async patch<T>(url: string, data?: unknown, config?: ClientTypeMap['axios']): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
			return response.data;
		} catch (error) {
			return this.handleError(error as AxiosError) as Promise<ApiResponse<T>>;
		}
	}
}

export const getApiClient = () => AxiosClient.create(apiConfig);
