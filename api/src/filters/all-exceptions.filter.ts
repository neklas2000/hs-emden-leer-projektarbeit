import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { DateService } from '@Services/date.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly date: DateService,
	) {}

	catch(exception: any, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const context = host.switchToHttp();
		const statusCode =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			timestamp: this.date.getCurrentTimestampWithOffset('0m').replace(' ', 'T').concat('Z'),
			path: httpAdapter.getRequestUrl(context.getRequest()),
			...(Object.hasOwn(exception, 'response') ? exception.response : exception),
			status: statusCode,
		};

		httpAdapter.reply(context.getResponse(), responseBody, statusCode);
	}
}
