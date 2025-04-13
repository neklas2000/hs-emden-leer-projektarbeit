import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { DateService } from '@Common/services';

export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly date: DateService,
	) {}

	catch(exception: any, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const context = host.switchToHttp();
		let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

		if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
		}

		const responseBody = {
			timestamp: this.date.nowAsString().replace(' ', 'T').concat('Z'),
			path: httpAdapter.getRequestUrl(context.getRequest()),
			...(Object.hasOwn(exception, 'response') ? exception.response : exception),
			status: statusCode,
		};

		httpAdapter.reply(context.getResponse(), responseBody, statusCode);
	}
}
