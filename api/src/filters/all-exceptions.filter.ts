import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { currentTimestampWithOffset } from '@Utils/current-timestamp-with-offset';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: any, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const context = host.switchToHttp();
		const statusCode =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			timestamp: currentTimestampWithOffset(0, 'minutes').replace(' ', 'T').concat('Z'),
			path: httpAdapter.getRequestUrl(context.getRequest()),
			...(Object.hasOwn(exception, 'response') ? exception.response : exception),
			status: statusCode,
		};

		httpAdapter.reply(context.getResponse(), responseBody, statusCode);
	}
}
