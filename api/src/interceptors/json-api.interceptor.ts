import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { map, Observable, take } from 'rxjs';

@Injectable()
export class JsonApiInterceptor implements NestInterceptor {
	intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(
			take(1),
			map((data) => {
				if (data === null || data === undefined) {
					return {
						data: null,
					};
				}

				return { data };
			}),
		);
	}
}
