import {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
	RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';

import { HSEmdenLeerBaseException } from '@Exceptions/hs-emden-leer-base.exception';
import { InternalServerErrorException } from '@Exceptions/internal-server-error.exception';

export class RequestTimeoutInterceptor implements NestInterceptor {
	constructor(private readonly config: ConfigService) {}

	intercept(
		_context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			timeout({ each: this.config.get('REQUEST_TTL_IN_MILLISECONDS') }),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					throw new RequestTimeoutException();
				}

				if (!(err instanceof HSEmdenLeerBaseException)) {
					throw new InternalServerErrorException(err);
				}

				return throwError(() => err);
			}),
		);
	}
}
