import type { ClientTypeMap, ApiResponse } from "../types/api.types";

export interface IApiClient {
	/**
	 * Perform a GET request
	 * @param url - The endpoint URL
	 * @param config - Optional request configuration
	 */
	get<T>(url: string, config?: ClientTypeMap[keyof ClientTypeMap]): Promise<ApiResponse<T>>;

	/**
	 * Perform a POST request
	 * @param url - The endpoint URL
	 * @param data - The request body data
	 * @param config - Optional request configuration
	 */
	post<T>(url: string, data?: unknown, config?: ClientTypeMap[keyof ClientTypeMap]): Promise<ApiResponse<T>>;

	/**
	 * Perform a PUT request
	 * @param url - The endpoint URL
	 * @param data - The request body data
	 * @param config - Optional request configuration
	 */
	put<T>(url: string, data?: unknown, config?: ClientTypeMap[keyof ClientTypeMap]): Promise<ApiResponse<T>>;

	/**
	 * Perform a DELETE request
	 * @param url - The endpoint URL
	 * @param config - Optional request configuration
	 */
	delete<T>(url: string, config?: ClientTypeMap[keyof ClientTypeMap]): Promise<ApiResponse<T>>;

	/**
	 * Perform a PATCH request
	 * @param url - The endpoint URL
	 * @param data - The request body data
	 * @param config - Optional request configuration
	 */
	patch<T>(url: string, data?: unknown, config?: ClientTypeMap[keyof ClientTypeMap]): Promise<ApiResponse<T>>;
}
