import { currentTimestampWithOffset } from './current-timestamp-with-offset';

describe('Util: currentTimestampWithOffset', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-01-01T06:00:00'));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should get the current timestamp with an offset of 7 days', () => {
		const date = currentTimestampWithOffset(7, 'days');

		expect(date).toEqual('2024-01-08 06:00:00');
	});

	it('should get the current timestamp with an offset of 30 minutes', () => {
		const date = currentTimestampWithOffset(30, 'minutes');

		expect(date).toEqual('2024-01-01 06:30:00');
	});
});
