import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { AllExceptionsFilter } from '@Filters/all-exceptions.filter';
import { DateService } from '@Services/date.service';

describe('Filter: AllExceptionsFilter', () => {
	let filter: AllExceptionsFilter;
	let httpAdapterHost: HttpAdapterHost;
	const oldEnv = { ...process.env };

	beforeEach(async () => {
		process.env.TZ = 'Europe/Berlin';
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-01-01T06:00:00'));

		const module = await Test.createTestingModule({
			providers: [
				AllExceptionsFilter,
				{
					provide: HttpAdapterHost,
					useValue: {
						httpAdapter: {
							getRequestUrl: () => {
								return '';
							},
							reply: () => {},
						},
					},
				},
				DateService,
			],
		}).compile();

		httpAdapterHost = module.get(HttpAdapterHost);
		filter = module.get(AllExceptionsFilter);
	});

	afterEach(() => {
		jest.useRealTimers();
		process.env = oldEnv;
	});

	it('should be created', () => {
		expect(httpAdapterHost).toBeTruthy();
		expect(filter).toBeTruthy();
	});

	it('should reply an internal server error exception', () => {
		const context = {
			getResponse: () => {},
			getRequest: () => {},
		};
		const argumentHost = {
			switchToHttp: () => context,
		} as any;

		jest.spyOn(context, 'getResponse').mockReturnValue({ type: 'response' } as any);
		jest.spyOn(context, 'getRequest').mockReturnValue({ type: 'request' } as any);
		jest.spyOn(argumentHost, 'switchToHttp');
		jest.spyOn(httpAdapterHost.httpAdapter, 'getRequestUrl').mockReturnValue('request path');
		jest.spyOn(httpAdapterHost.httpAdapter, 'reply');

		filter.catch(
			{
				code: 'HSEL-500-001',
			},
			argumentHost,
		);

		expect(argumentHost.switchToHttp).toHaveBeenCalled();
		expect(context.getRequest).toHaveBeenCalled();
		expect(httpAdapterHost.httpAdapter.getRequestUrl).toHaveBeenCalledWith({ type: 'request' });
		expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
			{
				type: 'response',
			},
			{
				timestamp: '2024-01-01T06:00:00Z',
				path: 'request path',
				code: 'HSEL-500-001',
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	});

	it('should reply the provided http exception', () => {
		const context = {
			getResponse: () => {},
			getRequest: () => {},
		};
		const argumentHost = {
			switchToHttp: () => context,
		} as any;

		jest.spyOn(context, 'getResponse').mockReturnValue({ type: 'response' } as any);
		jest.spyOn(context, 'getRequest').mockReturnValue({ type: 'request' } as any);
		jest.spyOn(argumentHost, 'switchToHttp');
		jest.spyOn(httpAdapterHost.httpAdapter, 'getRequestUrl').mockReturnValue('request path');
		jest.spyOn(httpAdapterHost.httpAdapter, 'reply');
		const exception = new HttpException('exception message', HttpStatus.NOT_FOUND);

		filter.catch(exception, argumentHost);

		expect(argumentHost.switchToHttp).toHaveBeenCalled();
		expect(context.getRequest).toHaveBeenCalled();
		expect(httpAdapterHost.httpAdapter.getRequestUrl).toHaveBeenCalledWith({ type: 'request' });
		expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
			{
				type: 'response',
			},
			{
				timestamp: '2024-01-01T06:00:00Z',
				path: 'request path',
				...Object(exception.getResponse()),
				status: HttpStatus.NOT_FOUND,
			},
			HttpStatus.NOT_FOUND,
		);
	});
});
