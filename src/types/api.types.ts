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
