const units = ["bytes", "KB", "MB", "GB", "TB"];

export function formatSize(bytes) {
	let value = bytes;
	let unit = 0;

	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit++;
	}

	const rounded = unit === 0 ? value : value.toFixed(1);

	return `${rounded} ${units[unit]}`;
}