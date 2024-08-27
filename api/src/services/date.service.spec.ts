import { Test } from '@nestjs/testing';

import { DateTime } from 'luxon';

import { DateService } from '@Services/date.service';

describe('Service: DateService', () => {
	let service: DateService;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(
			DateTime.fromFormat('2024-01-01 06:00:00', 'yyyy-MM-dd HH:mm:ss').toJSDate(),
		);
	});

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [DateService],
		}).compile();

		service = module.get(DateService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('getExpirationDateWithOffset(string): Date', () => {
		it('should return a js date with a 7d offset', () => {
			const expected = DateTime.fromFormat('2024-01-08 06:00:00', 'yyyy-MM-dd HH:mm:ss').toJSDate();

			expect(service.getExpirationDateWithOffset('7d')).toEqual(expected);
		});

		it('should return a js date with a 15m offset', () => {
			const expected = DateTime.fromFormat('2024-01-01 06:15:00', 'yyyy-MM-dd HH:mm:ss').toJSDate();

			expect(service.getExpirationDateWithOffset('15m')).toEqual(expected);
		});

		it('should return a js date with a 1ms offset', () => {
			const expected = DateTime.fromFormat(
				'2024-01-01 06:00:00.001',
				'yyyy-MM-dd HH:mm:ss.SSS',
			).toJSDate();

			expect(service.getExpirationDateWithOffset('1ms')).toEqual(expected);
		});
	});

	describe('getCurrentTimestmapWithOffset(string): string', () => {
		it('should add 30 minutes to the current time and return the timestamp as a string', () => {
			expect(service.getCurrentTimestampWithOffset('30m')).toEqual('2024-01-01 06:30:00');
		});
	});

	describe('isAfterCurrentTimestamp(string | Date): boolean', () => {
		it('should transform the date and check if it is after the current date', () => {
			expect(service.isAfterCurrentTimestamp(new Date(2024, 0, 1, 6, 1, 1))).toBe(true);
		});

		it('should check if the given timestamp is after the current date', () => {
			expect(service.isAfterCurrentTimestamp('2024-01-01 05:59:59')).toBe(false);
		});
	});

	describe('parseDate(Date): string', () => {
		it('should take a js date and parse it into a string (yyyy-MM-dd)', () => {
			expect(service.parseDate(new Date())).toEqual('2024-01-01');
		});
	});
});
