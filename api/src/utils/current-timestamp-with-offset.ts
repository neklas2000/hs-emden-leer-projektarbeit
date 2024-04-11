export type TimeUnit = 'days' | 'minutes';

export function currentTimestampWithOffset(offset: number, unit: TimeUnit) {
	const timeUnitMap = {
		days: 24 * 60 * 60 * 1000,
		minutes: 60 * 1000,
	};

	let timestamp = new Date().valueOf();
	timestamp += offset * timeUnitMap[unit];

	const date = new Date(timestamp)
		.toLocaleString('de-DE', {
			timeStyle: 'medium',
			dateStyle: 'medium',
			timeZone: 'Europe/Berlin',
		})
		.replace(',', '')
		.replaceAll('.', '-');

	return date
		.split(' ')
		.map((value, index) => {
			if (index === 0) return value.split('-').reverse().join('-');

			return value;
		})
		.join(' ');
}
