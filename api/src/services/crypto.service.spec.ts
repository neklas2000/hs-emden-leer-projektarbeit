import { Test } from '@nestjs/testing';

import { CryptoService } from '@Services/crypto.service';

describe('Service: CryptoService', () => {
	let service: CryptoService;

	beforeEach(async () => {
		jest.resetModules();

		const module = await Test.createTestingModule({
			providers: [CryptoService],
		}).compile();

		service = module.get(CryptoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create a correct SHA256 hash', () => {
		expect(service.hash('1234567890')).toEqual(
			'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
		);
	});
});
