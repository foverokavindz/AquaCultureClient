export interface ImageUploadResponse {
	url: string;
	publicId: string;
}

export interface Signature {
	signature: string;
	timestamp: number;
	apiKey: string;
	folder: string;
	uploadUrl: string;
}
