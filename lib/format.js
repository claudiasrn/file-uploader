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

const DURATION_UNITS = {
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
	w: 7 * 24 * 60 * 60 * 1000,
};

export function parseDuration(input) {
	const match = /^(\d+)([hdw])$/.exec(input.trim());

	if (!match) return null;

	const amount = Number(match[1]);
	const unit = match[2];

	if (amount < 1 || amount > 365) return null;

	return new Date(Date.now() + amount * DURATION_UNITS[unit]);
}