import { HttpException, HttpStatus } from '@nestjs/common';

type Options = {
	message: string;
	description: string;
	cause: Nullable<HttpException>;
};

export class HSEmdenLeerBaseException extends HttpException {
	constructor(status: HttpStatus, subCode: number, { message, description, cause }: Options) {
		super(
			{
				status,
				message,
				description,
				code: `HSEL-${status}-${String(subCode).padStart(3, '0')}`,
			},
			status,
			{
				cause,
			},
		);
	}
}
