import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { type Request } from 'express';

export const userFactory = (_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>();

	return request?.user || null;
};

export const User = createParamDecorator(userFactory);
