import { Test } from '@nestjs/testing';

import { InvalidUUIDFormatException } from '@Exceptions/invalid-uuid-format.exception';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';

describe('Pipe: ValidUUIDPipe', () => {
	let pipe: ValidUUIDPipe;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ValidUUIDPipe],
		}).compile();

		pipe = module.get(ValidUUIDPipe);
	});

	it('should be created', () => {
		expect(pipe).toBeTruthy();
	});

	it("should throw an exception because the value is not of the type 'string'", () => {
		expect(() => pipe.transform(1234567890)).toThrow(InvalidUUIDFormatException);
	});

	it('should throw an exception because the value is a malformed uuid', () => {
		expect(() => pipe.transform('e0c4b928-f412-494c-a29f-3976WTF49838')).toThrow(
			InvalidUUIDFormatException,
		);
	});

	it('should return the value because it is a well formed uuid', () => {
		const UUID = 'e0c4b928-f412-494c-a29f-3976f0749838';

		expect(pipe.transform(UUID)).toEqual(UUID);
	});
});
