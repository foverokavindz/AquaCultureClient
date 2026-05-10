import type { IApiClient } from '../api/IApiClient';
import { getApiClient } from '../api/AxiosClient';
import type { ApiResponse } from '../types/api.types';
import type { ImageUploadResponse, Signature } from '../types/imageUpload.types';

export class FileUploaderService {
	private api: IApiClient;

	constructor(api: IApiClient) {
		this.api = api;
	}

	public async UploadImage(file: File): Promise<ApiResponse<ImageUploadResponse>> {
		try {
			const signResponse = await this.api.get<Signature>(`/Image/sign`);
			if (!signResponse.success || !signResponse.data) {
				return {
					success: false,
					data: null,
					message: 'Failed to get upload signature',
					error: 'Failed to get upload signature',
					timestamp: new Date().toISOString(),
				};
			}

			const { signature, timestamp, apiKey, folder, uploadUrl } = signResponse.data;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('signature', signature);
			formData.append('timestamp', timestamp.toString());
			formData.append('api_key', apiKey);
			formData.append('folder', folder);

			const cloudinaryResponse = await fetch(uploadUrl, {
				method: 'POST',
				body: formData,
			});

			const data = await cloudinaryResponse.json();

			if (data.error) {
				return {
					success: false,
					data: null,
					message: data.error.message,
					error: data.error.message,
					timestamp: new Date().toISOString(),
				};
			}

			return {
				success: true,
				data: {
					url: data.secure_url,
					publicId: data.public_id,
				},
				message: 'Image uploaded successfully',
				error: null,
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			return {
				success: false,
				data: null,
				message: 'Image upload failed',
				error: error instanceof Error ? error.message : 'Unknown error',
				timestamp: new Date().toISOString(),
			};
		}
	}

	public async DeleteImage(publicId: string): Promise<ApiResponse<boolean>> {
		return await this.api.delete<boolean>(`/Image/${encodeURIComponent(publicId)}`);
	}
}

export const fileUploaderService = new FileUploaderService(getApiClient());
