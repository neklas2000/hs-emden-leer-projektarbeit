import { Test } from '@nestjs/testing';

import { DateService } from '@Services/date.service';

describe('Service: DateService', () => {
	let service: DateService;

	beforeEach(async () => {
		jest.resetModules();

		const module = await Test.createTestingModule({
			providers: [DateService],
		}).compile();

		service = module.get(DateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
