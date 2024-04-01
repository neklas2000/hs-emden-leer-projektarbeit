type TimeUnit = 'days' | 'minutes';

export function currentTimestampWithOffset(offset: number, unit: TimeUnit) {
  const timeUnitMap = {
    days: 24 * 60 * 60 * 1000,
    minutes: 60 * 1000,
  };

  let timestamp = new Date().valueOf();
  timestamp += offset * timeUnitMap[unit];

  const date = new Date(timestamp)
    .toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
