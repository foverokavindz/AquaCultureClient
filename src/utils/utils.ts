export const extractCloudinaryPublicId = (url: string): string | null => {
	try {
		const idx = url.indexOf('/upload/');
		if (idx === -1) return null;
		let after = url.substring(idx + 8);
		after = after.replace(/^v\d+\//, '');
		const dot = after.lastIndexOf('.');
		return dot !== -1 ? after.substring(0, dot) : after;
	} catch {
		return null;
	}
};

export const getPositionColor = (position: number): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default' => {
	switch (position) {
		case 0:
			return 'primary';
		case 1:
			return 'secondary';
		case 2:
			return 'success';
		case 3:
			return 'error';
		default:
			return 'primary';
	}
};

export const isCertExpired = (dateStr: string): boolean => {
	return new Date(dateStr) < new Date();
};
