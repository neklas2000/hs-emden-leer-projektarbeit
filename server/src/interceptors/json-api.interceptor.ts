import { PayloadMalformedException } from '@Exceptions/payload-malformed.exception';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { type Request } from 'express';
import { map, Observable, take } from 'rxjs';

export class JsonApiInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();

		if (['POST', 'PUT', 'PATCH'].includes(request.method.toUpperCase())) {
			if (
				request.body === null ||
				request.body === undefined ||
				typeof request.body !== 'object' ||
				Object.keys(request.body).length !== 1 ||
				!Object.hasOwn(request.body, 'data')
			) {
				throw new PayloadMalformedException();
			}

			request.body = request.body.data;
		}

		return next.handle().pipe(
			take(1),
			map((data) => {
				if (data === null || data === undefined) {
					return { data: null };
				}

				return { data };
			}),
		);
	}
}
